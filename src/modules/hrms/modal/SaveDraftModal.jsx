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

const SaveDraftModal = ({ isOpen, onClose, questions, surveyTitle, draftNote, bscPerspectives, selectedPerspective, setDraftNote, handleSaveDraft }) => {
  return (
    <Modal
        title="Save Survey as Draft"
        isOpen={isOpen}
        onClose={() => onClose()}
      >
        <p style={{ fontSize: "14px", color: "#374151", marginBottom: "16px" }}>
          Your survey will be saved as a draft and will not be visible to employees.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Draft Notes (Optional)</label>
          <textarea
            className="text-sm"
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
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => onClose()}
          >
            Cancel
          </button>

          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        </div>
      </Modal>
  );
};

export default SaveDraftModal;
