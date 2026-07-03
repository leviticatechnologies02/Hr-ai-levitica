import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import StatCard from "../../../shared/components/StatCard";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatDateTime = (dateString, timeString) => {
  return `${formatDate(dateString)} at ${timeString}`;
};

const STATUS_TYPES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
};

const PRIORITY_TYPES = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

const REQUEST_TYPES = {
  LEAVE: "leave",
  PURCHASE: "purchase",
  TRAINING: "training",
  TRAVEL: "travel",
  HARDWARE: "hardware",
  EXPENSE: "expense",
};

const generateInitialRequests = () => {
  const baseReqs = [
    { id: "REQ-001", title: "Annual Leave", type: REQUEST_TYPES.LEAVE, employeeId: "EMP001", employeeName: "John Doe", amount: null, priority: PRIORITY_TYPES.MEDIUM, status: STATUS_TYPES.PENDING, requestDate: new Date().toISOString(), description: "Family vacation" },
    { id: "REQ-002", title: "New Laptop", type: REQUEST_TYPES.HARDWARE, employeeId: "EMP002", employeeName: "Jane Smith", amount: 2000, priority: PRIORITY_TYPES.HIGH, status: STATUS_TYPES.APPROVED, requestDate: new Date().toISOString(), description: "Replacement for broken laptop" }
  ];
  const delegatedReqs = [];
  return [...baseReqs, ...delegatedReqs];
};

