import React, { useState, useEffect, useMemo } from "react";
import {
  Calculator,
  Clock,
  Lock,
  Unlock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Zap,
  CalendarDays,
  CreditCard,
  Edit,
  Printer,
  ChevronRight,
  ChevronLeft,
  Search,
  Home,
  Settings,
  UserX,
  Plus,
  Database,
  Eye,
  Trash2,
  Save,
  Upload,
  Bell,
  Users,
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  Shield,
  File,
  FileSpreadsheet,
  FileCode,
  EyeOff,
  Copy,
  ExternalLink,
  MoreVertical,
  Star,
  Award,
  Target,
  Activity,
  Heading6,
  AlertTriangle,
  ChevronDown
} from "lucide-react";
    

const styles = `
/* Reset any overflow properties that might interfere */
* {
  box-sizing: border-box;
}

.page {
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 40px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #334155;
  position: relative;
}

/* HEADER - FIXED STICKY POSITION */
.header-top {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 20px 28px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-sub {
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* SEARCH */
.search-box {
  padding: 12px 16px 12px 42px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  width: 320px;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.search-box:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.12);
  transform: translateY(-1px);
}

/* FILTER PANEL */
.filter-section {
  background: linear-gradient(135deg, #ffffff 0%, #fef7ff 100%);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin: 24px auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-row select {
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: white;
  font-size: 14px;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  appearance: none;
  padding-right: 40px;
}

.filter-row select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.btn {
  padding: 12px 22px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.btn:active::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
}

/* KPI CARDS */
.kpi-section {
  background: white;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.kpi-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  padding: 22px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #8b5cf6, #7c3aed);
  opacity: 0;
  transition: opacity 0.3s;
}

.kpi-card:hover::before {
  opacity: 1;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #ddd6fe;
}

.kpi-content {
  flex: 1;
}

.kpi-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.kpi-trend {
  font-size: 13px;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.kpi-trend.negative {
  color: #ef4444;
}

.kpi-trend.warning {
  color: #f59e0b;
}

.kpi-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.kpi-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: inherit;
  opacity: 0.2;
  z-index: -1;
}

.kpi-icon.realtime { background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); color: #8b5cf6; }
.kpi-icon.frozen { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #3b82f6; }
.kpi-icon.loss { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color: #ef4444; }
.kpi-icon.overtime { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #d97706; }
.kpi-icon.holiday { background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); color: #16a34a; }
.kpi-icon.leave { background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); color: #8b5cf6; }
.kpi-icon.corrections { background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%); color: #ca8a04; }
.kpi-icon.processed { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #10b981; }

/* TABS */
.tabs {
  background: white;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  display: flex;
  gap: 0;
  overflow-x: auto;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  padding: 18px 28px;
  border: none;
  background: none;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  transition: all 0.3s;
  position: relative;
}

.tab-btn:hover {
  color: #475569;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
}

.tab-btn.active {
  color: #8b5cf6;
  border-bottom: 3px solid #8b5cf6;
  background: linear-gradient(to bottom, #f5f3ff, #ffffff);
  font-weight: 600;
}

.tab-btn.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
}

/* TAB CONTENT */
.tab-content {
  background: white;
  padding: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  margin-top: 0;
  min-height: 500px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* DASHBOARD LAYOUT */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 28px;
  margin-top: 24px;
}

.chart-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

/* PAYROLL PROCESS SECTION */
.payroll-process {
  background: linear-gradient(135deg, #ffffff 0%, #fef7ff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.process-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.process-step {
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  position: relative;
  transition: all 0.3s;
}

.process-step:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.process-step.active {
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border-color: #8b5cf6;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
}

.process-step.completed {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #22c55e;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.2);
}

.process-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: #e2e8f0;
  color: #64748b;
  transition: all 0.3s;
}

.process-step.active .process-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  transform: scale(1.1);
}

.process-step.completed .process-icon {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  transform: scale(1.1);
}

/* FREEZE STATUS */
.freeze-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  padding: 20px 24px;
  border-radius: 14px;
  border: 2px solid #ddd6fe;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
}

.freeze-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.freeze-badge.frozen {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  box-shadow: 0 2px 6px rgba(220, 38, 38, 0.2);
}

.freeze-badge.unfrozen {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  box-shadow: 0 2px 6px rgba(6, 95, 70, 0.2);
}

/* TABLE STYLES - FIXED ALIGNMENT */
.data-table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-top: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1200px;
}

.data-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 16px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;
}

.data-table td {
  padding: 18px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #475569;
  vertical-align: middle;
  height: 64px;
}

.data-table tr {
  transition: all 0.2s;
}

.data-table tr:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transform: scale(1.002);
}

.data-table tr:last-child td {
  border-bottom: none;
}

/* Table cell alignment fix */
.table-cell-center {
  text-align: center;
  vertical-align: middle;
}

.table-cell-right {
  text-align: right;
  vertical-align: middle;
}

.table-cell-left {
  text-align: left;
  vertical-align: middle;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 100px;
  white-space: nowrap;
}

.status-pending { 
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  box-shadow: 0 2px 4px rgba(146, 64, 14, 0.1);
}

.status-processed { 
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  box-shadow: 0 2px 4px rgba(6, 95, 70, 0.1);
}

.status-frozen { 
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  box-shadow: 0 2px 4px rgba(30, 64, 175, 0.1);
}

.status-error { 
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  box-shadow: 0 2px 4px rgba(153, 27, 27, 0.1);
}

.amount-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 100px;
  white-space: nowrap;
}

.amount-positive { 
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  box-shadow: 0 2px 4px rgba(6, 95, 70, 0.1);
}

.amount-negative { 
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  box-shadow: 0 2px 4px rgba(153, 27, 27, 0.1);
}

.amount-neutral { 
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #475569;
  box-shadow: 0 2px 4px rgba(71, 85, 105, 0.1);
}

/* ALERTS */
.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.alert-card {
  border-radius: 14px;
  padding: 20px;
  border: 2px solid;
  background: white;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.alert-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.alert-high { 
  border-color: #fca5a5; 
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
}

.alert-medium { 
  border-color: #fcd34d; 
  background: linear-gradient(135deg, #fffbeb 0%, #fde68a 100%);
}

.alert-low { 
  border-color: #93c5fd; 
  background: linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%);
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.alert-title {
  font-weight: 700;
  font-size: 15px;
}

.alert-high .alert-title { color: #dc2626; }
.alert-medium .alert-title { color: #d97706; }
.alert-low .alert-title { color: #2563eb; }

/* INTEGRATION STATUS */
.integration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.integration-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s;
}

.integration-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #ddd6fe;
}

.integration-status {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 28px;
  font-weight: 700;
  transition: all 0.3s;
}

.integration-card:hover .integration-status {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.status-connected { 
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.status-disconnected { 
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.status-syncing { 
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

/* ACTION BUTTONS */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-icon:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* FORM CONTROLS */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  transition: all 0.3s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.12);
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  background: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s;
}

.form-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.12);
}

/* REPORT CARDS */
.report-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.report-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #ddd6fe;
}

.report-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

/* LOADING */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .process-steps {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  
  .search-box {
    width: 100%;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-row select {
    min-width: 100%;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .integration-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    padding: 14px 20px;
    font-size: 13px;
  }
  
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .modal-content {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .process-steps {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}

/* Export functionality styles */
.export-format-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.export-format-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  text-align: center;
}

.export-format-card:hover {
  border-color: #8b5cf6;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15);
}

.export-format-card.active {
  border-color: #8b5cf6;
  background: #f5f3ff;
}

.export-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
}

.export-icon.pdf { background: #fee2e2; color: #dc2626; }
.export-icon.excel { background: #d1fae5; color: #10b981; }
.export-icon.csv { background: #dbeafe; color: #3b82f6; }

/* Table action buttons alignment */
.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
}

/* Cell content wrapper for better alignment */
.cell-content {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.cell-content-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
}

.cell-content-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 100%;
}

/* Toast notifications for top right */
#top-right-toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Ensure no parent containers interfere with sticky header */
body, html, #root {
  overflow-x: hidden;
}
`;

// Utility functions for export/download functionality
const downloadFile = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const generateCSV = (data, headers) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  return csvContent;
};

