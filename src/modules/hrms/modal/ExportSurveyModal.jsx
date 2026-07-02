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

const ExportSurveyModal = ({ isOpen, onClose, questions, surveyTitle, selectedSurvey, exportType, exportData, setExportType, setExportData, handleExport }) => {
  return (
    <Modal
      title="Export Survey Data"
      isOpen={isOpen}
      onClose={() => onClose()}
      size="lg"
    >
      <div className="mb-5">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Export Format</label>
          <div className="flex gap-3 mt-2">
            <div
              style={{
                
                flex: 1,
                border: `2px solid ${exportType === "pdf" ? "#ef4444" : "#e5e7eb"}`,
                cursor: "pointer"
              }}
              onClick={() => setExportType("pdf")}
            >
              <div style={{ textAlign: "center" }}>
                <File size={32} color={exportType === "pdf" ? "#ef4444" : "#6b7280"} />
                <div style={{ marginTop: "8px", fontWeight: "600" }}>PDF</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>Portable Document Format</div>
              </div>
            </div>
            <div
              style={{
                
                flex: 1,
                border: `2px solid ${exportType === "excel" ? "#10b981" : "#e5e7eb"}`,
                cursor: "pointer"
              }}
              onClick={() => setExportType("excel")}
            >
              <div style={{ textAlign: "center" }}>
                <FileSpreadsheet size={32} color={exportType === "excel" ? "#10b981" : "#6b7280"} />
                <div style={{ marginTop: "8px", fontWeight: "600" }}>Excel (CSV)</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>Spreadsheet Format</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Include Data Sections</label>
          <div className="flex flex-col gap-2.5 mt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={exportData.includeQuestions}
                onChange={(e) => setExportData({ ...exportData, includeQuestions: e.target.checked })}
              />
              <span>Survey Questions ({questions.length} questions)</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={exportData.includeAnalytics}
                onChange={(e) => setExportData({ ...exportData, includeAnalytics: e.target.checked })}
              />
              <span>Analytics & Performance Data</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={exportData.includeBscData}
                onChange={(e) => setExportData({ ...exportData, includeBscData: e.target.checked })}
              />
              <span>BSC Objectives & Metrics</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={exportData.includeResponses}
                onChange={(e) => setExportData({ ...exportData, includeResponses: e.target.checked })}
              />
              <span>Response Summary</span>
            </label>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg h-[400px] overflow-auto whitespace-pre-wrap font-mono text-xs">
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "8px" }}>Preview:</div>
          <div style={{ fontSize: "10px", lineHeight: "1.4" }}>
            {exportType === "pdf" ?
              "PDF Document with selected sections will be generated for download." :
              "CSV/Excel file with structured data will be generated for download."}
            <br /><br />
            <strong>File Name:</strong> {(selectedSurvey?.title || surveyTitle || "survey").replace(/\s+/g, '_')}_survey_report_{new Date().getTime()}.{exportType === "pdf" ? "txt" : "csv"}
            <br />
            <strong>Size:</strong> {exportType === "pdf" ? "~500 KB" : "~100 KB"}
          </div>
        </div>

        <div style={{
          background: exportType === "pdf" ? "#fef2f2" : "#f0f9ff",
          padding: "12px",
          borderRadius: "8px",
          marginTop: "16px",
          border: `1px solid ${exportType === "pdf" ? "#fecaca" : "#bae6fd"}`
        }}>
          <div style={{ fontSize: "13px", fontWeight: "500", color: exportType === "pdf" ? "#dc2626" : "#0ea5e9" }}>
            {exportType === "pdf" ? "PDF Export" : "Excel Export"} Ready
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {exportType === "pdf"
              ? "PDF format is best for sharing reports and presentations."
              : "Excel format is best for data analysis and further processing."}
          </div>
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
          className="text-sm"
          onClick={handleExport}
        >
          {exportType === "pdf" ? <File size={16} /> : <FileSpreadsheet size={16} />}
          Export {exportType === "pdf" ? "PDF" : "Excel"}
        </button>
      </div>
    </Modal>
  );
};

export default ExportSurveyModal;
