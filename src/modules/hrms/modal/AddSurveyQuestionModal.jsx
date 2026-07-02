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

const AddSurveyQuestionModal = ({ isOpen, onClose, searchQuery, questionBank, bscQuestionBank, bscPerspectives, setSearchQuery, handleAddQuestion, questionTypes , handleAddFromQuestionBank}) => {
  return (
    <Modal
        title="Add Question"
        isOpen={isOpen}
        onClose={() => onClose()}
        size="lg"
      >
        <h5 style={{ marginBottom: "12px" }}>Choose Question Type</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {questionTypes.map(type => (
            <div
              key={type.id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-4"
              onClick={() => {
                handleAddQuestion(type.id);
                onClose();
              }}
            >
              <div className="flex gap-3">
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <type.icon size={20} color="#3b82f6" />
                </div>
                <div>
                  <strong>{type.label}</strong>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {type.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h5 style={{ margin: "24px 0 12px" }}>Add from Question Bank</h5>

        <input
          type="text"
          className="text-sm"
          placeholder="Search question bank..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="max-h-[300px] overflow-y-auto">
          {[...questionBank, ...bscQuestionBank]
            .filter(q =>
              q.question.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(q => (
              <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{q.question}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {q.perspective ? (
                        <span className="text-sm">
                          {bscPerspectives.find(p => p.id === q.perspective)?.name}
                        </span>
                      ) : null}
                      Used {q.used || 0} times
                    </div>
                  </div>
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    onClick={() => {
                      handleAddFromQuestionBank(q);
                      onClose();
                    }}
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
              </div>
            ))}
        </div>
      </Modal>
  );
};

export default AddSurveyQuestionModal;
