import React, { useState, useEffect, useCallback } from "react";
import { activitiesAPI } from "../../../shared/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPhone,
  FiMail,
  FiVideo,
  FiCheckSquare,
  FiCalendar,
  FiClock,
  FiUser,
  FiUsers,
  FiFileText,
  FiMessageSquare,
  FiAlertCircle,
  FiCheckCircle,
  FiMoreVertical
} from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("calls");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const getActivityStyle = (type) => {
    const typeLower = type?.toLowerCase() || "";
    if (typeLower.includes("call")) {
      return { badgeClass: "bg-purple-100 text-purple-700", icon: FiPhone };
    } else if (typeLower.includes("email")) {
      return { badgeClass: "bg-amber-100 text-amber-700", icon: FiMail };
    } else if (typeLower.includes("meeting")) {
      return { badgeClass: "bg-pink-100 text-pink-700", icon: FiVideo };
    } else if (typeLower.includes("task")) {
      return { badgeClass: "bg-blue-100 text-blue-700", icon: FiCheckSquare };
    }
    return { badgeClass: "bg-gray-100 text-gray-600", icon: FiFileText };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      if (isNaN(date.getTime())) return dateString;
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      if (typeof timeString === 'string') {
        return timeString.substring(0, 5);
      }
      return timeString;
    } catch (e) {
      return timeString;
    }
  };

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activitiesAPI.list();

      if (!data || !Array.isArray(data)) {
        setActivities([]);
        return;
      }

      const transformedData = data.map(activity => {
        let activityType = (activity.activity_type || activity.type || "").toString().trim();
        if (!activityType || activityType === "null" || activityType === "undefined") {
          activityType = "Calls";
        }
        const styleInfo = getActivityStyle(activityType);
        return {
          ...activity,
          type: activityType,
          activity_type: activityType,
          badgeClass: styleInfo.badgeClass,
          icon: styleInfo.icon,
          dueDate: activity.due_date ? formatDate(activity.due_date) : "",
          activityTime: activity.activity_time ? formatTime(activity.activity_time) : "",
          createdDate: activity.created_date ? formatDate(activity.created_date) : "",
          checked: activity.checked || false
        };
      }).filter(activity => activity !== null);

      setActivities(transformedData);
    } catch (err) {
      console.error("Error loading activities:", err);
      setError(err.message || "Failed to load activities. Please try again.");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Pagination
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setActivities((prev) => prev.map((item) => ({ ...item, checked: checked })));
  };

  const handleCheckboxChange = (id) => {
    setActivities((prev) => prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const [formData, setFormData] = useState({
    title: "", activityType: "Calls", dueDate: "", time: "", remainder: "", remainderType: "Work",
    owner: "", guests: "", description: "", deal: "", contact: "", company: "",
    callContactName: "", callContactNumber: "", email: "", emailPassword: "",
    meetingId: "", meetingPassword: "", task: ""
  });

  const [editActivity, setEditActivity] = useState({
    title: "", type: "", dueDate: "", time: "", reminder: "", reminderType: "Work",
    owner: "", guests: "", description: "", deals: "", contacts: "", companies: "",
    callContactName: "", callContactNumber: "", email: "", emailPassword: "",
    meetingId: "", meetingPassword: "", task: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const dueDate = formData.dueDate ? new Date(formData.dueDate).toISOString().split("T")[0] : null;
      const activityData = {
        title: formData.title || null,
        activity_type: selectedActivity.charAt(0).toUpperCase() + selectedActivity.slice(1),
        due_date: dueDate,
        activity_time: formData.time || null,
        remainder: formData.remainder || null,
        remainder_type: formData.remainderType || null,
        owner: formData.owner || null,
        guests: formData.guests || null,
        description: formData.description || null,
        deals: formData.deal || null,
        contacts: formData.contact || null,
        companies: formData.company || null,
        call_contact_name: formData.callContactName || null,
        call_contact_number: formData.callContactNumber || null,
        email: formData.email || null,
        email_password: formData.emailPassword || null,
        meeting_id: formData.meetingId || null,
        meeting_password: formData.meetingPassword || null,
        task: formData.task || null,
        created_date: new Date().toISOString().split("T")[0],
      };

      Object.keys(activityData).forEach((key) => {
        if (activityData[key] === "" || activityData[key] === undefined) activityData[key] = null;
      });

      await activitiesAPI.create(activityData);
      toast.success("Activity created successfully!");
      setFormData({
        title: "", activityType: "Calls", dueDate: "", time: "", remainder: "", remainderType: "Work",
        owner: "", guests: "", description: "", deal: "", contact: "", company: "",
        callContactName: "", callContactNumber: "", email: "", emailPassword: "",
        meetingId: "", meetingPassword: "", task: ""
      });
      setSelectedActivity("calls");
      setShowModal(false);
      await loadActivities();
    } catch (err) {
      console.error("Error creating activity:", err);
      toast.error(err.message || "Failed to create activity. Please try again.");
    }
  };

  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!activityToDelete || !activityToDelete.id) return;
    try {
      await activitiesAPI.delete(activityToDelete.id);
      toast.success("Activity deleted successfully!");
      setShowDeleteModal(false);
      setActivityToDelete(null);
      await loadActivities();
    } catch (err) {
      console.error("Error deleting activity:", err);
      toast.error(err.message || "Failed to delete activity.");
    }
  };

  const handleEdit = async (activity) => {
    try {
      let fullActivityData = activity;
      if (activity.id) {
        try {
          fullActivityData = await activitiesAPI.getById(activity.id);
        } catch (err) {
          console.error("Error fetching activity details:", err);
        }
      }

      setEditingActivityId(fullActivityData.id);
      let formattedDate = "";
      if (fullActivityData.due_date) {
        if (typeof fullActivityData.due_date === 'string') {
          formattedDate = fullActivityData.due_date.split('T')[0];
        } else {
          const date = new Date(fullActivityData.due_date);
          formattedDate = date.toISOString().split('T')[0];
        }
      }

      let formattedTime = "";
      if (fullActivityData.activity_time) {
        formattedTime = formatTime(fullActivityData.activity_time);
      }

      setEditActivity({
        title: fullActivityData.title || "",
        type: fullActivityData.activity_type || "",
        dueDate: formattedDate,
        time: formattedTime,
        reminder: fullActivityData.remainder || "",
        reminderType: fullActivityData.remainder_type || "Work",
        owner: fullActivityData.owner || "",
        guests: fullActivityData.guests || "",
        description: fullActivityData.description || "",
        deals: fullActivityData.deals || "",
        contacts: fullActivityData.contacts || "",
        companies: fullActivityData.companies || "",
        callContactName: fullActivityData.call_contact_name || "",
        callContactNumber: fullActivityData.call_contact_number || "",
        email: fullActivityData.email || "",
        emailPassword: fullActivityData.email_password || "",
        meetingId: fullActivityData.meeting_id || "",
        meetingPassword: fullActivityData.meeting_password || "",
        task: fullActivityData.task || ""
      });
      setSelectedActivity(fullActivityData.activity_type?.toLowerCase() || "calls");
      setShowEditModal(true);
    } catch (err) {
      console.error("Error opening edit modal:", err);
      toast.error("Failed to load activity details.");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingActivityId) return;
    try {
      const dueDate = editActivity.dueDate ? new Date(editActivity.dueDate).toISOString().split('T')[0] : null;
      const activityData = {
        title: editActivity.title || "",
        activity_type: editActivity.type || selectedActivity.charAt(0).toUpperCase() + selectedActivity.slice(1),
        due_date: dueDate || null,
        activity_time: editActivity.time || null,
        remainder: editActivity.reminder || null,
        remainder_type: editActivity.reminderType || null,
        owner: editActivity.owner || null,
        guests: editActivity.guests || null,
        description: editActivity.description || null,
        deals: editActivity.deals || null,
        contacts: editActivity.contacts || null,
        companies: editActivity.companies || null,
        call_contact_name: editActivity.callContactName || null,
        call_contact_number: editActivity.callContactNumber || null,
        email: editActivity.email || null,
        email_password: editActivity.emailPassword || null,
        meeting_id: editActivity.meetingId || null,
        meeting_password: editActivity.meetingPassword || null,
        task: editActivity.task || null
      };

      Object.keys(activityData).forEach(key => {
        if (activityData[key] === "" || activityData[key] === undefined) activityData[key] = null;
      });

      await activitiesAPI.update(editingActivityId, activityData);
      toast.success("Activity updated successfully!");
      setShowEditModal(false);
      setEditingActivityId(null);
      await loadActivities();
    } catch (err) {
      console.error("Error updating activity:", err);
      toast.error(err.message || "Failed to update activity.");
    }
  };

  const ActivityFormFields = ({ isEdit = false }) => {
    const currentData = isEdit ? editActivity : formData;

    const renderActivitySpecificFields = () => {
      switch (selectedActivity) {
        case "calls":
          return (
            <div className="space-y-2 mt-3 p-3 bg-gray-50 rounded-lg">
              <h6 className="text-sm font-semibold text-midnight_text">Call Details</h6>
              <input type="text" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter Contact Name" value={currentData.callContactName || ""} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, callContactName: e.target.value }) : setFormData({ ...formData, callContactName: e.target.value })} />
              <input type="text" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter Contact Number" value={currentData.callContactNumber || ""} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, callContactNumber: e.target.value }) : setFormData({ ...formData, callContactNumber: e.target.value })} />
            </div>
          );
        case "email":
          return (
            <div className="space-y-2 mt-3 p-3 bg-gray-50 rounded-lg">
              <h6 className="text-sm font-semibold text-midnight_text">Email Details</h6>
              <input type="email" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter Email" value={currentData.email || ""} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, email: e.target.value }) : setFormData({ ...formData, email: e.target.value })} />
              <input type="text" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter Password" value={currentData.emailPassword || ""} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, emailPassword: e.target.value }) : setFormData({ ...formData, emailPassword: e.target.value })} />
            </div>
          );
        case "meeting":
          return (
            <div className="space-y-2 mt-3 p-3 bg-gray-50 rounded-lg">
              <h6 className="text-sm font-semibold text-midnight_text">Meeting Details</h6>
              <input type="text" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter Meeting ID" value={currentData.meetingId || ""} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, meetingId: e.target.value }) : setFormData({ ...formData, meetingId: e.target.value })} />
              <input type="text" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter Meeting Password" value={currentData.meetingPassword || ""} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, meetingPassword: e.target.value }) : setFormData({ ...formData, meetingPassword: e.target.value })} />
            </div>
          );
        case "task":
          return (
            <div className="space-y-2 mt-3 p-3 bg-gray-50 rounded-lg">
              <h6 className="text-sm font-semibold text-midnight_text">Task Details</h6>
              <input type="text" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter Task" value={currentData.task || ""} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, task: e.target.value }) : setFormData({ ...formData, task: e.target.value })} />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-rose-500">*</span></label>
          <input type="text" value={currentData.title} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, title: e.target.value }) : setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type <span className="text-rose-500">*</span></label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setSelectedActivity("calls")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${selectedActivity === "calls" ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"}`}><FiPhone className="h-4 w-4" />Calls</button>
            <button type="button" onClick={() => setSelectedActivity("email")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${selectedActivity === "email" ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"}`}><FiMail className="h-4 w-4" />Email</button>
            <button type="button" onClick={() => setSelectedActivity("meeting")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${selectedActivity === "meeting" ? "bg-cyan-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"}`}><FiVideo className="h-4 w-4" />Meeting</button>
            <button type="button" onClick={() => setSelectedActivity("task")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${selectedActivity === "task" ? "bg-amber-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"}`}><FiCheckSquare className="h-4 w-4" />Task</button>
          </div>
          {renderActivitySpecificFields()}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-rose-500">*</span></label><input type="date" value={currentData.dueDate} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, dueDate: e.target.value }) : setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Time <span className="text-rose-500">*</span></label><input type="time" value={currentData.time} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, time: e.target.value }) : setFormData({ ...formData, time: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required /></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Remainder</label><input type="text" value={currentData.reminder} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, reminder: e.target.value }) : setFormData({ ...formData, remainder: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter remainder" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><input type="text" value={currentData.reminderType} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, reminderType: e.target.value }) : setFormData({ ...formData, remainderType: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter type" /></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Owner</label><input type="text" value={currentData.owner} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, owner: e.target.value }) : setFormData({ ...formData, owner: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter owner name" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Guests</label><input type="text" value={currentData.guests} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, guests: e.target.value }) : setFormData({ ...formData, guests: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter guest names" /></div>
        </div>

        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={currentData.description} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, description: e.target.value }) : setFormData({ ...formData, description: e.target.value })} rows="3" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"></textarea></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Deals</label><input type="text" value={currentData.deals} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, deals: e.target.value }) : setFormData({ ...formData, deal: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter deal name" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Contacts</label><input type="text" value={currentData.contacts} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, contacts: e.target.value }) : setFormData({ ...formData, contact: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter contact name" /></div>
        </div>

        <div><label className="block text-sm font-medium text-gray-700 mb-1">Companies</label><input type="text" value={currentData.companies} onChange={(e) => isEdit ? setEditActivity({ ...editActivity, companies: e.target.value }) : setFormData({ ...formData, company: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="Enter company name" /></div>
      </div>
    );
  };

  return (
    <div className="">
      <div className="max-w-full mx-auto overflow-x-hidden">
        <ToastContainer position="top-right" autoClose={3000} />

        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700">
            <FiAlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
            <span className="text-sm flex-1">{error}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiMessageSquare className="text-gray-600 text-xl sm:text-2xl" />
              Activities
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage and track all your business activities</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all w-full sm:w-auto">
            <FiPlus className="h-4 w-4" />
            Add Activity
          </button>
        </div>

        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden md:block bg-white rounded-lg border border-gray-100 shadow-deatail_shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/30">
            <h5 className="font-semibold text-midnight_text">Activity List</h5>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="w-10 px-4 py-3 text-center">
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="rounded border-gray-300 text-primary focus:ring-primary" />
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Title</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Activity Type</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Due Date</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Owner</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Created Date</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && activities.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" /></td></tr>
                ) : activities.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-500">No activities found</td></tr>
                ) : (
                  currentActivities.map((activity) => {
                    const ActivityIcon = activity.icon;
                    return (
                      <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-center"><input type="checkbox" checked={activity.checked || false} onChange={() => handleCheckboxChange(activity.id)} className="rounded border-gray-300 text-primary focus:ring-primary" /></td>
                        <td className="px-4 py-3"><span className="text-sm font-medium text-midnight_text">{activity.title}</span></td>
                        <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${activity.badgeClass}`}><ActivityIcon className="h-3 w-3" />{activity.type}</span></td>
                        <td className="px-4 py-3"><span className="text-sm text-gray-600">{activity.dueDate}</span></td>
                        <td className="px-4 py-3"><span className="text-sm text-gray-600">{activity.owner}</span></td>
                        <td className="px-4 py-3"><span className="text-sm text-gray-500">{activity.createdDate}</span></td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEdit(activity)} className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all" title="Edit"><FiEdit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteClick(activity)} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all" title="Delete"><FiTrash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {activities.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-100 bg-gray-50/30">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Rows per page:</span>
                <select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(Number(e.target.value))} className="px-2 py-1 text-sm border border-gray-200 rounded-lg bg-white">
                  <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                </select>
              </div>
              <div className="text-xs text-gray-500">Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, activities.length)} of {activities.length}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"><FiChevronLeft className="h-4 w-4" /></button>
                <div className="flex gap-1">
                  {[...Array(Math.min(3, totalPages)).keys()].map(num => (
                    <button key={num + 1} onClick={() => handlePageChange(num + 1)} className={`px-3 py-1 text-sm rounded-lg transition-all ${currentPage === num + 1 ? 'bg-primary text-white' : 'border border-gray-200 hover:bg-white'}`}>{num + 1}</button>
                  ))}
                  {totalPages > 3 && currentPage > 2 && <span className="px-2 py-1 text-sm text-gray-500">...</span>}
                </div>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"><FiChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Card View - Visible on mobile only */}
        <div className="block md:hidden space-y-3">
          {loading && activities.length === 0 ? (
            <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" /></div>
          ) : activities.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
              <FiMessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No activities found</p>
            </div>
          ) : (
            currentActivities.map((activity) => {
              const ActivityIcon = activity.icon;
              return (
                <div key={activity.id} className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={activity.checked || false} onChange={() => handleCheckboxChange(activity.id)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                      <h3 className="font-semibold text-midnight_text text-sm">{activity.title}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(activity)} className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all"><FiEdit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteClick(activity)} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"><FiTrash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Type:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${activity.badgeClass}`}><ActivityIcon className="h-3 w-3" />{activity.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Due Date:</span>
                      <span className="text-gray-700">{activity.dueDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Owner:</span>
                      <span className="text-gray-700">{activity.owner}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-500">{activity.createdDate}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Activity" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <ActivityFormFields isEdit={false} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"><FiPlus className="h-4 w-4" />Add Activity</button>
          </div>
        </form>
      </Modal>

      {/* Edit Activity Modal */}
      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingActivityId(null); }} title="Edit Activity" size="lg">
        <form onSubmit={handleUpdateSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <ActivityFormFields isEdit={true} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => { setShowEditModal(false); setEditingActivityId(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"><FiCheckCircle className="h-4 w-4" />Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setActivityToDelete(null); }} title="Confirm Delete" size="md">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="h-8 w-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-midnight_text mb-2">Are you sure?</h3>
          <p className="text-sm text-gray-500">Do you want to delete the activity "<strong>{activityToDelete?.title || "this activity"}</strong>"? This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={() => { setShowDeleteModal(false); setActivityToDelete(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default Activities;