const initialApprovers = [
  { id: "APP001", name: "Manager One", role: "Manager" },
  { id: "APP002", name: "Director Two", role: "Director" }
];
const initialEmployees = [
  { id: "EMP001", name: "John Doe", department: "Engineering" },
  { id: "EMP002", name: "Jane Smith", department: "HR" }
];

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const ApprovalsDashboard = () => {
  const userRole = "approver";
  const [userId, setUserId] = useLocalStorage("userId", "EMP001");
  const [requests, setRequests] = useLocalStorage(
    "approvalRequests",
    generateInitialRequests()
  );
  const [approvers] = useState(initialApprovers);
  const [employees] = useState(initialEmployees);

  const [newRequest, setNewRequest] = useState({
    type: REQUEST_TYPES.LEAVE,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    amount: "",
    priority: PRIORITY_TYPES.MEDIUM,
    attachments: [],
  });

  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    priority: "all",
    dateFrom: "",
    dateTo: "",
    employee: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRequests, setSelectedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showRequestDetail, setShowRequestDetail] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [delegateTo, setDelegateTo] = useState("");
  const [notification, setNotification] = useState(null);

  const fileInputRef = useRef(null);

  const stats = useMemo(() => {
    const userRequests = requests.filter((req) => {
      if (userRole === "employee") {
        return req.employeeId === userId;
      } else {
        return req.approverId === userId || req.originalApproverId === userId;
      }
    });

    const pending = userRequests.filter(
      (req) => req.status === STATUS_TYPES.PENDING
    );
    const approved = userRequests.filter(
      (req) => req.status === STATUS_TYPES.APPROVED
    );
    const rejected = userRequests.filter(
      (req) => req.status === STATUS_TYPES.REJECTED
    );
    const withdrawn = userRequests.filter(
      (req) => req.status === STATUS_TYPES.WITHDRAWN
    );

    const today = new Date().toISOString().split("T")[0];
    const slaBreaches = pending.filter((req) => {
      return req.slaDeadline && req.slaDeadline < today;
    });

    const highPriority = pending.filter(
      (req) => req.priority === PRIORITY_TYPES.HIGH
    );
    const mediumPriority = pending.filter(
      (req) => req.priority === PRIORITY_TYPES.MEDIUM
    );
    const lowPriority = pending.filter(
      (req) => req.priority === PRIORITY_TYPES.LOW
    );

    const approvedRequestsWithTime = approved.filter((req) => req.approvedDate);
    const totalApprovalTime = approvedRequestsWithTime.reduce((total, req) => {
      const submitted = new Date(req.submittedDate);
      const approved = new Date(req.approvedDate);
      return total + (approved - submitted);
    }, 0);
    const avgApprovalTime =
      approvedRequestsWithTime.length > 0
        ? Math.round(
          totalApprovalTime /
          (approvedRequestsWithTime.length * 24 * 60 * 60 * 1000)
        )
        : 0;

    return {
      total: userRequests.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      withdrawn: withdrawn.length,
      slaBreaches: slaBreaches.length,
      highPriority: highPriority.length,
      mediumPriority: mediumPriority.length,
      lowPriority: lowPriority.length,
      avgApprovalTime,
    };
  }, [requests, userRole, userId]);

  const filteredRequests = useMemo(() => {
    let filtered = requests.filter((request) => {
      if (userRole === "employee") {
        if (request.employeeId !== userId) return false;
      } else {
        const isAssigned = request.approverId === userId;
        const isDelegatedFrom = request.originalApproverId === userId;
        if (!isAssigned && !isDelegatedFrom) return false;
      }

      if (activeTab === "pending" && request.status !== STATUS_TYPES.PENDING)
        return false;
      if (activeTab === "approved" && request.status !== STATUS_TYPES.APPROVED)
        return false;
      if (activeTab === "rejected" && request.status !== STATUS_TYPES.REJECTED)
        return false;
      if (
        activeTab === "withdrawn" &&
        request.status !== STATUS_TYPES.WITHDRAWN
      )
        return false;

      if (filters.status !== "all" && request.status !== filters.status)
        return false;
      if (filters.type !== "all" && request.type !== filters.type) return false;
      if (filters.priority !== "all" && request.priority !== filters.priority)
        return false;
      if (filters.employee !== "all" && request.employeeId !== filters.employee)
        return false;

      if (filters.dateFrom && request.submittedDate < filters.dateFrom)
        return false;
      if (filters.dateTo && request.submittedDate > filters.dateTo)
        return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          request.title.toLowerCase().includes(term) ||
          request.description.toLowerCase().includes(term) ||
          request.employeeName.toLowerCase().includes(term) ||
          request.id.toLowerCase().includes(term) ||
          request.approverName.toLowerCase().includes(term) ||
          request.department.toLowerCase().includes(term)
        );
      }

      return true;
    });

    return filtered.sort((a, b) => {
      const priorityOrder = {
        [PRIORITY_TYPES.HIGH]: 3,
        [PRIORITY_TYPES.MEDIUM]: 2,
        [PRIORITY_TYPES.LOW]: 1,
      };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      if (a.slaDeadline && b.slaDeadline) {
        return new Date(a.slaDeadline) - new Date(b.slaDeadline);
      }

      return new Date(b.submittedDate) - new Date(a.submittedDate);
    });
  }, [requests, userRole, userId, activeTab, filters, searchTerm]);

  const getUserName = () => {
    if (userRole === "employee") {
      const employee = employees.find((e) => e.id === userId);
      return employee ? employee.name : "Employee";
    } else {
      const approver = approvers.find((a) => a.id === userId);
      return approver ? approver.name : "Approver";
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmitRequest = () => {
    if (!newRequest.title.trim() || !newRequest.description.trim()) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    if (
      (newRequest.type === REQUEST_TYPES.LEAVE ||
        newRequest.type === REQUEST_TYPES.TRAVEL) &&
      (!newRequest.startDate || !newRequest.endDate)
    ) {
      showNotification("Please select both start and end dates", "error");
      return;
    }

    if (
      [
        REQUEST_TYPES.PURCHASE,
        REQUEST_TYPES.TRAINING,
        REQUEST_TYPES.TRAVEL,
        REQUEST_TYPES.HARDWARE,
        REQUEST_TYPES.EXPENSE,
      ].includes(newRequest.type) &&
      (!newRequest.amount || parseFloat(newRequest.amount) <= 0)
    ) {
      showNotification("Please enter a valid amount", "error");
      return;
    }

    const employee = employees.find((e) => e.id === userId);
    const approver = approvers[0];

    const newId = `REQ${String(requests.length + 1).padStart(3, "0")}`;
    const today = new Date();
    const slaDeadline = new Date(today);
    slaDeadline.setDate(today.getDate() + 7);

    const newReq = {
      id: newId,
      employeeId: userId,
      employeeName: employee ? employee.name : "Employee",
      department: employee ? employee.department : "General",
      ...newRequest,
      amount: newRequest.amount || "",
      status: STATUS_TYPES.PENDING,
      submittedDate: today.toISOString().split("T")[0],
      slaDeadline: slaDeadline.toISOString().split("T")[0],
      approverId: approver.id,
      approverName: approver.name,
      timeline: [
        {
          action: "Submitted",
          by: employee ? employee.name : "Employee",
          byId: userId,
          date: today.toISOString().split("T")[0],
          time: today.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
      comments: [
        {
          by: employee ? employee.name : "Employee",
          byId: userId,
          text: newRequest.description,
          date: today.toISOString().split("T")[0],
          time: today.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
      canWithdraw: true,
      canResubmit: false,
    };

    setRequests((prev) => [...prev, newReq]);
    setNewRequest({
      type: REQUEST_TYPES.LEAVE,
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      amount: "",
      priority: PRIORITY_TYPES.MEDIUM,
      attachments: [],
    });
    setShowNewRequestModal(false);
    showNotification("Request submitted successfully!");
  };

  const handleWithdrawRequest = (requestId) => {
    if (window.confirm("Are you sure you want to withdraw this request?")) {
      const today = new Date();
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
              ...req,
              status: STATUS_TYPES.WITHDRAWN,
              canWithdraw: false,
              withdrawnDate: today.toISOString().split("T")[0],
              withdrawnBy: getUserName(),
              timeline: [
                ...req.timeline,
                {
                  action: "Withdrawn",
                  by: getUserName(),
                  byId: userId,
                  date: today.toISOString().split("T")[0],
                  time: today.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ],
              comments: [
                ...req.comments,
                {
                  by: getUserName(),
                  byId: userId,
                  text: "Request withdrawn by employee",
                  date: today.toISOString().split("T")[0],
                  time: today.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ],
            }
            : req
        )
      );
      showNotification("Request withdrawn successfully!");
    }
  };

  const handleResubmitRequest = (requestId) => {
    const original = requests.find((req) => req.id === requestId);
    if (!original) return;

    const employee = employees.find((e) => e.id === userId);
    const approver = approvers[0];
    const today = new Date();
    const slaDeadline = new Date(today);
    slaDeadline.setDate(today.getDate() + 7);
    const newId = `REQ${String(requests.length + 1).padStart(3, "0")}`;

    const resubmitted = {
      ...original,
      id: newId,
      status: STATUS_TYPES.PENDING,
      submittedDate: today.toISOString().split("T")[0],
      slaDeadline: slaDeadline.toISOString().split("T")[0],
      approverId: approver.id,
      approverName: approver.name,
      timeline: [
        {
          action: "Resubmitted",
          by: employee ? employee.name : "Employee",
          byId: userId,
          date: today.toISOString().split("T")[0],
          time: today.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
      comments: [
        {
          by: employee ? employee.name : "Employee",
          byId: userId,
          text: "Resubmitted request",
          date: today.toISOString().split("T")[0],
          time: today.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
      canWithdraw: true,
      canResubmit: false,
      rejectionReason: "",
      rejectedDate: "",
      rejectedBy: "",
      approvedDate: "",
      approvedBy: "",
    };

    setRequests((prev) => [...prev, resubmitted]);
    showNotification("Request resubmitted successfully!");
  };

  const handleApproveReject = useCallback(
    (requestId, action, notes = "") => {
      const today = new Date();
      const actionDate = today.toISOString().split("T")[0];
      const actionTime = today.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const actionBy = getUserName();

      setRequests((prev) =>
        prev.map((req) => {
          if (req.id === requestId) {
            const updated = {
              ...req,
              status: action,
              [`${action}edDate`]: actionDate,
              [`${action}edBy`]: actionBy,
              timeline: [
                ...req.timeline,
                {
                  action:
                    action === STATUS_TYPES.APPROVED ? "Approved" : "Rejected",
                  by: actionBy,
                  byId: userId,
                  date: actionDate,
                  time: actionTime,
                },
              ],
              comments: notes
                ? [
                  ...req.comments,
                  {
                    by: actionBy,
                    byId: userId,
                    text: notes,
                    date: actionDate,
                    time: actionTime,
                  },
                ]
                : req.comments,
              canWithdraw: false,
              canResubmit: action === STATUS_TYPES.REJECTED,
            };

            if (action === STATUS_TYPES.REJECTED) {
              updated.rejectionReason = notes || "No reason provided";
            }

            return updated;
          }
          return req;
        })
      );

      showNotification(`Request ${action} successfully!`);
    },
    [getUserName, userId, setRequests]
  );

  const handleBulkAction = (action) => {
    if (selectedRequests.length === 0) {
      showNotification("Please select requests first", "error");
      return;
    }

    const confirmMessage =
      action === STATUS_TYPES.APPROVED
        ? `Approve ${selectedRequests.length} request(s)?`
        : `Reject ${selectedRequests.length} request(s)?`;

    if (window.confirm(confirmMessage)) {
      const today = new Date();
      const actionDate = today.toISOString().split("T")[0];
      const actionTime = today.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const actionBy = getUserName();

      setRequests((prev) =>
        prev.map((req) => {
          if (selectedRequests.includes(req.id)) {
            const updated = {
              ...req,
              status: action,
              [`${action}edDate`]: actionDate,
              [`${action}edBy`]: actionBy,
              timeline: [
                ...req.timeline,
                {
                  action:
                    action === STATUS_TYPES.APPROVED ? "Approved" : "Rejected",
                  by: actionBy,
                  byId: userId,
                  date: actionDate,
                  time: actionTime,
                },
              ],
              canWithdraw: false,
              canResubmit: action === STATUS_TYPES.REJECTED,
            };

            if (action === STATUS_TYPES.REJECTED) {
              updated.rejectionReason = `Bulk ${action} action`;
            }

            return updated;
          }
          return req;
        })
      );

      setSelectedRequests([]);
      showNotification(
        `${selectedRequests.length} request(s) ${action}ed successfully!`
      );
    }
  };

  const handleDelegate = (requestId, delegateId) => {
    const delegate = approvers.find((a) => a.id === delegateId);
    if (!delegate) return;

    const today = new Date();
    const actionDate = today.toISOString().split("T")[0];
    const actionTime = today.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            approverId: delegateId,
            approverName: delegate.name,
            originalApproverId: req.originalApproverId || req.approverId,
            originalApproverName: req.originalApproverName || req.approverName,
            timeline: [
              ...req.timeline,
              {
                action: "Delegated",
                by: getUserName(),
                byId: userId,
                to: delegate.name,
                date: actionDate,
                time: actionTime,
              },
            ],
            comments: [
              ...req.comments,
              {
                by: getUserName(),
                byId: userId,
                text: `Request delegated to ${delegate.name}`,
                date: actionDate,
                time: actionTime,
              },
            ],
          };
        }
        return req;
      })
    );

    setDelegateTo("");
    showNotification(`Request delegated to ${delegate.name}`);
  };

  const handleAddComment = (requestId) => {
    if (!newComment.trim()) {
      showNotification("Please enter a comment", "error");
      return;
    }

    const today = new Date();
    const actionDate = today.toISOString().split("T")[0];
    const actionTime = today.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            comments: [
              ...req.comments,
              {
                by: getUserName(),
                byId: userId,
                text: newComment,
                date: actionDate,
                time: actionTime,
              },
            ],
          };
        }
        return req;
      })
    );

    setNewComment("");
    setShowCommentModal(null);
    showNotification("Comment added successfully!");
  };

  const toggleRequestSelection = (requestId) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredRequests.map((req) => req.id);
    if (selectedRequests.length === filteredIds.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredIds);
    }
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      type: "all",
      priority: "all",
      dateFrom: "",
      dateTo: "",
      employee: "all",
    });
    setSearchTerm("");
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case PRIORITY_TYPES.HIGH:
        return "danger";
      case PRIORITY_TYPES.MEDIUM:
        return "warning";
      case PRIORITY_TYPES.LOW:
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case STATUS_TYPES.APPROVED:
        return "success";
      case STATUS_TYPES.PENDING:
        return "warning";
      case STATUS_TYPES.REJECTED:
        return "danger";
      case STATUS_TYPES.WITHDRAWN:
        return "secondary";
      default:
        return "info";
    }
  };

  const getSLAStatus = (deadline) => {
    if (!deadline) return { text: "No SLA", class: "secondary", days: 0 };

    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { text: "SLA Breached", class: "danger", days: diffDays };
    if (diffDays <= 1)
      return { text: "Due Today", class: "warning", days: diffDays };
    if (diffDays <= 2)
      return { text: "Due Tomorrow", class: "warning", days: diffDays };
    if (diffDays <= 3)
      return { text: "Due Soon", class: "info", days: diffDays };
    return { text: "On Track", class: "success", days: diffDays };
  };

  const getRequestTypeIcon = (type) => {
    switch (type) {
      case REQUEST_TYPES.LEAVE:
        return "bi-calendar";
      case REQUEST_TYPES.PURCHASE:
        return "bi-cart";
      case REQUEST_TYPES.TRAINING:
        return "bi-mortarboard";
      case REQUEST_TYPES.TRAVEL:
        return "bi-airplane";
      case REQUEST_TYPES.HARDWARE:
        return "bi-pc-display";
      case REQUEST_TYPES.EXPENSE:
        return "bi-cash";
      default:
        return "bi-file-text";
    }
  };

  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map((file) => file.name);

    setNewRequest((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...fileNames],
    }));

    showNotification(`${files.length} file(s) attached`);
  };

  const handleRemoveAttachment = (index) => {
    setNewRequest((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(requests, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `approval-requests-${new Date().toISOString().split("T")[0]
      }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    showNotification("Data exported successfully!");
  };

  const exportToExcel = () => {
    try {
      const excelData = {
        Requests: requests || [],
        Employees: employees || [],
        Approvers: approvers || [],
      };

      const workbook = XLSX.utils.book_new();

      Object.entries(excelData).forEach(([sheetName, rows]) => {
        if (!Array.isArray(rows)) return;
        const worksheet = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });

      const fileName = `approvals-data-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Error exporting Excel file.");
    }
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          setRequests(importedData);
          showNotification("Data imported successfully!");
        } else {
          showNotification("Invalid data format", "error");
        }
      } catch (error) {
        showNotification("Error importing data", "error");
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This cannot be undone."
      )
    ) {
      setRequests([]);
      showNotification("All data cleared");
    }
  };

  const delegationStats = useMemo(() => {
    if (userRole !== "approver") return { delegatedToMe: 0, delegatedByMe: 0 };

    const delegatedToMe = requests.filter(
      (req) =>
        req.approverId === userId &&
        req.originalApproverId &&
        req.originalApproverId !== userId
    ).length;

    const delegatedByMe = requests.filter(
      (req) => req.originalApproverId === userId && req.approverId !== userId
    ).length;

    return { delegatedToMe, delegatedByMe };
  }, [requests, userId, userRole]);

  return (
    <div className="mx-auto space-y-4">
      
      {notification && (
        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div
            className={`toast show ${notification.type === "error" ? "bg-danger" : "bg-success"
              }`}
            role="alert"
          >
            <div className="toast-header">
              <strong className="me-auto">
                {notification.type === "error" ? "Error" : "Success"}
              </strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setNotification(null)}
              ></button>
            </div>
            <div className="toast-body text-white">{notification.message}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="mb-3 mb-md-0">
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <i className="bi-clipboard-check text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Approvals Dashboard</h2>
                <p className="text-slate-500 text-sm mb-0">
                  Review and approve team requests
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Requests"
          value={stats.total}
          icon="heroicons:document-text"
          color="blue"
          subtitle={userRole === 'approver' && stats.avgApprovalTime > 0 ? `Avg: ${stats.avgApprovalTime} days` : 'All time requests'}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon="heroicons:clock"
          color="yellow"
          subtitle={userRole === 'approver' && stats.pending > 0 ? <span className={stats.highPriority > 0 ? "text-red-600 font-bold flex items-center" : "flex items-center"}><span className="mr-1">{stats.highPriority} High Priority</span></span> : 'Awaiting action'}
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon="heroicons:check-circle"
          color="green"
          subtitle={stats.approved > 0 ? 'Processed' : 'No approvals yet'}
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon="heroicons:x-circle"
          color="red"
          subtitle={stats.total > 0 ? `${Math.round((stats.rejected / stats.total) * 100)}% rejection rate` : 'No rejections'}
        />
      </div>

      {userRole === "approver" &&
        (delegationStats.delegatedToMe > 0 ||
          delegationStats.delegatedByMe > 0) && (
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card bg-info bg-opacity-10 border-info">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted fw-normal mb-1">
                        Delegated to You
                      </h6>
                      <h4 className="fw-bold mb-0">
                        {delegationStats.delegatedToMe}
                      </h4>
                      <small className="text-muted">
                        {delegationStats.delegatedToMe > 0 && (
                          <button
                            className="btn btn-link btn-sm p-0 text-info text-decoration-none"
                            onClick={() => {
                              setFilters(prev => ({ ...prev, status: "pending" }));
                              setActiveTab("pending");
                              const delegatedReqs = requests.filter(req =>
                                req.approverId === userId &&
                                req.originalApproverId &&
                                req.originalApproverId !== userId &&
                                req.status === STATUS_TYPES.PENDING
                              );
                              if (delegatedReqs.length > 0) {
                                setShowRequestDetail(delegatedReqs[0]);
                              }
                            }}
                          >
                            View Delegated Requests →
                          </button>
                        )}
                      </small>
                    </div>
                    <div className="bg-info bg-opacity-25 p-3 rounded">
                      <i className="bi-arrow-right-circle text-info fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-warning bg-opacity-10 border-warning">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted fw-normal mb-1">
                        Delegated by You
                      </h6>
                      <h4 className="fw-bold mb-0">
                        {delegationStats.delegatedByMe}
                      </h4>
                      <small className="text-muted">
                        Requests you've delegated to others
                      </small>
                    </div>
                    <div className="bg-warning bg-opacity-25 p-3 rounded">
                      <i className="bi-arrow-left-circle text-warning fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {userRole === "approver" && stats.highPriority > 0 && (
        <div className="alert alert-warning alert-dismissible fade show mb-3 border-warning">
          <div className="d-flex align-items-center">
            <i className="bi-flag-fill fs-4 me-3 text-danger"></i>
            <div className="flex-grow-1">
              <strong>High Priority Requests Pending!</strong>
              <p className="mb-0">
                You have <strong>{stats.highPriority}</strong> high-priority request(s) requiring immediate attention.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-warning"
              onClick={() => {
                setFilters(prev => ({ ...prev, priority: PRIORITY_TYPES.HIGH }));
                setActiveTab("pending");
              }}
            >
              View High Priority
            </button>
            <button
              type="button"
              className="btn-close ms-2"
              data-bs-dismiss="alert"
            ></button>
          </div>
        </div>
      )}

      {userRole === "approver" && stats.slaBreaches > 0 && (
        <div className="alert alert-danger alert-dismissible fade show mb-4 border-danger">
          <div className="d-flex align-items-center">
            <i className="bi-exclamation-triangle-fill fs-4 me-3"></i>
            <div className="flex-grow-1">
              <strong>SLA Breach Alert!</strong>
              <p className="mb-0">
                You have <strong>{stats.slaBreaches}</strong> pending request(s) that have exceeded their SLA deadline. Please review immediately.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => {
                const breachedRequests = requests.filter(req => {
                  if (req.status !== STATUS_TYPES.PENDING) return false;
                  if (req.approverId !== userId && req.originalApproverId !== userId) return false;
                  if (!req.slaDeadline) return false;
                  return req.slaDeadline < new Date().toISOString().split("T")[0];
                });
                if (breachedRequests.length > 0) {
                  setShowRequestDetail(breachedRequests[0]);
                }
              }}
            >
              View Breached
            </button>
            <button
              type="button"
              className="btn-close ms-2"
              data-bs-dismiss="alert"
            ></button>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end mb-3">
        <div className="dropdown">
          <button
            className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="bi-filter-circle me-2"></i>
            <span>
              {activeTab === "all" && "All Requests"}
              {activeTab === "pending" && "Pending"}
              {activeTab === "approved" && "Approved"}
              {activeTab === "rejected" && "Rejected"}
              {activeTab === "withdrawn" && "Withdrawn"}
            </span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
            <li>
              <button
                className="dropdown-item d-flex align-items-center"
                onClick={() => setActiveTab("all")}
              >
                <i className="bi-list me-2"></i> All Requests
              </button>
            </li>

            <li>
              <button
                className="dropdown-item d-flex align-items-center"
                onClick={() => setActiveTab("pending")}
              >
                <i className="bi-clock me-2"></i>
                Pending
                {stats.pending > 0 && (
                  <span className="badge bg-danger ms-auto">
                    {stats.pending}
                  </span>
                )}
              </button>
            </li>

            <li>
              <button
                className="dropdown-item d-flex align-items-center"
                onClick={() => setActiveTab("approved")}
              >
                <i className="bi-check-circle me-2 text-success"></i>
                Approved
              </button>
            </li>

            <li>
              <button
                className="dropdown-item d-flex align-items-center"
                onClick={() => setActiveTab("rejected")}
              >
                <i className="bi-x-circle me-2 text-danger"></i>
                Rejected
              </button>
            </li>

            {userRole === "employee" && (
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => setActiveTab("withdrawn")}
                >
                  <i className="bi-arrow-return-left me-2 text-muted"></i>
                  Withdrawn
                </button>
              </li>
            )}

            {userRole === "approver" && delegationStats.delegatedToMe > 0 && (
              <li>
                <hr className="dropdown-divider" />
              </li>
            )}

            {userRole === "approver" && delegationStats.delegatedToMe > 0 && (
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => {
                    setFilters(prev => ({ ...prev, status: "pending" }));
                    setActiveTab("pending");
                    const delegatedReqs = requests.filter(req =>
                      req.approverId === userId &&
                      req.originalApproverId &&
                      req.originalApproverId !== userId
                    );
                    if (delegatedReqs.length > 0) {
                      setShowRequestDetail(delegatedReqs[0]);
                    }
                  }}
                >
                  <i className="bi-arrow-right-circle me-2 text-info"></i>
                  Delegated to Me
                  {delegationStats.delegatedToMe > 0 && (
                    <span className="badge bg-info ms-auto">
                      {delegationStats.delegatedToMe}
                    </span>
                  )}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label small">Status</label>
              <select
                className="form-select form-select-sm"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small">Type</label>
              <select
                className="form-select form-select-sm"
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="all">All Types</option>
                {Object.values(REQUEST_TYPES).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small">Priority</label>
              <select
                className="form-select form-select-sm"
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priority: e.target.value }))
                }
              >
                <option value="all">All Priorities</option>
                {Object.values(PRIORITY_TYPES).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {userRole === "approver" && (
              <div className="col-md-2">
                <label className="form-label small">Employee</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.employee}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      employee: e.target.value,
                    }))
                  }
                >
                  <option value="all">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={"col-md-2"}>
              <label className="form-label small">Date Range</label>
              <div className="input-group input-group-sm">
                <input
                  type="date"
                  className="form-control"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value,
                    }))
                  }
                />
                <span className="input-group-text">to</span>
                <input
                  type="date"
                  className="form-control"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className={"col-md-2"}>
              <label className="form-label small">Search</label>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={resetFilters}
                  title="Reset Filters"
                >
                  <i className="bi-x-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {userRole === "approver" && selectedRequests.length > 0 && (
        <div className="card bg-light mb-4">
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <i className="bi-check-square text-primary fs-5 me-2"></i>
                <span className="fw-medium">
                  {selectedRequests.length} request(s) selected
                </span>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleBulkAction(STATUS_TYPES.APPROVED)}
                >
                  <i className="bi-check-circle me-1"></i>
                  Approve Selected
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleBulkAction(STATUS_TYPES.REJECTED)}
                >
                  <i className="bi-x-circle me-1"></i>
                  Reject Selected
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setSelectedRequests([])}
                >
                  <i className="bi-x me-1"></i>
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi-inbox fs-1 text-muted mb-3"></i>
              <h5 className="text-muted">No requests found</h5>
              <p className="text-muted mb-0">
                Try adjusting your filters or create a new request
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    {userRole === "approver" && (
                      <th style={{ width: "50px" }}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={
                              selectedRequests.length ===
                              filteredRequests.length &&
                              filteredRequests.length > 0
                            }
                            onChange={selectAllFiltered}
                          />
                        </div>
                      </th>
                    )}
                    <th>Request Details</th>
                    {userRole === "approver" && <th>Employee</th>}
                    <th>Status</th>
                    <th>Priority</th>
                    <th>SLA Status</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => {
                    const slaStatus = getSLAStatus(request.slaDeadline);
                    const isDelegated =
                      request.originalApproverId &&
                      request.originalApproverId !== request.approverId;

                    return (
                      <tr
                        key={request.id}
                        className={
                          selectedRequests.includes(request.id)
                            ? "table-active"
                            : ""
                        }
                      >
                        {userRole === "approver" && (
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedRequests.includes(request.id)}
                                onChange={() =>
                                  toggleRequestSelection(request.id)
                                }
                                disabled={
                                  request.status !== STATUS_TYPES.PENDING
                                }
                              />
                            </div>
                          </td>
                        )}
                        <td>
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <i
                                className={`bi ${getRequestTypeIcon(
                                  request.type
                                )} me-2 text-primary`}
                              ></i>
                              <strong className="d-block">
                                {request.title}
                              </strong>
                            </div>
                            <small className="text-muted d-block mb-2">
                              {request.description.substring(0, 100)}...
                            </small>
                            <div className="d-flex flex-wrap gap-1">
                              <span className="badge bg-light text-dark">
                                <i className="bi-tag me-1"></i>
                                {request.type}
                              </span>
                              {request.startDate && request.endDate && (
                                <span className="badge bg-light text-dark">
                                  <i className="bi-calendar me-1"></i>
                                  {formatDate(request.startDate)} -{" "}
                                  {formatDate(request.endDate)}
                                </span>
                              )}
                              {request.amount && (
                                <span className="badge bg-light text-dark">
                                  <i className="bi-currency-dollar me-1"></i>$
                                  {request.amount}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        {userRole === "approver" && (
                          <td>
                            <div>
                              <strong className="d-block">
                                {request.employeeName}
                              </strong>
                              <small className="text-muted d-block">
                                {request.department}
                              </small>
                              {request.status === STATUS_TYPES.PENDING && (
                                <small className="text-muted">
                                  <i className="bi-person me-1"></i>
                                  Waiting for {request.approverName}
                                </small>
                              )}
                            </div>
                          </td>
                        )}
                        <td>
                          <span
                            className={`badge bg-${getStatusClass(
                              request.status
                            )}`}
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                          {userRole === "employee" &&
                            request.status === STATUS_TYPES.PENDING && (
                              <div className="mt-1">
                                <small className="text-muted d-block">
                                  <i className="bi-person me-1"></i>
                                  {request.approverName}
                                </small>
                              </div>
                            )}
                          {isDelegated && (
                            <div className="mt-1">
                              <span className="badge bg-info">
                                <i className="bi-arrow-right me-1"></i>
                                Delegated from {request.originalApproverName || "Original Approver"}
                              </span>
                            </div>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge bg-${getPriorityClass(
                              request.priority
                            )}`}
                          >
                            <i
                              className={`bi-flag${request.priority === PRIORITY_TYPES.HIGH
                                ? "-fill"
                                : ""
                                } me-1`}
                            ></i>
                            {request.priority.charAt(0).toUpperCase() +
                              request.priority.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span
                              className={`badge bg-${slaStatus.class} mb-1`}
                            >
                              {slaStatus.text}
                            </span>
                            {request.slaDeadline && (
                              <small className="text-muted">
                                Due: {formatDate(request.slaDeadline)}
                                {slaStatus.days !== 0 && (
                                  <span className="ms-1">
                                    ({slaStatus.days > 0 ? "+" : ""}
                                    {slaStatus.days}d)
                                  </span>
                                )}
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>{formatDate(request.submittedDate)}</div>
                          {request.status === STATUS_TYPES.APPROVED &&
                            request.approvedDate && (
                              <small className="text-muted">
                                Approved: {formatDate(request.approvedDate)}
                              </small>
                            )}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => setShowRequestDetail(request)}
                              title="View Details"
                            >
                              <i className="bi-eye"></i>
                            </button>

                            {userRole === "approver" &&
                              request.status === STATUS_TYPES.PENDING && (
                                <>
                                  <button
                                    className="btn btn-outline-success"
                                    onClick={() =>
                                      handleApproveReject(
                                        request.id,
                                        STATUS_TYPES.APPROVED,
                                        "Approved via quick action"
                                      )
                                    }
                                    title="Approve"
                                  >
                                    <i className="bi-check"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() =>
                                      handleApproveReject(
                                        request.id,
                                        STATUS_TYPES.REJECTED,
                                        "Rejected via quick action"
                                      )
                                    }
                                    title="Reject"
                                  >
                                    <i className="bi-x"></i>
                                  </button>
                                  <button
                                    className="btn btn-outline-info"
                                    onClick={() => setShowCommentModal(request)}
                                    title="Add Comment"
                                  >
                                    <i className="bi-chat"></i>
                                  </button>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-outline-secondary dropdown-toggle"
                                      data-bs-toggle="dropdown"
                                      title="More Actions"
                                    >
                                      <i className="bi-three-dots"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                      <li>
                                        <h6 className="dropdown-header">
                                          Delegate to
                                        </h6>
                                      </li>
                                      {approvers
                                        .filter(
                                          (a) => a.id !== request.approverId
                                        )
                                        .map((approver) => (
                                          <li key={approver.id}>
                                            <button
                                              className="dropdown-item"
                                              onClick={() =>
                                                handleDelegate(
                                                  request.id,
                                                  approver.id
                                                )
                                              }
                                            >
                                              <i className="bi-arrow-right me-2"></i>
                                              {approver.name} ({approver.role})
                                            </button>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                </>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filteredRequests.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Showing {filteredRequests.length} of {requests.length} requests
              </small>
              <small className="text-muted">
                {selectedRequests.length > 0 &&
                  `${selectedRequests.length} selected`}
              </small>
            </div>
          )}
        </div>
      </div>

      {showRequestDetail && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title mb-1">
                    {showRequestDetail.title}
                  </h5>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-dark">
                      <i
                        className={`bi ${getRequestTypeIcon(
                          showRequestDetail.type
                        )} me-1`}
                      ></i>
                      {showRequestDetail.type}
                    </span>
                    <span
                      className={`badge bg-${getPriorityClass(
                        showRequestDetail.priority
                      )}`}
                    >
                      {showRequestDetail.priority}
                    </span>
                    <span
                      className={`badge bg-${getStatusClass(
                        showRequestDetail.status
                      )}`}
                    >
                      {showRequestDetail.status}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRequestDetail(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  
                  <div className="col-md-8">
                    <div className="card mb-4">
                      <div className="card-body">
                        <h6 className="card-title fw-bold mb-3">
                          Request Details
                        </h6>
                        <p className="mb-4">{showRequestDetail.description}</p>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <strong className="d-block text-muted small mb-1">
                              Employee
                            </strong>
                            <div className="d-flex align-items-center">
                              <i className="bi-person-circle me-2"></i>
                              <span>
                                {showRequestDetail.employeeName} (
                                {showRequestDetail.department})
                              </span>
                            </div>
                          </div>

                          <div className="col-md-6 mb-3">
                            <strong className="d-block text-muted small mb-1">
                              Approver
                            </strong>
                            <div className="d-flex align-items-center">
                              <i className="bi-shield-check me-2"></i>
                              <span>{showRequestDetail.approverName}</span>
                              {showRequestDetail.originalApproverId &&
                                showRequestDetail.originalApproverId !==
                                showRequestDetail.approverId && (
                                  <span className="badge bg-warning ms-2">
                                    <i className="bi-arrow-right me-1"></i>
                                    Delegated
                                  </span>
                                )}
                            </div>
                          </div>

                          <div className="col-md-6 mb-3">
                            <strong className="d-block text-muted small mb-1">
                              Submitted
                            </strong>
                            <div className="d-flex align-items-center">
                              <i className="bi-calendar me-2"></i>
                              <span>
                                {formatDate(showRequestDetail.submittedDate)}
                              </span>
                            </div>
                          </div>

                          {showRequestDetail.startDate &&
                            showRequestDetail.endDate && (
                              <>
                                <div className="col-md-6 mb-3">
                                  <strong className="d-block text-muted small mb-1">
                                    Start Date
                                  </strong>
                                  <div className="d-flex align-items-center">
                                    <i className="bi-calendar-event me-2"></i>
                                    <span>
                                      {formatDate(showRequestDetail.startDate)}
                                    </span>
                                  </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                  <strong className="d-block text-muted small mb-1">
                                    End Date
                                  </strong>
                                  <div className="d-flex align-items-center">
                                    <i className="bi-calendar-event me-2"></i>
                                    <span>
                                      {formatDate(showRequestDetail.endDate)}
                                    </span>
                                  </div>
                                </div>
                              </>
                            )}

                          {showRequestDetail.amount && (
                            <div className="col-md-6 mb-3">
                              <strong className="d-block text-muted small mb-1">
                                Amount
                              </strong>
                              <div className="d-flex align-items-center">
                                <i className="bi-currency-dollar me-2"></i>
                                <span>${showRequestDetail.amount}</span>
                              </div>
                            </div>
                          )}

                          <div className="col-md-6 mb-3">
                            <strong className="d-block text-muted small mb-1">
                              SLA Deadline
                            </strong>
                            <div className="d-flex align-items-center">
                              <i className="bi-clock me-2"></i>
                              <span>
                                {formatDate(showRequestDetail.slaDeadline)}
                              </span>
                              {getSLAStatus(showRequestDetail.slaDeadline).class === "danger" && (
                                <span className="badge bg-danger ms-2">
                                  <i className="bi-exclamation-triangle-fill me-1"></i>
                                  SLA Breached
                                </span>
                              )}
                              {getSLAStatus(showRequestDetail.slaDeadline).class === "warning" && (
                                <span className="badge bg-warning text-dark ms-2">
                                  <i className="bi-clock me-1"></i>
                                  Due Soon
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {showRequestDetail.status === STATUS_TYPES.APPROVED &&
                          showRequestDetail.approvedDate && (
                            <div className="alert alert-success mt-3">
                              <div className="d-flex align-items-center">
                                <i className="bi-check-circle-fill fs-5 me-3"></i>
                                <div>
                                  <strong>Approved</strong>
                                  <p className="mb-0">
                                    Approved on{" "}
                                    {formatDate(showRequestDetail.approvedDate)}{" "}
                                    by {showRequestDetail.approvedBy}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {showRequestDetail.status === STATUS_TYPES.REJECTED &&
                          showRequestDetail.rejectedDate && (
                            <div className="alert alert-danger mt-3">
                              <div className="d-flex align-items-center">
                                <i className="bi-x-circle-fill fs-5 me-3"></i>
                                <div>
                                  <strong>Rejected</strong>
                                  <p className="mb-0">
                                    Rejected on{" "}
                                    {formatDate(showRequestDetail.rejectedDate)}{" "}
                                    by {showRequestDetail.rejectedBy}
                                  </p>
                                  {showRequestDetail.rejectionReason && (
                                    <div className="mt-2">
                                      <strong>Reason:</strong>
                                      <p className="mb-0 mt-1">
                                        {showRequestDetail.rejectionReason}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                        {showRequestDetail.status === STATUS_TYPES.WITHDRAWN &&
                          showRequestDetail.withdrawnDate && (
                            <div className="alert alert-secondary mt-3">
                              <div className="d-flex align-items-center">
                                <i className="bi-arrow-return-left fs-5 me-3"></i>
                                <div>
                                  <strong>Withdrawn</strong>
                                  <p className="mb-0">
                                    Withdrawn on{" "}
                                    {formatDate(
                                      showRequestDetail.withdrawnDate
                                    )}{" "}
                                    by {showRequestDetail.withdrawnBy}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {showRequestDetail.attachments &&
                          showRequestDetail.attachments.length > 0 && (
                            <div className="mt-4">
                              <h6 className="fw-bold mb-3">Attachments</h6>
                              <div className="row g-2">
                                {showRequestDetail.attachments.map(
                                  (file, index) => (
                                    <div key={index} className="col-md-6">
                                      <div className="card">
                                        <div className="card-body py-2">
                                          <div className="d-flex align-items-center">
                                            <i className="bi-paperclip me-2"></i>
                                            <span className="text-truncate">
                                              {file}
                                            </span>
                                            <button className="btn btn-sm btn-outline-primary ms-auto">
                                              <i className="bi-download"></i>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        <div className="mt-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0">
                              Comments & Communication
                            </h6>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                setShowCommentModal(showRequestDetail)
                              }
                            >
                              <i className="bi-plus-circle me-1"></i>
                              Add Comment
                            </button>
                          </div>

                          {showRequestDetail.comments &&
                            showRequestDetail.comments.length > 0 ? (
                            <div className="comments-section">
                              {showRequestDetail.comments.map(
                                (comment, index) => (
                                  <div key={index} className="card mb-3">
                                    <div className="card-body">
                                      <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                          <div
                                            className={`rounded-circle bg-${comment.byId.startsWith("EMP")
                                              ? "primary"
                                              : "success"
                                              } bg-opacity-10 p-2 me-2`}
                                          >
                                            <i
                                              className={`bi ${comment.byId.startsWith("EMP")
                                                ? "bi-person"
                                                : "bi-shield-check"
                                                } text-${comment.byId.startsWith("EMP")
                                                  ? "primary"
                                                  : "success"
                                                }`}
                                            ></i>
                                          </div>
                                          <div>
                                            <strong>{comment.by}</strong>
                                            <div className="text-muted small">
                                              {comment.byId.startsWith("EMP")
                                                ? "Employee"
                                                : "Approver"}
                                            </div>
                                          </div>
                                        </div>
                                        <small className="text-muted">
                                          {formatDate(comment.date)} at{" "}
                                          {comment.time}
                                        </small>
                                      </div>
                                      <p className="mb-0">{comment.text}</p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted">
                              <i className="bi-chat fs-4 d-block mb-2"></i>
                              <p className="mb-0">No comments yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="position-sticky" style={{ top: "20px" }}>
                      <div className="card">
                        <div
                          className="card-body"
                          style={{ maxHeight: "85vh", overflowY: "auto" }}
                        >
                          <h6 className="card-title fw-bold mb-3">Timeline</h6>

                          <div
                            className="timeline"
                            style={{ maxHeight: "50vh", overflowY: "auto" }}
                          >
                            {showRequestDetail.timeline.map((event, index) => (
                              <div key={index} className="timeline-item mb-3">
                                <div className="d-flex align-items-start">
                                  <div className="timeline-marker flex-shrink-0">
                                    <div
                                      className={`rounded-circle bg-${getStatusClass(
                                        event.action.toLowerCase()
                                      )} p-2 me-3 d-flex align-items-center justify-content-center`}
                                      style={{ width: "40px", height: "40px" }}
                                    >
                                      <i
                                        className={`bi ${event.action === "Submitted"
                                          ? "bi-send"
                                          : event.action === "Approved"
                                            ? "bi-check"
                                            : event.action === "Rejected"
                                              ? "bi-x"
                                              : event.action === "Withdrawn"
                                                ? "bi-arrow-return-left"
                                                : event.action === "Delegated"
                                                  ? "bi-arrow-right"
                                                  : event.action === "Resubmitted"
                                                    ? "bi-arrow-clockwise"
                                                    : "bi-clock"
                                          } text-white`}
                                      ></i>
                                    </div>
                                  </div>
                                  <div className="flex-grow-1">
                                    <strong className="d-block">
                                      {event.action}
                                    </strong>
                                    <small className="text-muted d-block">
                                      {event.by}
                                      {event.to && ` → ${event.to}`}
                                    </small>
                                    <small className="text-muted">
                                      {formatDateTime(event.date, event.time)}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-3 border-top">
                            <h6 className="fw-bold mb-3">Actions</h6>
                            <div className="d-grid gap-2">
                              {userRole === "employee" &&
                                showRequestDetail.canWithdraw &&
                                showRequestDetail.status ===
                                STATUS_TYPES.PENDING && (
                                  <button
                                    className="btn btn-warning"
                                    onClick={() => {
                                      handleWithdrawRequest(
                                        showRequestDetail.id
                                      );
                                      setShowRequestDetail(null);
                                    }}
                                  >
                                    <i className="bi-x-circle me-2"></i>
                                    Withdraw Request
                                  </button>
                                )}

                              {userRole === "employee" &&
                                showRequestDetail.canResubmit &&
                                showRequestDetail.status ===
                                STATUS_TYPES.REJECTED && (
                                  <button
                                    className="btn btn-success"
                                    onClick={() => {
                                      handleResubmitRequest(
                                        showRequestDetail.id
                                      );
                                      setShowRequestDetail(null);
                                    }}
                                  >
                                    <i className="bi-arrow-clockwise me-2"></i>
                                    Resubmit Request
                                  </button>
                                )}

                              {userRole === "approver" &&
                                showRequestDetail.status ===
                                STATUS_TYPES.PENDING && (
                                  <>
                                    <div className="d-grid gap-2">
                                      <button
                                        className="btn btn-success"
                                        onClick={() => {
                                          handleApproveReject(
                                            showRequestDetail.id,
                                            STATUS_TYPES.APPROVED,
                                            "Approved via detail view"
                                          );
                                          setShowRequestDetail(null);
                                        }}
                                      >
                                        <i className="bi-check-circle me-2"></i>
                                        Approve Request
                                      </button>

                                      <button
                                        className="btn btn-danger"
                                        onClick={() => {
                                          const reason = prompt(
                                            "Please enter rejection reason:"
                                          );
                                          if (reason !== null) {
                                            handleApproveReject(
                                              showRequestDetail.id,
                                              STATUS_TYPES.REJECTED,
                                              reason
                                            );
                                            setShowRequestDetail(null);
                                          }
                                        }}
                                      >
                                        <i className="bi-x-circle me-2"></i>
                                        Reject Request
                                      </button>

                                      <button
                                        className="btn btn-info"
                                        onClick={() =>
                                          setShowCommentModal(showRequestDetail)
                                        }
                                      >
                                        <i className="bi-chat me-2"></i>
                                        Add Comment
                                      </button>

                                      <div className="mt-2">
                                        <small className="text-muted d-block mb-2">
                                          Delegate to:
                                        </small>
                                        <div className="d-grid gap-2">
                                          {approvers
                                            .filter(
                                              (a) =>
                                                a.id !==
                                                showRequestDetail.approverId
                                            )
                                            .map((approver) => (
                                              <button
                                                key={approver.id}
                                                className="btn btn-outline-secondary text-start d-flex align-items-center"
                                                onClick={() => {
                                                  handleDelegate(
                                                    showRequestDetail.id,
                                                    approver.id
                                                  );
                                                  setShowRequestDetail(null);
                                                }}
                                              >
                                                <i className="bi-arrow-right me-2"></i>
                                                <div className="text-truncate">
                                                  <div className="fw-medium">
                                                    {approver.name}
                                                  </div>
                                                  <small className="text-muted">
                                                    {approver.role}
                                                  </small>
                                                </div>
                                              </button>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRequestDetail(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCommentModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Comment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCommentModal(null);
                    setNewComment("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your comment..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCommentModal(null);
                    setNewComment("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleAddComment(showCommentModal.id)}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsDashboard;
