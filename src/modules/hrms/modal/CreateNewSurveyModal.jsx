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

const CreateNewSurveyModal = ({ isOpen, onClose, questions, surveyTitle, surveyDescription, isViewMode, bscPerspectives, selectedPerspective, setSurveyTitle, setSurveyDescription, setIsViewMode, setSelectedPerspective , handleNewSurvey}) => {
  return (
    <Modal
        title="Create New Survey"
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsViewMode(false);
        }}
        size="lg"
      >
        <div style={{ marginBottom: "14px" }}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Survey Title *</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Employee Engagement Survey – Q2"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description (Optional)</label>
          <textarea
            className="text-sm"
            placeholder="Brief description of the survey purpose"
            value={surveyDescription}
            onChange={(e) => setSurveyDescription(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">BSC Perspective</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

        <div className="flex justify-end gap-3">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => {
              onClose();
              setIsViewMode(false);
            }}
          >
            Cancel
          </button>
          <button
            className="text-sm"
            disabled={!surveyTitle.trim() || isViewMode}
            onClick={() => {
              handleNewSurvey();
              onClose();
            }}
          >
            Create Survey
          </button>
        </div>
      </Modal>
  );
};

export default CreateNewSurveyModal;
