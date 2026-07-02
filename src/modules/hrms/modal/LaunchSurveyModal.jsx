import React from "react";
import Modal from "../../../shared/components/Modal";
import {
  Plus, Download, BarChart3, Users, Calendar, Send, BookOpen,
  Eye, Edit, Trash2, Copy, Save, Filter, Search, Clock, Mail,
  Bell, Target, PieChart, TrendingUp, MessageSquare, FileText,
  CheckSquare, Hash, Star, List, Grid, Zap, AlertCircle, XCircle,
  ChevronDown, ChevronUp, Upload, RefreshCw, Share2, Lock, Unlock,
  Users as UsersIcon, Building, MapPin, Tag, DownloadCloud, ExternalLink,
  MessageCircle, LineChart, Cloud, FileBarChart, Database, BellRing,
  DoorClosed, Heart, QrCode as QrCodeIcon, X, File, FileSpreadsheet,
  ThumbsUp, ThumbsDown, CheckCircle, MinusCircle, Maximize2, Minimize2,
  QrCode
} from "lucide-react";

const LaunchSurveyModal = ({ isOpen, onClose, launchAudience, launchNotify, bscPerspectives, selectedPerspective, setLaunchAudience, setLaunchNotify, handleLaunchSurvey }) => {
  return (
    <Modal
        title="Launch Survey"
        isOpen={isOpen}
        onClose={() => onClose()}
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

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Survey Audience</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={launchAudience}
            onChange={(e) => setLaunchAudience(e.target.value)}
          >
            <option value="all">All Employees</option>
            <option value="department">Specific Departments</option>
            <option value="location">Specific Locations</option>
          </select>
        </div>

        <div style={{ marginTop: "12px" }}>
          <label className="flex items-center gap-2">
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
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => onClose()}
          >
            Cancel
          </button>

          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={handleLaunchSurvey}
          >
            <Send size={16} /> Launch Now
          </button>
        </div>
      </Modal>
  );
};

export default LaunchSurveyModal;
