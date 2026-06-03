import React, { useState, useEffect, useMemo } from "react";

/* ===========================================================
   COMPLETE CSS STYLES
   =========================================================== */
const styles = `
.page {
  background: #f1f5f9;
  min-height: 100vh;
  padding-bottom: 40px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* HEADER */
.header-top {
  background: #ffffff;
  padding: 18px 22px;
  border-bottom: 1px solid #dbe4ee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.header-sub {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* SEARCH */
.search-box {
  padding: 10px 12px 10px 40px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  width: 280px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-box:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* FILTER PANEL */
.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #dbe4ee;
  margin: 18px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.filter-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-row select {
  padding: 10px 36px 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: white;
  font-size: 14px;
  min-width: 180px;
  cursor: pointer;
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.filter-row select:focus {
  outline: none;
  border-color: #3b82f6;
}

.filter-select-container {
  position: relative;
  min-width: 180px;
}

.filter-select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
  font-size: 16px;
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.btn-primary {
  padding: 10px 18px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 10px 18px;
  background: white;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn-secondary:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
  border-color: #e2e8f0;
}

/* KPI CARDS */
.kpi-section {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #dbe4ee;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.kpi-card {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 18px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.kpi-content {
  flex: 1;
}

.kpi-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 6px;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.kpi-trend {
  font-size: 12px;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.kpi-icon.present { background: #d1fae5; color: #10b981; }
.kpi-icon.absent { background: #fee2e2; color: #ef4444; }
.kpi-icon.late { background: #fef3c7; color: #f59e0b; }
.kpi-icon.overtime { background: #dbeafe; color: #3b82f6; }
.kpi-icon.punctuality { background: #dcfce7; color: #16a34a; }
.kpi-icon.consistency { background: #e0f2fe; color: #0ea5e9; }
.kpi-icon.alerts { background: #fef3c7; color: #d97706; }
.kpi-icon.leave { background: #f3e8ff; color: #8b5cf6; }

/* TABS */
.tabs {
  background: #fff;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  gap: 0;
  overflow-x: auto;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  padding: 16px 24px;
  border: none;
  background: none;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #475569;
  background: #f8fafc;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom: 3px solid #3b82f6;
  background: #f0f9ff;
}

/* CALENDAR PANEL */
.cal-wrap {
  background: #ffffff;
  border: 1px solid #dbe4f1;
  padding: 24px;
  border-radius: 14px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.cal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cal-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.cal-nav {
  display: flex;
  gap: 10px;
}

.cal-btn {
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.cal-btn:hover {
  background: #e2e8f0;
}

.week-row {
  display: grid;
  grid-template-columns: repeat(7,1fr);
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  color: #64748b;
  padding: 0 4px;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.cal-day,
.cal-empty {
  height: 90px;
  border-radius: 10px;
  padding: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  position: relative;
  transition: all 0.2s;
}

.cal-day:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cal-day.present { 
  background: #f0fdf4; 
  border-color: #86efac; 
}
.cal-day.absent  { 
  background: #fef2f2; 
  border-color: #fca5a5; 
}
.cal-day.leave   { 
  background: #fffbeb; 
  border-color: #fde68a; 
}
.cal-day.late    { 
  background: #fefce8; 
  border-color: #fde047; 
}

.cal-num {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.today-badge {
  background: #3b82f6;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.cal-dots {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.cal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.cal-dot.present { background: #22c55e; }
.cal-dot.absent  { background: #ef4444; }
.cal-dot.leave   { background: #f59e0b; }
.cal-dot.late    { background: #eab308; }

.legend {
  margin-top: 20px;
  display: flex;
  gap: 24px;
  font-size: 13px;
  flex-wrap: wrap;
}

.leg-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.leg-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.leg-dot.present { background: #22c55e; }
.leg-dot.absent { background: #ef4444; }
.leg-dot.leave { background: #f59e0b; }
.leg-dot.late { background: #eab308; }

/* TAB CONTENT */
.tab-content {
  background: #fff;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-top: 0;
  min-height: 400px;
}

/* DASHBOARD LAYOUT */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 20px;
}

.chart-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* REPORTS GRID */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.report-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
  cursor: pointer;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #93c5fd;
}

.report-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.report-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.report-icon.standard { background: #dbeafe; color: #3b82f6; }
.report-icon.exception { background: #fee2e2; color: #ef4444; }
.report-icon.analytics { background: #d1fae5; color: #10b981; }

.report-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.report-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
  line-height: 1.5;
}

.report-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #94a3b8;
}

.report-type {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.report-type.standard { background: #dbeafe; color: #1d4ed8; }
.report-type.exception { background: #fee2e2; color: #dc2626; }
.report-type.analytics { background: #d1fae5; color: #047857; }

/* ANALYTICS CARDS */
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.metric-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.metric-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.metric-trend {
  font-size: 13px;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* TABLE STYLES */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.data-table th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.data-table tr:hover {
  background: #f8fafc;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.status-present { background: #d1fae5; color: #065f46; }
.status-absent { background: #fee2e2; color: #991b1b; }
.status-late { background: #fef3c7; color: #92400e; }
.status-leave { background: #e0f2fe; color: #075985; }
.status-overtime { background: #e0f2fe; color: #075985; }

/* ALERTS */
.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.alert-card {
  border-radius: 12px;
  padding: 18px;
  border: 1px solid;
  background: white;
}

.alert-high { border-color: #fca5a5; background: #fef2f2; }
.alert-medium { border-color: #fcd34d; background: #fffbeb; }
.alert-low { border-color: #93c5fd; background: #eff6ff; }

.alert-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.alert-title {
  font-weight: 600;
  font-size: 14px;
}

.alert-high .alert-title { color: #dc2626; }
.alert-medium .alert-title { color: #d97706; }
.alert-low .alert-title { color: #2563eb; }

/* ACTION BUTTONS */
.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-icon {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Custom Role Dropdown */
.custom-role-dropdown {
  position: relative;
  min-width: 180px;
}

.custom-role-dropdown-btn {
  padding: 10px 36px 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: white;
  font-size: 14px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.custom-role-dropdown-btn:hover {
  border-color: #94a3b8;
}

.custom-role-dropdown-btn:focus {
  outline: none;
  border-color: #3b82f6;
}

.custom-role-dropdown-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
  font-size: 16px;
}

.custom-role-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  margin-top: 4px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
}

.custom-role-dropdown-item {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: white;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s;
}

.custom-role-dropdown-item:last-child {
  border-bottom: none;
}

.custom-role-dropdown-item:hover {
  background-color: #f8fafc;
  color: #3b82f6;
}

.custom-role-dropdown-item.selected {
  background-color: #f0f9ff;
  color: #3b82f6;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .reports-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
  }
  
  .filter-row {
    flex-direction: column;
  }
  
  .kpi-grid,
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    padding: 12px 16px;
    font-size: 13px;
  }
  
  .custom-role-dropdown {
    min-width: 100%;
  }
}

/* GENERATE REPORTS MODAL */
.generate-reports-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.generate-reports-content {
  background: white;
  border-radius: 16px;
  padding: 28px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.report-checkbox-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.report-checkbox-item:hover {
  background-color: #f8fafc;
  border-color: #93c5fd;
  transform: translateY(-2px);
}

.report-checkbox-item.selected {
  background-color: #f0f9ff;
  border-color: #3b82f6;
}

.report-checkbox-item input[type="checkbox"] {
  margin-top: 4px;
  margin-right: 12px;
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.report-checkbox-info {
  flex: 1;
}

.report-checkbox-info h4 {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.report-checkbox-info p {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

.report-checkbox-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #94a3b8;
}

.report-batch-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 10px;
  margin: 20px 0;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* REPORT GENERATION MODAL */
.report-generation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.report-generation-content {
  background: white;
  border-radius: 16px;
  padding: 28px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Print specific styles */
@media print {
  .page {
    background: white !important;
    padding: 0 !important;
  }
  
  .header-top,
  .filter-section,
  .kpi-section,
  .tabs,
  .btn-secondary,
  .btn-primary,
  .report-card .btn-icon,
  .action-buttons {
    display: none !important;
  }
  
  .tab-content {
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
  
  .reports-grid {
    grid-template-columns: repeat(1, 1fr) !important;
    gap: 10px !important;
  }
  
  .report-card {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1px solid #ddd !important;
    box-shadow: none !important;
  }
  
  .report-card:hover {
    transform: none !important;
  }
}

/* EXPORT MODAL STYLES */
.export-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.export-modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  animation: modalSlideIn 0.3s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.export-options {
  margin: 20px 0;
}

.export-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.export-option:hover {
  background: #f8fafc;
  border-color: #93c5fd;
}

.export-option.selected {
  background: #f0f9ff;
  border-color: #3b82f6;
}

.export-option-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 20px;
}

.export-option-icon.pdf {
  background: #fee2e2;
  color: #dc2626;
}

.export-option-icon.excel {
  background: #d1fae5;
  color: #059669;
}

.export-option-icon.csv {
  background: #dbeafe;
  color: #2563eb;
}

.export-option-info {
  flex: 1;
}

.export-option-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: #1e293b;
}

.export-option-desc {
  font-size: 12px;
  color: #64748b;
}

.export-progress {
  margin: 20px 0;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.export-progress-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.export-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* PATTERN MODAL STYLES */
.pattern-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.pattern-modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: auto;
  animation: modalSlideIn 0.3s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.pattern-analysis {
  margin: 20px 0;
}

.pattern-day {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.pattern-day:last-child {
  border-bottom: none;
}

.pattern-visualization {
  margin: 20px 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 10px;
}

.pattern-timeline {
  display: flex;
  height: 60px;
  align-items: center;
  margin: 20px 0;
  position: relative;
}

.timeline-item {
  flex: 1;
  text-align: center;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.timeline-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 auto 8px;
}

.timeline-marker.absent {
  background: #ef4444;
  box-shadow: 0 0 0 3px #fecaca;
}

.timeline-marker.late {
  background: #f59e0b;
  box-shadow: 0 0 0 3px #fef3c7;
}

.timeline-marker.present {
  background: #10b981;
  box-shadow: 0 0 0 3px #d1fae5;
}

/* ALERT ACKNOWLEDGE TOAST */
.alert-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 8px;
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

/* Bootstrap Icons Fix */
.bi {
  display: inline-block;
  vertical-align: -0.125em;
}
`;

/* ===========================================================
   CUSTOM ROLE DROPDOWN COMPONENT
   =========================================================== */
const CustomRoleDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const roleOptions = [
    { value: "employee", label: "Employee", icon: "bi-person" },
    { value: "manager", label: "Manager", icon: "bi-person-badge" },
    { value: "hr", label: "HR Admin", icon: "bi-building" },
    { value: "admin", label: "System Admin", icon: "bi-gear" }
  ];

  const selectedOption = roleOptions.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.custom-role-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="custom-role-dropdown">
      <button 
        className="custom-role-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <i className={`bi ${selectedOption?.icon}`}></i>
        <span>{selectedOption?.label}</span>
      </button>
      <i className="bi bi-chevron-down custom-role-dropdown-arrow"></i>
      
      {isOpen && (
        <div className="custom-role-dropdown-menu">
          {roleOptions.map(option => (
            <div
              key={option.value}
              className={`custom-role-dropdown-item ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <i className={`bi ${option.icon}`}></i>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===========================================================
   CALENDAR COMPONENT
   =========================================================== */
const AttendanceCalendar = ({ attendanceData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const format = (d) => d.toISOString().split("T")[0];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    let daysArray = [];
    
    // Empty days for previous month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dayDate = new Date(year, month, d);
      const dayStr = format(dayDate);
      const records = attendanceData.filter(x => x.date === dayStr);

      let statuses = [];
      if (records.length > 0) {
        records.forEach(record => {
          statuses.push(record.status);
          if (record.late > 0) statuses.push('late');
        });
      }

      daysArray.push({
        day: d,
        dateStr: dayStr,
        statuses: statuses.length > 0 ? [...new Set(statuses)] : ['none'],
        records: records
      });
    }

    return daysArray;
  }, [attendanceData, year, month]);

  const getDayClass = (statuses) => {
    if (statuses.includes('absent')) return 'absent';
    if (statuses.includes('leave')) return 'leave';
    if (statuses.includes('late')) return 'late';
    if (statuses.includes('present')) return 'present';
    return '';
  };

  return (
    <div className="cal-wrap">
      <div className="cal-header">
        <div className="cal-title">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </div>
        <div className="cal-nav">
          <button className="cal-btn" onClick={prevMonth}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="cal-btn" onClick={goToday}>
            Today
          </button>
          <button className="cal-btn" onClick={nextMonth}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="week-row">
        <div>Sun</div><div>Mon</div><div>Tue</div>
        <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      <div className="cal-grid">
        {days.map((day, index) =>
          day === null ? (
            <div key={index} className="cal-empty" />
          ) : (
            <div key={index} className={`cal-day ${getDayClass(day.statuses)}`}>
              <div className="cal-num">
                {day.day}
                {day.dateStr === format(new Date()) && (
                  <span className="today-badge">Today</span>
                )}
              </div>
              <div className="cal-dots">
                {day.statuses.map((status, idx) => (
                  <div key={idx} className={`cal-dot ${status}`} />
                ))}
              </div>
              {day.records.length > 0 && (
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                  {day.records.length} records
                </div>
              )}
            </div>
          )
        )}
      </div>

      <div className="legend">
        <div className="leg-item">
          <div className="leg-dot present"></div>
          <span>Present</span>
        </div>
        <div className="leg-item">
          <div className="leg-dot absent"></div>
          <span>Absent</span>
        </div>
        <div className="leg-item">
          <div className="leg-dot leave"></div>
          <span>Leave</span>
        </div>
        <div className="leg-item">
          <div className="leg-dot late"></div>
          <span>Late</span>
        </div>
      </div>
    </div>
  );
};

/* ===========================================================
   MAIN COMPONENT
   =========================================================== */
const AttendanceReports = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("manager");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showGenerateReports, setShowGenerateReports] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  
  // NEW STATE VARIABLES FOR EXPORT MODAL
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExportingExceptions, setIsExportingExceptions] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  // NEW STATE VARIABLES FOR ALERTS FUNCTIONALITY
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [selectedPatternAlert, setSelectedPatternAlert] = useState(null);
  const [showAcknowledgeToast, setShowAcknowledgeToast] = useState(false);
  const [acknowledgedAlert, setAcknowledgedAlert] = useState(null);
  const [alerts, setAlerts] = useState([]);
  
  // Pattern analysis data
  const [patternAnalysis, setPatternAnalysis] = useState({
    days: [],
    trend: '',
    recommendation: ''
  });

  const [filters, setFilters] = useState({
    date: "month",
    department: "all",
    location: "all",
    employee: "all",
  });

  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [reports, setReports] = useState([]);
  const [reportCategory, setReportCategory] = useState('all');
  const [exceptionType, setExceptionType] = useState('all');

  /* -----------------------
     MOCK DATA GENERATION
     ----------------------- */
  useEffect(() => {
    // Generate employees
    const emps = [
      { id: "EMP001", name: "John Smith", department: "Engineering", location: "HQ" },
      { id: "EMP002", name: "Sarah Johnson", department: "Marketing", location: "HQ" },
      { id: "EMP003", name: "Robert Chen", department: "Sales", location: "Branch A" },
      { id: "EMP004", name: "Maria Garcia", department: "HR", location: "HQ" },
      { id: "EMP005", name: "David Kim", department: "Engineering", location: "Remote" },
      { id: "EMP006", name: "Lisa Wang", department: "Finance", location: "HQ" },
      { id: "EMP007", name: "Tom Brown", department: "Operations", location: "Branch B" },
      { id: "EMP008", name: "Emma Davis", department: "Marketing", location: "Remote" }
    ];
    setEmployees(emps);

    // Generate attendance data
    const attendance = [];
    const today = new Date();

    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      emps.forEach(emp => {
        const rand = Math.random();
        let status = "present";
        let late = 0;
        let overtime = 0;

        if (rand < 0.05) status = "absent";
        else if (rand < 0.1) status = "leave";
        else if (rand < 0.25) {
          status = "present";
          late = Math.floor(Math.random() * 30);
        }

        if (status === "present" && rand < 0.3) {
          overtime = Math.floor(Math.random() * 4);
        }

        attendance.push({
          id: `${emp.id}_${dateStr}`,
          date: dateStr,
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          location: emp.location,
          status,
          late,
          overtime,
          inTime: status === 'present' ? `09:${Math.floor(Math.random() * 15)}` : null,
          outTime: status === 'present' ? `18:${Math.floor(Math.random() * 45)}` : null
        });
      });
    }
    setAttendanceData(attendance);

    // Generate analytics data
    const analytics = {
      trends: {
        daily: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
          present: Math.floor(Math.random() * 10) + 85,
          absent: Math.floor(Math.random() * 5) + 2,
          late: Math.floor(Math.random() * 8) + 1,
          overtime: Math.floor(Math.random() * 15) + 5
        })),
        department: [
          { name: 'Engineering', present: 96, absent: 2, late: 2, overtime: 45 },
          { name: 'Marketing', present: 94, absent: 3, late: 3, overtime: 32 },
          { name: 'Sales', present: 88, absent: 8, late: 4, overtime: 28 },
          { name: 'HR', present: 98, absent: 1, late: 1, overtime: 12 },
          { name: 'Finance', present: 95, absent: 3, late: 2, overtime: 18 },
          { name: 'Operations', present: 90, absent: 6, late: 4, overtime: 22 }
        ],
        location: [
          { name: 'HQ', present: 94, absent: 3, late: 3, overtime: 85 },
          { name: 'Branch A', present: 92, absent: 5, late: 3, overtime: 38 },
          { name: 'Branch B', present: 89, absent: 7, late: 4, overtime: 25 },
          { name: 'Remote', present: 91, absent: 5, late: 4, overtime: 8 }
        ]
      },
      metrics: {
        absenteeismRate: 4.2,
        punctualityScore: 88.7,
        leaveUtilization: 65.3,
        overtimeRate: 18.5,
        attendanceConsistency: 91.2,
        peakAbsenceDays: ['Monday', 'Friday'],
        peakAbsencePeriods: ['January', 'December'],
        anomalyThreshold: 3,
        predictiveAlerts: 12
      }
    };
    setAnalyticsData(analytics);

    // Generate reports
    const reportList = [
      {
        id: 1,
        name: 'Daily Attendance Summary',
        type: 'standard',
        frequency: 'daily',
        description: 'Daily attendance summary with present/absent/late counts for all employees',
        lastGenerated: '2024-01-20',
        columns: ['Employee', 'Department', 'In Time', 'Out Time', 'Status', 'Overtime']
      },
      {
        id: 2,
        name: 'Monthly Attendance Register',
        type: 'standard',
        frequency: 'monthly',
        description: 'Complete monthly attendance register for payroll processing',
        lastGenerated: '2024-01-01',
        columns: ['Date', 'Employee', 'Shift', 'Hours', 'Status', 'Remarks']
      },
      {
        id: 3,
        name: 'Absent/Late Employee Report',
        type: 'exception',
        frequency: 'weekly',
        description: 'List of employees with frequent absences or late arrivals',
        lastGenerated: '2024-01-15',
        columns: ['Employee', 'Department', 'Absent Days', 'Late Count', 'Action Required']
      },
      {
        id: 4,
        name: 'Overtime Analysis Report',
        type: 'analytics',
        frequency: 'monthly',
        description: 'Overtime trends and department-wise analysis with cost impact',
        lastGenerated: '2024-01-10',
        columns: ['Department', 'Total Overtime', 'Avg Overtime', 'Cost Impact', 'Trend']
      },
      {
        id: 11,
        name: 'Overtime Summary Report',
        type: 'standard',
        frequency: 'weekly',
        description: 'Weekly overtime summary with employee details and approval status',
        lastGenerated: '2024-01-19',
        columns: ['Employee', 'Department', 'Date', 'Overtime Hours', 'Approval Status', 'Cost']
      },
      {
        id: 12,
        name: 'Overtime Cost Analysis',
        type: 'analytics',
        frequency: 'monthly',
        description: 'Detailed overtime cost analysis by department and employee level',
        lastGenerated: '2024-01-15',
        columns: ['Department', 'Total Hours', 'Total Cost', 'Avg Cost/Employee', 'Budget Impact']
      },
      {
        id: 5,
        name: 'Leave Utilization Report',
        type: 'analytics',
        frequency: 'monthly',
        description: 'Leave type utilization and balance analysis with forecasting',
        lastGenerated: '2024-01-05',
        columns: ['Leave Type', 'Allocated', 'Used', 'Balance', 'Utilization %']
      },
      {
        id: 6,
        name: 'Department-wise Statistics',
        type: 'analytics',
        frequency: 'weekly',
        description: 'Department-level attendance metrics and comparisons',
        lastGenerated: '2024-01-18',
        columns: ['Department', 'Present %', 'Absent %', 'Late %', 'Overtime Hours']
      },
      {
        id: 7,
        name: 'Attendance Exception Report',
        type: 'exception',
        frequency: 'daily',
        description: 'All attendance exceptions and violations with approval status',
        lastGenerated: '2024-01-19',
        columns: ['Employee', 'Exception Type', 'Date', 'Duration', 'Approval Status']
      },
      {
        id: 8,
        name: 'Muster Roll Report',
        type: 'standard',
        frequency: 'monthly',
        description: 'Official muster roll for statutory compliance and payroll',
        lastGenerated: '2023-12-31',
        columns: ['Employee', 'Days Worked', 'Leave Days', 'Holidays', 'Net Payable Days']
      },
      {
        id: 9,
        name: 'Employee-wise Attendance Summary',
        type: 'standard',
        frequency: 'monthly',
        description: 'Individual employee attendance summary with trends',
        lastGenerated: '2024-01-15',
        columns: ['Employee', 'Present Days', 'Absent Days', 'Late Days', 'Overtime Hours']
      },
      {
        id: 10,
        name: 'Location-wise Attendance Trends',
        type: 'analytics',
        frequency: 'weekly',
        description: 'Attendance patterns and trends across different locations',
        lastGenerated: '2024-01-17',
        columns: ['Location', 'Present %', 'Absent %', 'Late %', 'Peak Hours']
      }
    ];
    setReports(reportList);

    // Generate alerts
    const alertList = [
      { 
        id: 1, 
        type: 'anomaly', 
        employee: 'Robert Chen', 
        message: '3 consecutive late arrivals this week', 
        severity: 'medium', 
        date: '2024-01-19',
        acknowledged: false,
        patternData: {
          days: ['2024-01-15', '2024-01-16', '2024-01-17'],
          times: ['09:25', '09:32', '09:28'],
          pattern: 'Monday-Wednesday consecutive lateness'
        }
      },
      { 
        id: 2, 
        type: 'pattern', 
        employee: 'Sarah Johnson', 
        message: 'High absenteeism on Mondays (4 out of last 6)', 
        severity: 'high', 
        date: '2024-01-18',
        acknowledged: false,
        patternData: {
          days: ['2024-01-01', '2024-01-08', '2024-01-15', '2024-01-22'],
          times: [],
          pattern: 'Monday absence pattern'
        }
      },
      { 
        id: 3, 
        type: 'threshold', 
        department: 'Sales', 
        message: 'Department absenteeism rate > 8% this month', 
        severity: 'high', 
        date: '2024-01-17',
        acknowledged: false,
        patternData: {
          days: [],
          times: [],
          pattern: 'Department-wide trend'
        }
      },
      { 
        id: 4, 
        type: 'predictive', 
        employee: 'David Kim', 
        message: 'Likely absence pattern detected for next week', 
        severity: 'low', 
        date: '2024-01-16',
        acknowledged: false,
        patternData: {
          days: ['2024-01-23', '2024-01-24'],
          times: [],
          pattern: 'Predicted Thursday-Friday absence'
        }
      },
      { 
        id: 5, 
        type: 'overtime', 
        employee: 'John Smith', 
        message: 'Excessive overtime detected (45 hours this month)', 
        severity: 'medium', 
        date: '2024-01-15',
        acknowledged: false,
        patternData: {
          days: ['2024-01-10', '2024-01-11', '2024-01-12', '2024-01-17', '2024-01-18'],
          times: ['20:30', '21:15', '19:45', '20:00', '21:30'],
          pattern: 'Weekend and evening overtime pattern'
        }
      }
    ];
    setAlerts(alertList);
  }, []);

  /* -----------------------
     CALCULATE STATISTICS with DATE FILTERING
     ----------------------- */
  const filteredData = useMemo(() => {
    let data = [...attendanceData];
    
    // Apply date filter
    const today = new Date();
    let filteredByDate = [...data];
    
    if (filters.date === "today") {
      const todayStr = today.toISOString().split("T")[0];
      filteredByDate = data.filter(item => item.date === todayStr);
    } else if (filters.date === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split("T")[0];
      filteredByDate = data.filter(item => item.date >= weekAgoStr);
    } else if (filters.date === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      const monthAgoStr = monthAgo.toISOString().split("T")[0];
      filteredByDate = data.filter(item => item.date >= monthAgoStr);
    } else if (filters.date === "quarter") {
      const quarterAgo = new Date();
      quarterAgo.setMonth(today.getMonth() - 3);
      const quarterAgoStr = quarterAgo.toISOString().split("T")[0];
      filteredByDate = data.filter(item => item.date >= quarterAgoStr);
    } else if (filters.date === "year") {
      const yearAgo = new Date();
      yearAgo.setFullYear(today.getFullYear() - 1);
      const yearAgoStr = yearAgo.toISOString().split("T")[0];
      filteredByDate = data.filter(item => item.date >= yearAgoStr);
    }
    
    // Apply other filters
    if (filters.department !== "all") {
      filteredByDate = filteredByDate.filter(item => item.department === filters.department);
    }
    
    if (filters.location !== "all") {
      filteredByDate = filteredByDate.filter(item => item.location === filters.location);
    }
    
    if (filters.employee !== "all") {
      filteredByDate = filteredByDate.filter(item => item.employeeId === filters.employee);
    }
    
    if (search) {
      const query = search.toLowerCase();
      filteredByDate = filteredByDate.filter(item =>
        item.employeeName.toLowerCase().includes(query) ||
        item.employeeId.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
      );
    }
    
    return filteredByDate;
  }, [attendanceData, filters, search]);

  const statistics = useMemo(() => {
    if (filteredData.length === 0) return {};
    
    const totalRecords = filteredData.length;
    const presentCount = filteredData.filter(x => x.status === "present").length;
    const absentCount = filteredData.filter(x => x.status === "absent").length;
    const leaveCount = filteredData.filter(x => x.status === "leave").length;
    const lateCount = filteredData.filter(x => x.late > 0).length;
    const totalOvertime = filteredData.reduce((sum, x) => sum + x.overtime, 0);
    const avgOvertime = totalOvertime / presentCount || 0;
    
    return {
      totalRecords,
      presentCount,
      absentCount,
      leaveCount,
      lateCount,
      presentRate: ((presentCount / totalRecords) * 100).toFixed(1),
      absentRate: ((absentCount / totalRecords) * 100).toFixed(1),
      lateRate: ((lateCount / totalRecords) * 100).toFixed(1),
      leaveRate: ((leaveCount / totalRecords) * 100).toFixed(1),
      totalOvertime,
      avgOvertime: avgOvertime.toFixed(1)
    };
  }, [filteredData]);

  /* -----------------------
     ALERT FUNCTIONALITIES
     ----------------------- */
  const handleAcknowledgeAlert = (alertId) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
    
    const acknowledged = alerts.find(a => a.id === alertId);
    setAcknowledgedAlert(acknowledged);
    setShowAcknowledgeToast(true);
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowAcknowledgeToast(false);
      setAcknowledgedAlert(null);
    }, 3000);
  };

  const handleViewPattern = (alert) => {
    setSelectedPatternAlert(alert);
    
    // Generate pattern analysis data
    const analysis = {
      days: alert.patternData.days.map((day, index) => ({
        date: day,
        status: alert.type === 'anomaly' ? 'Late' : 
                alert.type === 'pattern' ? 'Absent' : 
                alert.type === 'overtime' ? 'Overtime' : 'Alert',
        time: alert.patternData.times[index] || 'N/A',
        details: alert.type === 'anomaly' ? `Late by ${Math.floor(Math.random() * 15) + 15} minutes` :
                alert.type === 'pattern' ? 'Full day absence' :
                alert.type === 'overtime' ? `${Math.floor(Math.random() * 3) + 2} hours overtime` : 'Pattern detected'
      })),
      trend: alert.patternData.pattern,
      recommendation: alert.type === 'anomaly' ? 'Consider flexible start time for this employee' :
                     alert.type === 'pattern' ? 'Schedule check-in meeting on affected days' :
                     alert.type === 'overtime' ? 'Review workload and consider redistribution' :
                     'Monitor pattern and take preventive action'
    };
    
    setPatternAnalysis(analysis);
    setShowPatternModal(true);
  };

  const PatternModal = () => {
    if (!showPatternModal || !selectedPatternAlert) return null;

    return (
      <div className="pattern-modal-overlay">
        <div className="pattern-modal-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h7 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>
                Pattern Analysis: {selectedPatternAlert.employee || selectedPatternAlert.department}
              </h7>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                {selectedPatternAlert.message}
              </div>
            </div>
            <button 
              onClick={() => setShowPatternModal(false)}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: '#64748b',
                padding: '8px',
                borderRadius: '8px',
                fontSize: '20px',
                lineHeight: '1'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ 
            padding: '16px', 
            backgroundColor: selectedPatternAlert.severity === 'high' ? '#fef2f2' : 
                           selectedPatternAlert.severity === 'medium' ? '#fffbeb' : '#eff6ff',
            borderRadius: '8px',
            marginBottom: '20px',
            border: `1px solid ${selectedPatternAlert.severity === 'high' ? '#fca5a5' : 
                     selectedPatternAlert.severity === 'medium' ? '#fcd34d' : '#93c5fd'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="bi bi-exclamation-circle" style={{ 
                color: selectedPatternAlert.severity === 'high' ? '#dc2626' : 
                       selectedPatternAlert.severity === 'medium' ? '#d97706' : '#2563eb',
                fontSize: '24px'
              }}></i>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px', 
                  color: selectedPatternAlert.severity === 'high' ? '#dc2626' : 
                         selectedPatternAlert.severity === 'medium' ? '#d97706' : '#2563eb' }}>
                  {selectedPatternAlert.severity.toUpperCase()} PRIORITY
                </div>
                <div style={{ fontSize: '14px', color: '#475569' }}>
                  Detected on: {selectedPatternAlert.date}
                </div>
              </div>
            </div>
          </div>

          <div className="pattern-analysis">
            <h7 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#1e293b' }}>
              Pattern Details
            </h7>
            <div style={{ 
              backgroundColor: '#f8fafc', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                <strong>Pattern Type:</strong> {patternAnalysis.trend}
              </div>
              <div style={{ fontSize: '14px' }}>
                <strong>Recommendation:</strong> {patternAnalysis.recommendation}
              </div>
            </div>

            <div className="pattern-visualization">
              <h7 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#1e293b' }}>
                Timeline Visualization
              </h7>
              <div className="pattern-timeline">
                {patternAnalysis.days.map((day, index) => (
                  <div key={index} className="timeline-item">
                    <div className={`timeline-marker ${
                      selectedPatternAlert.type === 'anomaly' ? 'late' :
                      selectedPatternAlert.type === 'pattern' ? 'absent' : 'present'
                    }`}></div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      {day.date.split('-')[2]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h7 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#1e293b' }}>
                Detailed Occurrences
              </h7>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Time</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {patternAnalysis.days.map((day, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>{day.date}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          backgroundColor: day.status === 'Late' ? '#fef3c7' : 
                                         day.status === 'Absent' ? '#fee2e2' : '#dbeafe',
                          color: day.status === 'Late' ? '#92400e' : 
                                 day.status === 'Absent' ? '#991b1b' : '#1e40af',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {day.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{day.time}</td>
                      <td style={{ padding: '12px' }}>{day.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button 
              className="btn-secondary"
              onClick={() => setShowPatternModal(false)}
            >
              Close
            </button>
            <button 
              className="btn-primary"
              onClick={() => {
                handleAcknowledgeAlert(selectedPatternAlert.id);
                setShowPatternModal(false);
              }}
            >
              <i className="bi bi-check-circle"></i>
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AcknowledgeToast = () => {
    if (!showAcknowledgeToast || !acknowledgedAlert) return null;

    return (
      <div className="alert-toast">
        <i className="bi bi-check-circle-fill" style={{ fontSize: '20px' }}></i>
        <div>
          <div style={{ fontWeight: 600 }}>Alert Acknowledged</div>
          <div style={{ fontSize: '13px' }}>
            {acknowledgedAlert.employee || acknowledgedAlert.department} - {acknowledgedAlert.type}
          </div>
        </div>
      </div>
    );
  };

  /* -----------------------
     EXPORT EXCEPTIONS FUNCTION
     ----------------------- */
  const getExceptionType = (item) => {
    if (item.status === 'absent') return 'Absent Without Leave';
    if (item.late > 15) return 'Late Arrival';
    if (item.overtime > 8) return 'Excessive Overtime';
    return 'Unknown';
  };

  const getExceptionDetails = (item) => {
    if (item.status === 'absent') return 'Full day absence';
    if (item.late > 15) return `Late by ${item.late} minutes`;
    if (item.overtime > 8) return `Overtime: ${item.overtime} hours`;
    return '';
  };

  const getExceptionDuration = (item) => {
    if (item.status === 'absent') return 'Full Day';
    if (item.late > 15) return `${item.late} minutes`;
    if (item.overtime > 8) return `${item.overtime} hours`;
    return '';
  };

  const getExceptionStatus = (item) => {
    if (item.status === 'absent') return 'Pending Review';
    if (item.late > 15) return 'In Review';
    if (item.overtime > 8) return 'Requires Approval';
    return '';
  };

  const generatePDFContent = (data) => {
    const today = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Attendance Exceptions Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              margin: 0;
              padding: 40px;
              color: #1e293b;
              background: white;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #dc2626;
            }
            
            .header h1 {
              color: #dc2626;
              font-size: 32px;
              margin: 0 0 10px 0;
              font-weight: 700;
            }
            
            .header .subtitle {
              color: #64748b;
              font-size: 16px;
              margin-bottom: 15px;
            }
            
            .metadata {
              display: flex;
              justify-content: space-between;
              background: #f8fafc;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 30px;
              border: 1px solid #e2e8f0;
              font-size: 14px;
            }
            
            .metadata-item {
              flex: 1;
            }
            
            .metadata-label {
              color: #64748b;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
              font-weight: 600;
            }
            
            .metadata-value {
              color: #1e293b;
              font-weight: 600;
              font-size: 15px;
            }
            
            .summary-cards {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            
            .summary-card {
              padding: 20px;
              border-radius: 10px;
              text-align: center;
            }
            
            .summary-card.total {
              background: #fee2e2;
              border: 2px solid #fca5a5;
            }
            
            .summary-card.late {
              background: #fef3c7;
              border: 2px solid #fde68a;
            }
            
            .summary-card.absent {
              background: #fee2e2;
              border: 2px solid #fca5a5;
            }
            
            .summary-card.overtime {
              background: #dbeafe;
              border: 2px solid #93c5fd;
            }
            
            .summary-count {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            
            .summary-label {
              font-size: 13px;
              color: #475569;
              font-weight: 600;
            }
            
            .total .summary-count { color: #7f1d1d; }
            .late .summary-count { color: #78350f; }
            .absent .summary-count { color: #7f1d1d; }
            .overtime .summary-count { color: #1e3a8a; }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 13px;
            }
            
            th {
              background: #f1f5f9;
              padding: 16px 12px;
              text-align: left;
              font-weight: 600;
              color: #475569;
              border-bottom: 2px solid #e2e8f0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              font-size: 11px;
            }
            
            td {
              padding: 14px 12px;
              border-bottom: 1px solid #f1f5f9;
              vertical-align: top;
            }
            
            tr:hover {
              background: #f8fafc;
            }
            
            .status-badge {
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 600;
              display: inline-block;
            }
            
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-review { background: #dbeafe; color: #1e40af; }
            .status-approval { background: #e0f2fe; color: #075985; }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #94a3b8;
              font-size: 12px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
            
            .page-break {
              page-break-before: always;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              
              .summary-cards {
                grid-template-columns: repeat(2, 1fr);
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ATTENDANCE EXCEPTIONS REPORT</h1>
            <div class="subtitle">Human Resources Management System</div>
            <div style="color: #64748b; font-size: 14px;">
              Generated on ${today} at ${time}
            </div>
          </div>
          
          <div class="metadata">
            <div class="metadata-item">
              <div class="metadata-label">Report Period</div>
              <div class="metadata-value">${filters.date === 'all' ? 'All Time' : filters.date.charAt(0).toUpperCase() + filters.date.slice(1)}</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Exception Type</div>
              <div class="metadata-value">${exceptionType === 'all' ? 'All Types' : exceptionType.charAt(0).toUpperCase() + exceptionType.slice(1)}</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Total Records</div>
              <div class="metadata-value">${data.length} exceptions</div>
            </div>
            <div class="metadata-item">
              <div class="metadata-label">Generated By</div>
              <div class="metadata-value">${role === 'manager' ? 'Manager' : role === 'hr' ? 'HR Admin' : role === 'admin' ? 'System Admin' : 'Employee'}</div>
            </div>
          </div>
          
          <div class="summary-cards">
            <div class="summary-card total">
              <div class="summary-count">${data.length}</div>
              <div class="summary-label">Total Exceptions</div>
            </div>
            <div class="summary-card late">
              <div class="summary-count">${data.filter(r => r.late > 15).length}</div>
              <div class="summary-label">Late Arrivals</div>
            </div>
            <div class="summary-card absent">
              <div class="summary-count">${data.filter(r => r.status === 'absent').length}</div>
              <div class="summary-label">Absent Records</div>
            </div>
            <div class="summary-card overtime">
              <div class="summary-count">${data.filter(r => r.overtime > 8).length}</div>
              <div class="summary-label">Overtime Violations</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th width="5%">#</th>
                <th width="15%">Employee</th>
                <th width="10%">Department</th>
                <th width="10%">Exception Type</th>
                <th width="15%">Date & Time</th>
                <th width="10%">Duration</th>
                <th width="15%">Details</th>
                <th width="10%">Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                    <div style="font-weight: 600; color: #1e293b;">${item.employeeName}</div>
                    <div style="font-size: 11px; color: #64748b;">${item.employeeId}</div>
                  </td>
                  <td>
                    <span style="
                      padding: 4px 8px;
                      background: #dbeafe;
                      color: #1d4ed8;
                      border-radius: 4px;
                      font-size: 11px;
                      font-weight: 600;
                      display: inline-block;
                    ">
                      ${item.department}
                    </span>
                  </td>
                  <td style="font-weight: 500; color: ${
                    item.status === 'absent' ? '#dc2626' : 
                    item.late > 15 ? '#d97706' : 
                    '#1e40af'
                  };">
                    ${getExceptionType(item)}
                  </td>
                  <td>
                    <div>${item.date}</div>
                    <div style="font-size: 11px; color: #64748b;">
                      ${item.inTime || '--'} - ${item.outTime || '--'}
                    </div>
                  </td>
                  <td style="font-weight: 500;">
                    ${getExceptionDuration(item)}
                  </td>
                  <td style="font-size: 12px; color: #475569;">
                    ${getExceptionDetails(item)}
                  </td>
                  <td>
                    <span class="status-badge ${
                      item.status === 'absent' ? 'status-pending' : 
                      item.late > 15 ? 'status-review' : 
                      'status-approval'
                    }">
                      ${getExceptionStatus(item)}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} HRMS - Attendance Management System</p>
            <p>This document contains confidential information. Unauthorized distribution is prohibited.</p>
            <p>Page 1 of 1 • Report ID: EXC-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}</p>
          </div>
        </body>
      </html>
    `;
  };

  /* -----------------------
     HANDLE SINGLE REPORT CLICK
     ----------------------- */
  const handleReportClick = (report) => {
    setSelectedReport(report);
    alert(`Selected: ${report.name}\n\nDescription: ${report.description}\n\nClick the download button to export this report.`);
  };

  /* -----------------------
     EXPORT SINGLE REPORT
     ----------------------- */
  const handleExportSingleReport = (report) => {
    setIsGeneratingSingle(true);
    setSelectedReport(report);
    setGenerationProgress(0);

    // Simulate report generation progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Create and download the report file
          const reportContent = generateSingleReportContent(report);
          const blob = new Blob([reportContent], { type: 'application/pdf' });
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${report.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);

          // Show success message
          setTimeout(() => {
            alert(`✅ Report "${report.name}" has been downloaded!\n\nFile: ${link.download}`);
            setIsGeneratingSingle(false);
          }, 500);
          
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  /* -----------------------
     GENERATE SINGLE REPORT CONTENT
     ----------------------- */
  const generateSingleReportContent = (report) => {
    const today = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${report.name} - Attendance Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              margin: 0;
              padding: 40px;
              color: #1e293b;
              background: white;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3b82f6;
            }
            
            .header h1 {
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 10px 0;
              color: #1e293b;
            }
            
            .metadata {
              display: flex;
              justify-content: space-between;
              background: #f8fafc;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 30px;
              border: 1px solid #e2e8f0;
              font-size: 14px;
            }
            
            .metadata-label {
              color: #64748b;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
              font-weight: 600;
            }
            
            .metadata-value {
              color: #1e293b;
              font-weight: 600;
              font-size: 15px;
            }
            
            .report-info {
              margin-bottom: 30px;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .columns-list {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 10px;
              margin-top: 10px;
            }
            
            .column-item {
              padding: 8px 12px;
              background: #f1f5f9;
              border-radius: 6px;
              font-size: 13px;
              color: #475569;
            }
            
            .sample-data {
              margin-top: 30px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 13px;
            }
            
            th {
              background: #f1f5f9;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              color: #475569;
              border-bottom: 2px solid #e2e8f0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              font-size: 11px;
            }
            
            td {
              padding: 12px;
              border-bottom: 1px solid #f1f5f9;
              color: #475569;
            }
            
            tr:hover {
              background: #f8fafc;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #94a3b8;
              font-size: 12px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${report.name}</h1>
            <div style="color: #64748b; font-size: 16px;">
              Human Resources Management System
            </div>
            <div style="color: #64748b; font-size: 14px; margin-top: 10px;">
              Generated on ${today} at ${time}
            </div>
          </div>
          
          <div class="metadata">
            <div>
              <div class="metadata-label">Report Type</div>
              <div class="metadata-value">${report.type.toUpperCase()}</div>
            </div>
            <div>
              <div class="metadata-label">Frequency</div>
              <div class="metadata-value">${report.frequency.charAt(0).toUpperCase() + report.frequency.slice(1)}</div>
            </div>
            <div>
              <div class="metadata-label">Last Generated</div>
              <div class="metadata-value">${report.lastGenerated}</div>
            </div>
            <div>
              <div class="metadata-label">Generated By</div>
              <div class="metadata-value">${role === 'manager' ? 'Manager' : role === 'hr' ? 'HR Admin' : role === 'admin' ? 'System Admin' : 'Employee'}</div>
            </div>
          </div>
          
          <div class="report-info">
            <div class="section-title">Report Description</div>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              ${report.description}
            </p>
          </div>
          
          <div class="report-info">
            <div class="section-title">Columns Included</div>
            <div class="columns-list">
              ${report.columns.map(col => `
                <div class="column-item">${col}</div>
              `).join('')}
            </div>
          </div>
          
          <div class="sample-data">
            <div class="section-title">Sample Data Preview</div>
            <table>
              <thead>
                <tr>
                  ${report.columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${getSampleData(report).map(row => `
                  <tr>
                    ${row.map(cell => `<td>${cell}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} HRMS - Attendance Management System</p>
            <p>This document contains confidential information. Unauthorized distribution is prohibited.</p>
            <p>Report ID: ${report.id}-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}</p>
          </div>
        </body>
      </html>
    `;
  };

  /* -----------------------
     GET SAMPLE DATA FOR REPORT
     ----------------------- */
  const getSampleData = (report) => {
    // Generate sample data based on report type
    const sampleData = [];
    const rowCount = 5;
    
    for (let i = 1; i <= rowCount; i++) {
      const row = report.columns.map(column => {
        switch (column.toLowerCase()) {
          case 'employee':
            return employees[i % employees.length]?.name || 'John Smith';
          case 'department':
            return ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][i % 5];
          case 'date':
            return new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
          case 'status':
            return ['Present', 'Present', 'Absent', 'Late', 'Leave'][i % 5];
          case 'in time':
            return `09:${(i * 3).toString().padStart(2, '0')}`;
          case 'out time':
            return `18:${(i * 7).toString().padStart(2, '0')}`;
          case 'overtime':
            return `${i % 4} hours`;
          case 'absent days':
            return i % 3;
          case 'late count':
            return i % 4;
          case 'total hours':
            return `8.${i}`;
          case 'attendance %':
            return `${90 + i}%`;
          default:
            return 'Sample Data';
        }
      });
      sampleData.push(row);
    }
    
    return sampleData;
  };

  /* -----------------------
     HANDLE EXPORT ALL REPORTS
     ----------------------- */
  const handleExportAll = () => {
    const filteredReports = reportCategory === 'all' 
      ? reports 
      : reports.filter(r => r.type === reportCategory);
    
    if (filteredReports.length === 0) {
      alert('No reports to export');
      return;
    }
    
    setIsExporting(true);
    
    // Simulate PDF generation delay
    setTimeout(() => {
      // Create PDF content
      const pdfContent = generateAllReportsContent(filteredReports);
      
      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `attendance_reports_${reportCategory}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(downloadUrl);
      
      setIsExporting(false);
      
      // Show success message
      alert(`✅ Successfully exported ${filteredReports.length} reports as PDF!\n\nFile: attendance_reports_${reportCategory}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    }, 1500);
  };

  /* -----------------------
     GENERATE ALL REPORTS CONTENT
     ----------------------- */
  const generateAllReportsContent = (reportsList) => {
    const today = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Attendance Reports - ${reportCategory}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              margin: 0;
              padding: 40px;
              color: #1e293b;
              background: white;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3b82f6;
            }
            
            .header h1 {
              font-size: 32px;
              font-weight: 700;
              margin: 0 0 10px 0;
              color: #1e293b;
            }
            
            .summary {
              background: #f8fafc;
              padding: 24px;
              border-radius: 12px;
              margin-bottom: 30px;
              border: 1px solid #e2e8f0;
            }
            
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-top: 20px;
            }
            
            .summary-item {
              text-align: center;
              padding: 16px;
              background: white;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            
            .summary-value {
              font-size: 28px;
              font-weight: 700;
              color: #3b82f6;
              margin-bottom: 8px;
            }
            
            .summary-label {
              font-size: 13px;
              color: #64748b;
              font-weight: 500;
            }
            
            .report-card {
              margin-bottom: 30px;
              padding: 24px;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              page-break-inside: avoid;
            }
            
            .report-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 16px;
            }
            
            .report-title {
              font-size: 20px;
              font-weight: 600;
              color: #1e293b;
            }
            
            .report-badge {
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
            }
            
            .badge-standard {
              background: #dbeafe;
              color: #1d4ed8;
            }
            
            .badge-exception {
              background: #fee2e2;
              color: #dc2626;
            }
            
            .badge-analytics {
              background: #d1fae5;
              color: #047857;
            }
            
            .report-desc {
              font-size: 14px;
              color: #475569;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            
            .report-meta {
              display: flex;
              gap: 20px;
              font-size: 13px;
              color: #64748b;
              margin-bottom: 16px;
            }
            
            .columns-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 10px;
            }
            
            .column-tag {
              padding: 4px 10px;
              background: #f1f5f9;
              border-radius: 6px;
              font-size: 12px;
              color: #475569;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #94a3b8;
              font-size: 12px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
            
            @media print {
              .report-card {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Attendance Reports Collection</h1>
            <div style="color: #64748b; font-size: 16px;">
              ${reportCategory === 'all' ? 'All Report Categories' : reportCategory.charAt(0).toUpperCase() + reportCategory.slice(1) + ' Reports'}
            </div>
            <div style="color: #64748b; font-size: 14px; margin-top: 10px;">
              Generated on ${today} at ${time}
            </div>
          </div>
          
          <div class="summary">
            <h2 style="margin: 0 0 10px 0; color: #1e293b;">Export Summary</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-value">${reportsList.length}</div>
                <div class="summary-label">Total Reports</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${new Set(reportsList.map(r => r.frequency)).size}</div>
                <div class="summary-label">Frequencies</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${new Set(reportsList.map(r => r.type)).size}</div>
                <div class="summary-label">Report Types</div>
              </div>
            </div>
          </div>
          
          ${reportsList.map(report => `
            <div class="report-card">
              <div class="report-header">
                <div class="report-title">${report.name}</div>
                <div class="report-badge badge-${report.type}">
                  ${report.type.toUpperCase()}
                </div>
              </div>
              <div class="report-desc">
                ${report.description}
              </div>
              <div class="report-meta">
                <div><strong>Frequency:</strong> ${report.frequency}</div>
                <div><strong>Last Generated:</strong> ${report.lastGenerated}</div>
              </div>
              <div>
                <strong>Columns Included:</strong>
                <div class="columns-list">
                  ${report.columns.map(col => `<span class="column-tag">${col}</span>`).join('')}
                </div>
              </div>
            </div>
          `).join('')}
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} HRMS - Attendance Management System</p>
            <p>This document contains confidential information. Unauthorized distribution is prohibited.</p>
            <p>Document ID: REP-${reportCategory.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}</p>
          </div>
        </body>
      </html>
    `;
  };

  /* -----------------------
     HANDLE PRINT ALL REPORTS
     ----------------------- */
  const handlePrintAll = () => {
    const filteredReports = reportCategory === 'all' 
      ? reports 
      : reports.filter(r => r.type === reportCategory);
    
    if (filteredReports.length === 0) {
      alert('No reports to print');
      return;
    }
    
    setIsPrinting(true);
    
    // Create printable content
    const printContent = generatePrintContent(filteredReports);
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setIsPrinting(false);
      
      // Show success message
      alert(`✅ Successfully printed ${filteredReports.length} reports!`);
    }, 500);
  };

  /* -----------------------
     GENERATE PRINT CONTENT
     ----------------------- */
  const generatePrintContent = (reportsList) => {
    const today = new Date().toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Reports - Print</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              color: #333;
            }
            h1 {
              color: #1e293b;
              text-align: center;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .print-info {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: #666;
              margin-bottom: 20px;
            }
            .report-item {
              margin-bottom: 15px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
              page-break-inside: avoid;
            }
            .report-title {
              font-weight: bold;
              font-size: 16px;
              color: #1e293b;
              margin-bottom: 8px;
            }
            .report-type {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 3px;
              font-size: 11px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .type-standard { background: #dbeafe; color: #1d4ed8; }
            .type-exception { background: #fee2e2; color: #dc2626; }
            .type-analytics { background: #d1fae5; color: #047857; }
            .report-desc {
              color: #666;
              font-size: 13px;
              margin: 8px 0;
              line-height: 1.4;
            }
            .report-meta {
              font-size: 11px;
              color: #888;
              margin-bottom: 8px;
            }
            .columns {
              font-size: 12px;
              color: #555;
            }
            .footer {
              text-align: center;
              font-size: 11px;
              color: #999;
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #eee;
            }
            @media print {
              .report-item {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <h1>Attendance Reports</h1>
          <div class="print-info">
            <div>
              <strong>Printed on:</strong> ${today}<br>
              <strong>Generated by:</strong> ${role}
            </div>
            <div>
              <strong>Total Reports:</strong> ${reportsList.length}<br>
              <strong>Category:</strong> ${reportCategory === 'all' ? 'All' : reportCategory}
            </div>
          </div>
          
          ${reportsList.map(report => `
            <div class="report-item">
              <div class="report-title">${report.name}</div>
              <div class="report-type type-${report.type}">${report.type.toUpperCase()}</div>
              <div class="report-desc">${report.description}</div>
              <div class="report-meta">
                <span><strong>Frequency:</strong> ${report.frequency}</span> | 
                <span><strong>Last Generated:</strong> ${report.lastGenerated}</span>
              </div>
              <div class="columns">
                <strong>Columns:</strong> ${report.columns.join(', ')}
              </div>
            </div>
          `).join('')}
          
          <div class="footer">
            HRMS Attendance Reports System | Page 1 of 1
          </div>
        </body>
      </html>
    `;
  };

  const handleExportExceptions = async () => {
    if (exceptionData.length === 0) {
      alert('No exceptions to export');
      return;
    }

    setIsExportingExceptions(true);
    setExportProgress(0);
    setShowExportModal(false);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          if (exportFormat === 'pdf') {
            // Create and download PDF
            const pdfContent = generatePDFContent(exceptionData);
            
            // Create blob with proper PDF content
            const blob = new Blob([pdfContent], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            
            const filename = `attendance_exceptions_${new Date().toISOString().split('T')[0]}.pdf`;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
            
            // Show success message
            setTimeout(() => {
              alert(`✅ Successfully exported ${exceptionData.length} exceptions as PDF!\n\nFile: ${filename}`);
            }, 500);
            
          } else if (exportFormat === 'csv') {
            // Create CSV content
            const headers = ['Employee ID', 'Employee Name', 'Department', 'Date', 'Exception Type', 'Details', 'Duration', 'Status'];
            const rows = exceptionData.map(item => [
              item.employeeId,
              item.employeeName,
              item.department,
              item.date,
              getExceptionType(item),
              getExceptionDetails(item),
              getExceptionDuration(item),
              getExceptionStatus(item)
            ]);
            
            const csvContent = [
              headers.join(','),
              ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');
            
            // Create and download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            
            const filename = `attendance_exceptions_${new Date().toISOString().split('T')[0]}.csv`;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
            
            // Show success message
            setTimeout(() => {
              alert(`✅ Successfully exported ${exceptionData.length} exceptions as CSV!\n\nFile: ${filename}`);
            }, 500);
          }
          
          setIsExportingExceptions(false);
          setExportProgress(0);
          
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  /* -----------------------
     EXPORT MODAL COMPONENT
     ----------------------- */
  const renderExportModal = () => {
    if (!showExportModal) return null;

    return (
      <div className="export-modal-overlay">
        <div className="export-modal-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h7 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>
              Export Exceptions
            </h7>
            <button 
              onClick={() => setShowExportModal(false)}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: '#64748b',
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Export {exceptionData.length} exceptions in selected format
          </div>

          <div className="export-options">
            <div 
              className={`export-option ${exportFormat === 'pdf' ? 'selected' : ''}`}
              onClick={() => setExportFormat('pdf')}
            >
              <div className="export-option-icon pdf">
                <i className="bi bi-file-pdf"></i>
              </div>
              <div className="export-option-info">
                <div className="export-option-title">PDF Document</div>
                <div className="export-option-desc">Best for printing and sharing</div>
              </div>
              {exportFormat === 'pdf' && <i className="bi bi-check-circle" style={{ color: '#3b82f6', fontSize: '20px' }}></i>}
            </div>

            <div 
              className={`export-option ${exportFormat === 'csv' ? 'selected' : ''}`}
              onClick={() => setExportFormat('csv')}
            >
              <div className="export-option-icon csv">
                <i className="bi bi-file-earmark-bar-graph"></i>
              </div>
              <div className="export-option-info">
                <div className="export-option-title">CSV File</div>
                <div className="export-option-desc">Best for importing to other systems</div>
              </div>
              {exportFormat === 'csv' && <i className="bi bi-check-circle" style={{ color: '#3b82f6', fontSize: '20px' }}></i>}
            </div>
          </div>

          {isExportingExceptions && (
            <div className="export-progress">
              <i className="bi bi-arrow-clockwise spin" style={{ fontSize: '20px' }}></i>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                  Exporting exceptions...
                </div>
                <div className="export-progress-bar">
                  <div className="export-progress-fill" style={{ width: `${exportProgress}%` }} />
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#3b82f6' }}>
                {exportProgress}%
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button 
              className="btn-secondary" 
              onClick={() => setShowExportModal(false)}
              disabled={isExportingExceptions}
            >
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={handleExportExceptions}
              disabled={isExportingExceptions || exceptionData.length === 0}
            >
              {isExportingExceptions ? (
                <>
                  <i className="bi bi-arrow-clockwise spin" style={{ fontSize: '16px' }}></i>
                  Exporting...
                </>
              ) : (
                <>
                  <i className="bi bi-download"></i>
                  Export ({exceptionData.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* -----------------------
     Calculate exception data
     ----------------------- */
  const exceptionData = useMemo(() => {
    return filteredData.filter(record => {
      if (exceptionType === 'all') {
        return record.status === 'absent' || record.late > 15 || record.overtime > 8;
      } else if (exceptionType === 'late') {
        return record.late > 15;
      } else if (exceptionType === 'absent') {
        return record.status === 'absent';
      } else if (exceptionType === 'overtime') {
        return record.overtime > 8;
      }
      return false;
    });
  }, [filteredData, exceptionType]);

  /* -----------------------
     RENDER EXCEPTIONS TAB
     ----------------------- */
  const renderExceptions = () => {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h6 style={{ fontSize: 20, fontWeight: 600, color: '#1e293b' }}>
            Attendance Exception Reports
          </h6>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="filter-select-container">
              <select 
                value={exceptionType}
                onChange={(e) => setExceptionType(e.target.value)}
                style={{ padding: '8px 36px 8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', width: '100%' }}
              >
                <option value="all">All Exception Types</option>
                <option value="late">Late Arrivals (&gt;15 mins)</option>
                <option value="absent">Absent Without Leave</option>
                <option value="overtime">Excessive Overtime (&gt;8h)</option>
              </select>
              <i className="bi bi-chevron-down filter-select-arrow"></i>
            </div>
            <button 
              className="btn-primary"
              onClick={() => setShowExportModal(true)}
              disabled={exceptionData.length === 0 || isExportingExceptions}
            >
              {isExportingExceptions ? (
                <>
                  <i className="bi bi-arrow-clockwise spin" style={{ fontSize: '16px' }}></i>
                  Exporting...
                </>
              ) : (
                <>
                  <i className="bi bi-download"></i>
                  Export ({exceptionData.length})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Exception Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#fee2e2', 
            borderRadius: '8px',
            border: '1px solid #fca5a5'
          }}>
            <div style={{ fontSize: '12px', color: '#991b1b', marginBottom: '8px' }}>Total Exceptions</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#7f1d1d' }}>
              {exceptionData.length}
            </div>
          </div>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#fef3c7', 
            borderRadius: '8px',
            border: '1px solid #fde68a'
          }}>
            <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '8px' }}>Late Arrivals</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#78350f' }}>
              {exceptionData.filter(r => r.late > 15).length}
            </div>
          </div>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#fee2e2', 
            borderRadius: '8px',
            border: '1px solid #fca5a5'
          }}>
            <div style={{ fontSize: '12px', color: '#991b1b', marginBottom: '8px' }}>Absent Records</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#7f1d1d' }}>
              {exceptionData.filter(r => r.status === 'absent').length}
            </div>
          </div>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#dbeafe', 
            borderRadius: '8px',
            border: '1px solid #93c5fd'
          }}>
            <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '8px' }}>Overtime Violations</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#1e3a8a' }}>
              {exceptionData.filter(r => r.overtime > 8).length}
            </div>
          </div>
        </div>

        {/* Export Status Indicator */}
        {isExportingExceptions && (
          <div style={{ 
            backgroundColor: '#f0f9ff', 
            padding: '12px 16px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <i className="bi bi-arrow-clockwise spin" style={{ fontSize: '20px', color: '#3b82f6' }}></i>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#0369a1' }}>
                Exporting {exceptionData.length} exceptions...
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Progress: {exportProgress}% • Format: {exportFormat.toUpperCase()}
              </div>
            </div>
            <div className="progress-bar" style={{ width: '200px' }}>
              <div className="progress-fill" style={{ width: `${exportProgress}%` }} />
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Exception Type</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exceptionData.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <i className="bi bi-exclamation-circle" style={{ fontSize: '32px', opacity: 0.3, marginBottom: '12px' }}></i>
                    <div>No exceptions found for the selected criteria</div>
                  </td>
                </tr>
              ) : (
                exceptionData
                .slice(0, 20)
                .map((record, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}>
                          {record.employeeName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{record.employeeName}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{record.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#dbeafe',
                        color: '#1d4ed8',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        {record.department}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {record.status === 'absent' ? (
                          <>
                            <i className="bi bi-x-circle" style={{ color: '#ef4444' }}></i>
                            <span style={{ color: '#dc2626', fontWeight: 500 }}>Absent</span>
                          </>
                        ) : record.late > 15 ? (
                          <>
                            <i className="bi bi-clock" style={{ color: '#f59e0b' }}></i>
                            <span style={{ color: '#d97706', fontWeight: 500 }}>
                              Late by {record.late} mins
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-lightning" style={{ color: '#3b82f6' }}></i>
                            <span style={{ color: '#1e40af', fontWeight: 500 }}>
                              Overtime: {record.overtime}h
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>{record.date}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {record.inTime} - {record.outTime}
                      </div>
                    </td>
                    <td>
                      {record.status === 'absent' ? 'Full Day' : 
                       record.late > 15 ? `${record.late} mins` : 
                       `${record.overtime} hours`}
                    </td>
                    <td>
                      <span className={`status-badge ${
                        record.status === 'absent' ? 'status-absent' : 
                        record.late > 15 ? 'status-late' : 
                        'status-overtime'
                      }`}>
                        {record.status === 'absent' ? 'Pending Review' : 
                         record.late > 15 ? 'In Review' : 
                         'Requires Approval'}
                      </span>
                    </td>
                    <td>
                      <button style={{
                        padding: '6px 12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  /* -----------------------
     TAB RENDERING
     ----------------------- */
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "reports":
        return renderReports();
      case "analytics":
        return renderAnalytics();
      case "exceptions":
        return renderExceptions();
      case "alerts":
        return renderAlerts();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <>
      <h6 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1e293b' }}>
        Attendance Dashboard Overview
      </h6>

      <div className="dashboard-grid">
        <div>
          <div className="chart-card">
            <div className="chart-title">
              Daily Attendance Trends
              <select style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}>
                <option>Last 30 Days</option>
                <option>Last 60 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '20px 0' }}>
              {analyticsData.trends?.daily.slice(-14).map((day, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: `${day.present}%`, backgroundColor: '#10b981', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: '12px', height: `${day.absent}%`, backgroundColor: '#ef4444', marginTop: '2px' }} />
                  <div style={{ width: '12px', height: `${day.late}%`, backgroundColor: '#f59e0b', marginTop: '2px' }} />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                Present
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
                Absent
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }} />
                Late
              </div>
            </div>
          </div>

          <AttendanceCalendar attendanceData={filteredData} />
        </div>

        <div>
          <div className="chart-card">
            <div className="chart-title">
              Department Performance
            </div>
            <div style={{ marginTop: '16px' }}>
              {analyticsData.trends?.department.map((dept, index) => (
                <div key={index} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 500 }}>{dept.name}</span>
                    <span style={{ color: '#475569' }}>{dept.present}% Present</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${dept.present}%`,
                        background: `linear-gradient(90deg, #10b981, #22c55e)`,
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    <span>Absent: {dept.absent}%</span>
                    <span>Late: {dept.late}%</span>
                    <span>OT: {dept.overtime}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card" style={{ marginTop: '20px' }}>
            <div className="chart-title">
              Top Performers
            </div>
            <div style={{ marginTop: '12px' }}>
              {employees.slice(0, 4).map((emp, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderBottom: index < 3 ? '1px solid #f1f5f9' : 'none',
                    backgroundColor: index === 0 ? '#f0f9ff' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      backgroundColor: index === 0 ? '#3b82f6' : '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '14px' }}>{emp.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.department}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '16px' }}>
                      {Math.floor(Math.random() * 10) + 92}%
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Attendance</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderReports = () => {
    const filteredReports = reportCategory === 'all' 
      ? reports 
      : reports.filter(r => r.type === reportCategory);

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h6 style={{ fontSize: 20, fontWeight: 600, color: '#1e293b' }}>
            Standard Reports Library
          </h6>
          <div className="action-buttons">
            <button 
              className="btn-primary" 
              onClick={handleExportAll}
              disabled={isExporting || filteredReports.length === 0}
            >
              {isExporting ? (
                <>
                  <i className="bi bi-arrow-clockwise spin" style={{ fontSize: '16px' }}></i>
                  Generating PDF...
                </>
              ) : (
                <>
                  <i className="bi bi-download"></i>
                  Export All ({filteredReports.length})
                </>
              )}
            </button>
            <button 
              className="btn-secondary" 
              onClick={handlePrintAll}
              disabled={isPrinting || filteredReports.length === 0}
            >
              {isPrinting ? (
                <>
                  <i className="bi bi-arrow-clockwise spin" style={{ fontSize: '16px' }}></i>
                  Printing...
                </>
              ) : (
                <>
                  <i className="bi bi-printer"></i>
                  Print
                </>
              )}
            </button>
          </div>
        </div>

        {/* Report Category Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setReportCategory('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: reportCategory === 'all' ? '#3b82f6' : 'white',
              color: reportCategory === 'all' ? 'white' : '#475569',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              border: '1px solid #e2e8f0'
            }}
          >
            <i className="bi bi-files"></i> All Reports ({reports.length})
          </button>
          <button
            onClick={() => setReportCategory('standard')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: reportCategory === 'standard' ? '#3b82f6' : 'white',
              color: reportCategory === 'standard' ? 'white' : '#475569',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              border: '1px solid #e2e8f0'
            }}
          >
            <i className="bi bi-file-text"></i> Standard ({reports.filter(r => r.type === 'standard').length})
          </button>
          <button
            onClick={() => setReportCategory('exception')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: reportCategory === 'exception' ? '#3b82f6' : 'white',
              color: reportCategory === 'exception' ? 'white' : '#475569',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              border: '1px solid #e2e8f0'
            }}
          >
            <i className="bi bi-exclamation-circle"></i> Exception ({reports.filter(r => r.type === 'exception').length})
          </button>
          <button
            onClick={() => setReportCategory('analytics')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: reportCategory === 'analytics' ? '#3b82f6' : 'white',
              color: reportCategory === 'analytics' ? 'white' : '#475569',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              border: '1px solid #e2e8f0'
            }}
          >
            <i className="bi bi-bar-chart"></i> Analytics ({reports.filter(r => r.type === 'analytics').length})
          </button>
        </div>

        {filteredReports.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '2px dashed #e2e8f0'
          }}>
            <i className="bi bi-file-text" style={{ fontSize: '48px', opacity: 0.3, marginBottom: '16px', color: '#64748b' }}></i>
            <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>
              No reports found in this category
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>
              Try selecting a different category or check back later
            </div>
          </div>
        ) : (
          <>
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              padding: '12px 16px', 
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#0369a1' }}>
                    Showing {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '13px', marginLeft: '12px' }}>
                    • Export as PDF • Print available • Click any report for details
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="reports-grid">
              {filteredReports.map(report => (
                <div key={report.id} className="report-card" onClick={() => handleReportClick(report)}>
                  <div className="report-header">
                    <div className={`report-icon ${report.type}`}>
                      {report.type === 'standard' ? <i className="bi bi-file-text"></i> :
                      report.type === 'exception' ? <i className="bi bi-exclamation-circle"></i> :
                      <i className="bi bi-bar-chart"></i>}
                    </div>
                    <div>
                      <div className="report-title">{report.name}</div>
                      <span className={`report-type ${report.type}`}>
                        {report.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="report-desc">
                    {report.description}
                  </div>
                  <div className="report-footer">
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        <i className="bi bi-clock"></i> Frequency: {report.frequency}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        <i className="bi bi-calendar"></i> Last Generated: {report.lastGenerated}
                      </div>
                    </div>
                    <button 
                      className="btn-icon" 
                      style={{ padding: '6px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSingleReport(report);
                      }}
                    >
                      <i className="bi bi-download"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Single Report Generation Modal */}
        {isGeneratingSingle && (
          <div className="report-generation-modal">
            <div className="report-generation-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h6 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>
                  Generating Report
                </h6>
                <button 
                  onClick={() => setIsGeneratingSingle(false)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: '#64748b',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <i className="bi bi-file-text" style={{ fontSize: '20px', color: '#3b82f6', marginBottom: '16px' }}></i>
                <h7 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#1e293b' }}>
                  {selectedReport?.name}
                </h7>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                  Preparing your report for download...
                </p>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', margin: '20px 0' }}>
                  <div 
                    style={{ 
                      width: `${generationProgress}%`, 
                      height: '100%', 
                      backgroundColor: '#3b82f6',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  Progress: {generationProgress}%
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Calculate leave pattern analysis
  const leavePatterns = useMemo(() => {
    const leaveData = filteredData.filter(x => x.status === 'leave');
    const dayOfWeekCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const monthlyCounts = {};
    
    leaveData.forEach(record => {
      const date = new Date(record.date);
      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      const month = date.toLocaleString('default', { month: 'short' });
      
      dayOfWeekCounts[dayOfWeek]++;
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
    
    return { dayOfWeekCounts, monthlyCounts };
  }, [filteredData]);

  // Calculate attendance anomalies
  const attendanceAnomalies = useMemo(() => {
    const anomalies = [];
    const employeeStats = {};
    
    // Calculate per-employee statistics
    filteredData.forEach(record => {
      if (!employeeStats[record.employeeId]) {
        employeeStats[record.employeeId] = {
          employeeId: record.employeeId,
          employeeName: record.employeeName,
          department: record.department,
          totalDays: 0,
          absentCount: 0,
          lateCount: 0,
          lateMinutes: [],
          overtimeHours: [],
          consecutiveLate: 0,
          maxConsecutiveLate: 0,
          consecutiveAbsent: 0,
          maxConsecutiveAbsent: 0,
          dayOfWeekPattern: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
        };
      }
      
      const stats = employeeStats[record.employeeId];
      stats.totalDays++;
      
      if (record.status === 'absent') {
        stats.absentCount++;
        stats.consecutiveAbsent++;
        stats.maxConsecutiveAbsent = Math.max(stats.maxConsecutiveAbsent, stats.consecutiveAbsent);
      } else {
        stats.consecutiveAbsent = 0;
      }
      
      if (record.late > 0) {
        stats.lateCount++;
        stats.lateMinutes.push(record.late);
        stats.consecutiveLate++;
        stats.maxConsecutiveLate = Math.max(stats.maxConsecutiveLate, stats.consecutiveLate);
      } else {
        stats.consecutiveLate = 0;
      }
      
      if (record.overtime > 0) {
        stats.overtimeHours.push(record.overtime);
      }
      
      const date = new Date(record.date);
      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      if (record.status === 'absent' || record.status === 'leave') {
        stats.dayOfWeekPattern[dayOfWeek]++;
      }
    });
    
    // Detect anomalies
    Object.values(employeeStats).forEach(stats => {
      const absentRate = (stats.absentCount / stats.totalDays) * 100;
      const lateRate = (stats.lateCount / stats.totalDays) * 100;
      const avgLate = stats.lateMinutes.length > 0 
        ? stats.lateMinutes.reduce((a, b) => a + b, 0) / stats.lateMinutes.length 
        : 0;
      const avgOvertime = stats.overtimeHours.length > 0
        ? stats.overtimeHours.reduce((a, b) => a + b, 0) / stats.overtimeHours.length
        : 0;
      const totalOvertime = stats.overtimeHours.reduce((a, b) => a + b, 0);
      
      // Anomaly 1: Consecutive late arrivals (3+ days)
      if (stats.maxConsecutiveLate >= 3) {
        anomalies.push({
          type: 'consecutive_late',
          severity: stats.maxConsecutiveLate >= 5 ? 'high' : 'medium',
          employeeId: stats.employeeId,
          employeeName: stats.employeeName,
          department: stats.department,
          metric: `${stats.maxConsecutiveLate} consecutive late arrivals`,
          value: stats.maxConsecutiveLate,
          description: `Employee has ${stats.maxConsecutiveLate} consecutive late arrivals`,
        });
      }
      
      // Anomaly 2: High absenteeism rate (>10%)
      if (absentRate > 10 && stats.totalDays >= 20) {
        anomalies.push({
          type: 'high_absenteeism',
          severity: absentRate > 20 ? 'high' : 'medium',
          employeeId: stats.employeeId,
          employeeName: stats.employeeName,
          department: stats.department,
          metric: `${absentRate.toFixed(1)}% absenteeism rate`,
          value: absentRate,
          description: `Absenteeism rate of ${absentRate.toFixed(1)}% exceeds threshold of 10%`,
        });
      }
      
      // Anomaly 3: Frequent late arrivals (>30% late rate)
      if (lateRate > 30 && stats.totalDays >= 20) {
        anomalies.push({
          type: 'frequent_late',
          severity: lateRate > 50 ? 'high' : 'medium',
          employeeId: stats.employeeId,
          employeeName: stats.employeeName,
          department: stats.department,
          metric: `${lateRate.toFixed(1)}% late arrival rate`,
          value: lateRate,
          description: `Late arrival rate of ${lateRate.toFixed(1)}% with average ${avgLate.toFixed(0)} minutes late`,
        });
      }
      
      // Anomaly 4: Excessive overtime (>15 hours per week average)
      if (avgOvertime > 3 && stats.overtimeHours.length > 0) {
        anomalies.push({
          type: 'excessive_overtime',
          severity: avgOvertime > 5 ? 'high' : 'medium',
          employeeId: stats.employeeId,
          employeeName: stats.employeeName,
          department: stats.department,
          metric: `${avgOvertime.toFixed(1)}h average overtime (${totalOvertime.toFixed(0)}h total)`,
          value: totalOvertime,
          description: `Average ${avgOvertime.toFixed(1)} hours overtime per day, total ${totalOvertime.toFixed(0)} hours`,
        });
      }
      
      // Anomaly 5: Consecutive absences (3+ days)
      if (stats.maxConsecutiveAbsent >= 3) {
        anomalies.push({
          type: 'consecutive_absent',
          severity: stats.maxConsecutiveAbsent >= 5 ? 'high' : 'medium',
          employeeId: stats.employeeId,
          employeeName: stats.employeeName,
          department: stats.department,
          metric: `${stats.maxConsecutiveAbsent} consecutive absences`,
          value: stats.maxConsecutiveAbsent,
          description: `Employee has ${stats.maxConsecutiveAbsent} consecutive absent days`,
        });
      }
      
      // Anomaly 6: Pattern detection (same day of week absences)
      const maxDayAbsences = Math.max(...Object.values(stats.dayOfWeekPattern));
      if (maxDayAbsences >= 4) {
        const frequentDay = Object.entries(stats.dayOfWeekPattern)
          .find(([day, count]) => count === maxDayAbsences)[0];
        anomalies.push({
          type: 'pattern_detection',
          severity: maxDayAbsences >= 6 ? 'high' : 'medium',
          employeeId: stats.employeeId,
          employeeName: stats.employeeName,
          department: stats.department,
          metric: `${maxDayAbsences} absences on ${frequentDay}s`,
          value: maxDayAbsences,
          description: `Pattern detected: ${maxDayAbsences} absences on ${frequentDay}s (potential pattern)`,
        });
      }
      
      // Anomaly 7: Average late time > 30 minutes
      if (avgLate > 30 && stats.lateCount >= 5) {
        anomalies.push({
          type: 'severe_lateness',
          severity: avgLate > 60 ? 'high' : 'medium',
          employeeId: stats.employeeId,
          employeeName: stats.employeeName,
          department: stats.department,
          metric: `${avgLate.toFixed(0)} minutes average late`,
          value: avgLate,
          description: `Average late arrival time of ${avgLate.toFixed(0)} minutes exceeds 30 minutes threshold`,
        });
      }
    });
    
    // Calculate anomaly statistics
    const anomalyStats = {
      total: anomalies.length,
      byType: {},
      bySeverity: { high: 0, medium: 0, low: 0 },
      byDepartment: {},
    };
    
    anomalies.forEach(anomaly => {
      anomalyStats.byType[anomaly.type] = (anomalyStats.byType[anomaly.type] || 0) + 1;
      anomalyStats.bySeverity[anomaly.severity] = (anomalyStats.bySeverity[anomaly.severity] || 0) + 1;
      anomalyStats.byDepartment[anomaly.department] = (anomalyStats.byDepartment[anomaly.department] || 0) + 1;
    });
    
    return { anomalies, stats: anomalyStats };
  }, [filteredData]);

  const renderAnalytics = () => {
    return (
      <>
        <h6 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, color: '#1e293b' }}>
          Analytics & Insights
        </h6>

        <div className="analytics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <i className="bi bi-pie-chart" style={{ color: '#8b5cf6', fontSize: '18px' }}></i>
              <div className="metric-title">Absenteeism Rate</div>
            </div>
            <div className="metric-value">{analyticsData.metrics?.absenteeismRate || 0}%</div>
            <div className="metric-trend">
              <i className="bi bi-graph-up"></i>
              Industry average: 3.5%
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
              Lower than industry standard by 0.7%
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <i className="bi bi-bullseye" style={{ color: '#16a34a', fontSize: '18px' }}></i>
              <div className="metric-title">Punctuality Score</div>
            </div>
            <div className="metric-value">{analyticsData.metrics?.punctualityScore || 0}%</div>
            <div className="metric-trend">
              <i className="bi bi-graph-up"></i>
              Target: 90% ✓
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
              Exceeding target by {analyticsData.metrics?.punctualityScore - 90 || 0}%
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <i className="bi bi-clock" style={{ color: '#3b82f6', fontSize: '18px' }}></i>
              <div className="metric-title">Overtime Rate</div>
            </div>
            <div className="metric-value">{analyticsData.metrics?.overtimeRate || 0}%</div>
            <div className="metric-trend">
              <i className="bi bi-graph-up"></i>
              +2.3% from last month
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
              Primarily in Engineering & Sales departments
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <i className="bi bi-calendar" style={{ color: '#f59e0b', fontSize: '18px' }}></i>
              <div className="metric-title">Leave Utilization</div>
            </div>
            <div className="metric-value">{analyticsData.metrics?.leaveUtilization || 0}%</div>
            <div className="metric-trend">
              Optimal range: 60-70%
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
              Within optimal utilization range
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <i className="bi bi-graph-up" style={{ color: '#0ea5e9', fontSize: '18px' }}></i>
              <div className="metric-title">Attendance Consistency</div>
            </div>
            <div className="metric-value">{analyticsData.metrics?.attendanceConsistency || 0}%</div>
            <div className="metric-trend">
              <i className="bi bi-graph-up"></i>
              Very Good
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
              94% of employees have 85% consistency
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <i className="bi bi-exclamation-circle" style={{ color: '#dc2626', fontSize: '18px' }}></i>
              <div className="metric-title">Predictive Alerts</div>
            </div>
            <div className="metric-value">{analyticsData.metrics?.predictiveAlerts || 0}</div>
            <div className="metric-trend">
              <i className="bi bi-exclamation-circle"></i>
              Requires attention
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
              {analyticsData.metrics?.predictiveAlerts || 0} patterns detected this month
            </div>
          </div>
        </div>

        {/* Leave Pattern Analysis */}
        <div className="chart-card" style={{ marginTop: '24px' }}>
          <div className="chart-title">
            <i className="bi bi-calendar"></i>
            Leave Pattern Analysis
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px', color: '#475569' }}>
                Leave by Day of Week
              </div>
              <div>
                {Object.entries(leavePatterns.dayOfWeekCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([day, count], index) => (
                    <div key={day} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: index < 6 ? '1px solid #f1f5f9' : 'none'
                    }}>
                      <span style={{ color: '#475569', fontWeight: 500 }}>{day}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '120px', 
                          height: '8px', 
                          backgroundColor: '#e2e8f0', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${(count / Math.max(...Object.values(leavePatterns.dayOfWeekCounts))) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                            borderRadius: '4px'
                          }} />
                        </div>
                        <span style={{ fontWeight: 600, color: '#8b5cf6', minWidth: '40px', textAlign: 'right' }}>
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px', color: '#475569' }}>
                Leave by Month
              </div>
              <div>
                {Object.entries(leavePatterns.monthlyCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([month, count], index) => (
                    <div key={month} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: index < 5 ? '1px solid #f1f5f9' : 'none'
                    }}>
                      <span style={{ color: '#475569', fontWeight: 500 }}>{month}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '120px', 
                          height: '8px', 
                          backgroundColor: '#e2e8f0', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${(count / Math.max(...Object.values(leavePatterns.monthlyCounts))) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                            borderRadius: '4px'
                          }} />
                        </div>
                        <span style={{ fontWeight: 600, color: '#f59e0b', minWidth: '40px', textAlign: 'right' }}>
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overtime Analysis */}
        <div className="chart-card" style={{ marginTop: '24px' }}>
          <div className="chart-title">
            <i className="bi bi-lightning"></i>
            Overtime Analysis
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f0f9ff', 
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <div style={{ fontSize: '12px', color: '#0369a1', marginBottom: '8px' }}>Total Overtime Hours</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#0c4a6e' }}>
                  {statistics.totalOvertime || 0}h
                </div>
              </div>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#fef3c7', 
                borderRadius: '8px',
                border: '1px solid #fde68a'
              }}>
                <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '8px' }}>Average per Employee</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#78350f' }}>
                  {statistics.avgOvertime || 0}h
                </div>
              </div>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f3e8ff', 
                borderRadius: '8px',
                border: '1px solid #c4b5fd'
              }}>
                <div style={{ fontSize: '12px', color: '#6b21a8', marginBottom: '8px' }}>Employees with OT</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#581c87' }}>
                  {new Set(filteredData.filter(x => x.overtime > 0).map(x => x.employeeId)).size}
                </div>
              </div>
            </div>
            
            <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px', color: '#475569' }}>
              Department-wise Overtime Distribution
            </div>
            <div>
              {analyticsData.trends?.department
                .sort((a, b) => b.overtime - a.overtime)
                .map((dept, index) => (
                  <div key={index} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 500 }}>{dept.name}</span>
                      <span style={{ color: '#475569', fontWeight: 600 }}>{dept.overtime} hours</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${(dept.overtime / Math.max(...analyticsData.trends.department.map(d => d.overtime))) * 100}%`,
                          background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="chart-card" style={{ marginTop: '24px' }}>
          <div className="chart-title">
            Peak Absence Analysis
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Peak Absence Days</div>
              <div>
                {(analyticsData.metrics?.peakAbsenceDays || ['Monday', 'Friday']).map((day, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: index < 1 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <span style={{ color: '#475569' }}>{day}</span>
                    <span style={{ fontWeight: 600, color: '#dc2626' }}>
                      {day === 'Monday' ? '68%' : day === 'Friday' ? '72%' : '60%'} absence
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>High Absence Periods</div>
              <div>
                {(analyticsData.metrics?.peakAbsencePeriods || ['January', 'December']).map((period, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: index < 1 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <span style={{ color: '#475569' }}>{period}</span>
                    <span style={{ fontWeight: 600, color: '#d97706' }}>
                      {period === 'January' ? '85%' : '82%'} higher than average
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Anomaly Detection */}
        <div className="chart-card" style={{ marginTop: '24px' }}>
          <div className="chart-title">
            <i className="bi bi-exclamation-circle" style={{ color: '#dc2626' }}></i>
            Attendance Anomaly Detection
          </div>
          
          {/* Anomaly Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px', marginTop: '16px' }}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fee2e2', 
              borderRadius: '8px',
              border: '1px solid #fca5a5'
            }}>
              <div style={{ fontSize: '12px', color: '#991b1b', marginBottom: '8px' }}>Total Anomalies</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#7f1d1d' }}>
                {attendanceAnomalies.stats?.total || 0}
              </div>
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fee2e2', 
              borderRadius: '8px',
              border: '1px solid #f87171'
            }}>
              <div style={{ fontSize: '12px', color: '#991b1b', marginBottom: '8px' }}>High Severity</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#7f1d1d' }}>
                {attendanceAnomalies.stats?.bySeverity?.high || 0}
              </div>
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fef3c7', 
              borderRadius: '8px',
              border: '1px solid #fde68a'
            }}>
              <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '8px' }}>Medium Severity</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#78350f' }}>
                {attendanceAnomalies.stats?.bySeverity?.medium || 0}
              </div>
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#dbeafe', 
              borderRadius: '8px',
              border: '1px solid #93c5fd'
            }}>
              <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '8px' }}>Affected Employees</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e3a8a' }}>
                {new Set(attendanceAnomalies.anomalies?.map(a => a.employeeId) || []).size}
              </div>
            </div>
          </div>

          {/* Anomaly Types Distribution */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px', color: '#475569' }}>
              Anomalies by Type
            </div>
            <div>
              {Object.entries(attendanceAnomalies.stats?.byType || {}).map(([type, count]) => {
                const typeLabels = {
                  consecutive_late: 'Consecutive Late Arrivals',
                  high_absenteeism: 'High Absenteeism',
                  frequent_late: 'Frequent Late Arrivals',
                  excessive_overtime: 'Excessive Overtime',
                  consecutive_absent: 'Consecutive Absences',
                  pattern_detection: 'Pattern Detection',
                  severe_lateness: 'Severe Lateness',
                };
                return (
                  <div key={type} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 500 }}>{typeLabels[type] || type}</span>
                      <span style={{ color: '#475569', fontWeight: 600 }}>{count}</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${(count / (attendanceAnomalies.stats?.total || 1)) * 100}%`,
                          background: 'linear-gradient(90deg, #dc2626, #ef4444)',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Anomaly List */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px', color: '#475569' }}>
              Detected Anomalies ({attendanceAnomalies.anomalies?.length || 0})
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', position: 'sticky', top: 0 }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Employee</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Anomaly Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Metric</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceAnomalies.anomalies?.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        <i className="bi bi-check-circle" style={{ fontSize: '32px', opacity: 0.3, marginBottom: '12px' }}></i>
                        <div>No anomalies detected</div>
                      </td>
                    </tr>
                  ) : (
                    attendanceAnomalies.anomalies
                      .sort((a, b) => {
                        const severityOrder = { high: 3, medium: 2, low: 1 };
                        return severityOrder[b.severity] - severityOrder[a.severity];
                      })
                      .map((anomaly, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px' }}>
                            <div>
                              <div style={{ fontWeight: 500, color: '#1e293b' }}>{anomaly.employeeName}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>{anomaly.department}</div>
                            </div>
                          </td>
                          <td style={{ padding: '14px', color: '#475569' }}>
                            {anomaly.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </td>
                          <td style={{ padding: '14px', color: '#475569', fontSize: '13px' }}>
                            {anomaly.metric}
                          </td>
                          <td style={{ padding: '14px', textAlign: 'center' }}>
                            <span style={{ 
                              padding: '4px 12px', 
                              backgroundColor: anomaly.severity === 'high' ? '#fee2e2' : '#fef3c7',
                              color: anomaly.severity === 'high' ? '#991b1b' : '#92400e',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase'
                            }}>
                              {anomaly.severity}
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Department Comparison */}
        <div className="chart-card" style={{ marginTop: '24px' }}>
          <div className="chart-title">
            <i className="bi bi-building"></i>
            Department-wise Attendance Comparison
          </div>
          <div style={{ marginTop: '16px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Department</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Present %</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Absent %</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Late %</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Overtime</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.trends?.department.map((dept, index) => {
                  const score = dept.present - (dept.absent * 2) - (dept.late * 0.5) + (dept.overtime * 0.1);
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px', fontWeight: 500, color: '#1e293b' }}>{dept.name}</td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#d1fae5', 
                          color: '#065f46',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {dept.present}%
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#fee2e2', 
                          color: '#991b1b',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {dept.absent}%
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#fef3c7', 
                          color: '#92400e',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {dept.late}%
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center', color: '#475569' }}>{dept.overtime}h</td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          backgroundColor: score >= 90 ? '#d1fae5' : score >= 80 ? '#fef3c7' : '#fee2e2',
                          color: score >= 90 ? '#065f46' : score >= 80 ? '#92400e' : '#991b1b',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 700
                        }}>
                          {score.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderAlerts = () => {
    const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
    
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h6 style={{ fontSize: 20, fontWeight: 600, color: '#1e293b' }}>
              <i className="bi bi-bell"></i> Predictive Alerts & Anomaly Detection
            </h6>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
              {unacknowledgedAlerts.length} unacknowledged alerts
            </div>
          </div>
          <button 
            className="btn-secondary" 
            style={{ backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' }}
            onClick={() => {
              // Configure alerts functionality
              alert('Alert configuration panel would open here.\n\nYou can:\n• Set threshold values\n• Configure notification channels\n• Define escalation rules\n• Customize alert templates');
            }}
          >
            <i className="bi bi-gear"></i>
            Configure Alerts
          </button>
        </div>

        {/* Alert Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#fee2e2', 
            borderRadius: '8px',
            border: '1px solid #fca5a5'
          }}>
            <div style={{ fontSize: '12px', color: '#991b1b', marginBottom: '8px' }}>High Priority</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#7f1d1d' }}>
              {alerts.filter(a => a.severity === 'high').length}
            </div>
          </div>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#fef3c7', 
            borderRadius: '8px',
            border: '1px solid #fde68a'
          }}>
            <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '8px' }}>Medium Priority</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#78350f' }}>
              {alerts.filter(a => a.severity === 'medium').length}
            </div>
          </div>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#dbeafe', 
            borderRadius: '8px',
            border: '1px solid #93c5fd'
          }}>
            <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '8px' }}>Unacknowledged</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#1e3a8a' }}>
              {unacknowledgedAlerts.length}
            </div>
          </div>
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#d1fae5', 
            borderRadius: '8px',
            border: '1px solid #86efac'
          }}>
            <div style={{ fontSize: '12px', color: '#065f46', marginBottom: '8px' }}>Acknowledged</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#064e3b' }}>
              {alerts.filter(a => a.acknowledged).length}
            </div>
          </div>
        </div>

        {unacknowledgedAlerts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '2px dashed #e2e8f0'
          }}>
            <i className="bi bi-check-circle" style={{ fontSize: '48px', color: '#10b981', marginBottom: '16px' }}></i>
            <div style={{ fontSize: '16px', color: '#475569', marginBottom: '8px' }}>
              All alerts have been acknowledged
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>
              No pending alerts requiring your attention
            </div>
          </div>
        ) : (
          <>
            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '12px 16px', 
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fde68a'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="bi bi-exclamation-circle" style={{ color: '#d97706' }}></i>
                <div>
                  <span style={{ fontWeight: 600, color: '#92400e' }}>
                    {unacknowledgedAlerts.length} alerts require your attention
                  </span>
                  <span style={{ color: '#64748b', fontSize: '13px', marginLeft: '12px' }}>
                    • Click "View Pattern" to see detailed analysis • Click "Acknowledge" to mark as reviewed
                  </span>
                </div>
              </div>
            </div>

            <div className="alerts-grid">
              {unacknowledgedAlerts.map(alert => (
                <div key={alert.id} className={`alert-card alert-${alert.severity}`}>
                  <div className="alert-header">
                    <i className="bi bi-exclamation-circle"></i>
                    <div className="alert-title">
                      {alert.type.toUpperCase()} ALERT
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b' }}>
                      {alert.date}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                    {alert.employee ? `${alert.employee}: ${alert.message}` : alert.message}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                    >
                      <i className="bi bi-check-circle"></i>
                      Acknowledge
                    </button>
                    <button 
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onClick={() => handleViewPattern(alert)}
                    >
                      <i className="bi bi-eye"></i>
                      View Pattern
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="chart-card" style={{ marginTop: '24px' }}>
          <div className="chart-title">
            <i className="bi bi-shield-check"></i>
            Anomaly Detection Rules
          </div>
          <div style={{ marginTop: '16px' }}>
            {[
              { rule: 'Consecutive Late Arrivals', threshold: '3 consecutive days', count: 12, color: '#ef4444', icon: 'bi-clock-history' },
              { rule: 'Frequent Absence Pattern', threshold: 'Same day weekly absence', count: 8, color: '#f59e0b', icon: 'bi-calendar-week' },
              { rule: 'Excessive Overtime', threshold: '>15 hours per week', count: 5, color: '#3b82f6', icon: 'bi-lightning' },
              { rule: 'Department Threshold', threshold: 'Absenteeism rate > 8%', count: 2, color: '#8b5cf6', icon: 'bi-building' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: '18px' }}></i>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{item.rule}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Trigger: {item.threshold}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: item.color }}>
                    {item.count}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    This month
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  /* -----------------------
     MAIN RENDER
     ----------------------- */
  return (
    <>
      <style>{styles}</style>
      
      {/* Bootstrap Icons CSS */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" 
      />

      <div className="page">
        {/* HEADER */}
        <div className="header-top">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="bi bi-bar-chart" style={{ fontSize: '24px', color: '#1e293b' }}></i>
            </div>
            <div>
              <div className="header-title">Attendance Reports & Analytics</div>
              <div className="header-sub">
                <span><i className="bi bi-dashboard"></i> HRMS Dashboard</span>
                <span>•</span>
                <span><i className="bi bi-tag"></i> Version 3.8</span>
                <span>•</span>
                <span><i className="bi bi-graph-up"></i> Comprehensive analytics and insights</span>
              </div>
            </div>
          </div>

          {/* SEARCH + ROLE */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ position: "relative" }}>
              <i className="bi bi-search" style={{ 
                position: "absolute", 
                left: "12px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "#94a3b8", 
                fontSize: "16px",
                zIndex: 1
              }}></i>
              <input
                className="search-box"
                placeholder="Search reports or employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "40px" }}
              />
            </div>

            <CustomRoleDropdown value={role} onChange={setRole} />
          </div>
        </div>

        {/* FILTERS SECTION WITH DROPDOWN ARROWS */}
        <div className="filter-section">
          <div className="filter-row">
            <div className="filter-select-container">
              <select
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <i className="bi bi-chevron-down filter-select-arrow"></i>
            </div>

            <div className="filter-select-container">
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
              <i className="bi bi-chevron-down filter-select-arrow"></i>
            </div>

            <div className="filter-select-container">
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="all">All Locations</option>
                <option value="HQ">Headquarters</option>
                <option value="Branch A">Branch A</option>
                <option value="Branch B">Branch B</option>
                <option value="Remote">Remote</option>
              </select>
              <i className="bi bi-chevron-down filter-select-arrow"></i>
            </div>

            <div className="filter-select-container">
              <select
                value={filters.employee}
                onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
              >
                <option value="all">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
              <i className="bi bi-chevron-down filter-select-arrow"></i>
            </div>

            <div className="filter-actions">
              <button 
                className="btn-secondary"
                onClick={(e) => {
                  // Reset filters to initial state
                  setFilters({
                    date: "month",
                    department: "all",
                    location: "all",
                    employee: "all",
                  });
                  setSearch(""); // Also reset search if needed
                  
                  // Show loading state on button
                  const btn = e.currentTarget;
                  const originalContent = btn.innerHTML;
                  btn.innerHTML = '<span>Resetting...</span>';
                  btn.disabled = true;
                  
                  setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                  }, 500);
                }}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="kpi-section">
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-content">
                <div className="kpi-label">Present Rate</div>
                <div className="kpi-value">{statistics.presentRate || 0}%</div>
                <div className="kpi-trend">
                  <i className="bi bi-graph-up"></i>
                  +2.1% from last month
                </div>
              </div>
              <div className="kpi-icon present">
                <i className="bi bi-check-circle"></i>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-content">
                <div className="kpi-label">Absent Rate</div>
                <div className="kpi-value">{statistics.absentRate || 0}%</div>
                <div className="kpi-trend" style={{ color: '#ef4444' }}>
                  <i className="bi bi-graph-up"></i>
                  -0.3% from last month
                </div>
              </div>
              <div className="kpi-icon absent">
                <i className="bi bi-x-circle"></i>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-content">
                <div className="kpi-label">Late Arrivals</div>
                <div className="kpi-value">{statistics.lateRate || 0}%</div>
                <div className="kpi-trend" style={{ color: '#f59e0b' }}>
                  <i className="bi bi-exclamation-circle"></i>
                  Requires attention
                </div>
              </div>
              <div className="kpi-icon late">
                <i className="bi bi-clock"></i>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-content">
                <div className="kpi-label">Total Overtime</div>
                <div className="kpi-value">{statistics.totalOvertime || 0}h</div>
                <div className="kpi-trend">
                  <i className="bi bi-lightning"></i>
                  {statistics.avgOvertime || 0}h avg per employee
                </div>
              </div>
              <div className="kpi-icon overtime">
                <i className="bi bi-lightning"></i>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-content">
                <div className="kpi-label">Punctuality Score</div>
                <div className="kpi-value">{analyticsData.metrics?.punctualityScore || 0}%</div>
                <div className="kpi-trend">
                  <i className="bi bi-bullseye"></i>
                  Target: 90% ✓
                </div>
              </div>
              <div className="kpi-icon punctuality">
                <i className="bi bi-bullseye"></i>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-content">
                <div className="kpi-label">Consistency Score</div>
                <div className="kpi-value">{analyticsData.metrics?.attendanceConsistency || 0}%</div>
                <div className="kpi-trend">
                  <i className="bi bi-graph-up"></i>
                  Very Good
                </div>
              </div>
              <div className="kpi-icon consistency">
                <i className="bi bi-activity"></i>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-content">
                <div className="kpi-label">Alerts</div>
                <div className="kpi-value">{alerts.length}</div>
                <div className="kpi-trend" style={{ color: '#d97706' }}>
                  <i className="bi bi-bell"></i>
                  Requires review
                </div>
              </div>
              <div className="kpi-icon alerts">
                <i className="bi bi-bell"></i>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-content">
                <div className="kpi-label">Leave Utilization</div>
                <div className="kpi-value">{analyticsData.metrics?.leaveUtilization || 0}%</div>
                <div className="kpi-trend" style={{ color: '#8b5cf6' }}>
                  <i className="bi bi-calendar"></i>
                  Optimal range
                </div>
              </div>
              <div className="kpi-icon leave">
                <i className="bi bi-calendar"></i>
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
            <i className="bi bi-house"></i>
            Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <i className="bi bi-file-text"></i>
            Reports
          </button>
          <button
            className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <i className="bi bi-bar-chart"></i>
            Analytics
          </button>
          <button
            className={`tab-btn ${activeTab === "exceptions" ? "active" : ""}`}
            onClick={() => setActiveTab("exceptions")}
          >
            <i className="bi bi-exclamation-circle"></i>
            Exceptions
          </button>
          <button
            className={`tab-btn ${activeTab === "alerts" ? "active" : ""}`}
            onClick={() => setActiveTab("alerts")}
          >
            <i className="bi bi-bell"></i>
            Alerts
          </button>
          {(role === "hr" || role === "admin") && (
            <button
              className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <i className="bi bi-gear"></i>
              Settings
            </button>
          )}
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content">
          {renderTabContent()}
        </div>

        {/* EXPORT MODAL */}
        {renderExportModal()}
        
        {/* PATTERN MODAL */}
        <PatternModal />
        
        {/* ACKNOWLEDGE TOAST */}
        <AcknowledgeToast />
      </div>
    </>
  );
};

export default AttendanceReports;