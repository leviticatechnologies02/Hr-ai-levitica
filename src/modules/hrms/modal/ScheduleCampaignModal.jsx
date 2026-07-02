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

const ScheduleCampaignModal = ({ isOpen, onClose, scheduling, scheduleDate, scheduleTime, recurrencePattern, setScheduling, setScheduleDate, setScheduleTime, setRecurrencePattern , handleScheduleSurvey}) => {
  return (
    <Modal
        title="Schedule Survey Campaign"
        isOpen={isOpen}
        onClose={() => onClose()}
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

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Schedule Type</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Recurrence Pattern</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => onClose()}
          >
            Cancel
          </button>

          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={handleScheduleSurvey}
          >
            Confirm Schedule
          </button>
        </div>
      </Modal>
  );
};

export default ScheduleCampaignModal;
