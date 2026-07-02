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

const AddStrategicObjectiveModal = ({ isOpen, onClose, bscPerspectives, selectedPerspective, strategicAlignment, setSelectedPerspective, setStrategicAlignment, handleAddBscObjective }) => {
  return (
    <Modal
        title="Add Strategic Objective"
        isOpen={isOpen}
        onClose={() => onClose()}
        size="lg"
      >
        <div style={{ marginBottom: "16px" }}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Objective Name *</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Improve customer satisfaction score"
            value={strategicAlignment.objective}
            onChange={(e) => setStrategicAlignment({ ...strategicAlignment, objective: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">BSC Perspective</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Key Performance Indicators (KPIs)</label>
          <textarea
            className="text-sm"
            placeholder="Enter KPIs (one per line)"
            value={strategicAlignment.kpis.join('\n    ')}
            onChange={(e) => setStrategicAlignment({
              ...strategicAlignment,
              kpis: e.target.value.split('\n    ').filter(kpi => kpi.trim())
            })}
          />
          <div className="text-xs text-slate-500 mt-1">
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

        <div className="flex justify-end gap-3">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={handleAddBscObjective}
          >
            <Target size={16} /> Add Objective
          </button>
        </div>
      </Modal>
  );
};

export default AddStrategicObjectiveModal;
