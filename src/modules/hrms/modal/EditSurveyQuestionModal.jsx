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

const EditSurveyQuestionModal = ({ isOpen, onClose, editingQuestion, newQuestionText, newQuestionType, newQuestionCategory, newQuestionTags, tagInput, bscPerspectives, setEditingQuestion, setNewQuestionText, setNewQuestionType, setNewQuestionCategory, setTagInput, questionTypes , categories, handleAddTag, handleRemoveTag, handleSaveEditedQuestion, handleAddNewQuestionToBank}) => {
  return (
    <Modal
      title={editingQuestion ? "Edit Question" : "Add New Question"}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setEditingQuestion(null);
      }}
      size="lg"
    >
      <div className="mb-5">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Question Text *</label>
          <textarea
            className="text-sm"
            placeholder="Enter your question here..."
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Question Type</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newQuestionType}
              onChange={(e) => setNewQuestionType(e.target.value)}
            >
              {questionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newQuestionCategory}
              onChange={(e) => setNewQuestionCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.filter(c => c !== "all").map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags</label>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={handleAddTag}
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {newQuestionTags.map(tag => (
              <span key={tag} className="text-sm">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "10px",
                    color: "#1e40af",
                    padding: "0"
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {editingQuestion && (
          <div style={{
            background: "#f9fafb",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "13px",
            marginTop: "16px"
          }}>
            <div><strong>Question ID:</strong> {editingQuestion.id}</div>
            <div><strong>Times Used:</strong> {editingQuestion.used || 0}</div>
            <div><strong>Last Used:</strong> {editingQuestion.lastUsed || "Never"}</div>
            {editingQuestion.perspective && (
              <div><strong>BSC Perspective:</strong> {bscPerspectives.find(p => p.id === editingQuestion.perspective)?.name}</div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={() => {
            onClose();
            setEditingQuestion(null);
          }}
        >
          Cancel
        </button>
        {editingQuestion ? (
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={handleSaveEditedQuestion}
          >
            <Save size={16} /> Save Changes
          </button>
        ) : (
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
            onClick={handleAddNewQuestionToBank}
          >
            <Plus size={16} /> Add to Bank
          </button>
        )}
      </div>
    </Modal>
  );
};

export default EditSurveyQuestionModal;
