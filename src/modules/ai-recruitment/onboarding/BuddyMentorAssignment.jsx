// src/components/HRMS/Onboarding%26Joining/BuddyMentorAssignment.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Icon } from '@iconify/react/dist/iconify.js';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BuddyMentorAssignment = () => {
  // ==================== CONSTANTS ====================
  const menuItems = [
    { title: "Dashboard", link: "/recruiter/dashboard", active: false },
    { title: "Job Openings", link: "/recruiter/jobs", active: false },
    { title: "Candidates", link: "/recruiter/candidates", active: false },
    { title: "Interviews", link: "/recruiter/interviews", active: false },
    { title: "Pre-Joining", link: "/recruiter/pre-joining", active: false },
    { title: "Onboarding", link: "/recruiter/onboarding", active: true },
    { title: "Reports", link: "/recruiter/reports", active: false },
  ];

  const programTypes = [
    "New Hire Buddy Program",
    "Leadership Mentorship",
    "Cross-functional Buddy",
    "Virtual Buddy Program",
    "Technical Mentorship",
    "Executive Coaching",
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

  // ==================== INITIAL DATA ====================
  const initialBuddyPrograms = [
    {
      id: 1,
      name: "Q1 2024 New Hire Buddy Program",
      description: "Comprehensive buddy program for Q1 2024 new hires",
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      programType: "New Hire Buddy Program",
      department: "All",
      location: "All",

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
        {
          id: 3,
          rule: "Regular weekly check-ins required",
          mandatory: true,
          weight: 20,
        },
        {
          id: 4,
          rule: "Feedback submission every 2 weeks",
          mandatory: true,
          weight: 10,
        },
        {
          id: 5,
          rule: "Maximum 2 new joiners per buddy",
          mandatory: true,
          weight: 15,
        },
        {
          id: 6,
          rule: "Same location pairing preferred",
          mandatory: false,
          weight: 25,
        },
        {
          id: 7,
          rule: "Skill matching required for technical roles",
          mandatory: true,
          weight: 35,
        },
      ],

      assignments: [
        {
          id: 1,
          buddy: {
            id: 101,
            name: "John Davis",
            department: "Engineering",
            role: "Senior Software Engineer",
            tenure: "3 years",
            email: "john.davis@company.com",
            phone: "+91-9876543210",
            currentAssignments: 1,
            maxAssignments: 2,
            rating: 4.8,
            totalMentees: 5,
            officeLocation: "Bangalore",
            skills: ["JavaScript", "React", "Node.js"],
            availability: "Available",
            joinDate: "2020-03-15",
          },
          newJoiner: {
            id: 201,
            name: "Rahul Sharma",
            department: "Engineering",
            role: "Software Engineer",
            joinDate: "2024-01-15",
            email: "rahul.sharma@company.com",
            phone: "+91-9876543220",
            location: "Bangalore",
            onboardingStage: "Week 2",
            background: "Fresh graduate from IIT Delhi",
            skills: ["JavaScript", "Python", "React"],
            assignedBuddy: true,
          },
          assignmentDate: "2024-01-15",
          status: "active",
          matchScore: 85,
          pairingReason: "Same department and location",

          communicationRecords: [
            {
              id: 1,
              type: "welcome_call",
              date: "2024-01-15",
              duration: "30 mins",
              topics: ["Introduction", "Team Structure", "Tools"],
              followUp: ["Share tool access"],
              notes: "Good introductory call",
            },
            {
              id: 2,
              type: "weekly_checkin",
              date: "2024-01-22",
              duration: "45 mins",
              topics: ["Progress review", "Challenges"],
              followUp: ["Schedule training session"],
              notes: "Facing challenges with CI/CD setup",
            },
          ],

          lastCheckIn: "2024-03-15",
          nextCheckIn: "2024-03-22",
          feedbackScore: 4.5,
          completionPercentage: 60,
          milestones: [
            {
              id: 1,
              name: "Initial onboarding",
              completed: true,
              date: "2024-01-22",
            },
            {
              id: 2,
              name: "First project assignment",
              completed: true,
              date: "2024-02-15",
            },
            {
              id: 3,
              name: "Mid-program review",
              completed: false,
              date: "2024-03-15",
            },
          ],
        },
        {
          id: 2,
          buddy: {
            id: 102,
            name: "Priya Patel",
            department: "Marketing",
            role: "Marketing Manager",
            tenure: "2 years",
            email: "priya.patel@company.com",
            phone: "+91-9876543211",
            currentAssignments: 2,
            maxAssignments: 3,
            rating: 4.6,
            totalMentees: 8,
            officeLocation: "Delhi",
            skills: ["Digital Marketing", "Content Strategy", "SEO"],
            availability: "Available",
            joinDate: "2021-06-10",
          },
          newJoiner: {
            id: 202,
            name: "Anjali Singh",
            department: "Marketing",
            role: "Marketing Executive",
            joinDate: "2024-01-20",
            email: "anjali.singh@company.com",
            phone: "+91-9876543221",
            location: "Delhi",
            onboardingStage: "Week 3",
            background: "2 years experience in digital marketing",
            skills: ["Social Media", "Content Writing", "Google Analytics"],
            assignedBuddy: true,
          },
          assignmentDate: "2024-01-20",
          status: "active",
          matchScore: 90,
          pairingReason: "Same department and marketing expertise",

          communicationRecords: [
            {
              id: 1,
              type: "welcome_meeting",
              date: "2024-01-20",
              duration: "60 mins",
              topics: ["Marketing processes", "Campaigns", "Tools"],
              followUp: [
                "Share campaign templates",
                "Schedule analytics training",
              ],
              notes: "Very enthusiastic new joiner",
            },
          ],

          lastCheckIn: "2024-03-18",
          nextCheckIn: "2024-03-25",
          feedbackScore: 4.8,
          completionPercentage: 75,
          milestones: [
            {
              id: 1,
              name: "Campaign overview",
              completed: true,
              date: "2024-01-27",
            },
            {
              id: 2,
              name: "Tool training",
              completed: true,
              date: "2024-02-10",
            },
            {
              id: 3,
              name: "First campaign assignment",
              completed: false,
              date: "2024-03-20",
            },
          ],
        },
      ],

      buddyResponsibilities: [
        {
          id: 1,
          category: "Week 1",
          tasks: [
            {
              id: 1,
              task: "Initial welcome meeting",
              description: "Introduce company culture and team",
              deadline: "Day 1",
              status: "completed",
              priority: "high",
            },
            {
              id: 2,
              task: "Tool access setup",
              description: "Help with email, Slack, and other tools",
              deadline: "Day 2",
              status: "completed",
              priority: "high",
            },
            {
              id: 3,
              task: "Team introductions",
              description: "Introduce to immediate team members",
              deadline: "Day 3",
              status: "completed",
              priority: "medium",
            },
          ],
        },
        {
          id: 2,
          category: "Week 2",
          tasks: [
            {
              id: 4,
              task: "Process walkthrough",
              description: "Explain team processes and workflows",
              deadline: "Week 2",
              status: "in-progress",
              priority: "high",
            },
            {
              id: 5,
              task: "Tools training",
              description: "Train on specific job-related tools",
              deadline: "Week 2",
              status: "in-progress",
              priority: "medium",
            },
            {
              id: 6,
              task: "First task assignment",
              description: "Assign and guide through first task",
              deadline: "Week 2",
              status: "pending",
              priority: "medium",
            },
          ],
        },
        {
          id: 3,
          category: "Month 1",
          tasks: [
            {
              id: 7,
              task: "First month review",
              description: "Review progress and address concerns",
              deadline: "Month 1",
              status: "pending",
              priority: "high",
            },
            {
              id: 8,
              task: "Career path discussion",
              description: "Discuss growth opportunities",
              deadline: "Month 1",
              status: "pending",
              priority: "low",
            },
            {
              id: 9,
              task: "Feedback collection",
              description: "Collect formal feedback from new joiner",
              deadline: "Month 1",
              status: "pending",
              priority: "medium",
            },
          ],
        },
      ],

      feedback: [
        {
          id: 1,
          assignmentId: 1,
          submittedBy: "Rahul Sharma",
          role: "newJoiner",
          date: "2024-02-15",
          overallRating: 4.5,
          categories: [
            {
              category: "Responsiveness",
              rating: 5,
              comment: "Always available when needed",
            },
            {
              category: "Knowledge Sharing",
              rating: 4,
              comment: "Very knowledgeable about processes",
            },
            {
              category: "Support",
              rating: 5,
              comment: "Extremely supportive throughout",
            },
            {
              category: "Communication",
              rating: 4,
              comment: "Clear and effective communication",
            },
          ],
          overallComment:
            "John has been very supportive during my onboarding. He made the transition smooth.",
          improvementSuggestions: "More structured check-ins would be helpful",
          wouldRecommend: true,
          anonymous: false,
        },
        {
          id: 2,
          assignmentId: 2,
          submittedBy: "Priya Patel",
          role: "buddy",
          date: "2024-02-20",
          overallRating: 4.8,
          categories: [
            {
              category: "Learning Speed",
              rating: 5,
              comment: "Quick to learn and adapt",
            },
            {
              category: "Proactiveness",
              rating: 5,
              comment: "Very proactive in seeking help",
            },
            {
              category: "Engagement",
              rating: 4,
              comment: "Engaged in all discussions",
            },
            {
              category: "Initiative",
              rating: 5,
              comment: "Takes initiative on tasks",
            },
          ],
          overallComment:
            "Anjali is quick to learn and adapt to our marketing processes.",
          improvementSuggestions: "None",
          wouldRecommend: true,
          anonymous: false,
        },
      ],

      analytics: {
        totalPairs: 15,
        activePairs: 12,
        completedPairs: 3,
        averageRating: 4.7,
        completionRate: 80,
        feedbackCount: 8,
        averageMatchScore: 82,
        departmentDistribution: {
          Engineering: 8,
          Marketing: 4,
          Sales: 2,
          HR: 1,
        },
        locationDistribution: {
          Bangalore: 9,
          Delhi: 4,
          Mumbai: 2,
        },
        satisfactionScore: 4.6,
        timeToProductivity: "28 days",
      },

      totalPairs: 15,
      activePairs: 12,
      completionRate: 80,
      overallRating: 4.7,
      createdBy: "Sarah Johnson",
      createdAt: "2023-12-15",
    },
  ];

  // ==================== STATE MANAGEMENT ====================
  const [buddyPrograms, setBuddyPrograms] = useState(initialBuddyPrograms);
  const [buddies, setBuddies] = useState([]);
  const [newJoiners, setNewJoiners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateProgram, setShowCreateProgram] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showBuddyProfile, setShowBuddyProfile] = useState(false);
  const [showNewJoinerProfile, setShowNewJoinerProfile] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showEditProgramModal, setShowEditProgramModal] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);

  // Selected items
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [selectedNewJoiner, setSelectedNewJoiner] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Form states
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

  const [bulkAssignForm, setBulkAssignForm] = useState({
    programId: null,
    assignments: [],
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [viewMode, setViewMode] = useState("programs");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // ==================== INITIALIZE DATA ====================
  useEffect(() => {
    const initializeData = () => {
      // Extract buddies and new joiners from programs
      const allBuddies = [];
      const allNewJoiners = [];

      buddyPrograms.forEach((program) => {
        program.assignments.forEach((assignment) => {
          if (!allBuddies.find((b) => b.id === assignment.buddy.id)) {
            allBuddies.push(assignment.buddy);
          }
          if (!allNewJoiners.find((n) => n.id === assignment.newJoiner.id)) {
            allNewJoiners.push(assignment.newJoiner);
          }
        });
      });

      // Add more sample buddies
      const additionalBuddies = [
        {
          id: 103,
          name: "Michael Chen",
          department: "Engineering",
          role: "Tech Lead",
          tenure: "5 years",
          email: "michael.chen@company.com",
          phone: "+91-9876543212",
          currentAssignments: 1,
          maxAssignments: 2,
          rating: 4.9,
          totalMentees: 12,
          officeLocation: "Bangalore",
          skills: ["Java", "Spring Boot", "Microservices", "AWS"],
          availability: "Available",
          joinDate: "2018-08-20",
        },
        {
          id: 104,
          name: "Lisa Wang",
          department: "HR",
          role: "HR Business Partner",
          tenure: "5 years",
          email: "lisa.wang@company.com",
          phone: "+91-9876543213",
          currentAssignments: 0,
          maxAssignments: 3,
          rating: 4.7,
          totalMentees: 10,
          officeLocation: "Bangalore",
          skills: ["Employee Relations", "Policy Guidance", "Onboarding"],
          availability: "Available",
          joinDate: "2018-11-15",
        },
        {
          id: 105,
          name: "David Wilson",
          department: "Finance",
          role: "Finance Manager",
          tenure: "6 years",
          email: "david.wilson@company.com",
          phone: "+91-9876543214",
          currentAssignments: 1,
          maxAssignments: 2,
          rating: 4.5,
          totalMentees: 6,
          officeLocation: "Delhi",
          skills: ["Financial Planning", "Budget Management", "Forecasting"],
          availability: "Available",
          joinDate: "2017-05-10",
        },
      ];

      // Add unassigned new joiners
      const unassignedNewJoiners = [
        {
          id: 203,
          name: "Sneha Gupta",
          department: "HR",
          role: "HR Executive",
          joinDate: "2024-02-15",
          email: "sneha.gupta@company.com",
          phone: "+91-9876543223",
          location: "Bangalore",
          onboardingStage: "Week 1",
          background: "MBA in HR from XLRI",
          skills: ["Recruitment", "Employee Engagement", "Policy Making"],
          assignedBuddy: false,
        },
        {
          id: 204,
          name: "Rajesh Nair",
          department: "Finance",
          role: "Financial Analyst",
          joinDate: "2024-02-20",
          email: "rajesh.nair@company.com",
          phone: "+91-9876543224",
          location: "Delhi",
          onboardingStage: "Week 1",
          background: "CA with 4 years experience",
          skills: ["Financial Analysis", "Excel", "Reporting"],
          assignedBuddy: false,
        },
        {
          id: 205,
          name: "Amit Kumar",
          department: "Engineering",
          role: "Frontend Developer",
          joinDate: "2024-02-25",
          email: "amit.kumar@company.com",
          phone: "+91-9876543225",
          location: "Bangalore",
          onboardingStage: "Week 1",
          background: "2 years React experience",
          skills: ["React", "TypeScript", "Next.js", "CSS"],
          assignedBuddy: false,
        },
      ];

      setBuddies([...allBuddies, ...additionalBuddies]);
      setNewJoiners([...allNewJoiners, ...unassignedNewJoiners]);

      // Set default selected program
      if (buddyPrograms.length > 0 && !selectedProgram) {
        setSelectedProgram(buddyPrograms[0]);
      }

      setLoading(false);
    };

    initializeData();
  }, []);

  // ==================== HELPER FUNCTIONS ====================
  const getStatusBadge = (status) => {
    const badges = {
      active: <span className="badge bg-success">Active</span>,
      completed: <span className="badge bg-secondary">Completed</span>,
      draft: <span className="badge bg-light text-dark">Draft</span>,
      archived: <span className="badge bg-dark">Archived</span>,
      paused: <span className="badge bg-warning">Paused</span>,
    };
    return badges[status] || <span className="badge bg-info">{status}</span>;
  };

  const getTaskStatusBadge = (status) => {
    const badges = {
      completed: <span className="badge bg-success">Completed</span>,
      "in-progress": <span className="badge bg-warning">In Progress</span>,
      pending: <span className="badge bg-secondary">Pending</span>,
      overdue: <span className="badge bg-danger">Overdue</span>,
      cancelled: <span className="badge bg-dark">Cancelled</span>,
    };
    return badges[status] || <span className="badge bg-info">{status}</span>;
  };

  const getCommunicationTypeBadge = (type) => {
    const badges = {
      welcome_call: <span className="badge bg-primary">Welcome Call</span>,
      weekly_checkin: <span className="badge bg-success">Weekly Check-in</span>,
      welcome_meeting: <span className="badge bg-info">Welcome Meeting</span>,
      strategy_session: (
        <span className="badge bg-warning">Strategy Session</span>
      ),
      training_session: (
        <span className="badge bg-purple">Training Session</span>
      ),
      progress_review: <span className="badge bg-orange">Progress Review</span>,
      feedback_session: <span className="badge bg-teal">Feedback Session</span>,
    };
    return badges[type] || <span className="badge bg-secondary">{type}</span>;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: <span className="badge bg-danger">High</span>,
      medium: <span className="badge bg-warning">Medium</span>,
      low: <span className="badge bg-info">Low</span>,
    };
    return (
      badges[priority] || <span className="badge bg-secondary">{priority}</span>
    );
  };

  const calculateMatchScore = (buddy, newJoiner, program) => {
    if (!buddy || !newJoiner || !program) return 0;

    let score = 0;
    let maxPossibleScore = 0;

    program.assignmentRules.forEach((rule) => {
      maxPossibleScore += rule.weight;

      let ruleMatched = false;

      switch (rule.id) {
        case 1: // Minimum tenure
          const tenureYears = parseInt(buddy.tenure);
          ruleMatched = tenureYears >= 1;
          break;
        case 2: // Same department
          ruleMatched = buddy.department === newJoiner.department;
          break;
        case 3: // Weekly check-ins
          ruleMatched = true; // Assume buddy will follow
          break;
        case 4: // Feedback submission
          ruleMatched = true; // Assume buddy will follow
          break;
        case 5: // Max assignments
          ruleMatched = buddy.currentAssignments < buddy.maxAssignments;
          break;
        case 6: // Same location
          ruleMatched = buddy.officeLocation === newJoiner.location;
          break;
        case 7: // Skill matching
          const commonSkills =
            buddy.skills?.filter((skill) => newJoiner.skills?.includes(skill))
              .length || 0;
          ruleMatched = commonSkills > 0;
          break;
        default:
          ruleMatched = true;
      }

      if (ruleMatched) {
        score += rule.mandatory ? rule.weight : rule.weight;
      }
    });

    // Calculate normalized score (0-100)
    const normalizedScore =
      maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;

    return normalizedScore;
  };

  const filterPrograms = () => {
    let filtered = buddyPrograms;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((program) => program.status === activeTab);
    }

    // Filter by department
    if (filterDepartment !== "all") {
      filtered = filtered.filter(
        (program) =>
          program.department === filterDepartment ||
          program.department === "All",
      );
    }

    // Filter by location
    if (filterLocation !== "all") {
      filtered = filtered.filter(
        (program) =>
          program.location === filterLocation || program.location === "All",
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (program) =>
          program.name.toLowerCase().includes(term) ||
          program.description.toLowerCase().includes(term) ||
          program.programType.toLowerCase().includes(term),
      );
    }

    return filtered;
  };

  // ==================== HANDLERS ====================
  // 1. Create Buddy Program
  const handleCreateProgram = () => {
    if (!programForm.name || !programForm.startDate) {
      alert("Please fill in all required fields");
      return;
    }

    const newProgram = {
      id: Date.now(),
      ...programForm,
      assignments: [],
      buddyResponsibilities: [],
      feedback: [],
      analytics: {
        totalPairs: 0,
        activePairs: 0,
        completedPairs: 0,
        averageRating: 0,
        completionRate: 0,
        feedbackCount: 0,
        averageMatchScore: 0,
        departmentDistribution: {},
        locationDistribution: {},
        satisfactionScore: 0,
        timeToProductivity: "N/A",
      },
      totalPairs: 0,
      activePairs: 0,
      completionRate: 0,
      overallRating: 0,
      createdBy: "Sarah Johnson",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setBuddyPrograms([...buddyPrograms, newProgram]);
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

    alert("Buddy program created successfully!");
  };

  // 2. Assign Buddy to New Joiner
  const handleAssignBuddy = () => {
    const {
      programId,
      buddyId,
      newJoinerId,
      assignmentDate,
      notes,
      pairingReason,
    } = assignmentForm;

    if (!programId || !buddyId || !newJoinerId) {
      alert("Please select program, buddy, and new joiner");
      return;
    }

    const program = buddyPrograms.find((p) => p.id === programId);
    const buddy = buddies.find((b) => b.id === buddyId);
    const newJoiner = newJoiners.find((n) => n.id === newJoinerId);

    if (!program || !buddy || !newJoiner) {
      alert("Invalid selection");
      return;
    }

    if (buddy.currentAssignments >= buddy.maxAssignments) {
      alert("Selected buddy has reached maximum assignments");
      return;
    }

    if (newJoiner.assignedBuddy) {
      alert("This new joiner already has a buddy assigned");
      return;
    }

    // Calculate match score
    const matchScore = calculateMatchScore(buddy, newJoiner, program);

    // Create new assignment
    const newAssignment = {
      id: Date.now(),
      buddy: {
        ...buddy,
        currentAssignments: buddy.currentAssignments + 1,
      },
      newJoiner: {
        ...newJoiner,
        assignedBuddy: true,
      },
      assignmentDate: assignmentDate || new Date().toISOString().split("T")[0],
      status: "active",
      matchScore,
      pairingReason: pairingReason || "Manual assignment",
      communicationRecords: [],
      lastCheckIn: null,
      nextCheckIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      feedbackScore: 0,
      completionPercentage: 0,
      milestones: [
        { id: 1, name: "Initial onboarding", completed: false, date: null },
        { id: 2, name: "First task completion", completed: false, date: null },
        { id: 3, name: "Mid-program review", completed: false, date: null },
      ],
      notes,
    };

    // Update program
    setBuddyPrograms((prev) =>
      prev.map((p) => {
        if (p.id === programId) {
          const updatedAssignments = [...p.assignments, newAssignment];
          const activePairs = updatedAssignments.filter(
            (a) => a.status === "active",
          ).length;
          const totalPairs = updatedAssignments.length;
          const avgMatchScore =
            updatedAssignments.reduce((sum, a) => sum + a.matchScore, 0) /
            totalPairs;

          return {
            ...p,
            assignments: updatedAssignments,
            totalPairs,
            activePairs,
            analytics: {
              ...p.analytics,
              totalPairs,
              activePairs,
              averageMatchScore: avgMatchScore,
              departmentDistribution: {
                ...p.analytics.departmentDistribution,
                [newJoiner.department]:
                  (p.analytics.departmentDistribution[newJoiner.department] ||
                    0) + 1,
              },
              locationDistribution: {
                ...p.analytics.locationDistribution,
                [newJoiner.location]:
                  (p.analytics.locationDistribution[newJoiner.location] || 0) +
                  1,
              },
            },
          };
        }
        return p;
      }),
    );

    // Update buddy assignments count
    setBuddies((prev) =>
      prev.map((b) =>
        b.id === buddyId
          ? {
              ...b,
              currentAssignments: b.currentAssignments + 1,
              totalMentees: b.totalMentees + 1,
            }
          : b,
      ),
    );

    // Update new joiner status
    setNewJoiners((prev) =>
      prev.map((n) =>
        n.id === newJoinerId ? { ...n, assignedBuddy: true } : n,
      ),
    );

    setShowAssignmentModal(false);
    setAssignmentForm({
      programId: null,
      buddyId: null,
      newJoinerId: null,
      assignmentDate: new Date().toISOString().split("T")[0],
      notes: "",
      pairingReason: "",
    });
    alert("Buddy assigned successfully!");
  };

  // 3. Submit Feedback
const handleSubmitFeedback = (formData) => {
  const {
    assignmentId,
    submittedBy,
    role,
    overallRating,
    categories,
    overallComment,
    improvementSuggestions,
    wouldRecommend,
    anonymous,
  } = formData;

  if (!assignmentId || !submittedBy || !overallRating) {
    alert("Please fill all required fields");
    return;
  }

  const newFeedback = {
    id: Date.now(),
    assignmentId,
    submittedBy,
    role,
    date: new Date().toISOString().split("T")[0],
    overallRating: parseFloat(overallRating),
    categories: categories.map((cat) => ({
      ...cat,
      rating: parseFloat(cat.rating),
    })),
    overallComment,
    improvementSuggestions,
    wouldRecommend,
    anonymous,
  };

  let programId = null;

  const updatedPrograms = buddyPrograms.map((program) => {
    const assignment = program.assignments.find(
      (a) => a.id === Number(assignmentId)
    );

    if (assignment) {
      programId = program.id;

      const updatedAssignments = program.assignments.map((a) =>
        a.id === Number(assignmentId)
          ? { ...a, feedbackScore: parseFloat(overallRating) }
          : a
      );

      const allFeedback = [...program.feedback, newFeedback];

      const averageRating =
        allFeedback.reduce((sum, fb) => sum + fb.overallRating, 0) /
        allFeedback.length;

      return {
        ...program,
        assignments: updatedAssignments,
        feedback: allFeedback,
        overallRating: parseFloat(averageRating.toFixed(1)),
        analytics: {
          ...program.analytics,
          averageRating: parseFloat(averageRating.toFixed(1)),
          feedbackCount: allFeedback.length,
        },
      };
    }

    return program;
  });

  setBuddyPrograms(updatedPrograms);
  setShowFeedbackModal(false);

  alert("Feedback submitted successfully!");
};

// 4. Record Communication
const handleRecordCommunication = (formData) => {
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
    alert("Please fill required fields");
    return;
  }

  const newCommunication = {
    id: Date.now(),
    type,
    date,
    duration: duration || "N/A",
    topics: topics.split(",").map((t) => t.trim()).filter(Boolean),
    followUp: followUp.split(",").map((f) => f.trim()).filter(Boolean),
    notes,
  };

  const updatedPrograms = buddyPrograms.map((program) => {
    const assignmentIndex = program.assignments.findIndex(
      (a) => a.id === Number(assignmentId)
    );

    if (assignmentIndex !== -1) {
      const updatedAssignments = [...program.assignments];
      const assignment = updatedAssignments[assignmentIndex];

      const nextCheckIn = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];

      updatedAssignments[assignmentIndex] = {
        ...assignment,
        communicationRecords: [
          ...(assignment.communicationRecords || []),
          newCommunication,
        ],
        lastCheckIn: date,
        nextCheckIn,
        completionPercentage: Math.min(
          (assignment.completionPercentage || 0) + 5,
          100
        ),
      };

      return { ...program, assignments: updatedAssignments };
    }

    return program;
  });

  setBuddyPrograms(updatedPrograms);
  setShowCommunicationModal(false);

  alert("Communication recorded successfully!");
};

  // 5. Update Task Status
  const handleUpdateTaskStatus = (programId, taskId, newStatus) => {
    setBuddyPrograms((prev) =>
      prev.map((program) => {
        if (program.id === programId) {
          const updatedResponsibilities = program.buddyResponsibilities.map(
            (category) => ({
              ...category,
              tasks: category.tasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task,
              ),
            }),
          );

          return {
            ...program,
            buddyResponsibilities: updatedResponsibilities,
          };
        }
        return program;
      }),
    );
  };

  // 6. Auto-match Buddies
  const handleAutoMatch = (programId) => {
    const program = buddyPrograms.find((p) => p.id === programId);
    if (!program) return;

    const unassignedNewJoiners = newJoiners.filter((n) => !n.assignedBuddy);
    const availableBuddies = buddies.filter(
      (b) => b.currentAssignments < b.maxAssignments,
    );

    if (unassignedNewJoiners.length === 0) {
      alert("No unassigned new joiners available");
      return;
    }

    if (availableBuddies.length === 0) {
      alert("No available buddies for assignment");
      return;
    }

    const matches = [];

    unassignedNewJoiners.forEach((newJoiner) => {
      let bestMatch = null;
      let bestScore = 0;

      availableBuddies.forEach((buddy) => {
        if (buddy.currentAssignments >= buddy.maxAssignments) return;

        const score = calculateMatchScore(buddy, newJoiner, program);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = buddy;
        }
      });

      if (bestMatch && bestScore >= 60) {
        // Minimum threshold
        matches.push({
          newJoinerId: newJoiner.id,
          buddyId: bestMatch.id,
          score: bestScore,
        });

        // Update buddy's current assignments count
        bestMatch.currentAssignments += 1;
      }
    });

    if (matches.length === 0) {
      alert("No suitable matches found (minimum 60% match score required)");
      return;
    }

    // Process matches
    matches.forEach((match) => {
      const buddy = availableBuddies.find((b) => b.id === match.buddyId);
      const newJoiner = unassignedNewJoiners.find(
        (n) => n.id === match.newJoinerId,
      );

      if (buddy && newJoiner) {
        const newAssignment = {
          id: Date.now(),
          buddy: { ...buddy, currentAssignments: buddy.currentAssignments },
          newJoiner: { ...newJoiner, assignedBuddy: true },
          assignmentDate: new Date().toISOString().split("T")[0],
          status: "active",
          matchScore: match.score,
          pairingReason: `Auto-matched based on ${match.score}% compatibility`,
          communicationRecords: [],
          lastCheckIn: null,
          nextCheckIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          feedbackScore: 0,
          completionPercentage: 0,
          milestones: [
            { id: 1, name: "Initial onboarding", completed: false, date: null },
            {
              id: 2,
              name: "First task completion",
              completed: false,
              date: null,
            },
            { id: 3, name: "Mid-program review", completed: false, date: null },
          ],
        };

        // Update program
        setBuddyPrograms((prev) =>
          prev.map((p) => {
            if (p.id === programId) {
              return {
                ...p,
                assignments: [...p.assignments, newAssignment],
                totalPairs: p.totalPairs + 1,
                activePairs: p.activePairs + 1,
                analytics: {
                  ...p.analytics,
                  totalPairs: p.analytics.totalPairs + 1,
                  activePairs: p.analytics.activePairs + 1,
                  averageMatchScore:
                    (p.analytics.averageMatchScore * p.analytics.totalPairs +
                      match.score) /
                    (p.analytics.totalPairs + 1),
                  departmentDistribution: {
                    ...p.analytics.departmentDistribution,
                    [newJoiner.department]:
                      (p.analytics.departmentDistribution[
                        newJoiner.department
                      ] || 0) + 1,
                  },
                  locationDistribution: {
                    ...p.analytics.locationDistribution,
                    [newJoiner.location]:
                      (p.analytics.locationDistribution[newJoiner.location] ||
                        0) + 1,
                  },
                },
              };
            }
            return p;
          }),
        );

        // Update buddy
        setBuddies((prev) =>
          prev.map((b) =>
            b.id === buddy.id
              ? {
                  ...b,
                  currentAssignments: b.currentAssignments + 1,
                  totalMentees: b.totalMentees + 1,
                }
              : b,
          ),
        );

        // Update new joiner
        setNewJoiners((prev) =>
          prev.map((n) =>
            n.id === newJoiner.id ? { ...n, assignedBuddy: true } : n,
          ),
        );
      }
    });

    alert(`${matches.length} new joiners auto-matched with buddies!`);
  };

  // 7. Handle Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // 8. Export Data
  const handleExportData = (type) => {
    let data, filename, contentType;

    switch (type) {
      case "programs":
        data = buddyPrograms;
        filename = "buddy-programs.json";
        contentType = "application/json";
        break;

      case "assignments":
        const allAssignments = buddyPrograms.flatMap((p) => p.assignments);
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

        // Key Metrics Table
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

        // Department Distribution
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [["Department", "Pairs"]],
          body: Object.entries(analytics.departmentDistribution),
        });

        // Location Distribution
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [["Location", "Pairs"]],
          body: Object.entries(analytics.locationDistribution),
        });

        doc.save(`${selectedProgram.name}_Analytics_Report.pdf`);
        return; // IMPORTANT (stop JSON logic)

      default:
        return;
    }

    // JSON download (for programs & assignments only)
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

  // ==================== MODAL COMPONENTS ====================
  // 1. Create Program Modal
  const CreateProgramModal = () => {
    const [localProgramForm, setLocalProgramForm] = useState(programForm);
    useEffect(() => {
      setLocalProgramForm(programForm);
    }, [programForm]);

    const handleInputChange = (field, value) => {
      setLocalProgramForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleRuleChange = (index, field, value) => {
      setLocalProgramForm((prev) => {
        const newRules = [...prev.assignmentRules];
        newRules[index] = {
          ...newRules[index],
          [field]: value,
        };
        return {
          ...prev,
          assignmentRules: newRules,
        };
      });
    };

    const handleSubmit = () => {
      setProgramForm(localProgramForm);
      handleCreateProgram();
    };

    return (
      <div className="hrms-modal-overlay">
        <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">
              {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center gap-2">
               <i className="bi bi-person-plus-fill"></i> Create Buddy Program </h5>
            <button
              className="btn-close"
              onClick={() => {
                setLocalProgramForm(programForm);
                setShowCreateProgram(false);
              }}
            ></button>
          </div>

           {/* BODY */}
            <div className="hrms-modal-body hrms-modal-body-scroll">
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label">
                  Program Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={localProgramForm.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="e.g., Q2 2024 Buddy Program"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Program Type <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={localProgramForm.programType}
                  onChange={(e) =>
                    handleInputChange("programType", e.target.value)
                  }
                >
                  {programTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={localProgramForm.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the program objectives, scope, and expected outcomes"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Department <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={localProgramForm.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  Location <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={localProgramForm.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={localProgramForm.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={localProgramForm.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={localProgramForm.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            {/* Assignment Rules */}
            <div className="mt-4">
              <label className="form-label fw-bold">Assignment Rules</label>
              <div className="border rounded p-3 bg-light">
                {localProgramForm.assignmentRules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <div className="flex-grow-1">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={rule.rule}
                        onChange={(e) =>
                          handleRuleChange(index, "rule", e.target.value)
                        }
                        placeholder="Rule description"
                      />
                    </div>
<label
  className={`custom-checkbox ${rule.mandatory ? "checked" : ""}`}
>
  <div className="checkbox-box">
    {rule.mandatory && <span className="checkmark">✓</span>}
  </div>

  <span className="checkbox-label small">
    Mandatory
  </span>

  <input
    type="checkbox"
    checked={rule.mandatory}
    onChange={(e) =>
      handleRuleChange(index, "mandatory", e.target.checked)
    }
    style={{ display: "none" }}
  />
</label>

                    <input
                      type="number"
                      className="form-control form-control-sm"
                      style={{ width: "80px" }}
                      value={rule.weight}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // Allow empty string or valid numbers
                        if (newValue === "" || /^\d*$/.test(newValue)) {
                          handleRuleChange(
                            index,
                            "weight",
                            newValue === "" ? "" : parseInt(newValue, 10),
                          );
                        }
                      }}
                      onBlur={(e) => {
                        // Ensure we have a number when focus leaves
                        const currentValue = rule.weight;
                        if (currentValue === "" || isNaN(currentValue)) {
                          handleRuleChange(index, "weight", 0);
                        } else {
                          // Clamp value between 0 and 100
                          const clampedValue = Math.min(
                            100,
                            Math.max(0, parseInt(currentValue, 10) || 0),
                          );
                          handleRuleChange(index, "weight", clampedValue);
                        }
                      }}
                      min="0"
                      max="100"
                      placeholder="Wgt"
                    />

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setLocalProgramForm((prev) => {
                          const newRules = prev.assignmentRules.filter(
                            (_, i) => i !== index,
                          );
                          return {
                            ...prev,
                            assignmentRules: newRules,
                          };
                        });
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}

                <button
                  className="job-listings-btn"
                  onClick={() => {
                    setLocalProgramForm((prev) => {
                      const newRules = [...prev.assignmentRules];
                      newRules.push({
                        id: Date.now(),
                        rule: "",
                        mandatory: false,
                        weight: 10,
                      });
                      return {
                        ...prev,
                        assignmentRules: newRules,
                      };
                    });
                  }}
                >
                  <i className="bi bi-plus-circle me-1"></i>Add Rule
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-white border-top d-flex">
            <button
              className="cancel-btn"
              onClick={() => {
                setLocalProgramForm(programForm);
                setShowCreateProgram(false);
              }}
            >
              Cancel
            </button>
            <button
              className="create-job-btn"
              onClick={handleSubmit}
              disabled={!localProgramForm.name || !localProgramForm.startDate}
            >
              Create Program
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 2. Assignment Modal
  const AssignmentModal = () => {
    const buddy = assignmentForm.buddyId
      ? buddies.find((b) => b.id === assignmentForm.buddyId)
      : null;
    const newJoiner = assignmentForm.newJoinerId
      ? newJoiners.find((n) => n.id === assignmentForm.newJoinerId)
      : null;
    const program = assignmentForm.programId
      ? buddyPrograms.find((p) => p.id === assignmentForm.programId)
      : null;
    const [matchScore, setMatchScore] = useState(0);

    // Local state for form fields to handle typing smoothly
    const [localAssignmentDate, setLocalAssignmentDate] = useState(
      assignmentForm.assignmentDate,
    );
    const [localPairingReason, setLocalPairingReason] = useState(
      assignmentForm.pairingReason,
    );
    const [localNotes, setLocalNotes] = useState(assignmentForm.notes);

    // Update local state when parent form changes
    useEffect(() => {
      setLocalAssignmentDate(assignmentForm.assignmentDate);
      setLocalPairingReason(assignmentForm.pairingReason);
      setLocalNotes(assignmentForm.notes);
    }, [
      assignmentForm.assignmentDate,
      assignmentForm.pairingReason,
      assignmentForm.notes,
    ]);

    useEffect(() => {
      if (buddy && newJoiner && program) {
        const score = calculateMatchScore(buddy, newJoiner, program);
        setMatchScore(score);

        // Auto-generate pairing reason based on match (only if empty)
        if (!assignmentForm.pairingReason && !localPairingReason) {
          const reasons = [];
          if (buddy.department === newJoiner.department) {
            reasons.push("Same department");
          }
          if (buddy.officeLocation === newJoiner.location) {
            reasons.push("Same location");
          }
          const commonSkills =
            buddy.skills?.filter((skill) =>
              newJoiner.skills?.includes(skill),
            ) || [];
          if (commonSkills.length > 0) {
            reasons.push(`${commonSkills.length} shared skills`);
          }

          if (reasons.length > 0) {
            const autoReason = `Auto-matched: ${reasons.join(", ")}`;
            setLocalPairingReason(autoReason);
          }
        }
      }
    }, [buddy, newJoiner, program]);

    // Handle blur events to update parent state
    const handleAssignmentDateBlur = () => {
      setAssignmentForm({
        ...assignmentForm,
        assignmentDate: localAssignmentDate,
      });
    };

    const handlePairingReasonBlur = () => {
      setAssignmentForm({
        ...assignmentForm,
        pairingReason: localPairingReason,
      });
    };

    const handleNotesBlur = () => {
      setAssignmentForm({
        ...assignmentForm,
        notes: localNotes,
      });
    };

    return (
      <div 
      className="hrms-modal-overlay"
      >
        <div
        className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
        >
          {/* Header with border radius */}
              {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center gap-2">
              <i className="bi bi-people-fill"></i> Buddy-New Joiner Pairing
            </h5>
            <button
              className="btn-close"
              onClick={() => setShowAssignmentModal(false)}
            ></button>
          </div>

              <div className="hrms-modal-body hrms-modal-body-scroll">
            {/* Three Cards Row */}
            <div className="row g-3 mb-4">
              {/* Select Program Card */}
              <div className="col-md-4">
                <div
                  className="card h-100 shadow-sm"
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="card-header bg-light py-2"
                    style={{
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  >
                    <h6 className="mb-0 fw-semibold">
                      {/* <i className="bi bi-diagram-3 me-1"></i> */}
                      Select Program <span className="text-danger">*</span>
                    </h6>
                  </div>
                  <div className="card-body p-3">
                    <select
                      className="form-select form-select-sm mb-2"
                      value={assignmentForm.programId || ""}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          programId: parseInt(e.target.value) || null,
                        })
                      }
                    >
                      <option value="">Choose program...</option>
                      {buddyPrograms.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>

                    {assignmentForm.programId && program && (
                      <div className="mt-2 p-2 bg-light rounded small">
                        <div className="fw-bold text-primary">
                          {program.name}
                        </div>
                        <div className="text-muted small mt-1">
                          <i className="bi bi-calendar me-1"></i>
                          {program.startDate} to {program.endDate}
                        </div>
                        <div className="text-muted small">
                          <i className="bi bi-tag me-1"></i>
                          {program.programType}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Select Buddy Card */}
              <div className="col-md-4">
                <div
                  className="card h-100 shadow-sm"
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="card-header bg-light py-2"
                    style={{
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  >
                    <h6 className="mb-0 fw-semibold">
                      {/* <i className="bi bi-person-badge me-1"></i> */}
                      Select Buddy <span className="text-danger">*</span>
                    </h6>
                  </div>
                  <div className="card-body p-3">
                    <select
                      className="form-select form-select-sm mb-2"
                      value={assignmentForm.buddyId || ""}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          buddyId: parseInt(e.target.value) || null,
                        })
                      }
                    >
                      <option value="">Choose buddy...</option>
                      {buddies
                        .filter((b) => b.currentAssignments < b.maxAssignments)
                        .sort((a, b) => b.rating - a.rating)
                        .map((buddy) => (
                          <option key={buddy.id} value={buddy.id}>
                            {buddy.name} ({buddy.department}) -{" "}
                            {buddy.currentAssignments}/{buddy.maxAssignments}
                          </option>
                        ))}
                    </select>

                    {assignmentForm.buddyId && buddy && (
                      <div className="mt-2 p-2 bg-light rounded">
                        <div className="d-flex align-items-center">
                          <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                            <i className="bi bi-person text-success"></i>
                          </div>
                          <div>
                            <div className="fw-bold">{buddy.name}</div>
                            <div className="text-muted small">
                              {buddy.department} • {buddy.role}
                            </div>
                          </div>
                        </div>
                        <div className="row mt-2 g-1 small">
                          <div className="col-6">
                            <span className="text-muted">Rating:</span>
                            <span className="fw-bold ms-1 text-warning">
                              {buddy.rating}/5
                            </span>
                          </div>
                          <div className="col-6">
                            <span className="text-muted">Tenure:</span>
                            <span className="fw-bold ms-1">{buddy.tenure}</span>
                          </div>
                          <div className="col-12 mt-1">
                            <span className="text-muted">Assignments:</span>
                            <span className="fw-bold ms-1">
                              {buddy.currentAssignments}/{buddy.maxAssignments}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Select New Joiner Card */}
              <div className="col-md-4">
                <div
                  className="card h-100 shadow-sm"
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="card-header bg-light py-2"
                    style={{
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  >
                    <h6 className="mb-0 fw-semibold">
                      {/* <i className="bi bi-person-plus me-1"></i> */}
                      Select New Joiner <span className="text-danger">*</span>
                    </h6>
                  </div>
                  <div className="card-body p-3">
                    <select
                      className="form-select form-select-sm mb-2"
                      value={assignmentForm.newJoinerId || ""}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          newJoinerId: parseInt(e.target.value) || null,
                        })
                      }
                    >
                      <option value="">Choose new joiner...</option>
                      {newJoiners
                        .filter((n) => !n.assignedBuddy)
                        .sort(
                          (a, b) => new Date(b.joinDate) - new Date(a.joinDate),
                        )
                        .map((newJoiner) => (
                          <option key={newJoiner.id} value={newJoiner.id}>
                            {newJoiner.name} ({newJoiner.department})  {/*- Joined:{" "}
                             {new Date(newJoiner.joinDate).toLocaleDateString()} */}
                          </option>
                        ))}
                    </select>

                    {assignmentForm.newJoinerId && newJoiner && (
                      <div className="mt-2 p-2 bg-light rounded">
                        <div className="d-flex align-items-center">
                          <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-2">
                            <i className="bi bi-person-plus text-warning"></i>
                          </div>
                          <div>
                            <div className="fw-bold">{newJoiner.name}</div>
                            <div className="text-muted small">
                              {newJoiner.department} • {newJoiner.role}
                            </div>
                          </div>
                        </div>
                        <div className="row mt-2 g-1 small">
                          <div className="col-6">
                            <span className="text-muted">Joined:</span>
                            <span className="fw-bold ms-1">
                              {new Date(
                                newJoiner.joinDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="col-6">
                            <span className="text-muted">Stage:</span>
                            <span className="fw-bold ms-1">
                              {newJoiner.onboardingStage}
                            </span>
                          </div>
                          <div className="col-12 mt-1">
                            <span className="text-muted">Location:</span>
                            <span className="fw-bold ms-1">
                              {newJoiner.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Match Analysis + Assignment Details */}
            {assignmentForm.buddyId &&
              assignmentForm.newJoinerId &&
              buddy &&
              newJoiner &&
              program && (
                <div className="row mt-2">
                  <div className="col-md-6">
                    <div
                      className="card border"
                      style={{ borderRadius: "10px" }}
                    >
                      <div
                        className="card-header bg-light py-2"
                        style={{
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                      >
                        <h6 className="mb-0 fw-semibold">
                          <i className="bi bi-graph-up me-1"></i>
                          Match Analysis
                        </h6>
                      </div>
                      <div className="card-body p-3">
                        <div className="text-center mb-3">
                          <div
                            className={`display-6 fw-bold ${
                              matchScore >= 80
                                ? "text-success"
                                : matchScore >= 60
                                  ? "text-warning"
                                  : "text-danger"
                            }`}
                          >
                            {matchScore}/100
                          </div>
                          <div className="text-muted small">
                            Compatibility Score
                          </div>
                        </div>

                        <div
                          className="progress mb-3"
                          style={{ height: "10px" }}
                        >
                          <div
                            className={`progress-bar ${
                              matchScore >= 80
                                ? "bg-success"
                                : matchScore >= 60
                                  ? "bg-warning"
                                  : "bg-danger"
                            }`}
                            style={{ width: `${matchScore}%` }}
                          />
                        </div>

                        <div className="row small mb-3">
                          <div className="col-6">
                            <div className="fw-bold">Department</div>
                            <div
                              className={
                                buddy.department === newJoiner.department
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {buddy.department === newJoiner.department
                                ? "✓ Match"
                                : "✗ Different"}
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="fw-bold">Location</div>
                            <div
                              className={
                                buddy.officeLocation === newJoiner.location
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {buddy.officeLocation === newJoiner.location
                                ? "✓ Same"
                                : "✗ Different"}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="fw-bold mb-2">Skills Match</div>
                          <div className="d-flex flex-wrap gap-1">
                            {buddy.skills?.map((skill) => (
                              <span
                                key={skill}
                                className={`badge ${
                                  newJoiner.skills?.includes(skill)
                                    ? "bg-success"
                                    : "bg-light text-dark"
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Details */}
                  <div className="col-md-6">
                    <div
                      className="card border"
                      style={{ borderRadius: "10px" }}
                    >
                      <div
                        className="card-header bg-light py-2"
                        style={{
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                      >
                        <h6 className="mb-0 fw-semibold">
                          <i className="bi bi-card-list me-1"></i>
                          Assignment Details
                        </h6>
                      </div>
                      <div className="card-body p-3">
                        <div className="mb-3">
                          <label className="form-label small">
                            Assignment Date{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={localAssignmentDate}
                            onChange={(e) =>
                              setLocalAssignmentDate(e.target.value)
                            }
                            onBlur={handleAssignmentDateBlur}
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small">
                            Pairing Reason
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={localPairingReason}
                            onChange={(e) =>
                              setLocalPairingReason(e.target.value)
                            }
                            onBlur={handlePairingReasonBlur}
                            placeholder="Auto-generated or manual reason"
                          />
                          <small className="text-muted">
                            Auto-generated based on match criteria
                          </small>
                        </div>

                        <div className="mb-3">
                          <label className="form-label small">Notes</label>
                          <textarea
                            className="form-control form-control-sm"
                            rows="3"
                            value={localNotes}
                            onChange={(e) => setLocalNotes(e.target.value)}
                            onBlur={handleNotesBlur}
                            placeholder="Any special instructions or notes for this pairing"
                          />
                        </div>

                        <div className="alert alert-info small mb-0 d-flex align-items-center">
                          <i className="bi bi-envelope-paper me-2"></i>
                          Both buddy and new joiner will be notified via email
                          with pairing details and next steps.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* No selection message */}
            {(!assignmentForm.buddyId ||
              !assignmentForm.newJoinerId ||
              !assignmentForm.programId) && (
              <div
                className="alert alert-info text-center mt-3"
                style={{ borderRadius: "8px" }}
              >
                <i className="bi bi-info-circle me-2"></i>
                Please select a program, buddy, and new joiner to view match
                analysis
              </div>
            )}
          </div>

          <div className="modal-footer bg-white border-top d-flex">
            <button
              className="cancel-btn"
              onClick={() => setShowAssignmentModal(false)}
            >
              Cancel
            </button>
            <button
              className="create-job-btn"
              onClick={handleAssignBuddy}
              disabled={
                !assignmentForm.programId ||
                !assignmentForm.buddyId ||
                !assignmentForm.newJoinerId
              }
            >
              <i className="bi bi-check-circle me-2"></i>
              Create Pairing
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 3. Feedback Modal
const FeedbackModal = () => {
  const [localForm, setLocalForm] = useState({
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

  const assignment = localForm.assignmentId
    ? buddyPrograms
        .flatMap((p) => p.assignments)
        .find((a) => a.id === Number(localForm.assignmentId))
    : null;

  const handleChange = (field, value) => {
    setLocalForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...localForm.categories];
    updatedCategories[index][field] = value;

    setLocalForm((prev) => ({
      ...prev,
      categories: updatedCategories,
    }));
  };

  const handleSubmit = () => {
    handleSubmitFeedback(localForm);
  };

  return (
    <div className="hrms-modal-overlay" >
      <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">
              {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                  <i className="bi bi-clipboard-check"></i> Submit Feedback</h5>
          <button
            className="btn-close"
            onClick={() => setShowFeedbackModal(false)}
          />
        </div>
                {/* BODY */}
         <div className="hrms-modal-body hrms-modal-body-scroll">
          {/* Assignment */}
          <div className="mb-3">
            <label className="form-label">
              Select Assignment *
            </label>
            <select
              className="form-select"
              value={localForm.assignmentId || ""}
              onChange={(e) =>
                handleChange(
                  "assignmentId",
                  parseInt(e.target.value) || null
                )
              }
            >
              <option value="">Choose assignment...</option>
              {buddyPrograms.flatMap((program) =>
                program.assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.buddy.name} - {assignment.newJoiner.name} (
                    {program.name})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Submitted By */}
          <div className="mb-3">
            <label className="form-label">
              Submitted By *
            </label>
            <input
              type="text"
              className="form-control"
              value={localForm.submittedBy}
              onChange={(e) =>
                handleChange("submittedBy", e.target.value)
              }
              placeholder="Enter your name"
            />
          </div>

          {/* Overall Rating */}
          <div className="mb-4">
            <label className="form-label">Overall Rating *</label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`btn btn-link ${
                    star <= localForm.overallRating
                      ? "text-warning"
                      : "text-muted"
                  }`}
                  onClick={() =>
                    handleChange("overallRating", star)
                  }
                >
                  <i className="bi bi-star-fill fs-4"></i>
                </button>
              ))}
            </div>
          </div>

{/* Categories */}
{localForm.categories.map((cat, index) => (
  <div key={index} className="card border mb-3">
    <div className="card-body">
      {/* Label + Stars Same Line */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong className="mb-0">{cat.category}</strong>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`btn btn-link p-0 ms-1 ${
                star <= cat.rating ? "text-warning" : "text-muted"
              }`}
              onClick={() =>
                handleCategoryChange(index, "rating", star)
              }
              style={{ fontSize: "18px" }}
            >
              <i className="bi bi-star-fill"></i>
            </button>
          ))}
        </div>
      </div>
      {/* Comment Box */}
      <textarea
        className="form-control"
        rows="2"
        value={cat.comment}
        onChange={(e) =>
          handleCategoryChange(index, "comment", e.target.value)
        }
        placeholder="Enter comments"
      />
    </div>
  </div>
))}

          {/* Overall Comment */}
          <div className="mb-3">
            <label className="form-label">Overall Comments</label>
            <textarea
              className="form-control"
              rows="3"
              value={localForm.overallComment}
              onChange={(e) =>
                handleChange("overallComment", e.target.value)
              }
            />
          </div>
        </div>

        <div className="modal-footer bg-white border-top d-flex">
          <button
            className="cancel-btn"
            onClick={() => setShowFeedbackModal(false)}
          >
            Cancel
          </button>
          <button
            className="add-employee"
            onClick={handleSubmit}
            disabled={
              !localForm.assignmentId ||
              !localForm.submittedBy ||
              !localForm.overallRating
            }
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

  // 4. Analytics Modal - Fixed Size
  const AnalyticsModal = () => {
    const analytics = selectedProgram ? selectedProgram.analytics : null;

    if (!analytics) return null;

    return (
      <div className="hrms-modal-overlay">
        <div  className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">
 
              {/* HEADER */}
         <div className="hrms-modal-header">
          <h5 className="hrms-modal-title d-flex align-items-center">
              Program Analytics - {selectedProgram?.name}
            </h5>
            <button
              className="btn-close"
              onClick={() => setShowAnalyticsModal(false)}
            ></button>
          </div>

 
              {/* BODY */}
           <div className="hrms-modal-body hrms-modal-body-scroll">
            {/* Key Metrics */}
            <div className="row mb-3">
              <div className="col-6 col-md-3 mb-3">
                <div className="card border h-100">
                  <div className="card-body text-center p-2">
                    <h6 className="text-muted mb-2 fw-bold">Total Pairs</h6>
                    <h4 className="fw-bold text-primary">
                      {analytics.totalPairs}
                    </h4>
                    <small className="text-muted">
                      Active: {analytics.activePairs}
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3 mb-3">
                <div className="card border h-100">
                  <div className="card-body text-center p-3">
                    <h6 className="text-muted mb-2 fw-bold">Completion Rate</h6>
                    <h4 className="fw-bold text-success">
                      {analytics.completionRate}%
                    </h4>
                    <small className="text-muted">
                      {analytics.completedPairs} completed
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3 mb-3">
                <div className="card border h-100">
                  <div className="card-body text-center p-3">
                    <h6 className="text-muted mb-2 fw-bold">Avg Rating</h6>
                    <h4 className="fw-bold text-warning">
                      {analytics.averageRating}/5
                    </h4>
                    <small className="text-muted">
                      {analytics.feedbackCount} feedback
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3 mb-3">
                <div className="card border h-100">
                  <div className="card-body text-center p-3">
                    <h6 className="text-muted mb-2 fw-bold">Avg Match Score</h6>
                    <h4 className="fw-bold text-info">
                      {Number(analytics.averageMatchScore).toFixed(1)}/100
                    </h4>
                    <small className="text-muted">Pairing quality</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-header bg-light py-2">
                    <h6 className="mb-0 fw-bold">Department Distribution</h6>
                  </div>
                  <div className="card-body p-3">
                    {Object.entries(analytics.departmentDistribution).map(
                      ([dept, count]) => (
                        <div
                          key={dept}
                          className="d-flex justify-content-between align-items-center mb-2"
                        >
                          <span className="small">{dept}</span>
                          <div className="d-flex align-items-center">
                            <div
                              className="progress flex-grow-1 me-2"
                              style={{ width: "100px", height: "8px" }}
                            >
                              <div
                                className="progress-bar bg-primary"
                                style={{
                                  width: `${(count / analytics.totalPairs) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="fw-bold small">{count}</span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-header bg-light py-2">
                    <h6 className="mb-0">Location Distribution</h6>
                  </div>
                  <div className="card-body p-3">
                    {Object.entries(analytics.locationDistribution).map(
                      ([location, count]) => (
                        <div
                          key={location}
                          className="d-flex justify-content-between align-items-center mb-2"
                        >
                          <span className="small">{location}</span>
                          <div className="d-flex align-items-center">
                            <div
                              className="progress flex-grow-1 me-2"
                              style={{ width: "100px", height: "8px" }}
                            >
                              <div
                                className="progress-bar bg-success"
                                style={{
                                  width: `${(count / analytics.totalPairs) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="fw-bold small">{count}</span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Satisfaction Metrics */}
            <div className="row">
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-header bg-light py-2">
                    <h6 className="mb-0">Satisfaction Metrics</h6>
                  </div>
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="small">Satisfaction Score</span>
                      <div className="d-flex align-items-center">
                        <div
                          className="progress flex-grow-1 me-2"
                          style={{ width: "150px", height: "10px" }}
                        >
                          <div
                            className="progress-bar bg-warning"
                            style={{
                              width: `${(analytics.satisfactionScore / 5) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="fw-bold small">
                          {analytics.satisfactionScore}/5
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small">Time to Productivity</span>
                      <span className="fw-bold small">
                        {analytics.timeToProductivity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-header bg-light py-2">
                    <h6 className="mb-0">Performance Overview</h6>
                  </div>
                  <div className="card-body p-3">
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="h4 fw-bold text-primary">
                          {analytics.activePairs}
                        </div>
                        <div className="text-muted small">Active Pairs</div>
                      </div>
                      <div className="col-4">
                        <div className="h4 fw-bold text-success">
                          {analytics.completedPairs}
                        </div>
                        <div className="text-muted small">Completed</div>
                      </div>
                      <div className="col-4">
                        <div className="h4 fw-bold text-warning">
                          {analytics.feedbackCount}
                        </div>
                        <div className="text-muted small">Feedback</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-white border-top d-flex ">
            <button
              className="close-btn"
              onClick={() => setShowAnalyticsModal(false)}
            >
              Close
            </button>
            <button
              className="create-job-btn"
              onClick={() => handleExportData("analytics")}
            >
              <i className="bi bi-download me-1"></i> Export Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 5. Communication Modal
const CommunicationModal = () => {
  const [localForm, setLocalForm] = useState({
    assignmentId: null,
    type: "weekly_checkin",
    date: new Date().toISOString().split("T")[0],
    duration: "",
    topics: "",
    followUp: "",
    notes: "",
  });

  const assignment = localForm.assignmentId
    ? buddyPrograms
        .flatMap((p) => p.assignments)
        .find((a) => a.id === Number(localForm.assignmentId))
    : null;

  const handleChange = (field, value) => {
    setLocalForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    handleRecordCommunication(localForm);
  };

  return (
    <div
    className="hrms-modal-overlay"
    >
      <div
      className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
      >
              {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
            <i className="bi bi-mic-fill me-2"></i>
            Record Communication
          </h5>
          <button
            className="btn-close"
            onClick={() => setShowCommunicationModal(false)}
          ></button>
        </div>

              {/* BODY */}
              <div className="hrms-modal-body hrms-modal-body-scroll">

          {/* Assignment */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Assignment <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={localForm.assignmentId || ""}
              onChange={(e) =>
                handleChange(
                  "assignmentId",
                  parseInt(e.target.value) || null
                )
              }
            >
              <option value="">Select assignment...</option>
              {buddyPrograms.flatMap((program) =>
                program.assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.buddy.name} → {assignment.newJoiner.name} (
                    {program.name})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Info Card */}
          {assignment && (
            <div className="alert alert-info mb-3">
              <strong>Buddy:</strong> {assignment.buddy.name} <br />
              <strong>New Joiner:</strong> {assignment.newJoiner.name} <br />
              <strong>Last Check-in:</strong>{" "}
              {assignment.lastCheckIn || "N/A"} <br />
              <strong>Next Check-in:</strong>{" "}
              {assignment.nextCheckIn || "N/A"}
            </div>
          )}

          <div className="row g-3">

            {/* Type */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Communication Type *
              </label>
              <select
                className="form-select"
                value={localForm.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                {communicationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Date *
              </label>
              <input
                type="date"
                className="form-control"
                value={localForm.date}
                onChange={(e) => handleChange("date", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Duration */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Duration (minutes)
              </label>
              <input
                type="number"
                className="form-control"
                value={localForm.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="e.g., 30"
              />
            </div>

            {/* Next Checkin Auto */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Next Check-in Date
              </label>
              <input
                type="date"
                className="form-control bg-light"
                value={
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                }
                disabled
              />
            </div>

            {/* Topics */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                Topics Discussed
              </label>
              <textarea
                className="form-control"
                rows="3"
                value={localForm.topics}
                onChange={(e) => handleChange("topics", e.target.value)}
                placeholder="Separate with commas"
              />
            </div>

            {/* Follow Up */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                Follow-up Actions
              </label>
              <textarea
                className="form-control"
                rows="2"
                value={localForm.followUp}
                onChange={(e) => handleChange("followUp", e.target.value)}
                placeholder="Separate with commas"
              />
            </div>

            {/* Notes */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                Additional Notes
              </label>
              <textarea
                className="form-control"
                rows="2"
                value={localForm.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer bg-white border-top d-flex ">
          <button
            className="cancel-btn"
            onClick={() => setShowCommunicationModal(false)}
          >
            Cancel
          </button>

          <button
            className="create-job-btn"
            onClick={handleSubmit}
            disabled={!localForm.assignmentId || !localForm.date}
          >
            <i className="bi bi-check-circle me-2"></i>
            Record Communication
          </button>
        </div>
      </div>
    </div>
  );
};

  // 6. Rules Modal
  const RulesModal = () => {
    const program = selectedProgram;

    if (!program) return null;

    return (
      <div
         className="hrms-modal-overlay"
      >
        <div
          className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
        >
          {/* Header */}
          <div className="hrms-modal-header">
            <h5 className="hrms-modal-title d-flex align-items-center">
              Assignment Rules - {program.name}
            </h5>
            <button
              className="btn-close"
              onClick={() => setShowRulesModal(false)}
            ></button>
          </div>
           {/* BODY */}
          <div
            className="hrms-modal-body hrms-modal-body-scroll"
          >
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              These rules are used to automatically match buddies with new
              joiners. Mandatory rules must be satisfied, while preferred rules
              enhance match quality.
            </div>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Rule</th>
                    <th>Type</th>
                    <th>Weight</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {program.assignmentRules.map((rule) => (
                    <tr key={rule.id}>
                      <td className="fw-medium">{rule.rule}</td>
                      <td>
                        {rule.mandatory ? (
                          <span className="badge bg-danger">Mandatory</span>
                        ) : (
                          <span className="badge bg-warning">Preferred</span>
                        )}
                      </td>
                      <td>
                        <span className="fw-bold">{rule.weight}pts</span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {rule.mandatory
                            ? "Must be satisfied for pairing"
                            : "Improves match quality"}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {program.assignmentRules.length === 0 && (
              <div className="alert alert-warning text-center">
                No assignment rules defined for this program.
              </div>
            )}
          </div>

          <div className="modal-footer bg-white border-top d-flex">
            <button
              className="close-btn"
              onClick={() => setShowRulesModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 7. Checklist Modal
  const ChecklistModal = () => {
    const program = selectedProgram;

    if (!program) return null;

    const completedTasks = program.buddyResponsibilities
      .flatMap((c) => c.tasks)
      .filter((t) => t.status === "completed").length;

    const totalTasks = program.buddyResponsibilities.flatMap(
      (c) => c.tasks,
    ).length;

    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    /* ===============================
     EXPORT CHECKLIST (CSV)
  ================================ */
    const handleExportChecklist = () => {
      if (!program || !program.buddyResponsibilities?.length) return;

      const headers = [
        "Program Name",
        "Category",
        "Task",
        "Description",
        "Priority",
        "Status",
        "Deadline",
        "Assigned To",
      ];

      const rows = [];

      program.buddyResponsibilities.forEach((category) => {
        category.tasks.forEach((task) => {
          rows.push([
            program.name,
            category.category,
            task.task,
            task.description || "",
            task.priority || "",
            task.status,
            task.deadline || "",
            task.assignedTo || "",
          ]);
        });
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Buddy_Checklist_${program.name.replace(/\s+/g, "_")}.csv`;
      link.click();

      URL.revokeObjectURL(url);
    };

    return (
      <div
        className="hrms-modal-overlay"
      >
        <div
          className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
        >
          {/* Header */}
          <div className="hrms-modal-header">
            <div>
              <h5 className="hrms-modal-title d-flex align-items-center">
                Buddy Responsibilities Checklist – {program.name}
              </h5>
              {/* Progress Section */}
              <div className="d-flex align-items-center gap-3 mt-2">
                <div>
                  <div className="fw-semibold small">
                    {completedTasks}/{totalTasks} Tasks Completed
                  </div>
                  <div
                    className="progress mt-1"
                    style={{ height: "6px", width: "180px" }}
                  >
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
                <span className="badge bg-success-subtle text-success border">
                  {completionPercentage}% Complete
                </span>
              </div>
            </div>
            <button
              className="btn-close"
              onClick={() => setShowChecklistModal(false)}
            />
          </div>
          {/* BODY */}
          <div className="hrms-modal-body hrms-modal-body-scroll">
            {program.buddyResponsibilities.map((category) => (
              <div key={category.id} className="card border-0 shadow-sm mb-4">
                {/* Category Header */}
                <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                  <h6 className="mb-0 fw-bold">{category.category}</h6>
                  <span className="badge bg-secondary">
                    {
                      category.tasks.filter((t) => t.status === "completed")
                        .length
                    }
                    /{category.tasks.length}
                  </span>
                </div>
                {/* Task List */}
                <div className="list-group list-group-flush">
                  {category.tasks.map((task) => (
                    <div key={task.id} className="list-group-item py-3 px-3">
                      <div className="d-flex justify-content-between align-items-start">
                        {/* Left Content */}
                        <div className="flex-grow-1 me-4">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-semibold">{task.task}</span>
                            {getPriorityBadge(task.priority)}
                          </div>
                          <p className="text-muted small mb-2">
                            {task.description}
                          </p>
                          <div className="d-flex flex-wrap align-items-center gap-3 small text-muted">
                            <span>
                              <i className="bi bi-calendar me-1"></i>
                              Deadline: {task.deadline || "—"}
                            </span>
                            {task.assignedTo && (
                              <span>
                                <i className="bi bi-person me-1"></i>
                                {task.assignedTo}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Right Action Area */}
                        <div className="d-flex flex-column align-items-end gap-2">
                          {getTaskStatusBadge(task.status)}
                          <div className="btn-group btn-group-sm">
                            <button
                              className={`btn ${
                                task.status === "completed"
                                  ? "btn-success"
                                  : "btn-outline-success"
                              }`}
                              onClick={() =>
                                handleUpdateTaskStatus(
                                  program.id,
                                  task.id,
                                  "completed",
                                )
                              }
                              disabled={task.status === "completed"}
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button
                              className={`btn ${
                                task.status === "in-progress"
                                  ? "btn-warning"
                                  : "btn-outline-warning"
                              }`}
                              onClick={() =>
                                handleUpdateTaskStatus(
                                  program.id,
                                  task.id,
                                  "in-progress",
                                )
                              }
                              disabled={task.status === "in-progress"}
                            >
                              <i className="bi bi-clock"></i>
                            </button>
                            <button
                              className={`btn ${
                                task.status === "pending"
                                  ? "btn-secondary"
                                  : "btn-outline-secondary"
                              }`}
                              onClick={() =>
                                handleUpdateTaskStatus(
                                  program.id,
                                  task.id,
                                  "pending",
                                )
                              }
                              disabled={task.status === "pending"}
                            >
                              <i className="bi bi-dash-lg"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* FOOTER */}
          <div className="modal-footer bg-white border-top d-flex ">
            <div className="d-flex w-100 align-items-center">
              {/* Left Info Text */}
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Use buttons to update task status
              </small>
              {/* Right Buttons */}
              <div className="ms-auto d-flex gap-2">
                <button
                  className="cancel-btn"
                  onClick={() => setShowChecklistModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="create-job-btn"
                  onClick={handleExportChecklist}
                >
                  <i className="bi bi-download me-1"></i>
                  Export Checklist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 8. Buddy Profile Modal (Improved Version)
  const BuddyProfileModal = () => {
    const buddy = selectedBuddy;
    if (!buddy) return null;

    const buddyAssignments = buddyPrograms.flatMap((program) =>
      program.assignments.filter((a) => a.buddy.id === buddy.id),
    );

    const avgFeedbackScore =
      buddyAssignments.length > 0
        ? buddyAssignments.reduce((sum, a) => sum + (a.feedbackScore || 0), 0) /
          buddyAssignments.length
        : 0;

    return (
      <div
        className="hrms-modal-overlay"
      >
        <div
          className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
        >
          {/* HEADER */}
          <div className="hrms-modal-header">
            <h5 className="hrms-modal-title d-flex align-items-center">Buddy Profile - {buddy.name}</h5>
            <button
              className="btn-close"
              onClick={() => setShowBuddyProfile(false)}
            />
          </div>

          {/* BODY */}
          <div  className="hrms-modal-body hrms-modal-body-scroll">
            <div className="row g-4">
              {/* LEFT PROFILE SECTION */}
              <div className="col-md-4 text-center border-end">
                <div
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: "110px",
                    height: "110px",
                  }}
                >
                  <i className="bi bi-person-badge text-white fs-1"></i>
                </div>

                <h5 className="fw-bold">{buddy.name}</h5>
                <p className="text-muted mb-2">{buddy.role}</p>

                <div className="mb-2 text-warning fs-5">
                  {"★".repeat(Math.floor(buddy.rating))}
                  {"☆".repeat(5 - Math.floor(buddy.rating))}
                  <span className="ms-2 text-dark fw-bold">
                    {buddy.rating}/5
                  </span>
                </div>

                <span className="badge bg-success px-3 py-2">
                  {buddy.availability}
                </span>
              </div>

              {/* RIGHT DETAILS SECTION */}
              <div className="col-md-8">
                {/* CONTACT & ASSIGNMENT CARDS */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted mb-3">Contact Information</h6>
                        <p className="mb-2">
                          <i className="bi bi-envelope me-2"></i>
                          {buddy.email}
                        </p>
                        <p className="mb-2">
                          <i className="bi bi-telephone me-2"></i>
                          {buddy.phone}
                        </p>
                        <p className="mb-0">
                          <i className="bi bi-building me-2"></i>
                          {buddy.officeLocation}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted mb-3">Assignment Summary</h6>
                        <p className="mb-1">
                          Current:{" "}
                          <strong>
                            {buddy.currentAssignments}/{buddy.maxAssignments}
                          </strong>
                        </p>
                        <p className="mb-1">
                          Total Mentees: <strong>{buddy.totalMentees}</strong>
                        </p>
                        <p className="mb-0">
                          Avg Feedback:{" "}
                          <strong className="text-warning">
                            {avgFeedbackScore.toFixed(1)}/5
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INFO CARDS */}
                <div className="row g-3 mb-4 text-center">
                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Department</h6>
                        <p className="fw-bold mb-0">{buddy.department}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Tenure</h6>
                        <p className="fw-bold mb-0">{buddy.tenure}</p>
                        <small className="text-muted">
                          Joined: {buddy.joinDate}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Availability</h6>
                        {buddy.currentAssignments < buddy.maxAssignments ? (
                          <span className="badge bg-success">Available</span>
                        ) : (
                          <span className="badge bg-danger">Full Capacity</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SKILLS */}
                {buddy.skills?.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Skills & Expertise</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {buddy.skills.map((skill, index) => (
                        <span key={index} className="badge bg-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ASSIGNMENTS TABLE */}
            <div className="mt-4">
              <h6 className="fw-bold mb-3">
                Current Assignments ({buddyAssignments.length})
              </h6>
              {buddyAssignments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>New Joiner</th>
                        <th>Department</th>
                        <th>Match Score</th>
                        <th>Progress</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buddyAssignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td className="fw-bold">
                            {assignment.newJoiner.name}
                          </td>
                          <td>{assignment.newJoiner.department}</td>
                          <td className="fw-bold text-dark">
                            {assignment.matchScore}/100
                          </td>
                          <td className="fw-bold text-dark">
                            {assignment.completionPercentage || 0}%
                          </td>

                          <td>{getStatusBadge(assignment.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">No current assignments</div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer bg-white border-top d-flex">
            <button
              className="close-btn"
              onClick={() => setShowBuddyProfile(false)}
            >
              Close
            </button>

            {buddy.currentAssignments < buddy.maxAssignments && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setAssignmentForm((prev) => ({
                    ...prev,
                    buddyId: buddy.id,
                  }));
                  setShowBuddyProfile(false);
                  setShowAssignmentModal(true);
                }}
              >
                Assign to New Joiner
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 9. New Joiner Profile Modal (Improved & Properly Arranged)
  const NewJoinerProfileModal = () => {
    const newJoiner = selectedNewJoiner;
    if (!newJoiner) return null;
    const assignment = buddyPrograms.flatMap((program) =>
      program.assignments.filter((a) => a.newJoiner.id === newJoiner.id),
    )[0];
    return (
      <div
        className="hrms-modal-overlay"
      >
        <div
          className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
        >
          {/* ================= HEADER ================= */}
          <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
              New Joiner Profile - {newJoiner.name}
            </h5>
            <button
              className="btn-close"
              onClick={() => setShowNewJoinerProfile(false)}
            />
          </div>
          {/* ================= BODY ================= */}
          <div className="hrms-modal-body hrms-modal-body-scroll">
            <div className="row g-4">
              {/* LEFT PROFILE SECTION */}
              <div className="col-md-4 text-center border-end">
                <div
                  className="rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "110px", height: "110px" }}
                >
                  <i
                    className="bi bi-person-plus text-white"
                    style={{ fontSize: "45px" }}
                  ></i>
                </div>
                <h5 className="fw-bold">{newJoiner.name}</h5>
                <p className="text-muted mb-2">{newJoiner.role}</p>
                <span className="badge bg-info mb-2 px-3 py-2">
                  {newJoiner.onboardingStage}
                </span>
                <div>
                  {newJoiner.assignedBuddy ? (
                    <span className="badge bg-success px-3 py-2">
                      Buddy Assigned
                    </span>
                  ) : (
                    <span className="badge bg-warning px-3 py-2">
                      Needs Buddy
                    </span>
                  )}
                </div>
              </div>
              {/* RIGHT DETAILS SECTION */}
              <div className="col-md-8">
                {/* CONTACT + ONBOARDING */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted mb-3">Contact Information</h6>
                        <p className="mb-2">
                          <i className="bi bi-envelope me-2"></i>
                          {newJoiner.email}
                        </p>
                        <p className="mb-0">
                          <i className="bi bi-telephone me-2"></i>
                          {newJoiner.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted mb-3">Onboarding Details</h6>
                        <p className="mb-1">
                          Join Date: <strong>{newJoiner.joinDate}</strong>
                        </p>
                        <p className="mb-0">
                          Location: <strong>{newJoiner.location}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* DEPARTMENT + STATUS */}
                <div className="row g-3 mb-4 text-center">
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Department</h6>
                        <p className="fw-bold mb-0">{newJoiner.department}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Buddy Status</h6>
                        {newJoiner.assignedBuddy ? (
                          <span className="badge bg-success">Assigned</span>
                        ) : (
                          <span className="badge bg-warning">Unassigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* BACKGROUND + SKILLS */}
                {(newJoiner.background || newJoiner.skills?.length > 0) && (
                  <div className="row g-3 mb-4">
                    {newJoiner.background && (
                      <div className="col-md-6">
                        <div className="card h-100 shadow-sm">
                          <div className="card-body">
                            <h6 className="fw-bold mb-2">Background</h6>
                            <p className="text-muted mb-0">
                              {newJoiner.background}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {newJoiner.skills?.length > 0 && (
                      <div className="col-md-6">
                        <div className="card h-100 shadow-sm">
                          <div className="card-body">
                            <h6 className="fw-bold mb-3">Skills</h6>
                            <div className="d-flex flex-wrap gap-2">
                              {newJoiner.skills.map((skill, index) => (
                                <span key={index} className="badge bg-success">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* ================= ASSIGNMENT DETAILS ================= */}
            {assignment && (
              <div className="mt-4">
                <h6 className="fw-bold mb-3">Buddy Assignment Details</h6>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p>
                          <strong>Buddy:</strong> {assignment.buddy.name}
                        </p>
                        <p>
                          <strong>Department:</strong>{" "}
                          {assignment.buddy.department}
                        </p>
                        <p>
                          <strong>Tenure:</strong> {assignment.buddy.tenure}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Match Score:</strong>{" "}
                          <span className="badge bg-info">
                            {assignment.matchScore}/100
                          </span>
                        </p>
                        <p>
                          <strong>Assignment Date:</strong>{" "}
                          {assignment.assignmentDate}
                        </p>
                        <p>
                          <strong>Feedback:</strong>{" "}
                          <span className="text-warning">
                            {assignment.feedbackScore || "N/A"}/5
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <strong>Progress</strong>
                      {assignment.completionPercentage !== undefined ? (
                        <div style={{ minWidth: "60px" }}>
                          <div className="progress" style={{ height: "18px" }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{
                                width: `${Number(assignment.completionPercentage) || 0}%`,
                                fontSize: "12px",
                                height: "18px",
                                lineHeight: "18px",
                              }}
                              aria-valuenow={
                                Number(assignment.completionPercentage) || 0
                              }
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              {Number(assignment.completionPercentage) || 0}%
                            </div>
                          </div>
                        </div>
                      ) : (
                        <small className="text-muted">No progress data</small>
                      )}
                    </div>
                    {/* Communications */}
                    {assignment.communicationRecords?.length > 0 && (
                      <div className="mt-3">
                        <h6 className="fw-bold mb-2">Recent Communications</h6>
                        <div className="list-group">
                          {assignment.communicationRecords
                            .slice(0, 3)
                            .map((comm) => (
                              <div key={comm.id} className="list-group-item">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    {getCommunicationTypeBadge(comm.type)}
                                    <span className="ms-2 text-muted">
                                      {comm.date}
                                    </span>
                                  </div>
                                  {comm.duration && (
                                    <small className="text-muted">
                                      {comm.duration}
                                    </small>
                                  )}
                                </div>

                                {comm.notes && (
                                  <small className="text-muted d-block mt-1">
                                    {comm.notes}
                                  </small>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* ================= FOOTER ================= */}
          <div  className="modal-footer bg-white border-top d-flex">
            <button
              className="close-btn"
              onClick={() => setShowNewJoinerProfile(false)}
            >
              Close
            </button>
            {!newJoiner.assignedBuddy && (
              <button
                className="create-job-btn"
                onClick={() => {
                  setAssignmentForm((prev) => ({
                    ...prev,
                    newJoinerId: newJoiner.id,
                  }));
                  setShowNewJoinerProfile(false);
                  setShowAssignmentModal(true);
                }}
              >
                Assign Buddy
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==================== RENDER ====================
  if (loading) {
    return (
      <div className="container-fluid px-3 px-md-4 py-5">
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">
            Loading Buddy/Mentor Assignment Module...
          </p>
        </div>
      </div>
    );
  }

  const filteredPrograms = filterPrograms();

  return (
    <div className="container-fluid px-2 px-md-3 px-lg-4 py-3">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
             <Icon icon='heroicons:clock'/>
            Buddy / Mentor Assignment
          </h5>
          <p className="text-muted mb-0">
            Facilitate successful onboarding through structured buddy programs
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            className="job-listings-btn"
            onClick={() => setShowAssignmentModal(true)}
          >
            <i className="bi bi-person-plus"></i>
            <span>Create Pairing</span>
          </button>

          <button
             className="record-communication-btn"
            onClick={() => setShowCommunicationModal(true)}
          >
            <i className="bi bi-chat-left-text"></i>
            <span>Record Communication</span>
          </button>

          <button
            className="create-job-btn"
            onClick={() => setShowCreateProgram(true)}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Create Program</span>
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="card border mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            <button
              className={`btn ${viewMode === "programs" ? "create-job-btn" : "job-listings-btn "}`}
              onClick={() => setViewMode("programs")}
            >
              <i className="bi bi-people me-2"></i>
              Buddy Programs ({buddyPrograms.length})
            </button>
            <button
              className={`btn ${viewMode === "buddies" ? "add-employee" : "buddies-toggle-btn"}`}
              onClick={() => setViewMode("buddies")}
            >
              <i className="bi bi-person-badge me-2"></i>
              Buddies ({buddies.length})
            </button>
            <button
              className={`btn ${viewMode === "newJoiners" ? "help-btn " : "new-joiners-toggle-btn"}`}
              onClick={() => setViewMode("newJoiners")}
            >
              <i className="bi bi-person-plus me-2"></i>
              New Joiners ({newJoiners.filter((n) => !n.assignedBuddy).length}
              unassigned)
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4 g-3">
        <div className="col-12">
          <div className="card border">
            <div className="card-header bg-light">
              <h6 className="mb-0 fw-bold">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6 col-md-4 col-lg-2">
                  <button
                    className="btn btn-outline-primary w-100 d-flex flex-column align-items-center py-3"
                    onClick={() => setShowCreateProgram(true)}
                  >
                    <i className="bi bi-plus-circle fs-4 mb-2"></i>
                    <span className="small">Create Program</span>
                  </button>
                </div>

                <div className="col-6 col-md-4 col-lg-2">
                  <button
                    className="btn btn-outline-success w-100 d-flex flex-column align-items-center py-3"
                    onClick={() => setShowAssignmentModal(true)}
                  >
                    <i className="bi bi-person-plus fs-4 mb-2"></i>
                    <span className="small">Create Pairing</span>
                  </button>
                </div>

                <div className="col-6 col-md-4 col-lg-2">
                  <button
                    className="btn btn-outline-info w-100 d-flex flex-column align-items-center py-3"
                    onClick={() => setShowCommunicationModal(true)}
                  >
                    <i className="bi bi-chat-left-text fs-4 mb-2"></i>
                    <span className="small">Record Communication</span>
                  </button>
                </div>

                <div className="col-6 col-md-4 col-lg-2">
                  <button
                    className="btn btn-outline-warning w-100 d-flex flex-column align-items-center py-3"
                    onClick={() => setShowFeedbackModal(true)}
                  >
                    <i className="bi bi-chat-dots fs-4 mb-2"></i>
                    <span className="small">Submit Feedback</span>
                  </button>
                </div>

                <div className="col-6 col-md-4 col-lg-2">
                  <button
                    className="btn btn-outline-danger w-100 d-flex flex-column align-items-center py-3"
                    onClick={() =>
                      selectedProgram && setShowAnalyticsModal(true)
                    }
                    disabled={!selectedProgram}
                  >
                    <i className="bi bi-graph-up fs-4 mb-2"></i>
                    <span className="small">View Analytics</span>
                  </button>
                </div>

                <div className="col-6 col-md-4 col-lg-2">
                  <button
                    className="btn btn-outline-secondary w-100 d-flex flex-column align-items-center py-3"
                    onClick={() =>
                      selectedProgram && handleAutoMatch(selectedProgram.id)
                    }
                    disabled={!selectedProgram}
                  >
                    <i className="bi bi-robot fs-4 mb-2"></i>
                    <span className="small">Auto-match</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Statistics Cards */}

<div className="kpi-row">
  {[
    {
      title: "Total Programs",
      value: buddyPrograms.length,
      icon: "heroicons:user-group",
      bg: "kpi-primary",
      color: "kpi-primary-text",
      sub: `${buddyPrograms.filter((p) => p.status === "active").length} active`,
    },
    {
      title: "Total Pairs",
      value: buddyPrograms.reduce((sum, program) => sum + program.totalPairs, 0),
      icon: "heroicons:users",
      bg: "kpi-success",
      color: "kpi-success-text",
      sub: `${buddyPrograms.reduce((sum, program) => sum + program.activePairs, 0)} active`,
    },
    {
      title: "Available Buddies",
      value: buddies.filter((b) => b.currentAssignments < b.maxAssignments).length,
      icon: "heroicons:user-plus",
      bg: "kpi-warning",
      color: "kpi-warning-text",
      sub: `${buddies.length} total buddies`,
    },
    {
      title: "Avg. Rating",
      value:
        buddyPrograms.length > 0
          ? (
              buddyPrograms.reduce(
                (sum, program) => sum + program.overallRating,
                0
              ) / buddyPrograms.length
            ).toFixed(1) + "/5"
          : "0.0/5",
      icon: "heroicons:star",
      bg: "kpi-info",
      color: "kpi-info-text",
      sub: "Based on feedback",
    },
  ].map((item, index) => (
    <div className="kpi-col" key={index}>
      <div className="kpi-card">
        <div className="kpi-card-body">

          {/* Icon */}
          <div className={`kpi-icon ${item.bg}`}>
            <Icon icon={item.icon} className={`kpi-icon-style ${item.color}`} />
          </div>

          {/* Content */}
          <div className="kpi-content">
            <div className="kpi-title">{item.title}</div>
            <div className="kpi-value">{item.value}</div>

            {/* Sub text */}
            <small className="text-muted">{item.sub}</small>
          </div>

        </div>
      </div>
    </div>
  ))}
</div>

      {/* Main Content based on View Mode */}
      {viewMode === "programs" && (
        <>
          {/* Filters and Search */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-8">
              <div className="d-flex flex-wrap gap-2">
                <button
                  className={`btn ${activeTab === "all" ? "btn-primary" : "btn-outline-primary"} btn-sm`}
                  onClick={() => setActiveTab("all")}
                >
                  All Programs
                </button>
                <button
                  className={`btn ${activeTab === "active" ? "btn-success" : "btn-outline-success"} btn-sm`}
                  onClick={() => setActiveTab("active")}
                >
                  Active
                </button>
                <button
                  className={`btn ${activeTab === "completed" ? "btn-secondary" : "btn-outline-secondary"} btn-sm`}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed
                </button>
                <button
                  className={`btn ${activeTab === "draft" ? "btn-secondary" : "btn-outline-secondary"} btn-sm`}
                  onClick={() => setActiveTab("draft")}
                >
                  Drafts
                </button>

                <select
                  className="form-select form-select-sm"
                  style={{ width: "150px" }}
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
                  className="form-select form-select-sm"
                  style={{ width: "150px" }}
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
            </div>

            <div className="col-12 col-md-4">
              <div className="input-group input-group-sm">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Buddy Programs Table */}
          <div className="card border mb-4">
            <div className="card-header bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <h6 className="mb-2 mb-md-0 fw-bold">Buddy Programs</h6>
              <span className="badge bg-primary">
                {filteredPrograms.length} programs
              </span>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSort("name")}
                      >
                        Program Name
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="d-none d-md-table-cell">Type</th>
                      <th>Status</th>
                      <th>Pairs</th>
                      <th className="d-none d-md-table-cell">Rating</th>
                      <th className="d-none d-md-table-cell">Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrograms.map((program) => (
                      <tr
                        key={program.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedProgram(program)}
                        className={
                          selectedProgram?.id === program.id
                            ? "table-active"
                            : ""
                        }
                      >
                        <td>
                          <div className="fw-bold">{program.name}</div>
                          <small className="text-muted">
                            {program.description.substring(0, 60)}...
                          </small>
                          <div className="small text-muted mt-1">
                            {program.department} • {program.location}
                          </div>
                        </td>
                        <td className="d-none d-md-table-cell">
                          <span className="badge bg-info">
                            {program.programType}
                          </span>
                        </td>
                        <td>{getStatusBadge(program.status)}</td>
                        <td>
                          <div>
                            {program.activePairs}/{program.totalPairs}
                          </div>
                          <small className="text-muted">
                            {program.completionRate}% complete
                          </small>
                        </td>
                        <td className="d-none d-md-table-cell">
                          <div className="d-flex align-items-center">
                            <span className="fw-bold me-1">
                              {program.overallRating}
                            </span>
                            <div className="text-warning">
                              {"★".repeat(Math.floor(program.overallRating))}
                            </div>
                          </div>
                        </td>
                        <td className="d-none d-md-table-cell">
                          <div>
                            {program.startDate} to {program.endDate}
                          </div>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProgram(program);
                                setShowAnalyticsModal(true);
                              }}
                              title="Analytics"
                            >
                              <i className="bi bi-graph-up"></i>
                            </button>
                            <button
                              className="btn btn-outline-success"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProgram(program);
                                setAssignmentForm((prev) => ({
                                  ...prev,
                                  programId: program.id,
                                }));
                                setShowAssignmentModal(true);
                              }}
                              title="Create Pairing"
                            >
                              <i className="bi bi-person-plus"></i>
                            </button>
                            <button
                              className="btn btn-outline-warning"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAutoMatch(program.id);
                              }}
                              title="Auto-match"
                            >
                              <i className="bi bi-robot"></i>
                            </button>
                            <button
                              className="btn btn-outline-info"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProgram(program);
                                setShowRulesModal(true);
                              }}
                              title="Rules"
                            >
                              <i className="bi bi-list-check"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPrograms.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-people fs-1 text-muted mb-3"></i>
                  <p className="text-muted">
                    No programs found matching your criteria
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateProgram(true)}
                  >
                    Create Your First Program
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Program Details */}
          {selectedProgram && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card border mb-4">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">
                      Program Details: {selectedProgram.name}
                    </h6>
                    <div className="btn-group btn-group-sm gap-2">
                      <button
                        className="job-listings-btn"
                        onClick={() => setShowRulesModal(true)}
                        title="View Rules"
                      >
                        <i className="bi bi-list-check me-1"></i>Rules
                      </button>
                      <button
                        className="record-communication-btn"
                        onClick={() => setShowChecklistModal(true)}
                        title="View Checklist"
                      >
                        <i className="bi bi-check-square me-1"></i>Checklist
                      </button>
                      <button
                        className="new-joiners-toggle-btn"
                        onClick={() => setShowAnalyticsModal(true)}
                        title="View Analytics"
                      >
                        <i className="bi bi-graph-up me-1"></i>Analytics
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 mb-4">
                        <h6 className="fw-bold mb-3">Program Information</h6>
                        <div className="list-group list-group-flush">
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Type</span>
                            <span className="fw-bold">
                              {selectedProgram.programType}
                            </span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Department</span>
                            <span className="fw-bold">
                              {selectedProgram.department}
                            </span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Location</span>
                            <span className="fw-bold">
                              {selectedProgram.location}
                            </span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Duration</span>
                            <span className="fw-bold">
                              {selectedProgram.startDate} to
                              {selectedProgram.endDate}
                            </span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Status</span>
                            <span>
                              {getStatusBadge(selectedProgram.status)}
                            </span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Created By</span>
                            <span className="fw-bold">
                              {selectedProgram.createdBy}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-4">
                        <h6 className="fw-bold mb-3">Quick Stats</h6>
                        <div className="list-group list-group-flush">
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Total Pairs</span>
                            <span className="fw-bold">
                              {selectedProgram.totalPairs}
                            </span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Active Pairs</span>
                            <span className="fw-bold">
                              {selectedProgram.activePairs}
                            </span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Completion Rate</span>
                            <span className="fw-bold">
                              {selectedProgram.completionRate}%
                            </span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Average Rating</span>
                            <span className="fw-bold">
                              {selectedProgram.overallRating}/5
                            </span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">
                              Feedback Received
                            </span>
                            <span className="fw-bold">
                              {selectedProgram.feedback.length}
                            </span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span className="text-muted">Created On</span>
                            <span className="fw-bold">
                              {selectedProgram.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-4">
                        <h6 className="fw-bold mb-3">Recent Feedback</h6>
                        {selectedProgram.feedback.length > 0 ? (
                          <div className="list-group list-group-flush">
                            {selectedProgram.feedback.slice(0, 3).map((fb) => (
                              <div key={fb.id} className="list-group-item">
                                <div className="d-flex justify-content-between">
                                  <span className="fw-bold small">
                                    {fb.submittedBy}
                                  </span>
                                  <span className="text-warning">
                                    {fb.overallRating}/5
                                  </span>
                                </div>
                                <div className="small text-muted mt-1">
                                  {fb.overallComment.substring(0, 60)}...
                                </div>
                                <div className="small mt-1">
                                  <span className="text-muted">{fb.date}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="alert alert-info small">
                            No feedback yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignments Section */}
                <div className="card border">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">
                      Assignments ({selectedProgram.assignments.length})
                    </h6>
                    <div className="btn-group gap-2">
                      <button
                        className="create-job-btn"
                        onClick={() => {
                          setAssignmentForm((prev) => ({
                            ...prev,
                            programId: selectedProgram.id,
                          }));
                          setShowAssignmentModal(true);
                        }}
                      >
                        <i className="bi bi-person-plus me-1"></i>Add Assignment
                      </button>
                      <button
                        className="new-joiners-toggle-btn"
                        onClick={() => handleAutoMatch(selectedProgram.id)}
                      >
                        <i className="bi bi-robot me-1"></i>Auto-match
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    {selectedProgram.assignments.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Buddy</th>
                              <th>New Joiner</th>
                              <th>Match Score</th>
                              <th>Assignment Date</th>
                              <th>Last Check-in</th>
                              <th>Progress</th>
                              <th>Feedback Score</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProgram.assignments.map((assignment) => (
                              <tr key={assignment.id}>
                                <td>
                                  <div className="fw-bold">
                                    {assignment.buddy.name}
                                  </div>
                                  <small className="text-muted">
                                    {assignment.buddy.department}
                                  </small>
                                </td>
                                <td>
                                  <div className="fw-bold">
                                    {assignment.newJoiner.name}
                                  </div>
                                  <small className="text-muted">
                                    {assignment.newJoiner.department}
                                  </small>
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      assignment.matchScore >= 80
                                        ? "bg-success"
                                        : assignment.matchScore >= 60
                                          ? "bg-warning"
                                          : "bg-danger"
                                    }`}
                                  >
                                    {assignment.matchScore}/100
                                  </span>
                                </td>
                                <td>{assignment.assignmentDate}</td>
<td>
  {assignment.lastCheckIn
    ? new Date(assignment.lastCheckIn).toLocaleDateString("en-GB")
    : "N/A"}
</td>
                                <td>
                                  {assignment.completionPercentage !==
                                  undefined ? (
                                    <div style={{ minWidth: "60px" }}>
                                      <div
                                        className="progress"
                                        style={{ height: "18px" }}
                                      >
                                        <div
                                          className="progress-bar bg-success"
                                          role="progressbar"
                                          style={{
                                            width: `${Number(assignment.completionPercentage) || 0}%`,
                                            height: "18px",
                                            fontSize: "12px",
                                            lineHeight: "18px",
                                          }}
                                          aria-valuenow={
                                            Number(
                                              assignment.completionPercentage,
                                            ) || 0
                                          }
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        >
                                          {Number(
                                            assignment.completionPercentage,
                                          ) || 0}
                                          %
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted">0%</span>
                                  )}
                                </td>
                                <td className="text-center">
                                  {assignment.feedbackScore > 0 ? (
                                    <span className="fw-semibold text-dark">
                                      {assignment.feedbackScore}/5
                                    </span>
                                  ) : (
                                    <span className="text-muted">-</span>
                                  )}
                                </td>
                                <td>{getStatusBadge(assignment.status)}</td>
                                <td>
                                  <div className="btn-group btn-group-sm">
                                    <button
                                      className="btn btn-outline-info"
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
                                      <i className="bi bi-chat-left-text"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-warning"
                                      onClick={() => {
                                        setSelectedAssignment(assignment);
                                        setFeedbackForm((prev) => ({
                                          ...prev,
                                          assignmentId: assignment.id,
                                        }));
                                        setShowFeedbackModal(true);
                                      }}
                                      title="Submit Feedback"
                                    >
                                      <i className="bi bi-star"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="alert alert-info text-center">
                        No assignments yet. Click "Add Assignment" to create a
                        buddy-new joiner pairing.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Buddies View */}
      {viewMode === "buddies" && (
        <div className="row">
          <div className="col-12">
            <div className="card border">
              <div className="card-header bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h6 className="mb-2 mb-md-0 fw-bold">Buddy Database</h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success d-flex align-items-center">
                    {
                      buddies.filter(
                        (b) => b.currentAssignments < b.maxAssignments,
                      ).length
                    }{" "}
                    available
                  </span>

                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleExportData("assignments")}
                  >
                    <i className="bi bi-download me-1"></i> Export
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Location</th>
                        <th>Tenure</th>
                        <th>Rating</th>
                        <th>Assignments</th>
                        <th>Availability</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buddies.map((buddy) => (
                        <tr key={buddy.id}>
                          <td>
                            <div className="fw-bold">{buddy.name}</div>
                            <small className="text-muted">{buddy.role}</small>
                          </td>
                          <td>{buddy.department}</td>
                          <td>{buddy.officeLocation}</td>
                          <td>{buddy.tenure}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="fw-bold me-1">
                                {buddy.rating}
                              </span>
                              <div className="text-warning">
                                {"★".repeat(Math.floor(buddy.rating))}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold">
                              {buddy.currentAssignments}/{buddy.maxAssignments}
                            </div>
                            <small className="text-muted">
                              {buddy.totalMentees} total mentees
                            </small>
                          </td>
                          <td>
                            {buddy.currentAssignments < buddy.maxAssignments ? (
                              <span className="badge bg-success">
                                Available
                              </span>
                            ) : (
                              <span className="badge bg-danger">Full</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setSelectedBuddy(buddy);
                                setShowBuddyProfile(true);
                              }}
                              title="View Profile"
                            >
                              <i className="bi bi-eye me-1"></i>View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Joiners View */}
      {viewMode === "newJoiners" && (
        <div className="row">
          <div className="col-12">
            <div className="card border">
              <div className="card-header bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h6 className="mb-2 mb-md-0 fw-bold">New Joiners</h6>
                <span className="badge bg-warning">
                  {newJoiners.filter((n) => !n.assignedBuddy).length} unassigned
                </span>
              </div>

              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Location</th>
                        <th>Join Date</th>
                        <th>Onboarding Stage</th>
                        <th>Skills</th>
                        <th>Buddy Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newJoiners.map((newJoiner) => (
                        <tr key={newJoiner.id}>
                          <td>
                            <div className="fw-bold">{newJoiner.name}</div>
                            <small className="text-muted">
                              {newJoiner.role}
                            </small>
                          </td>
                          <td>{newJoiner.department}</td>
                          <td>{newJoiner.location}</td>
                          <td>{newJoiner.joinDate}</td>
                          <td>
                            <span className="badge bg-info">
                              {newJoiner.onboardingStage}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {newJoiner.skills?.slice(0, 2).map((skill) => (
                                <span
                                  key={skill}
                                  className="badge bg-light text-dark"
                                >
                                  {skill}
                                </span>
                              ))}
                              {newJoiner.skills?.length > 2 && (
                                <span className="badge bg-light text-dark">
                                  +{newJoiner.skills.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            {newJoiner.assignedBuddy ? (
                              <span className="badge bg-success">Assigned</span>
                            ) : (
                              <span className="badge bg-warning">
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => {
                                  setSelectedNewJoiner(newJoiner);
                                  setShowNewJoinerProfile(true);
                                }}
                                title="View Profile"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              {!newJoiner.assignedBuddy && (
                                <button
                                  className="btn btn-outline-success"
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
                                  <i className="bi bi-person-plus"></i>
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
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Modals */}
      {showCreateProgram && <CreateProgramModal />}
      {showAssignmentModal && <AssignmentModal />}
      {showFeedbackModal && <FeedbackModal />}
      {showAnalyticsModal && <AnalyticsModal />}
      {showCommunicationModal && <CommunicationModal />}
      {showRulesModal && <RulesModal />}
      {showChecklistModal && <ChecklistModal />}
      {showBuddyProfile && <BuddyProfileModal />}
      {showNewJoinerProfile && <NewJoinerProfileModal />}
    </div>
  );
};

export default BuddyMentorAssignment;