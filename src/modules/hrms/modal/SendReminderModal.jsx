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

const SendReminderModal = ({ isOpen, onClose, reminderAudience, reminderMessage, reminderChannel, setReminderAudience, setReminderMessage, setReminderChannel , handleSendReminders}) => {
  return (
    <Modal
        title="Send Survey Reminder"
        isOpen={isOpen}
        onClose={() => onClose()}
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

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reminder Audience</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={reminderAudience}
            onChange={(e) => setReminderAudience(e.target.value)}
          >
            <option value="nonRespondents">Non-Respondents Only</option>
            <option value="all">All Participants</option>
            <option value="partial">Partially Completed</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Delivery Channel</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={reminderChannel}
            onChange={(e) => setReminderChannel(e.target.value)}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="inApp">In-App Notification</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reminder Message</label>
          <textarea
            className="text-sm"
            placeholder="Optional custom reminder message"
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
          />
          <div className="text-xs text-slate-500 mt-1">
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
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => onClose()}
          >
            Cancel
          </button>

          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={handleSendReminders}
          >
            Send Reminder
          </button>
        </div>
      </Modal>
  );
};

export default SendReminderModal;
