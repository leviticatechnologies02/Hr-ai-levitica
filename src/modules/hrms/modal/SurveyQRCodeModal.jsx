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

const SurveyQRCodeModal = ({ isOpen, onClose, shareLink , handleShareSurvey}) => {
  return (
    <Modal
        title="Survey QR Code"
        isOpen={isOpen}
        onClose={() => onClose()}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "200px",
              height: "200px",
              background: "#f3f4f6",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontWeight: "600",
              fontSize: "14px",
              color: "#6b7280"
            }}
          >
            QR CODE PREVIEW
            <div style={{ fontSize: "10px", marginTop: "8px" }}>
              Scan to open: {shareLink || "Survey Link"}
            </div>
          </div>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Scan to open the survey
          </p>
          <div style={{ marginTop: "16px", fontSize: "12px", color: "#3b82f6", wordBreak: "break-all" }}>
            {shareLink || "No link generated yet"}
          </div>
          <button
            className="text-sm"
            onClick={handleShareSurvey}
          >
            <Copy size={16} /> Copy Link
          </button>
        </div>
      </Modal>
  );
};

export default SurveyQRCodeModal;