const generateExcelXML = (data, headers, sheetName = 'PayrollData') => {
  const xmlHeader = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" ss:Size="12" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="12" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#8B5CF6" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:Horizontal="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${sheetName}">
  <Table>`;

  const xmlFooter = `  </Table>
 </Worksheet>
</Workbook>`;

  const headerRow = `   <Row>
${headers.map(h => `    <Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`).join('\n')}
   </Row>`;

  const dataRows = data.map(row => {
    return `   <Row>
${headers.map(h => {
  const value = row[h] || '';
  const type = typeof value === 'number' ? 'Number' : 'String';
  return `    <Cell><Data ss:Type="${type}">${value}</Data></Cell>`;
}).join('\n')}
   </Row>`;
  }).join('\n');

  return xmlHeader + '\n' + headerRow + '\n' + dataRows + '\n' + xmlFooter;
};

const PayrollFreezeComponent = ({ freezeStatus, onToggleFreeze, isLoading }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleConfirmToggle = () => {
    setShowConfirm(true);
  };
  
  const handleConfirm = () => {
    onToggleFreeze();
    setShowConfirm(false);
  };

  return (
    <div className="freeze-status">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: freezeStatus.isFrozen 
            ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' 
            : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: freezeStatus.isFrozen 
            ? '0 4px 12px rgba(220, 38, 38, 0.2)' 
            : '0 4px 12px rgba(6, 95, 70, 0.2)'
        }}>
          {freezeStatus.isFrozen ? (
            <Lock size={28} color="#dc2626" />
          ) : (
            <Unlock size={28} color="#16a34a" />
          )}
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
            Attendance Data Status: {freezeStatus.isFrozen ? 'Frozen' : 'Open'}
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={14} />
            {freezeStatus.isFrozen 
              ? `Data frozen for payroll processing until ${freezeStatus.freezeEndDate}`
              : 'Attendance data is live and updating in real-time'}
          </div>
        </div>
      </div>
      
      {showConfirm ? (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>
            Confirm {freezeStatus.isFrozen ? 'unfreeze' : 'freeze'}?
          </div>
          <button 
            className="btn-secondary"
            onClick={() => setShowConfirm(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className={`btn-${freezeStatus.isFrozen ? 'success' : 'warning'}`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                Processing...
              </div>
            ) : (
              <>
                {freezeStatus.isFrozen ? <Unlock size={16} /> : <Lock size={16} />}
                Confirm {freezeStatus.isFrozen ? 'Unfreeze' : 'Freeze'}
              </>
            )}
          </button>
        </div>
      ) : (
        <button 
          className={`btn ${freezeStatus.isFrozen ? 'btn-success' : 'btn-warning'}`}
          onClick={handleConfirmToggle}
          disabled={isLoading}
        >
          {freezeStatus.isFrozen ? <Unlock size={18} /> : <Lock size={18} />}
          {freezeStatus.isFrozen ? 'Unfreeze Data' : 'Freeze for Payroll'}
        </button>
      )}
    </div>
  );
};

const PayrollProcessSteps = ({ currentStep, onStepClick, onRefresh, onViewDetails }) => {
  const steps = [
    { id: 1, name: 'Data Collection', icon: <Database size={22} />, description: 'Gather attendance data' },
    { id: 2, name: 'Attendance Freeze', icon: <Lock size={22} />, description: 'Lock data for processing' },
    { id: 3, name: 'Calculations', icon: <Calculator size={22} />, description: 'Run payroll calculations' },
    { id: 4, name: 'Approval', icon: <CheckCircle size={22} />, description: 'Manager approval' },
    { id: 5, name: 'Processing', icon: <CreditCard size={22} />, description: 'Disburse salaries' }
  ];

  return (
    <div className="payroll-process">
      <div className="process-header">
        <div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
            Payroll Processing Status
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarDays size={14} />
            Current Period: Jan 1 - Jan 31, 2024
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} />
            Next Run: Feb 5, 2024
          </div>
        </div>
      </div>
      
      <div className="process-steps">
        {steps.map(step => {
          let status = '';
          if (step.id < currentStep) status = 'completed';
          else if (step.id === currentStep) status = 'active';
          
          return (
            <button
              key={step.id}
              className={`process-step ${status}`}
              onClick={() => onStepClick(step.id)}
              style={{ cursor: 'pointer', border: 'none', outline: 'none' }}
            >
              <div className="process-icon">
                {step.icon}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Step {step.id}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                {step.name}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                {step.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const PayrollIntegration = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("payroll-admin");
  const [isLoading, setIsLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    period: "current-month",
    department: "all",
    location: "all",
    employee: "all",
    status: "all"
  });

  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [integrationStatus, setIntegrationStatus] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [freezeStatus, setFreezeStatus] = useState({
    isFrozen: false,
    freezeStartDate: "",
    freezeEndDate: "",
    frozenBy: ""
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({
    employeeId: "",
    date: "",
    correctionType: "Status Change",
    originalValue: "",
    correctedValue: "",
    reason: "",
    impact: 0
  });
  const [currentStep, setCurrentStep] = useState(2);
  const [exportSettings, setExportSettings] = useState({
    format: "Excel",
    startDate: "",
    endDate: "",
    include: {
      employeeDetails: true,
      attendanceSummary: true,
      payrollCalculations: true,
      deductions: true,
      additions: true,
      netPay: true
    }
  });

  // Add state for rules
  const [calculationRules, setCalculationRules] = useState([
    { 
      id: 1,
      feature: 'Loss of Pay Calculation', 
      description: 'Automatic deduction based on absence days',
      formula: 'Daily Rate × Absent Days',
      status: 'active',
      multiplier: 1.0,
      enabled: true
    },
    { 
      id: 2,
      feature: 'Overtime Hours Feed', 
      description: 'Overtime hours automatically added to payroll',
      formula: 'Hourly Rate × 1.5 × Overtime Hours',
      status: 'active',
      multiplier: 1.5,
      enabled: true
    },
    { 
      id: 3,
      feature: 'Holiday Working Pay', 
      description: 'Double pay for holiday work days',
      formula: 'Daily Rate × 2 × Holiday Work Days',
      status: 'active',
      multiplier: 2.0,
      enabled: true
    },
    { 
      id: 4,
      feature: 'Leave Without Pay Tracking', 
      description: 'Track and deduct for unauthorized leave',
      formula: 'Daily Rate × LWOP Days',
      status: 'active',
      multiplier: 1.0,
      enabled: true
    }
  ]);

  // Add state for editing rule
  const [editingRule, setEditingRule] = useState(null);
  const [showRuleEditModal, setShowRuleEditModal] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    id: null,
    feature: '',
    description: '',
    formula: '',
    multiplier: 1.0,
    enabled: true
  });

  // Also add state for selected report
  const [selectedReport, setSelectedReport] = useState(null);

  // Define handler functions
  const handleViewDetails = (record) => {
    console.log('View details:', record);
    setSelectedRecord(record);
  };

  const handleEditRecord = (record) => {
    console.log('Edit record:', record);
    setSelectedRecord(record);
    setShowCorrectionModal(true);
  };

  const handleExportRecord = (record) => {
    console.log('Export record:', record);
    const headers = [
      'Employee ID',
      'Employee Name', 
      'Department',
      'Basic Salary',
      'Present Days',
      'Absent Days',
      'Overtime Hours',
      'Loss of Pay',
      'Overtime Pay',
      'Holiday Pay',
      'Leave Without Pay Deduction',
      'Net Pay',
      'Status'
    ];

    const data = [{
      'Employee ID': record.employeeId,
      'Employee Name': record.employeeName,
      'Department': record.department,
      'Basic Salary': `$${record.basicSalary.toFixed(2)}`,
      'Present Days': record.totalPresent,
      'Absent Days': record.totalAbsent,
      'Overtime Hours': record.totalOvertime,
      'Loss of Pay': `$${record.lossOfPay.toFixed(2)}`,
      'Overtime Pay': `$${record.overtimePay.toFixed(2)}`,
      'Holiday Pay': `$${record.holidayPay.toFixed(2)}`,
      'Leave Without Pay Deduction': `$${record.leaveWithoutPayDeduction.toFixed(2)}`,
      'Net Pay': `$${record.netPay.toFixed(2)}`,
      'Status': record.status
    }];

    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payroll_${record.employeeId}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification(`${record.employeeName}'s data exported successfully`, "success");
  };

  // Updated notification function for top-right toasts
  const showNotification = (message, type = "success") => {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('top-right-toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'top-right-toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
      `;
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.style.cssText = `
      background: ${type === 'success' ? '#10b981' : 
                   type === 'error' ? '#ef4444' : 
                   type === 'warning' ? '#f59e0b' : '#3b82f6'};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideInRight 0.3s ease;
      max-width: 100%;
    `;
    
    toast.innerHTML = `
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">
          ${type === 'success' ? 'Success' : 
            type === 'error' ? 'Error' : 
            type === 'warning' ? 'Warning' : 'Notification'}
        </div>
        <div style="font-size: 13px; opacity: 0.9; word-break: break-word;">${message}</div>
      </div>
      <button onclick="document.getElementById('${toastId}').remove()" 
              style="background: none; border: none; color: white; cursor: pointer; opacity: 0.7; padding: 4px; font-size: 16px;">
        ✕
      </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      const toastElement = document.getElementById(toastId);
      if (toastElement) {
        toastElement.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
          if (toastElement.parentNode) {
            toastElement.parentNode.removeChild(toastElement);
          }
        }, 300);
      }
    }, 3000);
    
    // Add CSS animations if not already added
    if (!document.getElementById('toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const emps = [
      { id: "EMP001", name: "John Smith", department: "Engineering", location: "HQ", basicSalary: 5000, email: "john@company.com" },
      { id: "EMP002", name: "Sarah Johnson", department: "Marketing", location: "HQ", basicSalary: 4500, email: "sarah@company.com" },
      { id: "EMP003", name: "Robert Chen", department: "Sales", location: "Branch A", basicSalary: 4000, email: "robert@company.com" },
      { id: "EMP004", name: "Maria Garcia", department: "HR", location: "HQ", basicSalary: 4200, email: "maria@company.com" },
      { id: "EMP005", name: "David Kim", department: "Engineering", location: "Remote", basicSalary: 5500, email: "david@company.com" },
      { id: "EMP006", name: "Lisa Wang", department: "Finance", location: "HQ", basicSalary: 4800, email: "lisa@company.com" },
      { id: "EMP007", name: "Tom Brown", department: "Operations", location: "Branch B", basicSalary: 3800, email: "tom@company.com" },
      { id: "EMP008", name: "Emma Davis", department: "Marketing", location: "Remote", basicSalary: 4300, email: "emma@company.com" }
    ];
    setEmployees(emps);

    const today = new Date();
    const payroll = [];

    emps.forEach(emp => {
      let totalPresent = Math.floor(Math.random() * 22) + 18;
      let totalAbsent = Math.floor(Math.random() * 3);
      let totalOvertime = Math.floor(Math.random() * 20);
      let holidayWorkDays = Math.floor(Math.random() * 2);
      let leaveWithoutPay = Math.floor(Math.random() * 2);

      const dailyRate = emp.basicSalary / 30;
      const lossOfPay = totalAbsent * dailyRate;
      const overtimePay = totalOvertime * (dailyRate / 8 * 1.5);
      const holidayPay = holidayWorkDays * dailyRate * 2;
      const leaveWithoutPayDeduction = leaveWithoutPay * dailyRate;
      
      const netPay = emp.basicSalary - lossOfPay - leaveWithoutPayDeduction + overtimePay + holidayPay;

      payroll.push({
        id: `PAY${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        location: emp.location,
        basicSalary: emp.basicSalary,
        totalPresent,
        totalAbsent,
        totalOvertime,
        holidayWorkDays,
        leaveWithoutPay,
        lossOfPay: parseFloat(lossOfPay.toFixed(2)),
        overtimePay: parseFloat(overtimePay.toFixed(2)),
        holidayPay: parseFloat(holidayPay.toFixed(2)),
        leaveWithoutPayDeduction: parseFloat(leaveWithoutPayDeduction.toFixed(2)),
        netPay: parseFloat(netPay.toFixed(2)),
        status: Math.random() > 0.3 ? "processed" : "pending",
        lastUpdated: today.toISOString().split("T")[0],
        processedBy: "System",
        processedDate: today.toISOString().split("T")[0]
      });
    });

    setPayrollData(payroll);

    setIntegrationStatus({
      attendanceSync: { 
        status: 'connected', 
        lastSync: new Date().toLocaleString(),
        syncFrequency: '15 minutes',
        successRate: '99.8%'
      },
      payrollSync: { 
        status: 'connected', 
        lastSync: new Date().toLocaleString(),
        syncFrequency: '30 minutes',
        successRate: '99.5%'
      },
      dataFreshness: { 
        status: 'current', 
        hoursAgo: 0.5,
        lastUpdate: 'Just now',
        latency: '< 5 minutes'
      },
      errorCount: 2,
      warnings: 3
    });

    setFreezeStatus({
      isFrozen: false,
      freezeStartDate: "",
      freezeEndDate: "",
      frozenBy: "",
      nextFreeze: '2024-02-01'
    });

    const alertList = [
      { 
        id: 1, 
        type: 'sync', 
        message: 'Payroll sync delayed by 2 hours', 
        severity: 'medium', 
        date: '2024-01-19',
        action: 'Retry Sync',
        resolved: false
      },
      { 
        id: 2, 
        type: 'calculation', 
        message: 'Overtime calculation mismatch for 3 employees', 
        severity: 'high', 
        date: '2024-01-19',
        action: 'Review Calculations',
        resolved: false
      },
      { 
        id: 3, 
        type: 'freeze', 
        message: 'Attendance freeze required for payroll processing', 
        severity: 'medium', 
        date: '2024-01-18',
        action: 'Initiate Freeze',
        resolved: false
      },
      { 
        id: 4, 
        type: 'correction', 
        message: '5 attendance corrections pending approval', 
        severity: 'low', 
        date: '2024-01-18',
        action: 'Review Corrections',
        resolved: false
      }
    ];
    setAlerts(alertList);
    
    setIsLoading(false);
    showNotification("Data loaded successfully", "success");
  };

  const filteredData = useMemo(() => {
    let data = [...payrollData];
    
    if (filters.department !== "all") {
      data = data.filter(item => item.department === filters.department);
    }
    
    if (filters.location !== "all") {
      data = data.filter(item => item.location === filters.location);
    }
    
    if (filters.employee !== "all") {
      data = data.filter(item => item.employeeId === filters.employee);
    }
    
    if (filters.status !== "all") {
      data = data.filter(item => item.status === filters.status);
    }
    
    if (search) {
      const query = search.toLowerCase();
      data = data.filter(item =>
        item.employeeName.toLowerCase().includes(query) ||
        item.employeeId.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
      );
    }
    
    return data;
  }, [payrollData, filters, search]);

  const statistics = useMemo(() => {
    if (filteredData.length === 0) return {};
    
    const totalEmployees = filteredData.length;
    const totalSalary = filteredData.reduce((sum, x) => sum + x.basicSalary, 0);
    const totalNetPay = filteredData.reduce((sum, x) => sum + x.netPay, 0);
    const totalLossOfPay = filteredData.reduce((sum, x) => sum + x.lossOfPay, 0);
    const totalOvertimePay = filteredData.reduce((sum, x) => sum + x.overtimePay, 0);
    const totalHolidayPay = filteredData.reduce((sum, x) => sum + x.holidayPay, 0);
    const totalCorrections = filteredData.filter(x => x.status === 'pending').length;
    const avgOvertimeHours = filteredData.reduce((sum, x) => sum + x.totalOvertime, 0) / totalEmployees;
    const leaveWithoutPayTotal = filteredData.reduce((sum, x) => sum + x.leaveWithoutPayDeduction, 0);
    
    return {
      totalEmployees,
      totalSalary: parseFloat(totalSalary.toFixed(2)),
      totalNetPay: parseFloat(totalNetPay.toFixed(2)),
      totalLossOfPay: parseFloat(totalLossOfPay.toFixed(2)),
      totalOvertimePay: parseFloat(totalOvertimePay.toFixed(2)),
      totalHolidayPay: parseFloat(totalHolidayPay.toFixed(2)),
      totalCorrections,
      avgOvertimeHours: parseFloat(avgOvertimeHours.toFixed(1)),
      totalDeductions: parseFloat((totalLossOfPay + leaveWithoutPayTotal).toFixed(2)),
      totalAdditions: parseFloat((totalOvertimePay + totalHolidayPay).toFixed(2)),
      leaveWithoutPayTotal: parseFloat(leaveWithoutPayTotal.toFixed(2))
    };
  }, [filteredData]);

  const handleToggleFreeze = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (freezeStatus.isFrozen) {
      setFreezeStatus(prev => ({
        ...prev,
        isFrozen: false,
        freezeStartDate: "",
        freezeEndDate: "",
        frozenBy: ""
      }));
      showNotification("Attendance data unfrozen successfully", "success");
    } else {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 3);
      
      setFreezeStatus({
        isFrozen: true,
        freezeStartDate: today.toISOString().split("T")[0],
        freezeEndDate: endDate.toISOString().split("T")[0],
        frozenBy: "Admin User",
        nextFreeze: '2024-02-01'
      });
      showNotification("Attendance data frozen for payroll processing", "warning");
    }
    
    setIsLoading(false);
  };

  const handleRunPayroll = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPayrollData(prev => prev.map(item => ({
      ...item,
      status: "processed",
      processedBy: role === "payroll-admin" ? "System Admin" : "Auto-process",
      processedDate: new Date().toISOString().split("T")[0]
    })));
    
    setIsLoading(false);
    showNotification("Payroll processing completed successfully", "success");
  };

  const handleExportPayrollData = async (format) => {
    setIsLoading(true);
    
    const headers = [
      'Employee ID',
      'Employee Name',
      'Department',
      'Basic Salary',
      'Present Days',
      'Absent Days',
      'Overtime Hours',
      'Loss of Pay',
      'Overtime Pay',
      'Holiday Pay',
      'Leave Without Pay Deduction',
      'Net Pay',
      'Status',
      'Last Updated'
    ];

    const data = filteredData.map(item => ({
      'Employee ID': item.employeeId,
      'Employee Name': item.employeeName,
      'Department': item.department,
      'Basic Salary': `$${item.basicSalary.toFixed(2)}`,
      'Present Days': item.totalPresent,
      'Absent Days': item.totalAbsent,
      'Overtime Hours': item.totalOvertime,
      'Loss of Pay': `$${item.lossOfPay.toFixed(2)}`,
      'Overtime Pay': `$${item.overtimePay.toFixed(2)}`,
      'Holiday Pay': `$${item.holidayPay.toFixed(2)}`,
      'Leave Without Pay Deduction': `$${item.leaveWithoutPayDeduction.toFixed(2)}`,
      'Net Pay': `$${item.netPay.toFixed(2)}`,
      'Status': item.status,
      'Last Updated': item.lastUpdated
    }));

    switch(format) {
      case 'CSV':
        const csvContent = generateCSV(data, headers);
        downloadFile(csvContent, `payroll_data_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        break;
        
      case 'Excel':
        const excelXML = generateExcelXML(data, headers, 'PayrollData');
        downloadFile(excelXML, `payroll_data_${new Date().toISOString().split('T')[0]}.xml`, 'application/vnd.ms-excel');
        break;
        
      case 'PDF':
        const pdfContent = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #333; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background-color: #8b5cf6; color: white; padding: 12px; text-align: left; }
                td { padding: 10px; border-bottom: 1px solid #ddd; }
                tr:nth-child(even) { background-color: #f8fafc; }
                .total { font-weight: bold; color: #8b5cf6; }
              </style>
            </head>
            <body>
              <h1>Payroll Report - ${new Date().toLocaleDateString()}</h1>
              <table>
                <thead>
                  <tr>
                    ${headers.map(h => `<th>${h}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${data.map(row => `
                    <tr>
                      ${headers.map(h => `<td>${row[h]}</td>`).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div style="margin-top: 30px; padding: 20px; background: #f5f3ff; border-radius: 8px;">
                <h3>Summary</h3>
                <p>Total Employees: ${statistics.totalEmployees}</p>
                <p>Total Net Pay: $${statistics.totalNetPay?.toFixed(2)}</p>
                <p>Total Deductions: $${statistics.totalDeductions?.toFixed(2)}</p>
                <p>Total Additions: $${statistics.totalAdditions?.toFixed(2)}</p>
              </div>
            </body>
          </html>
        `;
        
        const blob = new Blob([pdfContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `payroll_report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        break;
    }
    
    setIsLoading(false);
    showNotification(`Payroll data exported as ${format} successfully`, "success");
    setShowExportModal(false);
  };

  const handleExportReport = async (reportId, format) => {
    setIsLoading(true);
    
    const reports = {
      1: { name: 'Payroll-Attendance Reconciliation', type: 'reconciliation' },
      2: { name: 'Loss of Pay Report', type: 'deduction' },
      3: { name: 'Overtime Payment Summary', type: 'addition' },
      4: { name: 'Holiday Working Compensation', type: 'addition' }
    };
    
    const report = reports[reportId];
    if (!report) {
      showNotification("Report not found", "error");
      setIsLoading(false);
      return;
    }
    
    const sampleData = [
      { Employee: 'John Smith', Amount: '$1,500.00', Status: 'Processed' },
      { Employee: 'Sarah Johnson', Amount: '$1,200.00', Status: 'Pending' },
      { Employee: 'Robert Chen', Amount: '$1,800.00', Status: 'Processed' }
    ];
    
    const headers = Object.keys(sampleData[0]);
    
    switch(format) {
      case 'CSV':
        const csvContent = generateCSV(sampleData, headers);
        downloadFile(csvContent, `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        break;
        
      case 'Excel':
        const excelXML = generateExcelXML(sampleData, headers, report.name);
        downloadFile(excelXML, `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xml`, 'application/vnd.ms-excel');
        break;
    }
    
    setIsLoading(false);
    showNotification(`${report.name} exported as ${format}`, "success");
  };

  const handleExportCorrections = async () => {
    setIsLoading(true);
    
    const corrections = [
      {
        id: 1,
        employeeName: 'John Smith',
        employeeId: 'EMP001',
        originalDate: '2024-01-15',
        correctionType: 'Overtime Update',
        originalValue: '2 hours',
        correctedValue: '4 hours',
        payrollImpact: '+$75.00',
        status: 'pending',
        requestedBy: 'Manager',
        requestedDate: '2024-01-18'
      }
    ];
    
    const headers = [
      'Employee Name',
      'Employee ID',
      'Original Date',
      'Correction Type',
      'Original Value',
      'Corrected Value',
      'Payroll Impact',
      'Status',
      'Requested By',
      'Requested Date'
    ];
    
    const data = corrections.map(correction => ({
      'Employee Name': correction.employeeName,
      'Employee ID': correction.employeeId,
      'Original Date': correction.originalDate,
      'Correction Type': correction.correctionType,
      'Original Value': correction.originalValue,
      'Corrected Value': correction.correctedValue,
      'Payroll Impact': correction.payrollImpact,
      'Status': correction.status,
      'Requested By': correction.requestedBy,
      'Requested Date': correction.requestedDate
    }));
    
    const csvContent = generateCSV(data, headers);
    downloadFile(csvContent, `corrections_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    
    setIsLoading(false);
    showNotification("Corrections exported successfully", "success");
  };

  const handleApplyFilters = () => {
    showNotification("Filters applied successfully", "success");
  };

  const handleResetFilters = () => {
    setFilters({
      period: "current-month",
      department: "all",
      location: "all",
      employee: "all",
      status: "all"
    });
    showNotification("Filters reset", "success");
  };

  const handleRefreshStatus = async () => {
    setIsLoading(true);
    await loadInitialData();
    setIsLoading(false);
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
    showNotification(`Navigated to step ${stepId}`, "success");
  };

  const handleViewProcessDetails = () => {
    setActiveTab("reports");
    showNotification("Showing process details", "success");
  };

  const handleSubmitCorrection = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!correctionForm.employeeId || !correctionForm.date || !correctionForm.originalValue || !correctionForm.correctedValue) {
      showNotification("Please fill all required fields", "error");
      setIsLoading(false);
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCorrectionForm({
      employeeId: "",
      date: "",
      correctionType: "Status Change",
      originalValue: "",
      correctedValue: "",
      reason: "",
      impact: 0
    });
    
    setShowCorrectionModal(false);
    showNotification("Correction submitted successfully", "success");
    setIsLoading(false);
  };

  const handleCorrectionTypeChange = (type) => {
    const impacts = {
      "Status Change": 150,
      "Time Correction": 0,
      "Overtime Update": 75,
      "Holiday Work Addition": 200,
      "Post-Payroll Adjustment": -140
    };
    
    setCorrectionForm(prev => ({
      ...prev,
      correctionType: type,
      impact: impacts[type] || 0
    }));
  };

  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const dailyRate = employee.basicSalary / 30;
      const impacts = {
        "Status Change": dailyRate,
        "Time Correction": 0,
        "Overtime Update": dailyRate / 8 * 1.5 * 2,
        "Holiday Work Addition": dailyRate * 2,
        "Post-Payroll Adjustment": -dailyRate
      };
      
      setCorrectionForm(prev => ({
        ...prev,
        employeeId,
        impact: impacts[prev.correctionType] || 0
      }));
    }
  };

  const handleUpdateRecord = async (recordId, updates) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setPayrollData(prev => prev.map(item => 
      item.id === recordId ? { ...item, ...updates } : item
    ));
    
    showNotification("Record updated successfully", "success");
    setIsLoading(false);
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setPayrollData(prev => prev.filter(item => item.id !== recordId));
    
    showNotification("Record deleted successfully", "success");
    setIsLoading(false);
  };

  const handleSyncIntegration = async (integrationType) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIntegrationStatus(prev => ({
      ...prev,
      [integrationType]: {
        ...prev[integrationType],
        lastSync: new Date().toLocaleString(),
        status: 'connected'
      }
    }));
    
    showNotification(`${integrationType} synchronized successfully`, "success");
    setIsLoading(false);
  };

  const handleResolveAlert = async (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    
    showNotification("Alert resolved", "success");
  };

  const handleExportAllData = async () => {
    setIsLoading(true);
    
    // Create a zip file with multiple reports
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Export payroll data
    await handleExportPayrollData('CSV');
    
    // Export corrections
    await handleExportCorrections();
    
    // Export statistics report
    const statsReport = `
      Payroll Statistics Report - ${timestamp}
      ======================================
      
      Summary:
      ---------
      Total Employees: ${statistics.totalEmployees}
      Total Basic Salary: $${statistics.totalSalary?.toFixed(2)}
      Total Net Pay: $${statistics.totalNetPay?.toFixed(2)}
      Total Deductions: $${statistics.totalDeductions?.toFixed(2)}
      Total Additions: $${statistics.totalAdditions?.toFixed(2)}
      
      Breakdown:
      ----------
      Loss of Pay: $${statistics.totalLossOfPay?.toFixed(2)}
      Overtime Pay: $${statistics.totalOvertimePay?.toFixed(2)}
      Holiday Pay: $${statistics.totalHolidayPay?.toFixed(2)}
      Leave Without Pay: $${statistics.leaveWithoutPayTotal?.toFixed(2)}
      
      Integration Status:
      ------------------
      Attendance Sync: ${integrationStatus.attendanceSync?.status}
      Payroll Sync: ${integrationStatus.payrollSync?.status}
      Data Freshness: ${integrationStatus.dataFreshness?.hoursAgo} hours
      
      Generated: ${new Date().toLocaleString()}
    `;
    
    downloadFile(statsReport, `payroll_statistics_${timestamp}.txt`, 'text/plain');
    
    setIsLoading(false);
    showNotification("All data exported successfully", "success");
  };

  // Handler functions for calculation rules
  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setRuleForm({
      id: rule.id,
      feature: rule.feature,
      description: rule.description,
      formula: rule.formula,
      multiplier: rule.multiplier || 1.0,
      enabled: rule.enabled
    });
    setShowRuleEditModal(true);
  };

  const handleToggleRule = (ruleId) => {
    setCalculationRules(prev => prev.map(rule => {
      if (rule.id === ruleId) {
        const updated = { 
          ...rule, 
          enabled: !rule.enabled,
          status: !rule.enabled ? 'active' : 'inactive'
        };
        showNotification(
          `${rule.feature} ${updated.enabled ? 'enabled' : 'disabled'}`,
          updated.enabled ? 'success' : 'warning'
        );
        return updated;
      }
      return rule;
    }));
  };

  const handleSaveRule = (e) => {
    e.preventDefault();
    
    setCalculationRules(prev => prev.map(rule => {
      if (rule.id === ruleForm.id) {
        return { ...rule, ...ruleForm };
      }
      return rule;
    }));
    
    showNotification(`Rule "${ruleForm.feature}" updated successfully`, "success");
    setShowRuleEditModal(false);
    setEditingRule(null);
  };

  // Report download functions
  const handleDownloadReport = async (report) => {
    setIsLoading(true);
    
    // Get the first format from the report
    const format = report.format.split(',')[0].trim();
    
    // Create sample data based on report type
    let sampleData = [];
    let headers = [];
    
    switch(report.type) {
      case 'reconciliation':
        headers = ['Employee', 'Present Days', 'Payable Days', 'Difference', 'Status'];
        sampleData = [
          { Employee: 'John Smith', 'Present Days': 22, 'Payable Days': 22, Difference: 0, Status: 'Matched' },
          { Employee: 'Sarah Johnson', 'Present Days': 20, 'Payable Days': 21, Difference: 1, Status: 'Mismatch' },
          { Employee: 'Robert Chen', 'Present Days': 23, 'Payable Days': 23, Difference: 0, Status: 'Matched' }
        ];
        break;
        
      case 'deduction':
        headers = ['Employee', 'Absent Days', 'Daily Rate', 'Deduction', 'Approval'];
        sampleData = [
          { Employee: 'John Smith', 'Absent Days': 2, 'Daily Rate': '$166.67', Deduction: '$333.34', Approval: 'Approved' },
          { Employee: 'Maria Garcia', 'Absent Days': 1, 'Daily Rate': '$140.00', Deduction: '$140.00', Approval: 'Pending' },
          { Employee: 'Tom Brown', 'Absent Days': 3, 'Daily Rate': '$126.67', Deduction: '$380.01', Approval: 'Approved' }
        ];
        break;
        
      case 'addition':
        headers = ['Employee', 'Overtime Hours', 'Rate', 'Total Pay', 'Department'];
        sampleData = [
          { Employee: 'David Kim', 'Overtime Hours': 12, Rate: '$31.25', 'Total Pay': '$375.00', Department: 'Engineering' },
          { Employee: 'Lisa Wang', 'Overtime Hours': 8, Rate: '$30.00', 'Total Pay': '$240.00', Department: 'Finance' },
          { Employee: 'Emma Davis', 'Overtime Hours': 6, Rate: '$26.88', 'Total Pay': '$161.28', Department: 'Marketing' }
        ];
        break;
        
      case 'audit':
        headers = ['Date', 'Employee', 'Correction', 'Impact', 'Approved By'];
        sampleData = [
          { Date: '2024-01-15', Employee: 'John Smith', Correction: 'Overtime Update', Impact: '+$75.00', 'Approved By': 'Manager' },
          { Date: '2024-01-16', Employee: 'Sarah Johnson', Correction: 'Status Change', Impact: '+$150.00', 'Approved By': 'HR' },
          { Date: '2024-01-10', Employee: 'Robert Chen', Correction: 'Time Correction', Impact: 'No Impact', 'Approved By': 'Employee' }
        ];
        break;
        
      case 'system':
        headers = ['Component', 'Last Sync', 'Status', 'Errors', 'Latency'];
        sampleData = [
          { Component: 'Attendance Sync', 'Last Sync': '2024-01-19 23:59:59', Status: 'Connected', Errors: 0, Latency: '< 5min' },
          { Component: 'Payroll Sync', 'Last Sync': '2024-01-19 23:59:59', Status: 'Connected', Errors: 2, Latency: '15min' },
          { Component: 'Data Freshness', 'Last Sync': 'Just now', Status: 'Current', Errors: 0, Latency: '< 1min' }
        ];
        break;
    }
    
    try {
      switch(format) {
        case 'PDF':
          await generatePDFReport(report.name, headers, sampleData, report.type);
          break;
          
        case 'Excel':
          await generateExcelReport(report.name, headers, sampleData);
          break;
          
        case 'CSV':
          await generateCSVReport(report.name, headers, sampleData);
          break;
          
        default:
          // Default to CSV
          await generateCSVReport(report.name, headers, sampleData);
      }
      
      showNotification(`${report.name} downloaded as ${format}`, "success");
    } catch (error) {
      showNotification(`Failed to download ${report.name}`, "error");
      console.error('Download error:', error);
    }
    
    setIsLoading(false);
  };

  const handleViewReport = (report) => {
    // Show a modal or detailed view of the report
    setSelectedReport(report);
    
    // Create detailed preview content
    const previewContent = `
      <div style="padding: 20px; background: white; border-radius: 12px; max-width: 800px;">
        <h3 style="color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          ${report.name}
        </h3>
        <div style="margin-bottom: 20px;">
          <p style="color: #64748b; line-height: 1.6;">${report.description}</p>
        </div>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #475569; margin-bottom: 10px;">Report Details</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Type:</strong> ${report.type}</div>
            <div><strong>Frequency:</strong> ${report.frequency}</div>
            <div><strong>Format:</strong> ${report.format}</div>
            <div><strong>Last Generated:</strong> ${report.lastGenerated}</div>
            <div><strong>Columns:</strong> ${report.columns.length}</div>
            <div><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Ready</span></div>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <h4 style="color: #475569; margin-bottom: 10px;">Sample Preview</h4>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f1f5f9;">
                  ${report.columns.map(col => `
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #64748b;">
                      ${col}
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Sample Data 1</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Sample Data 2</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Sample Data 3</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Sample Data 4</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Sample Data 5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button onclick="window.closePreview()" style="padding: 8px 16px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
            Close
          </button>
          <button onclick="window.downloadReport()" style="padding: 8px 16px; background: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Download Report
          </button>
        </div>
      </div>
    `;
    
    // Open preview in new window
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <html>
        <head>
          <title>Preview: ${report.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: #f8fafc;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 10px;
              text-align: left;
            }
            button {
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          ${previewContent}
          <script>
            window.closePreview = function() {
              window.close();
            };
            
            window.downloadReport = function() {
              // Trigger download
              const link = document.createElement('a');
              link.href = 'data:text/csv;charset=utf-8,Sample,Data,Preview';
              link.download = '${report.name.replace(/\s+/g, '_')}_preview.csv';
              link.click();
            };
          </script>
        </body>
      </html>
    `);
    previewWindow.document.close();
    
    showNotification(`Opening preview for ${report.name}`, "success");
  };

  // Helper functions for generating reports
  const generateCSVReport = (reportName, headers, data) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    downloadFile(csvContent, `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const generateExcelReport = (reportName, headers, data) => {
    const excelXML = generateExcelXML(data, headers, reportName);
    downloadFile(excelXML, `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xml`, 'application/vnd.ms-excel');
  };

  const generatePDFReport = (reportName, headers, data, type) => {
    // Create a simple HTML-based PDF
    const pdfContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            .pdf-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid ${type === 'reconciliation' ? '#3b82f6' : 
                                      type === 'deduction' ? '#ef4444' : 
                                      type === 'addition' ? '#10b981' : '#d97706'};
            }
            .pdf-header h1 {
              color: #1e293b;
              margin-bottom: 10px;
            }
            .report-meta {
              color: #64748b;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background: #f8fafc;
              padding: 12px;
              text-align: left;
              border-bottom: 2px solid #e2e8f0;
              color: #64748b;
              font-weight: bold;
            }
            td {
              padding: 10px;
              border-bottom: 1px solid #f1f5f9;
              color: #475569;
            }
            tr:nth-child(even) {
              background: #f8fafc;
            }
            .pdf-footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #94a3b8;
              font-size: 12px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="pdf-header">
            <h1>${reportName}</h1>
            <div class="report-meta">
              Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${headers.map(h => `<td>${row[h]}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="pdf-footer">
            <p>Confidential Report - Payroll Integration System</p>
            <p>© ${new Date().getFullYear()} All rights reserved</p>
          </div>
        </body>
      </html>
    `;
    
    // Convert to blob and download
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

 const renderDashboard = () => (
    <>
      <h6 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: '#1e293b' }}>
        Payroll Integration Dashboard
      </h6>
      
      <PayrollFreezeComponent 
        freezeStatus={freezeStatus} 
        onToggleFreeze={handleToggleFreeze}
        isLoading={isLoading}
      />
      
      {/* Payroll Process Steps with buttons on top right */}
      <div style={{ 
        position: 'relative',
        marginBottom: '28px'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          display: 'flex', 
          gap: '12px', 
          zIndex: 1 
        }}>
          <button 
            className="btn-secondary" 
            onClick={handleRefreshStatus}
            style={{ 
              padding: '10px 16px', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '40px'
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button 
            className="btn-primary" 
            onClick={handleViewProcessDetails}
            style={{ 
              padding: '10px 16px', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '40px'
            }}
          >
            <Eye size={16} />
            View Details
          </button>
        </div>
        <PayrollProcessSteps 
          currentStep={currentStep}
          onStepClick={handleStepClick}
          onRefresh={handleRefreshStatus}
          onViewDetails={handleViewProcessDetails}
        />
      </div>
      
      <div className="dashboard-grid">
        <div>
        <div className="chart-card">
  <div className="chart-title">
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <BarChart3 size={20} color="#8b5cf6" />
      <span style={{ lineHeight: '1' }}>Payroll Impact Analysis</span>
    </div>
    <select 
      className="form-select"
      style={{ width: '180px' }}
      value={filters.period}
      onChange={(e) => setFilters({ ...filters, period: e.target.value })}
    >
      <option value="current-month">Current Month</option>
      <option value="last-month">Last Month</option>
      <option value="quarter">Quarterly</option>
    </select>
  </div>
  
  {/* Bar Chart Container */}
  <div style={{ height: '280px', padding: '20px 0' }}>
    <div style={{ 
      position: 'relative', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'flex-end', 
      gap: '16px',
      borderBottom: '2px solid #e2e8f0',
      paddingBottom: '24px'
    }}>
      {/* Y-axis labels */}
      <div style={{
        position: 'absolute',
        left: '-30px',
        top: 0,
        bottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontSize: '10px',
        color: '#94a3b8',
        paddingRight: '8px'
      }}>
        {[100, 75, 50, 25, 0].map((percent, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
            <span>₹{(6000 * (percent/100) / 1000).toFixed(0)}k</span>
          </div>
        ))}
      </div>
      
      {/* Chart bars for each employee */}
      {filteredData.slice(0, 8).map((emp, index) => (
        <div key={index} style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          height: '100%'
        }}>
          {/* Bar chart columns - grouped for each employee */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'center',
            gap: '6px',
            height: 'calc(100% - 40px)',
            width: '100%',
            position: 'relative'
          }}>
            {/* Basic Salary Bar */}
            <div style={{ 
              width: '22px', 
              height: `${(emp.basicSalary / 6000) * 100}%`, 
              background: 'linear-gradient(to top, #8b5cf6, #a78bfa)',
              borderRadius: '4px 4px 0 0',
              position: 'relative',
              transition: 'height 0.3s ease'
            }}>
              {/* Value label on hover */}
              <div style={{
                position: 'absolute',
                top: '-22px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '10px',
                fontWeight: 600,
                color: '#8b5cf6',
                opacity: 0,
                transition: 'opacity 0.2s',
                whiteSpace: 'nowrap'
              }}>
                ₹{emp.basicSalary.toLocaleString()}
              </div>
            </div>
            
            {/* Net Pay Bar */}
            <div style={{ 
              width: '22px', 
              height: `${(emp.netPay / 6000) * 100}%`, 
              background: 'linear-gradient(to top, #10b981, #34d399)',
              borderRadius: '4px 4px 0 0',
              position: 'relative',
              transition: 'height 0.3s ease'
            }}>
              {/* Value label on hover */}
              <div style={{
                position: 'absolute',
                top: '-22px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '10px',
                fontWeight: 600,
                color: '#10b981',
                opacity: 0,
                transition: 'opacity 0.2s',
                whiteSpace: 'nowrap'
              }}>
                ₹{emp.netPay.toLocaleString()}
              </div>
            </div>
            
            {/* Loss of Pay Bar (if any) */}
            {emp.lossOfPay > 0 && (
              <div style={{ 
                width: '14px', 
                height: `${Math.min((emp.lossOfPay / 1000) * 100, 100)}%`, 
                background: 'linear-gradient(to top, #ef4444, #f87171)',
                borderRadius: '4px 4px 0 0',
                marginLeft: '4px',
                position: 'relative'
              }}>
                {/* Value label on hover */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: '#ef4444',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }}>
                  -₹{emp.lossOfPay.toLocaleString()}
                </div>
              </div>
            )}
          </div>
          
          {/* X-axis labels (Employee names) */}
          <div style={{ 
            fontSize: '12px', 
            color: '#64748b', 
            marginTop: '12px', 
            textAlign: 'center',
            fontWeight: 500,
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            {emp.employeeName.split(' ')[0]}
          </div>
        </div>
      ))}
    </div>
  </div>
  
  {/* Chart Legend */}
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '24px', 
    fontSize: '13px', 
    color: '#64748b', 
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: '16px', 
        height: '16px', 
        background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', 
        borderRadius: '3px' 
      }} />
      Basic Salary
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: '16px', 
        height: '16px', 
        background: 'linear-gradient(135deg, #10b981, #34d399)', 
        borderRadius: '3px' 
      }} />
      Net Pay
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: '12px', 
        height: '12px', 
        background: 'linear-gradient(135deg, #ef4444, #f87171)', 
        borderRadius: '3px' 
      }} />
      Loss of Pay
    </div>
  </div>
</div>

{/* Add CSS for hover effects */}
<style jsx>{`
  .chart-card:hover .bar-container div > div > div {
    opacity: 1;
  }
  
  /* Alternative: Add hover effect directly with inline styles */
  .bar-container {
    position: relative;
  }
  
  .bar-container:hover .value-label {
    opacity: 1 !important;
  }
`}</style>

          <div className="chart-card" style={{ marginTop: '24px' }}>
            <div className="chart-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PieChart size={20} color="#8b5cf6" />
                <span style={{ lineHeight: '1' }}>Top Deductions & Additions</span>
              </div>
              <button 
                className="btn-secondary" 
                onClick={() => handleExportAllData()}
                disabled={isLoading}
                style={{ 
                  padding: '8px 16px', 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Download size={14} />
                Export Summary
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginTop: '20px' }}>
              <div>
                <div style={{ 
                  fontSize: '15px', 
                  fontWeight: 700, 
                  marginBottom: '16px', 
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <TrendingDown size={18} />
                  <span>Deductions ($${statistics.totalDeductions || 0})</span>
                </div>
                <div style={{ backgroundColor: '#fef2f2', borderRadius: '12px', padding: '16px' }}>
                  {[
                    { label: 'Loss of Pay', value: statistics.totalLossOfPay || 0, percent: ((statistics.totalLossOfPay / statistics.totalDeductions) * 100).toFixed(1) },
                    { label: 'Leave Without Pay', value: statistics.leaveWithoutPayTotal || 0, percent: ((statistics.leaveWithoutPayTotal / statistics.totalDeductions) * 100).toFixed(1) }
                  ].map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: index < 1 ? '1px solid #fee2e2' : 'none'
                    }}>
                      <div className="cell-content">
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          backgroundColor: index === 0 ? '#dc2626' : '#ef4444',
                          borderRadius: '50%'
                        }} />
                        <span style={{ color: '#475569', fontWeight: 500 }}>{item.label}</span>
                      </div>
                      <div className="cell-content-right">
                        <span style={{ fontWeight: 700, color: '#dc2626' }}>
                          $${item.value.toFixed(2)}
                        </span>
                        <span style={{ 
                          fontSize: '12px', 
                          backgroundColor: '#fee2e2', 
                          color: '#dc2626',
                          padding: '4px 8px',
                          borderRadius: '20px',
                          fontWeight: 600
                        }}>
                          {item.percent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ 
                  fontSize: '15px', 
                  fontWeight: 700, 
                  marginBottom: '16px', 
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <TrendingUp size={18} />
                  <span>Additions ($${statistics.totalAdditions || 0})</span>
                </div>
                <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '16px' }}>
                  {[
                    { label: 'Overtime Pay', value: statistics.totalOvertimePay || 0, percent: ((statistics.totalOvertimePay / statistics.totalAdditions) * 100).toFixed(1) },
                    { label: 'Holiday Pay', value: statistics.totalHolidayPay || 0, percent: ((statistics.totalHolidayPay / statistics.totalAdditions) * 100).toFixed(1) }
                  ].map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: index < 1 ? '1px solid #dcfce7' : 'none'
                    }}>
                      <div className="cell-content">
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          backgroundColor: index === 0 ? '#10b981' : '#16a34a',
                          borderRadius: '50%'
                        }} />
                        <span style={{ color: '#475569', fontWeight: 500 }}>{item.label}</span>
                      </div>
                      <div className="cell-content-right">
                        <span style={{ fontWeight: 700, color: '#16a34a' }}>
                          $${item.value.toFixed(2)}
                        </span>
                        <span style={{ 
                          fontSize: '12px', 
                          backgroundColor: '#d1fae5', 
                          color: '#065f46',
                          padding: '4px 8px',
                          borderRadius: '20px',
                          fontWeight: 600
                        }}>
                          {item.percent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="chart-card">
            <div className="chart-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Database size={20} color="#8b5cf6" />
                <span style={{ lineHeight: '1' }}>Integration Status</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn-secondary" 
                  onClick={handleRefreshStatus}
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => setActiveTab('integration')}
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Settings size={14} />
                  Configure
                </button>
              </div>
            </div>
            <div className="integration-grid">
              <div className="integration-card" onClick={() => handleSyncIntegration('attendanceSync')}>
                <div className={`integration-status status-${integrationStatus.attendanceSync?.status || 'disconnected'}`}>
                  {integrationStatus.attendanceSync?.status === 'connected' ? '✓' : '!'}
                </div>
                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Attendance Sync</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  Last sync: {integrationStatus.attendanceSync?.lastSync || 'N/A'}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Sync: {integrationStatus.attendanceSync?.syncFrequency || '15min'}
                </div>
              </div>
              
              <div className="integration-card" onClick={() => handleSyncIntegration('payrollSync')}>
                <div className={`integration-status status-${integrationStatus.payrollSync?.status || 'disconnected'}`}>
                  {integrationStatus.payrollSync?.status === 'connected' ? '✓' : '!'}
                </div>
                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Payroll Sync</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  Last sync: {integrationStatus.payrollSync?.lastSync || 'N/A'}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Sync: {integrationStatus.payrollSync?.syncFrequency || '30min'}
                </div>
              </div>
              
              <div className="integration-card">
                <div className={`integration-status status-${integrationStatus.dataFreshness?.status || 'disconnected'}`}>
                  {integrationStatus.dataFreshness?.status === 'current' ? '✓' : '!'}
                </div>
                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Data Freshness</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  {integrationStatus.dataFreshness?.hoursAgo || 0} hours ago
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Latency: {integrationStatus.dataFreshness?.latency || '< 5min'}
                </div>
              </div>
              
              <div className="integration-card">
                <div className={`integration-status status-${integrationStatus.errorCount > 0 ? 'disconnected' : 'connected'}`}>
                  {integrationStatus.errorCount || 0}
                </div>
                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>System Health</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  {integrationStatus.errorCount || 0} issues found
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Warnings: {integrationStatus.warnings || 0}
                </div>
              </div>
            </div>
          </div>

       <div className="chart-card" style={{ marginTop: '20px' }}>
  <div className="chart-title">
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Bell size={20} color="#8b5cf6" />
      <span style={{ lineHeight: '1' }}>Action Required</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
        {alerts.filter(a => !a.resolved).length} Active
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className="btn-secondary"
          onClick={() => {
            setAlerts(prev => prev.map(alert => ({ ...alert, resolved: true })));
            showNotification("All alerts marked as resolved", "success");
          }}
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <CheckCircle size={12} />
          Mark All
        </button>
        <button 
          className="btn-primary"
          onClick={() => {
            setActiveTab('reports');
            showNotification("Viewing all reports", "info");
          }}
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Eye size={12} />
          View All
        </button>
      </div>
    </div>
  </div>
  
  <div style={{ marginTop: '16px' }}>
    {alerts.slice(0, 4).map((alert, index) => (
      <div key={index} style={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        gap: '16px',
        padding: '16px',
        borderBottom: index < 3 ? '1px solid #f1f5f9' : 'none',
        backgroundColor: alert.resolved ? '#f8fafc' : 'white',
        opacity: alert.resolved ? 0.6 : 1
      }}>
        <div style={{ 
          width: '28px', 
          height: '28px', 
          borderRadius: '8px',
          background: alert.severity === 'high' 
            ? 'linear-gradient(135deg, #fee2e2, #fecaca)' 
            : alert.severity === 'medium' 
            ? 'linear-gradient(135deg, #fef3c7, #fde68a)' 
            : 'linear-gradient(135deg, #eff6ff, #bfdbfe)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertCircle size={16} color={alert.severity === 'high' ? '#dc2626' : alert.severity === 'medium' ? '#d97706' : '#2563eb'} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              color: alert.severity === 'high' ? '#dc2626' : alert.severity === 'medium' ? '#d97706' : '#2563eb',
              letterSpacing: '0.5px'
            }}>
              {alert.type}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              {alert.date}
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
            {alert.message}
          </div>
          {!alert.resolved && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-secondary"
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => {
                  handleResolveAlert(alert.id);
                  showNotification("Alert marked as resolved", "success");
                }}
              >
                <CheckCircle size={12} />
                Mark Resolved
              </button>
              <button 
                className="btn-primary"
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => {
                  if (alert.type === 'correction') {
                    setActiveTab('corrections');
                    showNotification("Redirecting to corrections", "info");
                  }
                  if (alert.type === 'freeze') {
                    handleToggleFreeze();
                    showNotification("Freeze status updated", "success");
                  }
                }}
              >
                <AlertTriangle size={12} />
                {alert.action}
              </button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
        </div>
      </div>
    </>
  );

 // Add the edit rule modal component
const renderRuleEditModal = () => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h6 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
          Edit Calculation Rule
        </h6>
        <button 
          onClick={() => setShowRuleEditModal(false)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '24px', 
            color: '#64748b',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ×
        </button>
      </div>
      
      <form onSubmit={handleSaveRule}>
        <div style={{ marginBottom: '24px' }}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Rule Name</label>
            <input 
              type="text" 
              className="form-input"
              value={ruleForm.feature}
              onChange={(e) => setRuleForm({ ...ruleForm, feature: e.target.value })}
              required
              placeholder="Enter rule name"
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Description</label>
            <textarea 
              className="form-textarea"
              value={ruleForm.description}
              onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
              required
              placeholder="Describe the calculation rule"
              rows={3}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Formula</label>
            <input 
              type="text" 
              className="form-input"
              value={ruleForm.formula}
              onChange={(e) => setRuleForm({ ...ruleForm, formula: e.target.value })}
              required
              placeholder="e.g., Daily Rate × Absent Days"
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Multiplier</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input 
                type="range" 
                min="0.5" 
                max="3.0" 
                step="0.1"
                value={ruleForm.multiplier}
                onChange={(e) => setRuleForm({ ...ruleForm, multiplier: parseFloat(e.target.value) })}
                style={{ flex: 1 }}
              />
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#8b5cf6',
                minWidth: '40px',
                textAlign: 'center'
              }}>
                {ruleForm.multiplier}x
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Adjust the multiplier for this calculation (0.5x to 3.0x)
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={ruleForm.enabled}
                onChange={(e) => setRuleForm({ ...ruleForm, enabled: e.target.checked })}
                style={{ width: '16px', height: '16px' }}
              />
              Enable this rule
            </label>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => setShowRuleEditModal(false)}
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px'
            }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px'
            }}
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
);

 const renderPayrollCalculation = () => (
    <>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h6 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>
          Payroll Calculation Details
        </h6>
        <div className="action-buttons" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={handleRunPayroll} 
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                Processing...
              </div>
            ) : (
              <>
                <Calculator size={18} />
                Run Payroll
              </>
            )}
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => setShowExportModal(true)} 
            disabled={isLoading}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              height: '40px'
            }}
          >
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

<div className="data-table-container">
  <table className="data-table">
    <thead>
      <tr>
        <th className="table-cell-left">Employee</th>
        <th className="table-cell-left">Department</th>
        <th className="table-cell-center">Present Days</th>
        <th className="table-cell-center">Absent Days</th>
        <th className="table-cell-center">Overtime (Hrs)</th>
        <th className="table-cell-center">Holiday Work</th>
        <th className="table-cell-right">Basic Salary</th>
        <th className="table-cell-right">Loss of Pay</th>
        <th className="table-cell-right">Overtime Pay</th>
        <th className="table-cell-right">Net Pay</th>
        <th className="table-cell-center">Status</th>
        <th className="table-cell-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredData.slice(0, 15).map((record) => (
        <tr key={record.id}>
          <td className="table-cell-left">
            <div className="cell-content">
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                flexShrink: 0
              }}>
                {record.employeeName.charAt(0)}
              </div>
              <div style={{ minWidth: '120px' }}>
                <div style={{ fontWeight: 600, color: '#1e293b', lineHeight: '1.2' }}>{record.employeeName}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{record.employeeId}</div>
              </div>
            </div>
          </td>
          <td className="table-cell-left">
            <div className="cell-content">
              <span style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                color: '#5b21b6',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                whiteSpace: 'nowrap'
              }}>
                {record.department}
              </span>
            </div>
          </td>
          <td className="table-cell-center">
            <div className="cell-content-center">
              <div style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#10b981',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {record.totalPresent}
              </div>
            </div>
          </td>
          <td className="table-cell-center">
            <div className="cell-content-center">
              <div style={{
                width: '28px',
                height: '28px',
                backgroundColor: record.totalAbsent > 0 ? '#ef4444' : '#94a3b8',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {record.totalAbsent}
              </div>
            </div>
          </td>
          <td className="table-cell-center">
            <div className="cell-content-center" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '4px' 
            }}>
              <Clock size={16} color="#d97706" style={{ verticalAlign: 'middle' }} />
              <span style={{ fontWeight: 700, color: '#d97706', verticalAlign: 'middle' }}>
                {record.totalOvertime}h
              </span>
            </div>
          </td>
          <td className="table-cell-center">
            <span className={`amount-badge ${record.holidayWorkDays > 0 ? 'amount-positive' : 'amount-neutral'}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              verticalAlign: 'middle'
            }}>
              <CalendarDays size={12} style={{ verticalAlign: 'middle' }} />
              <span style={{ verticalAlign: 'middle' }}>
                {record.holidayWorkDays} days
              </span>
            </span>
          </td>
          <td className="table-cell-right">
            <div className="cell-content-right" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              justifyContent: 'flex-end' 
            }}>
              <DollarSign size={14} color="#475569" style={{ verticalAlign: 'middle' }} />
              <span style={{ fontWeight: 700, color: '#475569', verticalAlign: 'middle' }}>
                $${record.basicSalary.toFixed(2)}
              </span>
            </div>
          </td>
          <td className="table-cell-right">
            <div className="cell-content-right" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              justifyContent: 'flex-end' 
            }}>
              <TrendingDown size={14} style={{ verticalAlign: 'middle' }} />
              <span style={{ fontWeight: 700, color: '#dc2626', verticalAlign: 'middle' }}>
                $${record.lossOfPay.toFixed(2)}
              </span>
            </div>
          </td>
          <td className="table-cell-right">
            <div className="cell-content-right" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              justifyContent: 'flex-end' 
            }}>
              <TrendingUp size={14} style={{ verticalAlign: 'middle' }} />
              <span style={{ fontWeight: 700, color: '#16a34a', verticalAlign: 'middle' }}>
                $${record.overtimePay.toFixed(2)}
              </span>
            </div>
          </td>
          <td className="table-cell-right">
            <div className="cell-content-right" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              justifyContent: 'flex-end' 
            }}>
              <DollarSign size={16} style={{ verticalAlign: 'middle' }} />
              <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '15px', verticalAlign: 'middle' }}>
                $${record.netPay.toFixed(2)}
              </span>
            </div>
          </td>
          <td className="table-cell-center">
            <span className={`status-badge status-${record.status}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              verticalAlign: 'middle'
            }}>
              {record.status === 'processed' ? 
                <CheckCircle size={12} style={{ verticalAlign: 'middle' }} /> : 
                <AlertCircle size={12} style={{ verticalAlign: 'middle' }} />
              }
              <span style={{ verticalAlign: 'middle' }}>
                {record.status}
              </span>
            </span>
          </td>
          <td className="table-cell-center">
            <div className="table-actions" style={{ 
              display: 'flex', 
              gap: '4px',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <button 
                className="btn-icon" 
                onClick={() => handleViewDetails(record)}
                title="View Details"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#475569',
                  padding: 0,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Eye size={14} style={{ 
                  display: 'block', 
                  margin: '0 auto',
                  verticalAlign: 'middle'
                }} />
              </button>
              <button 
                className="btn-icon" 
                onClick={() => handleEditRecord(record)}
                title="Edit"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#475569',
                  padding: 0,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Edit size={14} style={{ 
                  display: 'block', 
                  margin: '0 auto',
                  verticalAlign: 'middle'
                }} />
              </button>
              <button 
                className="btn-icon" 
                onClick={() => handleExportRecord(record)}
                title="Export"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#475569',
                  padding: 0,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Download size={14} style={{ 
                  display: 'block', 
                  margin: '0 auto',
                  verticalAlign: 'middle'
                }} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Showing {Math.min(15, filteredData.length)} of {filteredData.length} employees • 
          Total: $${filteredData.reduce((sum, x) => sum + x.netPay, 0).toFixed(2)}
        </div>
        
      </div>
    </>
  );

  const renderIntegration = () => (
  <>
    <h6 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: '#1e293b' }}>
      Attendance-Payroll Integration Features
    </h6>

    <div className="chart-card">
      <div className="chart-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Database size={22} color="#8b5cf6" />
          Real-time Data Flow
        </div>
        <button 
          className="btn-secondary" 
          onClick={handleRefreshStatus}
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={18} />
          Refresh Status
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginTop: '20px' }}>
        <div className="integration-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
            }}>
              <Database size={24} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#1e293b' }}>Real-time Attendance Data</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Live sync with payroll system</div>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Sync Frequency:</span>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>{integrationStatus.attendanceSync?.syncFrequency || '15 minutes'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Success Rate:</span>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>{integrationStatus.attendanceSync?.successRate || '99.8%'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={{ color: '#64748b' }}>Last Sync:</span>
              <span style={{ fontWeight: 700, color: '#1e293b' }}>{integrationStatus.attendanceSync?.lastSync || 'N/A'}</span>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button 
              className="btn-primary" 
              style={{ width: '100%' }}
              onClick={() => handleSyncIntegration('attendanceSync')}
            >
              Sync Now
            </button>
          </div>
        </div>

        <div className="integration-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
            }}>
              <Lock size={24} color="#dc2626" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#1e293b' }}>Attendance Freeze</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Secure payroll processing</div>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Current Status:</span>
              <span className={`freeze-badge ${freezeStatus.isFrozen ? 'frozen' : 'unfrozen'}`}>
                {freezeStatus.isFrozen ? 'Frozen' : 'Unfrozen'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Freeze Window:</span>
              <span style={{ fontWeight: 700 }}>3 days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={{ color: '#64748b' }}>Next Freeze:</span>
              <span style={{ fontWeight: 700 }}>Feb 1-3, 2024</span>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button 
              className="btn-warning" 
              style={{ width: '100%' }}
              onClick={handleToggleFreeze}
            >
              {freezeStatus.isFrozen ? 'Unfreeze Now' : 'Freeze Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
<div className="chart-card" style={{ marginTop: '28px' }}>
  <div className="chart-title">
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Calculator size={22} color="#8b5cf6" />
      Calculation Rules & Configuration
    </div>
    <button 
      className="btn-secondary" 
      onClick={() => setShowSettingsModal(true)}
      style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <Settings size={18} />
      Configure
    </button>
  </div>
  <div style={{ marginTop: '20px' }}>
    {calculationRules.map((rule, index) => (
      <div key={rule.id} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        background: index % 2 === 0 ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' : 'white',
        borderRadius: '12px',
        marginBottom: '12px',
        transition: 'all 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: rule.id === 1 ? 'linear-gradient(135deg, #fee2e2, #fecaca)' :
                      rule.id === 2 ? 'linear-gradient(135deg, #fef3c7, #fde68a)' :
                      rule.id === 3 ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' :
                      'linear-gradient(135deg, #e0f2fe, #bae6fd)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: rule.id === 1 ? '#ef4444' :
                  rule.id === 2 ? '#d97706' :
                  rule.id === 3 ? '#16a34a' : '#3b82f6',
            boxShadow: rule.id === 1 ? '0 4px 12px rgba(239, 68, 68, 0.2)' :
                      rule.id === 2 ? '0 4px 12px rgba(217, 119, 6, 0.2)' :
                      rule.id === 3 ? '0 4px 12px rgba(16, 185, 129, 0.2)' :
                      '0 4px 12px rgba(59, 130, 246, 0.2)',
            flexShrink: 0
          }}>
            {rule.id === 1 ? <TrendingDown size={18} /> :
             rule.id === 2 ? <Zap size={18} /> :
             rule.id === 3 ? <CalendarDays size={18} /> :
             <UserX size={18} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontWeight: 700, 
              fontSize: '15px', 
              color: '#1e293b', 
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {rule.feature}
              {!rule.enabled && (
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 600,
                  background: '#fef3c7',
                  color: '#92400e'
                }}>
                  DISABLED
                </span>
              )}
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: '#64748b', 
              marginBottom: '8px',
              lineHeight: 1.5
            }}>
              {rule.description}
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: '#475569', 
              fontFamily: 'monospace',
              background: '#f8fafc',
              padding: '6px 12px',
              borderRadius: '6px',
              display: 'inline-block',
              fontWeight: 600
            }}>
              {rule.formula}
            </div>
            {rule.multiplier && (
              <div style={{ 
                fontSize: '12px', 
                color: rule.id === 1 ? '#ef4444' :
                      rule.id === 2 ? '#d97706' :
                      rule.id === 3 ? '#16a34a' : '#3b82f6',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Percent size={12} />
                Multiplier: {rule.multiplier}x
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span className={`status-badge ${rule.status === 'active' ? 'status-processed' : 'status-pending'}`}>
            {rule.status === 'active' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            {rule.status}
          </span>
          <button
            className="btn-icon"
            onClick={() => handleEditRule(rule)}
            style={{ width: '32px', height: '32px' }}
            title="Edit Rule"
          >
            <Edit size={14} />
          </button>
          <button
            className="btn-icon"
            onClick={() => handleToggleRule(rule.id)}
            style={{ width: '32px', height: '32px' }}
            title={rule.enabled ? "Disable Rule" : "Enable Rule"}
          >
            {rule.enabled ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
  </>
);

  const renderCorrections = () => (
    <>
     <div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '24px',
  gap: '16px'
}}>
  <h6 style={{ 
    fontSize: 24, 
    fontWeight: 800, 
    color: '#1e293b',
    flex: 1,
    margin: 0
  }}>
    Attendance Corrections & Post-Payroll Handling
  </h6>
  <div style={{ 
    display: 'flex', 
    gap: '12px', 
    alignItems: 'center',
    flexShrink: 0
  }}>
    <button 
      className="btn-primary" 
      onClick={() => setShowCorrectionModal(true)}
      style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px'
      }}
    >
      <Plus size={18} />
      Add Correction
    </button>
    <button 
      className="btn-secondary" 
      onClick={handleExportCorrections}
      style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px'
      }}
    >
      <Download size={18} />
      Export Corrections
    </button>
  </div>
</div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="table-cell-left">Employee</th>
              <th className="table-cell-center">Original Date</th>
              <th className="table-cell-left">Correction Type</th>
              <th className="table-cell-center">Original Value</th>
              <th className="table-cell-center">Corrected Value</th>
              <th className="table-cell-center">Payroll Impact</th>
              <th className="table-cell-center">Status</th>
              <th className="table-cell-left">Requested By</th>
              <th className="table-cell-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: 1,
                employeeName: 'John Smith',
                employeeId: 'EMP001',
                originalDate: '2024-01-15',
                correctionType: 'Overtime Update',
                originalValue: '2 hours',
                correctedValue: '4 hours',
                payrollImpact: '+$75.00',
                status: 'pending',
                requestedBy: 'Manager',
                requestedDate: '2024-01-18'
              },
              {
                id: 2,
                employeeName: 'Sarah Johnson',
                employeeId: 'EMP002',
                originalDate: '2024-01-16',
                correctionType: 'Status Change',
                originalValue: 'Absent',
                correctedValue: 'Present',
                payrollImpact: '+$150.00',
                status: 'approved',
                requestedBy: 'HR',
                requestedDate: '2024-01-17'
              },
              {
                id: 3,
                employeeName: 'Robert Chen',
                employeeId: 'EMP003',
                originalDate: '2024-01-10',
                correctionType: 'Time Correction',
                originalValue: '09:30 AM',
                correctedValue: '09:00 AM',
                payrollImpact: 'No Impact',
                status: 'rejected',
                requestedBy: 'Employee',
                requestedDate: '2024-01-12'
              },
              {
                id: 4,
                employeeName: 'Maria Garcia',
                employeeId: 'EMP004',
                originalDate: '2024-01-05',
                correctionType: 'Post-Payroll Adjustment',
                originalValue: 'Present',
                correctedValue: 'Leave',
                payrollImpact: '-$140.00',
                status: 'pending',
                requestedBy: 'Payroll Admin',
                requestedDate: '2024-01-19'
              }
            ].map((correction) => (
              <tr key={correction.id}>
                <td className="table-cell-left">
                  <div className="cell-content">
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                      flexShrink: 0
                    }}>
                      {correction.employeeName.charAt(0)}
                    </div>
                    <div style={{ minWidth: '120px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b', lineHeight: '1.2' }}>{correction.employeeName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{correction.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="table-cell-center">
                  <div className="cell-content-center">
                    <CalendarDays size={14} color="#64748b" />
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>
                      {correction.originalDate}
                    </span>
                  </div>
                </td>
                <td className="table-cell-left">
                  <div className="cell-content">
                    <span style={{
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
                      color: '#075985',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap'
                    }}>
                      {correction.correctionType}
                    </span>
                  </div>
                </td>
                <td className="table-cell-center">
                  <div className="cell-content-center">
                    <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, minWidth: '80px' }}>
                      {correction.originalValue}
                    </span>
                  </div>
                </td>
                <td className="table-cell-center">
                  <div className="cell-content-center">
                    <span style={{ color: '#1e293b', fontWeight: 700, fontSize: '14px', minWidth: '80px' }}>
                      {correction.correctedValue}
                    </span>
                  </div>
                </td>
                <td className="table-cell-center">
                  <span className={`amount-badge ${
                    correction.payrollImpact.startsWith('+') ? 'amount-positive' :
                    correction.payrollImpact.startsWith('-') ? 'amount-negative' :
                    'amount-neutral'
                  }`}>
                    {correction.payrollImpact.startsWith('+') ? <TrendingUp size={12} /> :
                     correction.payrollImpact.startsWith('-') ? <TrendingDown size={12} /> :
                     <DollarSign size={12} />}
                    {correction.payrollImpact}
                  </span>
                </td>
                <td className="table-cell-center">
                  <span className={`status-badge status-${correction.status}`}>
                    {correction.status === 'approved' ? <CheckCircle size={12} /> :
                     correction.status === 'rejected' ? <XCircle size={12} /> :
                     <AlertCircle size={12} />}
                    {correction.status}
                  </span>
                </td>
                <td className="table-cell-left">
                  <div style={{ minWidth: '100px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{correction.requestedBy}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{correction.requestedDate}</div>
                  </div>
                </td>
                <td className="table-cell-center">
                  <div className="table-actions">
                    {correction.status === 'pending' && (
                      <>
                        <button 
                          className="btn-icon"
                          onClick={() => showNotification(`Approved correction for ${correction.employeeName}`)}
                          style={{ borderColor: '#d1fae5', color: '#10b981', width: '32px', height: '32px' }}
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button 
                          className="btn-icon"
                          onClick={() => showNotification(`Rejected correction for ${correction.employeeName}`)}
                          style={{ borderColor: '#fee2e2', color: '#ef4444', width: '32px', height: '32px' }}
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    <button 
                      className="btn-icon"
                      onClick={() => {
                        setCorrectionForm({
                          ...correctionForm,
                          employeeId: correction.employeeId,
                          date: correction.originalDate,
                          correctionType: correction.correctionType,
                          originalValue: correction.originalValue,
                          correctedValue: correction.correctedValue
                        });
                        setShowCorrectionModal(true);
                      }}
                      style={{ width: '32px', height: '32px' }}
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderReports = () => (
    <>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
  <h6 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>
    Payroll Integration Reports
  </h6>
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
    <button 
      className="btn-primary" 
      onClick={() => handleExportAllData()}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
    >
      <Download size={18} />
      <span>Export All Reports</span>
    </button>
   
  </div>
</div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', marginTop: '24px' }}>
  {[
    {
      id: 1,
      name: 'Payroll-Attendance Reconciliation',
      type: 'reconciliation',
      description: 'Monthly reconciliation report showing attendance vs payroll data',
      frequency: 'monthly',
      columns: ['Employee', 'Present Days', 'Payable Days', 'Difference', 'Status'],
      lastGenerated: '2024-01-19',
      format: 'PDF, Excel'
    },
    {
      id: 2,
      name: 'Loss of Pay Report',
      type: 'deduction',
      description: 'Detailed report of all loss of pay calculations and deductions',
      frequency: 'monthly',
      columns: ['Employee', 'Absent Days', 'Daily Rate', 'Deduction', 'Approval'],
      lastGenerated: '2024-01-19',
      format: 'Excel, CSV'
    },
    {
      id: 3,
      name: 'Overtime Payment Summary',
      type: 'addition',
      description: 'Overtime hours and corresponding payments summary',
      frequency: 'monthly',
      columns: ['Employee', 'Overtime Hours', 'Rate', 'Total Pay', 'Department'],
      lastGenerated: '2024-01-19',
      format: 'PDF, Excel'
    },
    {
      id: 4,
      name: 'Holiday Working Compensation',
      type: 'addition',
      description: 'Report of holiday work days and double pay compensation',
      frequency: 'monthly',
      columns: ['Employee', 'Holiday Days', 'Regular Pay', 'Additional Pay', 'Total'],
      lastGenerated: '2024-01-19',
      format: 'PDF, Excel'
    },
    {
      id: 5,
      name: 'Leave Without Pay Report',
      type: 'deduction',
      description: 'Unauthorized leave days and corresponding salary deductions',
      frequency: 'monthly',
      columns: ['Employee', 'LWOP Days', 'Deduction', 'Reason', 'Manager Approval'],
      lastGenerated: '2024-01-19',
      format: 'Excel, CSV'
    },
    {
      id: 6,
      name: 'Post-Payroll Correction Log',
      type: 'audit',
      description: 'Audit trail of all post-payroll attendance corrections',
      frequency: 'monthly',
      columns: ['Date', 'Employee', 'Correction', 'Impact', 'Approved By'],
      lastGenerated: '2024-01-19',
      format: 'PDF, Excel'
    },
    {
      id: 7,
      name: 'Attendance Freeze Log',
      type: 'audit',
      description: 'Complete history of attendance freeze periods for payroll',
      frequency: 'quarterly',
      columns: ['Period', 'Freeze Date', 'Unfreeze Date', 'Processed By', 'Status'],
      lastGenerated: '2024-01-19',
      format: 'PDF'
    },
    {
      id: 8,
      name: 'Integration Health Report',
      type: 'system',
      description: 'System health and data sync status between attendance and payroll',
      frequency: 'weekly',
      columns: ['Component', 'Last Sync', 'Status', 'Errors', 'Latency'],
      lastGenerated: '2024-01-19',
      format: 'PDF, Excel'
    }
  ].map(report => (
    <div key={report.id} className="report-card">
      <div className="report-header">
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: report.type === 'reconciliation' ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' : 
                      report.type === 'deduction' ? 'linear-gradient(135deg, #fee2e2, #fecaca)' : 
                      report.type === 'addition' ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #fef3c7, #fde68a)',
          color: report.type === 'reconciliation' ? '#3b82f6' : 
                 report.type === 'deduction' ? '#ef4444' : 
                 report.type === 'addition' ? '#10b981' : '#d97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: report.type === 'reconciliation' ? '0 4px 12px rgba(59, 130, 246, 0.2)' :
                     report.type === 'deduction' ? '0 4px 12px rgba(239, 68, 68, 0.2)' :
                     report.type === 'addition' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(217, 119, 6, 0.2)'
        }}>
          {report.type === 'reconciliation' ? <FileText size={24} /> :
           report.type === 'deduction' ? <TrendingDown size={24} /> :
           report.type === 'addition' ? <TrendingUp size={24} /> :
           <Database size={24} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
            {report.name}
          </div>
          <span style={{
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            background: report.type === 'reconciliation' ? '#dbeafe' : 
                        report.type === 'deduction' ? '#fee2e2' : 
                        report.type === 'addition' ? '#d1fae5' : '#fef3c7',
            color: report.type === 'reconciliation' ? '#1d4ed8' : 
                   report.type === 'deduction' ? '#dc2626' : 
                   report.type === 'addition' ? '#047857' : '#92400e',
            display: 'inline-block'
          }}>
            {report.type.toUpperCase()}
          </span>
        </div>
      </div>
      <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: '1.5' }}>
        {report.description}
      </div>
      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Frequency:</span>
          <span style={{ fontWeight: 600 }}>{report.frequency}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Format:</span>
          <span style={{ fontWeight: 600 }}>{report.format}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Last Generated:</span>
          <span style={{ fontWeight: 600 }}>{report.lastGenerated}</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
          {report.columns.length} columns
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-icon" 
            onClick={() => handleDownloadReport(report)}
            style={{ width: '32px', height: '32px' }}
            title={`Download ${report.name}`}
          >
            <Download size={16} />
          </button>
          <button 
            className="btn-icon" 
            onClick={() => handleViewReport(report)}
            style={{ width: '32px', height: '32px' }}
            title={`View ${report.name}`}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
    </>
  );

  const renderSettings = () => (
    <>
      <h6 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: '#1e293b' }}>
        Integration Settings & Configuration
      </h6>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="chart-card">
          <div className="chart-title">
          
            <Shield size={20} color="#8b5cf6" />  Security Settings
          </div>
          <div style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label">Payroll Processing Password</label>
              <input type="password" className="form-input" placeholder="Enter password" />
            </div>
            <div className="form-group">
              <label className="form-label">Two-Factor Authentication</label>
              <select className="form-select">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Session Timeout</label>
              <select className="form-select">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">
            <RefreshCw size={20} color="#8b5cf6" />
            Sync Settings
          </div>
          <div style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label">Attendance Sync Frequency</label>
              <select className="form-select">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>Real-time</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payroll Sync Frequency</label>
              <select className="form-select">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>4 hours</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Retry Failed Syncs</label>
              <select className="form-select">
                <option>3 times</option>
                <option>5 times</option>
                <option>10 times</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">
            <Bell size={20} color="#8b5cf6" />
            Notification Settings
          </div>
          <div style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" defaultChecked />
                Email Notifications
              </label>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" defaultChecked />
                Push Notifications
              </label>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" />
                SMS Notifications
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">Alert Threshold</label>
              <select className="form-select">
                <option>High: Any error</option>
                <option>Medium: 5+ errors</option>
                <option>Low: 10+ errors</option>
              </select>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">
            <Calculator size={20} color="#8b5cf6" />
            Calculation Settings
          </div>
          <div style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label">Overtime Multiplier</label>
              <input type="number" className="form-input" defaultValue="1.5" step="0.1" />
            </div>
            <div className="form-group">
              <label className="form-label">Holiday Pay Multiplier</label>
              <input type="number" className="form-input" defaultValue="2.0" step="0.1" />
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Working Days</label>
              <input type="number" className="form-input" defaultValue="30" />
            </div>
            <div className="form-group">
              <label className="form-label">Daily Hours</label>
              <input type="number" className="form-input" defaultValue="8" />
            </div>
          </div>
        </div>
      </div>

  <div style={{ 
  marginTop: '32px', 
  display: 'flex', 
  justifyContent: 'flex-end', 
  gap: '12px',
  alignItems: 'center'
}}>
  <button 
    onClick={() => {
      showNotification("Reset to Defaults clicked!", "info");
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 20px',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      background: '#f8fafc',
      color: '#475569',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      height: '40px',
      transition: 'all 0.2s'
    }}
    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
    onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
  >
    Reset to Defaults
  </button>
  
  <button 
    onClick={() => {
      showNotification("Settings saved successfully!", "success");
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      background: '#8b5cf6',
      color: 'white',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      height: '40px',
      transition: 'all 0.2s'
    }}
    onMouseOver={(e) => e.currentTarget.style.background = '#7c3aed'}
    onMouseOut={(e) => e.currentTarget.style.background = '#8b5cf6'}
  >
    Save Settings
  </button>
</div>
    </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "payroll-calculation":
        return renderPayrollCalculation();
      case "integration":
        return renderIntegration();
      case "corrections":
        return renderCorrections();
      case "reports":
        return renderReports();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const renderCorrectionModal = () => (
   <div className="modal-overlay">
  <div className="modal-content">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <h6 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
        Add Attendance Correction
      </h6>
      <button 
        onClick={() => setShowCorrectionModal(false)}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          fontSize: '24px', 
          color: '#64748b',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        ×
      </button>
    </div>
    
    <form onSubmit={handleSubmitCorrection}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} />
              Employee
            </label>
            <select 
              className="form-select"
              value={correctionForm.employeeId}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={16} />
              Date
            </label>
            <input 
              type="date" 
              className="form-input"
              value={correctionForm.date}
              onChange={(e) => setCorrectionForm({ ...correctionForm, date: e.target.value })}
              required
            />
          </div>
        </div>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Correction Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {['Status Change', 'Time Correction', 'Overtime Update', 'Holiday Work Addition', 'Post-Payroll Adjustment'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleCorrectionTypeChange(type)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: `2px solid ${correctionForm.correctionType === type ? '#8b5cf6' : '#e2e8f0'}`,
                  background: correctionForm.correctionType === type ? '#f5f3ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '60px'
                }}
              >
                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px', textAlign: 'center' }}>{type}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Original Value</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g., Absent or 09:30"
              value={correctionForm.originalValue}
              onChange={(e) => setCorrectionForm({ ...correctionForm, originalValue: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Corrected Value</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g., Present or 09:00"
              value={correctionForm.correctedValue}
              onChange={(e) => setCorrectionForm({ ...correctionForm, correctedValue: e.target.value })}
              required
            />
          </div>
        </div>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Reason for Correction</label>
          <textarea 
            className="form-textarea"
            placeholder="Explain the reason for this correction..."
            value={correctionForm.reason}
            onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
          />
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '20px',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{ 
            fontSize: '15px', 
            fontWeight: 700, 
            color: '#475569', 
            marginBottom: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <Calculator size={16} />
            Payroll Impact Analysis
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#64748b' }}>Estimated Impact:</span>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: 800, 
              color: correctionForm.impact > 0 ? '#16a34a' : correctionForm.impact < 0 ? '#dc2626' : '#64748b'
            }}>
              {correctionForm.impact > 0 ? '+' : ''}$${Math.abs(correctionForm.impact).toFixed(2)}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            This {correctionForm.impact > 0 ? 'addition' : correctionForm.impact < 0 ? 'deduction' : 'change'} will affect the next payroll run. Changes are irreversible once processed.
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <button 
          type="button" 
          className="btn-secondary" 
          onClick={() => setShowCorrectionModal(false)}
          disabled={isLoading}
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 20px'
          }}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn-primary"
          disabled={isLoading}
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 20px'
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <CheckCircle size={18} />
              <span>Submit Correction</span>
            </>
          )}
        </button>
      </div>
    </form>
  </div>
</div>
  );

 const renderExportModal = () => (
  <div className="modal-overlay">
    <div className="modal-content">
      {/* Modal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h6 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
          Export Payroll Data
        </h6>
        <button 
          onClick={() => setShowExportModal(false)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '24px', 
            color: '#64748b',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            padding: 0
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ×
        </button>
      </div>
      
      {/* Modal Body */}
      <div style={{ marginBottom: '24px' }}>
        {/* Export Format Selection */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Export Format</label>
          <div className="export-format-grid">
            {['PDF', 'Excel', 'CSV'].map(format => (
              <div
                key={format}
                className={`export-format-card ${exportSettings.format === format ? 'active' : ''}`}
                onClick={() => setExportSettings({ ...exportSettings, format })}
              >
                <div className={`export-icon ${format.toLowerCase()}`}>
                  {format === 'PDF' ? <File size={24} style={{ verticalAlign: 'middle' }} /> :
                   format === 'Excel' ? <FileSpreadsheet size={24} style={{ verticalAlign: 'middle' }} /> :
                   <FileCode size={24} style={{ verticalAlign: 'middle' }} />}
                </div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '8px', fontSize: '15px' }}>{format}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {format === 'PDF' ? 'For reports' : format === 'Excel' ? 'For analysis' : 'For import'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Date Range */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Date Range</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input 
              type="date" 
              className="form-input"
              value={exportSettings.startDate}
              onChange={(e) => setExportSettings({ ...exportSettings, startDate: e.target.value })}
            />
            <input 
              type="date" 
              className="form-input"
              value={exportSettings.endDate}
              onChange={(e) => setExportSettings({ ...exportSettings, endDate: e.target.value })}
            />
          </div>
        </div>
        
        {/* Include Sections */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Include Sections</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {Object.entries(exportSettings.include).map(([key, value]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={value}
                  onChange={(e) => setExportSettings({
                    ...exportSettings,
                    include: { ...exportSettings.include, [key]: e.target.checked }
                  })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: '#475569', fontWeight: 500 }}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Export Summary */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', 
          padding: '20px', 
          borderRadius: '12px',
          border: '2px solid #ddd6fe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FileText size={16} color="#5b21b6" />
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#5b21b6' }}>
              Export Summary
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#6d28d9' }}>
            {Object.values(exportSettings.include).filter(v => v).length} sections selected • 
            {' '}{exportSettings.format} format • 
            {' '}{filteredData.length} records
          </div>
        </div>
      </div>
      
      {/* Modal Footer with Fixed Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTop: '1px solid #e2e8f0',
        paddingTop: '20px'
      }}>
        <button 
          className="btn-secondary" 
          onClick={() => setShowExportModal(false)}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 20px',
            height: '40px',
            minWidth: '100px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            color: '#475569',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
        >
          Cancel
        </button>
        <button 
          className="btn-primary" 
          onClick={() => handleExportPayrollData(exportSettings.format)}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 20px',
            height: '40px',
            minWidth: '140px',
            borderRadius: '6px',
            border: 'none',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed, #6d28d9)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="loading-spinner" style={{ 
                width: '16px', 
                height: '16px', 
                borderWidth: '2px',
                borderColor: 'white transparent white transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                display: 'inline-block'
              }} />
              <span>Exporting...</span>
            </div>
          ) : (
            <>
              <Download size={18} style={{ verticalAlign: 'middle', margin: 0 }} />
              <span>Export Data</span>
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

  const renderSettingsModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h6 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
            Integration Configuration
          </h6>
          <button 
            onClick={() => setShowSettingsModal(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '24px', 
              color: '#64748b',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">API Endpoint</label>
              <input type="text" className="form-input" placeholder="https://api.example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input type="password" className="form-input" placeholder="Enter API key" />
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Webhook URL</label>
            <input type="text" className="form-input" placeholder="https://webhook.example.com" />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" defaultChecked />
              Enable Automatic Backups
            </label>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" defaultChecked />
              Enable Audit Logging
            </label>
          </div>
        </div>
        
       <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
  <button 
    type="button"
    className="btn-secondary" 
    onClick={() => {
      setShowSettingsModal(false);
      showNotification("Configuration cancelled", "info");
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 20px',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      background: '#f8fafc',
      color: '#475569',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer'
    }}
  >
    Cancel
  </button>
  
  <button 
    type="button"
    className="btn-primary"
    onClick={() => {
      setShowSettingsModal(false);
      showNotification("Configuration saved successfully!", "success");
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      background: '#8b5cf6',
      color: 'white',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer'
    }}
  >
    Save Configuration
  </button>
</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}

      <div className="page">
        {/* HEADER - Now properly sticky */}
   <div className="header-top">
  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
    <div style={{
      width: '48px',
      height: '48px',
      background: 'none',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <Calculator size={20} color="#475569" />
    </div>
    <div>
      <div className="header-title" style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '22px',
        fontWeight: 700,
        marginBottom: '6px'
      }}>
        Attendance-Payroll Integration
      </div>
      <div className="header-sub" style={{ 
        fontSize: '13px',
        color: '#475569'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={12} color="#64748b" />
          <span style={{ color: '#475569' }}>HRMS Dashboard</span>
        </span>
        <span style={{ color: '#94a3b8' }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={12} color="#64748b" />
          <span style={{ color: '#475569' }}>Seamless Integration</span>
        </span>
        <span style={{ color: '#94a3b8' }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={12} color="#64748b" />
          <span style={{ color: '#475569' }}>Real-time Data Sync</span>
        </span>
      </div>
    </div>
  </div>

  {/* SEARCH + ROLE */}
  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
    <div style={{ position: "relative" }}>
      <Search size={16} style={{ 
        position: "absolute", 
        left: 16, 
        top: 12, 
        color: "#64748b"
      }} />
      <input
        className="search-box"
        placeholder="Search employees, payroll, or corrections..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ 
          padding: '10px 16px 10px 40px',
          fontSize: '13px'
        }}
      />
    </div>

    {/* Role selector with chevron arrow */}
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ 
          width: '160px',
          padding: '10px 40px 10px 16px',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          fontSize: '13px',
          color: '#475569',
          background: 'white',
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none'
        }}
      >
        <option value="payroll-admin">Payroll Admin</option>
        <option value="hr">HR Manager</option>
        <option value="finance">Finance</option>
        <option value="admin">System Admin</option>
      </select>
      {/* Custom chevron arrow */}
      <div style={{
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: '#64748b'
      }}>
        <ChevronDown size={14} />
      </div>
    </div>
  </div>
</div>
        {/* FILTERS */}
        <div className="filter-section">
          <div className="filter-row">
            <select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value })}
            >
              <option value="current-month"> Current Month</option>
              <option value="last-month"> Last Month</option>
              <option value="quarter"> This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom"> Custom Range</option>
            </select>

            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <option value="all"> All Departments</option>
              <option value="Engineering"> Engineering</option>
              <option value="Marketing">Marketing </option>
              <option value="Sales"> Sales</option>
              <option value="HR"> HR</option>
              <option value="Finance"> Finance</option>
              <option value="Operations"> Operations</option>
            </select>

            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              <option value="all"> All Locations</option>
              <option value="HQ"> Headquarters</option>
              <option value="Branch A"> Branch A</option>
              <option value="Branch B"> Branch B</option>
              <option value="Remote"> Remote</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all"> All Status</option>
              <option value="pending"> Pending</option>
              <option value="processed"> Processed</option>
              <option value="frozen"> Frozen</option>
              <option value="error"> Error</option>
            </select>
<div className="filter-actions" style={{
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginTop: '16px'
}}>
  <button 
    className="btn-primary" 
    onClick={handleApplyFilters}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 20px',
      height: '40px',
      minWidth: '140px',
      borderRadius: '6px',
      border: 'none',
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      color: 'white',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
    onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed, #6d28d9)'}
    onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}
  >
    <Filter size={18} style={{ verticalAlign: 'middle', margin: 0 }} />
    <span style={{ verticalAlign: 'middle' }}>Apply Filters</span>
  </button>
  
  <button 
    className="btn-secondary" 
    onClick={handleResetFilters}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 20px',
      height: '40px',
      minWidth: '100px',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      background: '#f8fafc',
      color: '#475569',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
  >
    <span style={{ verticalAlign: 'middle' }}>Reset</span>
  </button>
</div>
          </div>
        </div>

        {/* KPI */}
      <div className="kpi-section">
  <div className="kpi-grid">
    <div className="kpi-card">
      <div className="kpi-content">
        <div className="kpi-label">
          <RefreshCw size={14} />
          Real-time Sync
        </div>
        <div className="kpi-value">{integrationStatus.dataFreshness?.hoursAgo || 0.5}h</div>
        <div className="kpi-trend">
          <Clock size={12} />
          Last sync: Just now
        </div>
      </div>
      <div className="kpi-icon realtime">
        <RefreshCw size={24} />
      </div>
    </div>

    <div className="kpi-card">
      <div className="kpi-content">
        <div className="kpi-label">
          {freezeStatus.isFrozen ? <Lock size={14} /> : <Unlock size={14} />}
          Data Status
        </div>
        <div className="kpi-value">{freezeStatus.isFrozen ? 'Frozen' : 'Live'}</div>
        <div className="kpi-trend" style={{ color: freezeStatus.isFrozen ? '#ef4444' : '#10b981' }}>
          {freezeStatus.isFrozen ? <Lock size={12} /> : <Unlock size={12} />}
          {freezeStatus.isFrozen ? 'For payroll processing' : 'Ready for updates'}
        </div>
      </div>
      <div className="kpi-icon frozen">
        {freezeStatus.isFrozen ? <Lock size={24} /> : <Unlock size={24} />}
      </div>
    </div>

    <div className="kpi-card">
      <div className="kpi-content">
        <div className="kpi-label">
          <TrendingDown size={14} />
          Total Loss of Pay
        </div>
        <div className="kpi-value">₹{statistics.totalLossOfPay || 0}</div>
        <div className="kpi-trend negative">
          <AlertCircle size={12} />
          Affects {filteredData.filter(x => x.lossOfPay > 0).length} employees
        </div>
      </div>
      <div className="kpi-icon loss">
        <TrendingDown size={24} />
      </div>
    </div>

    <div className="kpi-card">
      <div className="kpi-content">
        <div className="kpi-label">
          <Zap size={14} />
          Overtime Pay
        </div>
        <div className="kpi-value">₹{statistics.totalOvertimePay || 0}</div>
        <div className="kpi-trend">
          <Clock size={12} />
          {statistics.avgOvertimeHours || 0}h avg per employee
        </div>
      </div>
      <div className="kpi-icon overtime">
        <Zap size={24} />
      </div>
    </div>

    <div className="kpi-card">
      <div className="kpi-content">
        <div className="kpi-label">
          <CalendarDays size={14} />
          Holiday Pay
        </div>
        <div className="kpi-value">₹{statistics.totalHolidayPay || 0}</div>
        <div className="kpi-trend">
          <CalendarDays size={12} />
          Double pay for holiday work
        </div>
      </div>
      <div className="kpi-icon holiday">
        <CalendarDays size={24} />
      </div>
    </div>

    <div className="kpi-card">
      <div className="kpi-content">
        <div className="kpi-label">
          <UserX size={14} />
          Leave Without Pay
        </div>
        <div className="kpi-value">
          {filteredData.reduce((sum, x) => sum + x.leaveWithoutPay, 0)} days
        </div>
        <div className="kpi-trend negative">
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>₹</span>
          ₹{statistics.leaveWithoutPayTotal?.toFixed(2) || 0} deduction
        </div>
      </div>
      <div className="kpi-icon leave">
        <UserX size={24} />
      </div>
    </div>

    <div className="kpi-card">
      <div className="kpi-content">
        <div className="kpi-label">
          <AlertCircle size={14} />
          Pending Corrections
        </div>
        <div className="kpi-value">{statistics.totalCorrections || 0}</div>
        <div className="kpi-trend warning">
          <Edit size={12} />
          Requires review
        </div>
      </div>
      <div className="kpi-icon corrections">
        <AlertCircle size={24} />
      </div>
    </div>

    <div className="kpi-card">
      <div className="kpi-content">
        <div className="kpi-label">
          <CheckCircle size={14} />
          Processed Payroll
        </div>
        <div className="kpi-value">
          ₹{(statistics.totalNetPay || 0).toLocaleString()}
        </div>
        <div className="kpi-trend">
          <Users size={12} />
          For {statistics.totalEmployees || 0} employees
        </div>
      </div>
      <div className="kpi-icon processed">
        <CheckCircle size={24} />
      </div>
    </div>
  </div>
</div>

        {/* TABS */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home size={18} />
            Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === "payroll-calculation" ? "active" : ""}`}
            onClick={() => setActiveTab("payroll-calculation")}
          >
            <Calculator size={18} />
            Payroll Calculation
          </button>
          <button
            className={`tab-btn ${activeTab === "integration" ? "active" : ""}`}
            onClick={() => setActiveTab("integration")}
          >
            <Database size={18} />
            Integration
          </button>
          <button
            className={`tab-btn ${activeTab === "corrections" ? "active" : ""}`}
            onClick={() => setActiveTab("corrections")}
          >
            <Edit size={18} />
            Corrections
          </button>
          <button
            className={`tab-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <FileText size={18} />
            Reports
          </button>
          <button
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} />
            Settings
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content">
          {renderTabContent()}
        </div>

        {/* MODALS */}
        {showCorrectionModal && renderCorrectionModal()}
        {showExportModal && renderExportModal()}
        {showSettingsModal && renderSettingsModal()}
        {showRuleEditModal && renderRuleEditModal()}

        {/* SELECTED RECORD MODAL */}
     {selectedRecord && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h6 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
          Payroll Details: {selectedRecord.employeeName}
        </h6>
        <button 
          onClick={() => setSelectedRecord(null)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '24px', 
            color: '#64748b',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            padding: 0
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} style={{ verticalAlign: 'middle' }} />
              <span style={{ verticalAlign: 'middle' }}>Employee ID</span>
            </div>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>{selectedRecord.employeeId}</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={14} style={{ verticalAlign: 'middle' }} />
              <span style={{ verticalAlign: 'middle' }}>Department</span>
            </div>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>{selectedRecord.department}</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} style={{ verticalAlign: 'middle' }} />
              <span style={{ verticalAlign: 'middle' }}>Present Days</span>
            </div>
            <div style={{ fontWeight: 700, color: '#16a34a' }}>{selectedRecord.totalPresent}</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={14} style={{ verticalAlign: 'middle' }} />
              <span style={{ verticalAlign: 'middle' }}>Absent Days</span>
            </div>
            <div style={{ fontWeight: 700, color: '#dc2626' }}>{selectedRecord.totalAbsent}</div>
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
          padding: '24px', 
          borderRadius: '14px', 
          marginBottom: '20px',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calculator size={20} style={{ verticalAlign: 'middle' }} />
            <span style={{ verticalAlign: 'middle' }}>Salary Breakdown</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Basic Salary</div>
              <div style={{ fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} color="#475569" style={{ verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle' }}>$${selectedRecord.basicSalary.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Loss of Pay</div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingDown size={16} style={{ verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle' }}>-$${selectedRecord.lossOfPay.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Overtime Pay</div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle' }}>+$${selectedRecord.overtimePay.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Holiday Pay</div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarDays size={16} style={{ verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle' }}>+$${selectedRecord.holidayPay.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>Net Pay</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={20} style={{ verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle' }}>$${selectedRecord.netPay.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button 
          className="btn-secondary" 
          onClick={() => setSelectedRecord(null)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 20px',
            height: '42px',
            minWidth: '100px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            color: '#475569',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Close
        </button>
        <button 
          className="btn-primary" 
          onClick={() => handleExportPayrollData('PDF')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 20px',
            height: '42px',
            minWidth: '160px',
            borderRadius: '6px',
            border: 'none',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed, #6d28d9)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}
        >
          <Download size={18} style={{ verticalAlign: 'middle', margin: 0 }} />
          <span style={{ verticalAlign: 'middle' }}>Export Details</span>
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
};

export default PayrollIntegration;