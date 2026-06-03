// src\components\HRMS\Reports&Analytics\AIDrivenInsights.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, AreaChart, Area, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  AlertTriangle, TrendingUp, TrendingDown, Bell, Lightbulb, 
  MessageSquare, Search, Filter, Download, ChevronRight, 
  Users, Calendar, Clock, FileWarning, Target, Zap,
  Activity, ShieldAlert, Brain, BarChart3, Sparkles,
  Calculator, AlertCircle, CheckCircle, X, Eye, MoreVertical,
  Settings, RefreshCw, Save, Upload, Trash2, Send, History,
  ThumbsUp, ThumbsDown, Copy, Star, Award, TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon, LineChart as LineChartIcon
} from 'lucide-react';

// Mock data for AI-driven insights
const mockAnomalyData = [
  { id: 1, type: 'Attendance', description: 'Unusual login pattern detected', employee: 'John Doe', department: 'Engineering', severity: 'high', date: '2024-04-15', status: 'pending', confidence: 92 },
  { id: 2, type: 'Leave', description: 'Sudden spike in leave applications', department: 'Sales', severity: 'medium', date: '2024-04-14', status: 'reviewed', confidence: 78 },
  { id: 3, type: 'Expense', description: 'Suspicious expense claim detected', employee: 'Jane Smith', department: 'Marketing', severity: 'high', date: '2024-04-13', status: 'pending', confidence: 95 },
  { id: 4, type: 'Attendance', description: 'Multiple late arrivals', employee: 'Mike Johnson', department: 'HR', severity: 'low', date: '2024-04-12', status: 'resolved', confidence: 65 },
  { id: 5, type: 'Policy', description: 'Policy violation detected', employee: 'Sarah Williams', department: 'Finance', severity: 'medium', date: '2024-04-11', status: 'pending', confidence: 82 },
  { id: 6, type: 'Payroll', description: 'Payroll calculation anomaly detected', employee: 'Robert Chen', department: 'Engineering', severity: 'high', date: '2024-04-10', status: 'pending', confidence: 88 },
  { id: 7, type: 'Attendance', description: 'Excessive overtime detected', employee: 'Lisa Wang', department: 'Operations', severity: 'medium', date: '2024-04-09', status: 'reviewed', confidence: 71 },
  { id: 8, type: 'Expense', description: 'Duplicate expense claims found', employee: 'David Kim', department: 'Marketing', severity: 'low', date: '2024-04-08', status: 'resolved', confidence: 60 },
];

const mockAttritionRiskData = [
  { id: 1, name: 'John Doe', department: 'Engineering', role: 'Senior Developer', riskScore: 85, riskLevel: 'high', lastPromotion: '2023-06-15', tenure: 2.5, engagement: 65, salaryPercentile: 75 },
  { id: 2, name: 'Jane Smith', department: 'Marketing', role: 'Marketing Manager', riskScore: 72, riskLevel: 'medium', lastPromotion: '2022-11-20', tenure: 3.2, engagement: 58, salaryPercentile: 65 },
  { id: 3, name: 'Mike Johnson', department: 'HR', role: 'HR Specialist', riskScore: 45, riskLevel: 'low', lastPromotion: '2024-01-15', tenure: 1.5, engagement: 82, salaryPercentile: 85 },
  { id: 4, name: 'Sarah Williams', department: 'Finance', role: 'Financial Analyst', riskScore: 68, riskLevel: 'medium', lastPromotion: '2023-09-10', tenure: 2.8, engagement: 71, salaryPercentile: 70 },
  { id: 5, name: 'Robert Brown', department: 'Sales', role: 'Sales Executive', riskScore: 91, riskLevel: 'high', lastPromotion: '2022-08-05', tenure: 4.1, engagement: 49, salaryPercentile: 55 },
  { id: 6, name: 'Lisa Wang', department: 'Engineering', role: 'Tech Lead', riskScore: 79, riskLevel: 'medium', lastPromotion: '2023-03-20', tenure: 3.8, engagement: 62, salaryPercentile: 80 },
  { id: 7, name: 'David Kim', department: 'Marketing', role: 'Content Strategist', riskScore: 56, riskLevel: 'low', lastPromotion: '2024-02-10', tenure: 1.8, engagement: 78, salaryPercentile: 72 },
  { id: 8, name: 'Emily Chen', department: 'Operations', role: 'Operations Manager', riskScore: 83, riskLevel: 'high', lastPromotion: '2022-12-15', tenure: 3.5, engagement: 54, salaryPercentile: 68 },
];

const mockPredictiveData = [
  { month: 'Jan', attrition: 3, payroll: 125000, leaves: 42, hiring: 8, training: 12 },
  { month: 'Feb', attrition: 2, payroll: 128000, leaves: 38, hiring: 6, training: 10 },
  { month: 'Mar', attrition: 4, payroll: 131000, leaves: 45, hiring: 9, training: 15 },
  { month: 'Apr', attrition: 5, payroll: 135000, leaves: 48, hiring: 7, training: 14 },
  { month: 'May', attrition: 7, payroll: 138000, leaves: 52, hiring: 10, training: 18 },
  { month: 'Jun', attrition: 6, payroll: 142000, leaves: 50, hiring: 8, training: 16 },
  { month: 'Jul', attrition: 8, payroll: 145000, leaves: 55, hiring: 12, training: 20 },
  { month: 'Aug', attrition: 9, payroll: 148000, leaves: 58, hiring: 11, training: 22 },
];

const mockRecommendations = [
  { id: 1, type: 'Retention', title: 'High attrition risk in Engineering', description: '3 employees with >80% flight risk score. Consider retention bonuses or promotions.', priority: 'high', impact: 'High', status: 'pending', cost: 25000, roi: 4.2 },
  { id: 2, type: 'Hiring', title: 'Optimal hiring timing for Q3', description: 'Based on historical patterns and current workload, Q3 has 30% lower hiring costs.', priority: 'medium', impact: 'Medium', status: 'approved', cost: 15000, roi: 2.8 },
  { id: 3, type: 'Policy', title: 'Leave policy optimization needed', description: 'High leave utilization in summer months. Consider flexible leave options.', priority: 'medium', impact: 'Medium', status: 'pending', cost: 5000, roi: 3.1 },
  { id: 4, type: 'Budget', title: 'Budget overrun warning', description: 'Marketing department expenses 15% above budget. Review marketing campaigns.', priority: 'high', impact: 'High', status: 'in-progress', cost: 0, roi: 5.0 },
  { id: 5, type: 'Training', title: 'Training needs identified', description: 'Skill gaps detected in 5 departments. AI/ML training recommended.', priority: 'low', impact: 'Low', status: 'pending', cost: 20000, roi: 2.5 },
  { id: 6, type: 'Compensation', title: 'Salary benchmarking adjustment', description: 'Engineering salaries 8% below market average. Consider salary adjustments.', priority: 'high', impact: 'High', status: 'review', cost: 100000, roi: 3.8 },
];

const mockNLPQueries = [
  { id: 1, query: "Show me attrition in engineering last quarter", response: "Engineering had 4 attrition cases last quarter with an average cost of $85,000 per case. The main reasons were competitive offers (60%) and career growth (40%)." },
  { id: 2, query: "What's the average time to hire for marketing roles?", response: "Average time to hire for marketing roles is 32 days. This is 5 days longer than the industry average of 27 days." },
  { id: 3, query: "Which department has the highest expenses?", response: "Sales department has the highest expenses at $450,000 last quarter, which is 22% above budget. Main expenses include travel (45%) and client entertainment (30%)." },
  { id: 4, query: "Show employee engagement trends", response: "Overall employee engagement dropped 8% in Q2. Engineering saw the largest decline at 12%, while HR maintained stable engagement at 82%." },
  { id: 5, query: "Predict attrition for next quarter", response: "Based on current trends, predicted attrition for next quarter is 7-9 employees. High-risk departments: Engineering (3), Sales (2), Marketing (2)." },
  { id: 6, query: "Show budget utilization by department", response: "Budget utilization: Engineering 95%, Sales 122%, Marketing 115%, HR 88%, Finance 92%. Sales and Marketing are over budget." },
];

const anomalyTypeColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981'
};

const riskLevelColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981'
};

const AIModels = {
  ANOMALY_DETECTION: { name: 'Anomaly Detection Model', accuracy: 92, version: '2.1.0' },
  ATTRITION_PREDICTION: { name: 'Attrition Prediction Model', accuracy: 87, version: '3.0.1' },
  FORECASTING: { name: 'HR Forecasting Model', accuracy: 85, version: '1.8.2' },
  NLP: { name: 'Natural Language Processing', accuracy: 89, version: '2.0.0' },
  RECOMMENDATION: { name: 'Recommendation Engine', accuracy: 83, version: '1.5.0' }
};

// =====================
// 1. BREADCRUMB COMPONENT
// =====================

const BreadcrumbComponent = ({ items = [] }) => {
  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb mb-0">
        {items.map((item, index) => (
          <li 
            key={index} 
            className={`breadcrumb-item ${item.active ? 'active' : ''}`}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.link && !item.active ? (
              <a href={item.link} className="text-decoration-none">{item.label}</a>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// =====================
// 2. EXPORT MODAL COMPONENT
// =====================

const ExportModal = ({ 
  show, 
  onClose, 
  exportData, 
  exportFormat, 
  setExportFormat,
  availableFormats = ['csv', 'json', 'pdf', 'excel']
}) => {
  if (!show) return null;

  const exportOptions = [
    { id: 'anomalies', label: 'Anomalies Report', description: 'All detected anomalies with details' },
    { id: 'attrition', label: 'Attrition Risk Report', description: 'Employee attrition risk scores and factors' },
    { id: 'predictions', label: 'Predictive Analytics', description: 'Forecast data and predictions' },
    { id: 'recommendations', label: 'AI Recommendations', description: 'All AI-generated recommendations' },
    { id: 'summary', label: 'Executive Summary', description: 'High-level insights summary' },
  ];

  return (
    <div className="modal fade show d-block" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Download size={20} />
              Export Insights
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <h6 className="mb-2">Select Format</h6>
              <div className="d-flex flex-wrap gap-2">
                {availableFormats.map(format => (
                  <button
                    key={format}
                    className={`btn ${exportFormat === format ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setExportFormat(format)}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h6 className="mb-2">Select Reports to Export</h6>
              <div className="list-group">
                {exportOptions.map(option => (
                  <div key={option.id} className="list-group-item">
                    <div className="form-check d-flex align-items-center justify-content-between">
                      <div>
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          id={`export-${option.id}`}
                          defaultChecked
                        />
                        <label className="form-check-label fw-medium" htmlFor={`export-${option.id}`}>
                          {option.label}
                        </label>
                        <div className="text-muted small">{option.description}</div>
                      </div>
                      <span className="badge bg-light text-dark">
                        {exportFormat}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h6 className="mb-2">Export Options</h6>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="include-charts" />
                <label className="form-check-label" htmlFor="include-charts">
                  Include charts and visualizations
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="compressed" defaultChecked />
                <label className="form-check-label" htmlFor="compressed">
                  Compress files (ZIP)
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="watermark" />
                <label className="form-check-label" htmlFor="watermark">
                  Add company watermark
                </label>
              </div>
            </div>

            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              Exports may take a few moments depending on data size.
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                exportData('summary');
                onClose();
              }}
            >
              <Download size={16} className="me-2" />
              Export All Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================
// 3. SETTINGS PANEL COMPONENT - FIXED VERSION
// =====================

const SettingsPanel = ({ 
  show, 
  onClose, 
  settings, 
  onSettingsChange,
  AIModels,
  selectedModel,
  onModelChange 
}) => {
  if (!show) return null;

  const modelOptions = [
    { id: 'ANOMALY_DETECTION', label: 'Anomaly Detection', color: '#3b82f6' },
    { id: 'ATTRITION_PREDICTION', label: 'Attrition Prediction', color: '#ef4444' },
    { id: 'FORECASTING', label: 'HR Forecasting', color: '#10b981' },
    { id: 'NLP', label: 'Natural Language Processing', color: '#8b5cf6' },
    { id: 'RECOMMENDATION', label: 'Recommendation Engine', color: '#f59e0b' },
  ];

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
    onClose();
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1040,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        zIndex: 1050
      }}>
        <div className="modal-header" style={{
          padding: '1rem',
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h5 className="modal-title d-flex align-items-center gap-2" style={{ margin: 0 }}>
            <Settings size={20} />
            AI Model Settings & Configuration
          </h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: 0,
              width: '30px',
              height: '30px'
            }}
          >
            ×
          </button>
        </div>
        <div className="modal-body" style={{ padding: '1rem' }}>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="card h-100" style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
                <div className="card-header" style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderBottom: '1px solid #dee2e6',
                  padding: '0.75rem 1rem'
                }}>
                  <h6 className="mb-0" style={{ fontWeight: '600' }}>AI Model Configuration</h6>
                </div>
                <div className="card-body" style={{ padding: '1rem' }}>
                  {modelOptions.map(model => (
                    <div key={model.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="aiModel"
                            id={`model-${model.id}`}
                            value={model.id}
                            checked={selectedModel === model.id}
                            onChange={(e) => onModelChange(e.target.value)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          <label className="form-check-label fw-medium" htmlFor={`model-${model.id}`} style={{ cursor: 'pointer' }}>
                            {model.label}
                          </label>
                        </div>
                        <span className="badge" style={{ 
                          backgroundColor: model.color, 
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px'
                        }}>
                          {AIModels[model.id]?.accuracy || 85}%
                        </span>
                      </div>
                      {AIModels[model.id] && (
                        <div className="text-muted small">
                          v{AIModels[model.id].version} • Trained on {Math.floor(Math.random() * 100) + 50}K data points
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card h-100" style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
                <div className="card-header" style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderBottom: '1px solid #dee2e6',
                  padding: '0.75rem 1rem'
                }}>
                  <h6 className="mb-0" style={{ fontWeight: '600' }}>Detection Settings</h6>
                </div>
                <div className="card-body" style={{ padding: '1rem' }}>
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                      Confidence Threshold
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min="50"
                      max="95"
                      value={settings.confidenceThreshold}
                      onChange={(e) => onSettingsChange('confidenceThreshold', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <div className="d-flex justify-content-between mt-1">
                      <small className="text-muted">Low ({settings.confidenceThreshold}%)</small>
                      <small className="fw-semibold">{settings.confidenceThreshold}%</small>
                      <small className="text-muted">High (95%)</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                      Alert Frequency
                    </label>
                    <select 
                      className="form-select"
                      value={settings.alertFrequency}
                      onChange={(e) => onSettingsChange('alertFrequency', e.target.value)}
                      style={{ width: '100%', padding: '0.375rem 0.75rem' }}
                    >
                      <option value="realtime">Real-time</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Summary</option>
                      <option value="weekly">Weekly Report</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                      Data Retention
                    </label>
                    <select 
                      className="form-select"
                      value={settings.dataRetention}
                      onChange={(e) => onSettingsChange('dataRetention', e.target.value)}
                      style={{ width: '100%', padding: '0.375rem 0.75rem' }}
                    >
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180">6 months</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.autoRetrain}
                      onChange={(e) => onSettingsChange('autoRetrain', e.target.checked)}
                      id="autoRetrain"
                      style={{ marginRight: '0.5rem' }}
                    />
                    <label className="form-check-label" htmlFor="autoRetrain" style={{ cursor: 'pointer' }}>
                      Auto-retrain models weekly
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card" style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
                <div className="card-header" style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderBottom: '1px solid #dee2e6',
                  padding: '0.75rem 1rem'
                }}>
                  <h6 className="mb-0" style={{ fontWeight: '600' }}>Advanced Settings</h6>
                </div>
                <div className="card-body" style={{ padding: '1rem' }}>
                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <div className="form-check form-switch d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={settings.predictiveMode}
                          onChange={(e) => onSettingsChange('predictiveMode', e.target.checked)}
                          id="predictiveMode"
                          style={{ marginRight: '0.5rem' }}
                        />
                        <label className="form-check-label" htmlFor="predictiveMode" style={{ cursor: 'pointer' }}>
                          Predictive Mode
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="form-check form-switch d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={settings.ensembleLearning}
                          onChange={(e) => onSettingsChange('ensembleLearning', e.target.checked)}
                          id="ensembleLearning"
                          style={{ marginRight: '0.5rem' }}
                        />
                        <label className="form-check-label" htmlFor="ensembleLearning" style={{ cursor: 'pointer' }}>
                          Ensemble Learning
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="form-check form-switch d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={settings.deepAnalysis}
                          onChange={(e) => onSettingsChange('deepAnalysis', e.target.checked)}
                          id="deepAnalysis"
                          style={{ marginRight: '0.5rem' }}
                        />
                        <label className="form-check-label" htmlFor="deepAnalysis" style={{ cursor: 'pointer' }}>
                          Deep Analysis
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{
          padding: '1rem',
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem'
        }}>
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================
// 4. INSIGHT COMPARISON COMPONENT
// =====================

const InsightComparison = ({ 
  currentData, 
  previousData, 
  timeframe = 'month',
  metrics = ['attrition', 'anomalies', 'riskScore']
}) => {
  const getComparison = (current, previous) => {
    if (!previous || previous === 0) return { change: 0, trend: 'neutral' };
    const change = ((current - previous) / previous) * 100;
    return {
      change: Math.abs(change).toFixed(1),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const comparisons = {
    attrition: getComparison(currentData.attrition, previousData?.attrition),
    anomalies: getComparison(currentData.anomalies, previousData?.anomalies),
    riskScore: getComparison(currentData.avgRiskScore, previousData?.avgRiskScore),
  };

  return (
    <div className="card">
      <div className="card-header">
        <h6 className="mb-0">Insight Comparison</h6>
        <small className="text-muted">vs Previous {timeframe}</small>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {metrics.map(metric => {
            const comp = comparisons[metric];
            return (
              <div key={metric} className="col-12 col-md-4">
                <div className="card bg-light">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small text-uppercase">
                          {metric === 'attrition' ? 'Attrition Rate' : 
                           metric === 'anomalies' ? 'Anomalies' : 'Avg Risk Score'}
                        </div>
                        <div className="h5 mb-0">{currentData[metric]}</div>
                      </div>
                      <div className="text-end">
                        <div className={`d-flex align-items-center gap-1 ${comp.trend === 'up' ? 'text-danger' : comp.trend === 'down' ? 'text-success' : 'text-muted'}`}>
                          {comp.trend === 'up' ? <TrendingUp size={16} /> : 
                           comp.trend === 'down' ? <TrendingDown size={16} /> : 
                           <Activity size={16} />}
                          <span className="fw-semibold">{comp.change}%</span>
                        </div>
                        <small className="text-muted">
                          {comp.trend === 'up' ? 'Increase' : comp.trend === 'down' ? 'Decrease' : 'No change'}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =====================
// 5. ALERT MANAGEMENT COMPONENT
// =====================

const AlertManagement = ({ 
  alerts, 
  onAlertAction,
  filterOptions = {},
  onFilterChange,
  view = 'list'
}) => {
  const [groupedAlerts, setGroupedAlerts] = React.useState({});

  React.useEffect(() => {
    // Group alerts by severity
    const grouped = alerts.reduce((acc, alert) => {
      const key = alert.severity || 'medium';
      if (!acc[key]) acc[key] = [];
      acc[key].push(alert);
      return acc;
    }, {});

    setGroupedAlerts(grouped);
  }, [alerts]);

  const severityColors = {
    high: 'danger',
    medium: 'warning',
    low: 'info',
    info: 'primary'
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'high': return <AlertTriangle size={16} />;
      case 'medium': return <Bell size={16} />;
      case 'low': return <Info size={16} />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Alert Management</h6>
        <div className="d-flex gap-2">
          <select 
            className="form-select form-select-sm"
            value={filterOptions.severity || 'all'}
            onChange={(e) => onFilterChange('severity', e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="high">High Only</option>
            <option value="medium">Medium Only</option>
            <option value="low">Low Only</option>
          </select>
          <select 
            className="form-select form-select-sm"
            value={filterOptions.status || 'all'}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>
      <div className="card-body">
        {view === 'grouped' ? (
          // Grouped View
          <div className="accordion" id="alertsAccordion">
            {Object.entries(groupedAlerts).map(([severity, severityAlerts]) => (
              <div key={severity} className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${severity}`}
                  >
                    <span className={`badge bg-${severityColors[severity]} me-2`}>
                      {getSeverityIcon(severity)}
                    </span>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)} Alerts
                    <span className="badge bg-light text-dark ms-2">
                      {severityAlerts.length}
                    </span>
                  </button>
                </h2>
                <div id={`collapse-${severity}`} className="accordion-collapse collapse show">
                  <div className="accordion-body p-0">
                    <div className="list-group list-group-flush">
                      {severityAlerts.map(alert => (
                        <div key={alert.id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-medium">{alert.title}</div>
                              <div className="text-muted small">{alert.description}</div>
                            </div>
                            <div className="d-flex gap-1">
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => onAlertAction(alert.id, 'resolve')}
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => onAlertAction(alert.id, 'review')}
                              >
                                <Clock size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Alert</th>
                  <th>Status</th>
                  <th>Detected</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(alert => (
                  <tr key={alert.id}>
                    <td>
                      <span className={`badge bg-${severityColors[alert.severity]}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td>
                      <div className="fw-medium">{alert.title}</div>
                      <small className="text-muted">{alert.description}</small>
                    </td>
                    <td>
                      <span className={`badge ${
                        alert.status === 'pending' ? 'bg-warning' :
                        alert.status === 'reviewed' ? 'bg-info' : 'bg-success'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                    <td>
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-success"
                          onClick={() => onAlertAction(alert.id, 'resolve')}
                        >
                          Resolve
                        </button>
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => onAlertAction(alert.id, 'details')}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Total: {alerts.length} alerts • Pending: {alerts.filter(a => a.status === 'pending').length}
          </small>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => onAlertAction('all', 'resolve')}
            >
              Resolve All
            </button>
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={() => onAlertAction('all', 'dismiss')}
            >
              Dismiss All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================
// ADDITIONAL ICON (Info)
// =====================
const Info = ({ size = 16, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// Helper List Icon component
const ListIcon = ({ size = 16, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// Main AI Insights Component
function AIDrivenInsightsContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlertDetails, setShowAlertDetails] = useState(null);
  const [nlpInput, setNlpInput] = useState('');
  const [nlpResponse, setNlpResponse] = useState('');
  const [isProcessingNLP, setIsProcessingNLP] = useState(false);
  const [anomalyData, setAnomalyData] = useState(mockAnomalyData);
  const [attritionRiskData, setAttritionRiskData] = useState(mockAttritionRiskData);
  const [predictiveData, setPredictiveData] = useState(mockPredictiveData);
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [nlpHistory, setNlpHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState('ANOMALY_DETECTION');
  const [simulationMode, setSimulationMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [insightThreshold, setInsightThreshold] = useState(75);
  const [viewMode, setViewMode] = useState('grid');
  const [exportFormat, setExportFormat] = useState('csv');
  
  // New state variables for missing components
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [alertFilters, setAlertFilters] = useState({ severity: 'all', status: 'all' });
  const [aiSettings, setAiSettings] = useState({
    confidenceThreshold: 75,
    alertFrequency: 'daily',
    dataRetention: '90',
    autoRetrain: true,
    predictiveMode: false,
    ensembleLearning: true,
    deepAnalysis: true
  });

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshData();
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Filter anomalies
  const filteredAnomalies = useMemo(() => {
    return anomalyData.filter(anomaly => {
      if (selectedDepartment !== 'all' && anomaly.department !== selectedDepartment) return false;
      if (searchQuery && !anomaly.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !anomaly.employee?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }).filter(anomaly => anomaly.confidence >= insightThreshold);
  }, [anomalyData, selectedDepartment, searchQuery, insightThreshold]);

  // Filter attrition risk
  const filteredAttritionRisk = useMemo(() => {
    return attritionRiskData.filter(employee => {
      if (selectedDepartment !== 'all' && employee.department !== selectedDepartment) return false;
      if (searchQuery && !employee.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return employee.riskScore >= insightThreshold;
    });
  }, [attritionRiskData, selectedDepartment, searchQuery, insightThreshold]);

  // Filter recommendations
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      if (selectedDepartment !== 'all') {
        if (rec.title.toLowerCase().includes(selectedDepartment.toLowerCase())) return true;
        return false;
      }
      return true;
    });
  }, [recommendations, selectedDepartment]);

  // Calculate insights summary
  const insightsSummary = useMemo(() => {
    const highRisk = attritionRiskData.filter(e => e.riskLevel === 'high').length;
    const pendingAlerts = anomalyData.filter(a => a.status === 'pending').length;
    const highPriorityRecs = recommendations.filter(r => r.priority === 'high').length;
    const totalCostSavings = recommendations
      .filter(r => r.status === 'implemented')
      .reduce((sum, r) => sum + (r.cost * r.roi), 0);
    
    return {
      highRiskEmployees: highRisk,
      pendingAlerts,
      highPriorityRecs,
      totalAnomalies: anomalyData.length,
      avgRiskScore: Math.round(attritionRiskData.reduce((sum, e) => sum + e.riskScore, 0) / attritionRiskData.length),
      costSavings: Math.round(totalCostSavings / 1000) + 'K',
      modelAccuracy: AIModels[selectedModel].accuracy
    };
  }, [anomalyData, attritionRiskData, recommendations, selectedModel]);

  // Enhanced NLP query handler
  const handleNLPQuery = () => {
    if (!nlpInput.trim()) return;
    
    setIsProcessingNLP(true);
    
    setTimeout(() => {
      let response = "I can help you analyze HR data. Try asking about attrition, hiring metrics, expenses, or employee engagement.";
      
      const query = nlpInput.toLowerCase();
      
      if (query.includes('attrition') || query.includes('turnover')) {
        const highRisk = attritionRiskData.filter(e => e.riskLevel === 'high').length;
        response = `Currently, there are ${highRisk} high-risk employees for attrition. Top departments: ${[...new Set(attritionRiskData.filter(e => e.riskLevel === 'high').map(e => e.department))].join(', ')}`;
      } else if (query.includes('expense') || query.includes('cost')) {
        const totalExpenses = predictiveData.reduce((sum, m) => sum + m.payroll, 0);
        const avgMonthly = Math.round(totalExpenses / predictiveData.length);
        response = `Total payroll expenses: $${(totalExpenses / 1000).toFixed(0)}K, Average monthly: $${(avgMonthly / 1000).toFixed(0)}K`;
      } else if (query.includes('hiring') || query.includes('recruitment')) {
        const totalHiring = predictiveData.reduce((sum, m) => sum + m.hiring, 0);
        response = `Total predicted hiring for next year: ${totalHiring} employees. Average monthly: ${Math.round(totalHiring / predictiveData.length)}`;
      } else if (query.includes('leave') || query.includes('vacation')) {
        const totalLeaves = predictiveData.reduce((sum, m) => sum + m.leaves, 0);
        response = `Total leave days predicted: ${totalLeaves}. Peak month: ${predictiveData.reduce((max, m) => m.leaves > max.leaves ? m : max).month}`;
      } else if (query.includes('prediction') || query.includes('forecast')) {
        const nextAttrition = predictiveData[predictiveData.length - 1].attrition;
        response = `Next month's attrition forecast: ${nextAttrition} employees. Trend: ${nextAttrition > predictiveData[predictiveData.length - 2].attrition ? 'increasing' : 'decreasing'}`;
      }

      setNlpResponse(response);
      
      const newHistoryItem = {
        id: Date.now(),
        query: nlpInput,
        response,
        timestamp: new Date().toISOString()
      };
      setNlpHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      
      setIsProcessingNLP(false);
      addNotification('info', 'NLP query processed successfully');
    }, 1500);
  };

  // Add notification
  const addNotification = (type, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  // Refresh data
  const refreshData = () => {
    // Simulate data update
    const newAnomaly = {
      id: anomalyData.length + 1,
      type: ['Attendance', 'Leave', 'Expense', 'Policy'][Math.floor(Math.random() * 4)],
      description: `New anomaly detected - ${Math.random() > 0.5 ? 'pattern identified' : 'irregularity found'}`,
      employee: ['John Doe', 'Jane Smith', 'Mike Johnson'][Math.floor(Math.random() * 3)],
      department: ['Engineering', 'Sales', 'Marketing'][Math.floor(Math.random() * 3)],
      severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      confidence: Math.floor(Math.random() * 30) + 70
    };

    setAnomalyData(prev => [newAnomaly, ...prev.slice(0, 9)]);
    addNotification('info', 'Data refreshed with new insights');
  };

  // Export data
  const exportData = (type) => {
    let data = [];
    let filename = '';
    
    switch(type) {
      case 'anomalies':
        data = filteredAnomalies;
        filename = 'anomaly-report.csv';
        break;
      case 'attrition':
        data = filteredAttritionRisk;
        filename = 'attrition-risk-report.csv';
        break;
      case 'predictions':
        data = predictiveData;
        filename = 'predictive-analytics.csv';
        break;
      case 'recommendations':
        data = filteredRecommendations;
        filename = 'ai-recommendations.csv';
        break;
      default:
        return;
    }
    
    if (exportFormat === 'csv') {
      exportToCSV(data, filename);
    } else if (exportFormat === 'json') {
      exportToJSON(data, filename);
    }
  };

  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      addNotification('warning', 'No data to export');
      return;
    }
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    downloadFile(csv, `${filename}-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    addNotification('success', 'Data exported as CSV');
  };

  const exportToJSON = (data, filename) => {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${filename}-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    addNotification('success', 'Data exported as JSON');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle anomaly actions
  const handleAnomalyAction = (anomalyId, action) => {
    setAnomalyData(prev => prev.map(anomaly => 
      anomaly.id === anomalyId 
        ? { ...anomaly, status: action === 'resolve' ? 'resolved' : action === 'ignore' ? 'ignored' : 'in-progress' }
        : anomaly
    ));
    
    addNotification('success', `Anomaly ${action}d successfully`);
  };

  // Handle recommendation actions
  const handleRecommendationAction = (recommendationId, action) => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === recommendationId 
        ? { ...rec, status: action }
        : rec
    ));
    
    if (action === 'implemented') {
      addNotification('success', 'Recommendation implemented! Tracking ROI...');
    }
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Handle alert filters
  const handleAlertFilterChange = (key, value) => {
    setAlertFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle AI settings change
  const handleAISettingsChange = (key, value) => {
    setAiSettings(prev => ({ ...prev, [key]: value }));
  };

  // Risk scatter chart data
  const riskScatterData = attritionRiskData.map(emp => ({
    x: emp.tenure,
    y: emp.riskScore,
    z: emp.engagement,
    name: emp.name.split(' ')[0],
    riskLevel: emp.riskLevel,
    department: emp.department
  }));

  // Anomaly trend data
  const anomalyTrendData = [
    { month: 'Jan', anomalies: 8, high: 3, resolved: 5 },
    { month: 'Feb', anomalies: 5, high: 2, resolved: 3 },
    { month: 'Mar', anomalies: 12, high: 5, resolved: 8 },
    { month: 'Apr', anomalies: 9, high: 4, resolved: 6 },
    { month: 'May', anomalies: 7, high: 3, resolved: 5 },
    { month: 'Jun', anomalies: 10, high: 4, resolved: 7 },
    { month: 'Jul', anomalies: 11, high: 5, resolved: 8 },
    { month: 'Aug', anomalies: 9, high: 4, resolved: 6 },
  ];

  // ROI comparison data
  const roiComparisonData = recommendations.map(rec => ({
    name: rec.title.substring(0, 20) + '...',
    cost: rec.cost / 1000,
    roi: rec.roi,
    savings: (rec.cost * rec.roi) / 1000,
    status: rec.status
  }));

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Breadcrumb Navigation */}
      <BreadcrumbComponent
        items={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Reports & Analytics', link: '/reports' },
          { label: 'AI-Driven Insights', active: true }
        ]}
      />

      {/* Header with enhanced controls */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-2 fw-bold d-flex align-items-center gap-2">
              <Brain className="text-primary" size={24} />
              AI-Driven Insights
              {simulationMode && (
                <span className="badge bg-warning ms-2">Simulation Mode</span>
              )}
              {autoRefresh && (
                <span className="badge bg-info ms-2">Auto-refresh ON</span>
              )}
            </h5>
            <p className="text-muted mb-0">
              Real-time anomaly detection, predictive analytics, and AI-powered recommendations
            </p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={refreshData}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button 
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={() => setShowSettingsPanel(true)}
            >
              <Settings size={16} />
              Settings
            </button>
            <button 
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => setShowExportModal(true)}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Model Selection */}
        <div className="card mb-3">
          <div className="card-body p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small">Active AI Model:</span>
                <select 
                  className="form-select form-select-sm d-inline-block w-auto mx-2"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option value="ANOMALY_DETECTION">Anomaly Detection ({AIModels.ANOMALY_DETECTION.accuracy}% accuracy)</option>
                  <option value="ATTRITION_PREDICTION">Attrition Prediction ({AIModels.ATTRITION_PREDICTION.accuracy}% accuracy)</option>
                  <option value="FORECASTING">HR Forecasting ({AIModels.FORECASTING.accuracy}% accuracy)</option>
                  <option value="NLP">Natural Language Processing ({AIModels.NLP.accuracy}% accuracy)</option>
                  <option value="RECOMMENDATION">Recommendation Engine ({AIModels.RECOMMENDATION.accuracy}% accuracy)</option>
                </select>
                <span className="badge bg-light text-dark">
                  v{AIModels[selectedModel].version}
                </span>
              </div>
              <div>
                <span className="text-muted small me-2">Insight Threshold:</span>
                <input
                  type="range"
                  className="form-range d-inline-block"
                  style={{ width: '150px' }}
                  min="50"
                  max="95"
                  value={insightThreshold}
                  onChange={(e) => setInsightThreshold(parseInt(e.target.value))}
                />
                <span className="ms-2 fw-semibold">{insightThreshold}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        exportData={exportData}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
      />

      {/* Settings Panel - Fixed Version */}
      <SettingsPanel
        show={showSettingsPanel}
        onClose={() => setShowSettingsPanel(false)}
        settings={aiSettings}
        onSettingsChange={handleAISettingsChange}
        AIModels={AIModels}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="card mb-4 border-warning">
          <div className="card-header bg-warning-subtle d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-semibold">Recent Notifications</h6>
            <button 
              className="btn btn-sm btn-outline-warning"
              onClick={clearNotifications}
            >
              Clear All
            </button>
          </div>
          <div className="card-body p-0">
            <div className="list-group list-group-flush">
              {notifications.slice(0, 3).map(notif => (
                <div key={notif.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        {notif.type === 'success' && <CheckCircle size={16} className="text-success" />}
                        {notif.type === 'warning' && <AlertTriangle size={16} className="text-warning" />}
                        {notif.type === 'error' && <X size={16} className="text-danger" />}
                        {notif.type === 'info' && <Bell size={16} className="text-info" />}
                        <span className="fw-medium">{notif.message}</span>
                      </div>
                      <small className="text-muted ms-4">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </small>
                    </div>
                    {!notif.read && <span className="badge bg-primary">New</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#fef2f2' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-danger fw-semibold small">High Risk Employees</div>
                  <div className="h4 mb-0 text-danger fw-bold">{insightsSummary.highRiskEmployees}</div>
                  <div className="text-xs text-muted">Needs immediate attention</div>
                </div>
                <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <AlertTriangle size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#fffbeb' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-warning fw-semibold small">Pending Alerts</div>
                  <div className="h4 mb-0 text-warning fw-bold">{insightsSummary.pendingAlerts}</div>
                  <div className="text-xs text-muted">Requires review</div>
                </div>
                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <Bell size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#f0f9ff' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-primary fw-semibold small">High Priority Recs</div>
                  <div className="h4 mb-0 text-primary fw-bold">{insightsSummary.highPriorityRecs}</div>
                  <div className="text-xs text-muted">Critical actions needed</div>
                </div>
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <Lightbulb size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#f0fdf4' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-success fw-semibold small">Model Accuracy</div>
                  <div className="h4 mb-0 text-success fw-bold">{insightsSummary.modelAccuracy}%</div>
                  <div className="text-xs text-muted">Current AI model</div>
                </div>
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <Activity size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Comparison */}
      <div className="mb-4">
        <InsightComparison
          currentData={{
            attrition: insightsSummary.highRiskEmployees,
            anomalies: insightsSummary.pendingAlerts,
            riskScore: insightsSummary.avgRiskScore
          }}
          previousData={{ attrition: 4, anomalies: 15, riskScore: 68 }}
          timeframe="month"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="card border shadow-none mb-4">
        <div className="card-body p-3">
          <div className="d-flex flex-wrap gap-2">
            <button 
              className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 size={16} />
              Overview
            </button>
            <button 
              className={`btn ${activeTab === 'anomalies' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
              onClick={() => setActiveTab('anomalies')}
            >
              <AlertCircle size={16} />
              Anomaly Detection
            </button>
            <button 
              className={`btn ${activeTab === 'predictive' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
              onClick={() => setActiveTab('predictive')}
            >
              <TrendingUp size={16} />
              Predictive Analytics
            </button>
            <button 
              className={`btn ${activeTab === 'alerts' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
              onClick={() => setActiveTab('alerts')}
            >
              <Bell size={16} />
              Intelligent Alerts
              {notifications.length > 0 && (
                <span className="badge bg-danger rounded-pill">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <button 
              className={`btn ${activeTab === 'recommendations' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
              onClick={() => setActiveTab('recommendations')}
            >
              <Lightbulb size={16} />
              Recommendations
            </button>
            <button 
              className={`btn ${activeTab === 'nlp' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
              onClick={() => setActiveTab('nlp')}
            >
              <MessageSquare size={16} />
              Natural Language
            </button>
            <button 
              className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
              onClick={() => setActiveTab('reports')}
            >
              <Download size={16} />
              Reports & Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border shadow-none mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-2">
              <select value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)} className="form-select form-select-sm">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last quarter</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="form-select form-select-sm">
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <div className="input-group input-group-sm">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search anomalies, employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <div className="btn-group w-100">
                <button 
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <BarChart3 size={14} />
                </button>
                <button 
                  className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <ListIcon size={14} />
                </button>
              </div>
            </div>
            <div className="col-12 col-md-3 d-flex justify-content-md-end gap-2">
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-primary dropdown-toggle d-flex align-items-center" 
                  type="button" data-bs-toggle="dropdown">
                  <Download size={16} className="me-1" />
                  Export
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <div className="dropdown-item">
                      <small className="text-muted">Format:</small>
                      <select 
                        className="form-select form-select-sm mt-1"
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                      >
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={() => exportData('anomalies')}>
                      Anomalies Report
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => exportData('attrition')}>
                      Attrition Risk Report
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => exportData('recommendations')}>
                      AI Recommendations
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-semibold">Risk Analysis Dashboard</h6>
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-outline-secondary">Daily</button>
                  <button className="btn btn-outline-secondary active">Weekly</button>
                  <button className="btn btn-outline-secondary">Monthly</button>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-title">Risk Distribution</h6>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'High Risk', value: filteredAttritionRisk.filter(e => e.riskLevel === 'high').length, color: '#ef4444' },
                                { name: 'Medium Risk', value: filteredAttritionRisk.filter(e => e.riskLevel === 'medium').length, color: '#f59e0b' },
                                { name: 'Low Risk', value: filteredAttritionRisk.filter(e => e.riskLevel === 'low').length, color: '#10b981' },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {[
                                { color: '#ef4444' },
                                { color: '#f59e0b' },
                                { color: '#10b981' },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-title">Anomaly Trends</h6>
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={anomalyTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="anomalies" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Risk Factor Correlation</h6>
                    <ResponsiveContainer width="100%" height={250}>
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          name="Tenure"
                          label={{ value: 'Tenure (years)', position: 'insideBottom', offset: -10 }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="y" 
                          name="Risk Score"
                          label={{ value: 'Risk Score %', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'x') return [`${value} years`, 'Tenure'];
                            if (name === 'y') return [`${value}%`, 'Risk Score'];
                            if (name === 'z') return [`${value}%`, 'Engagement'];
                            return value;
                          }}
                        />
                        <Scatter name="Employees" data={riskScatterData} shape="circle">
                          {riskScatterData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.riskLevel === 'high' ? '#ef4444' : entry.riskLevel === 'medium' ? '#f59e0b' : '#10b981'} 
                            />
                          ))}
                        </Scatter>
                        <Legend />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-lg-4">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0 fw-semibold">Quick Actions & Alerts</h6>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2 mb-4">
                  <button className="btn btn-danger d-flex align-items-center justify-content-between">
                    <span>Review High-Risk Employees</span>
                    <span className="badge bg-white text-danger">{insightsSummary.highRiskEmployees}</span>
                  </button>
                  <button className="btn btn-warning d-flex align-items-center justify-content-between">
                    <span>Process Pending Alerts</span>
                    <span className="badge bg-white text-warning">{insightsSummary.pendingAlerts}</span>
                  </button>
                  <button className="btn btn-primary d-flex align-items-center justify-content-between">
                    <span>Generate Monthly Report</span>
                    <ChevronRight size={16} />
                  </button>
                  <button className="btn btn-success d-flex align-items-center justify-content-between">
                    <span>Optimize AI Models</span>
                    <span className="badge bg-white text-success">+{insightsSummary.modelAccuracy}%</span>
                  </button>
                </div>
                
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-title">AI Model Performance</h6>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Anomaly Detection</small>
                        <small className="fw-semibold">{AIModels.ANOMALY_DETECTION.accuracy}%</small>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar bg-success" style={{ width: `${AIModels.ANOMALY_DETECTION.accuracy}%` }}></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Attrition Prediction</small>
                        <small className="fw-semibold">{AIModels.ATTRITION_PREDICTION.accuracy}%</small>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar bg-primary" style={{ width: `${AIModels.ATTRITION_PREDICTION.accuracy}%` }}></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>HR Forecasting</small>
                        <small className="fw-semibold">{AIModels.FORECASTING.accuracy}%</small>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar bg-info" style={{ width: `${AIModels.FORECASTING.accuracy}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <h6 className="mb-2">Recent Insights</h6>
                  <div className="list-group list-group-flush">
                    {filteredAnomalies.slice(0, 3).map(anomaly => (
                      <div key={anomaly.id} className="list-group-item px-0 py-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="fw-medium small">{anomaly.type}</div>
                            <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>
                              {anomaly.description}
                            </div>
                          </div>
                          <span className={`badge ${anomaly.severity === 'high' ? 'bg-danger' : anomaly.severity === 'medium' ? 'bg-warning' : 'bg-success'}`}>
                            {anomaly.severity.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Anomaly Detection Tab */}
      {activeTab === 'anomalies' && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-semibold">Anomaly Detection Dashboard</h6>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setAnomalyData(prev => [...prev].sort((a, b) => b.confidence - a.confidence))}
                  >
                    Sort by Confidence
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setAnomalyData(prev => prev.filter(a => a.status !== 'resolved'))}
                  >
                    Hide Resolved
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold">Type</th>
                        <th className="fw-semibold">Description</th>
                        <th className="fw-semibold">Confidence</th>
                        <th className="fw-semibold">Severity</th>
                        <th className="fw-semibold">Status</th>
                        <th className="fw-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAnomalies.map(anomaly => (
                        <tr key={anomaly.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className={`rounded-circle p-1 ${anomaly.severity === 'high' ? 'bg-danger' : anomaly.severity === 'medium' ? 'bg-warning' : 'bg-success'}`}>
                                <AlertTriangle size={12} className="text-white" />
                              </div>
                              <span>{anomaly.type}</span>
                            </div>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '300px' }} title={anomaly.description}>
                              {anomaly.description}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress flex-grow-1" style={{ height: '6px', width: '80px' }}>
                                <div 
                                  className={`progress-bar ${anomaly.confidence > 85 ? 'bg-success' : anomaly.confidence > 70 ? 'bg-warning' : 'bg-danger'}`}
                                  style={{ width: `${anomaly.confidence}%` }}
                                ></div>
                              </div>
                              <span className="fw-semibold">{anomaly.confidence}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${anomaly.severity === 'high' ? 'bg-danger' : anomaly.severity === 'medium' ? 'bg-warning' : 'bg-success'}`}>
                              {anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${anomaly.status === 'pending' ? 'bg-warning' : anomaly.status === 'reviewed' ? 'bg-info' : 'bg-success'}`}>
                              {anomaly.status.charAt(0).toUpperCase() + anomaly.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setShowAlertDetails(anomaly)}
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleAnomalyAction(anomaly.id, 'resolve')}
                                title="Mark as Resolved"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleAnomalyAction(anomaly.id, 'review')}
                                title="Mark for Review"
                              >
                                <Clock size={14} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleAnomalyAction(anomaly.id, 'ignore')}
                                title="Ignore Alert"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Showing {filteredAnomalies.length} of {anomalyData.length} anomalies
                  </small>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => exportData('anomalies')}
                    >
                      <Download size={14} className="me-1" />
                      Export Anomalies
                    </button>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={refreshData}
                    >
                      <RefreshCw size={14} className="me-1" />
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Predictive Analytics Tab */}
      {activeTab === 'predictive' && (
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0 fw-semibold">Attrition Risk Prediction</h6>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold">Employee</th>
                        <th className="fw-semibold">Department</th>
                        <th className="fw-semibold">Risk Score</th>
                        <th className="fw-semibold">Engagement</th>
                        <th className="fw-semibold">Tenure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttritionRisk.map(employee => (
                        <tr key={employee.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className={`w-8 h-8 rounded-circle ${employee.riskLevel === 'high' ? 'bg-danger' : employee.riskLevel === 'medium' ? 'bg-warning' : 'bg-success'} d-flex align-items-center justify-content-center text-white`}>
                                {employee.name.split(' ')[0].charAt(0)}
                              </div>
                              <span>{employee.name}</span>
                            </div>
                          </td>
                          <td>{employee.department}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                <div 
                                  className={`progress-bar ${employee.riskScore > 80 ? 'bg-danger' : employee.riskScore > 60 ? 'bg-warning' : 'bg-success'}`}
                                  style={{ width: `${employee.riskScore}%` }}
                                ></div>
                              </div>
                              <span className="fw-semibold">{employee.riskScore}%</span>
                            </div>
                          </td>
                          <td>{employee.engagement}%</td>
                          <td>{employee.tenure} years</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0 fw-semibold">Risk Factors Analysis</h6>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius={90} data={[
                    { subject: 'Promotion Lag', A: 85, fullMark: 100 },
                    { subject: 'Workload', A: 72, fullMark: 100 },
                    { subject: 'Compensation', A: 68, fullMark: 100 },
                    { subject: 'Growth Opp', A: 45, fullMark: 100 },
                    { subject: 'Work-Life', A: 78, fullMark: 100 },
                    { subject: 'Manager Support', A: 65, fullMark: 100 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Risk Factors" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0 fw-semibold">Predictive Analytics Forecast</h6>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictiveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="attrition" stroke="#ef4444" strokeWidth={2} name="Attrition" />
                    <Line yAxisId="right" type="monotone" dataKey="payroll" stroke="#3b82f6" strokeWidth={2} name="Payroll Cost (K)" />
                    <Line yAxisId="right" type="monotone" dataKey="leaves" stroke="#10b981" strokeWidth={2} name="Leave Forecast" />
                    <Line yAxisId="left" type="monotone" dataKey="hiring" stroke="#f59e0b" strokeWidth={2} name="Hiring" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Management Tab */}
      {activeTab === 'alerts' && (
        <div className="row g-4">
          <div className="col-12">
            <AlertManagement
              alerts={anomalyData}
              onAlertAction={(id, action) => handleAnomalyAction(id, action)}
              filterOptions={alertFilters}
              onFilterChange={handleAlertFilterChange}
              view="list"
            />
          </div>
        </div>
      )}

      {/* Enhanced NLP Tab */}
      {activeTab === 'nlp' && (
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0 fw-semibold">AI-Powered Natural Language Query</h6>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <div className="input-group input-group-lg">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ask anything about your HR data (e.g., 'Show me attrition trends, predict next quarter hiring, analyze expenses by department')"
                      value={nlpInput}
                      onChange={(e) => setNlpInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNLPQuery()}
                      disabled={isProcessingNLP}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={handleNLPQuery}
                      disabled={isProcessingNLP || !nlpInput.trim()}
                    >
                      {isProcessingNLP ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send size={20} className="me-2" />
                          Ask AI
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-2 d-flex justify-content-between">
                    <small className="text-muted">
                      Powered by GPT-4 model • {AIModels[selectedModel].accuracy}% accuracy
                    </small>
                    <button 
                      className="btn btn-sm btn-link"
                      onClick={() => setNlpInput('')}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {nlpResponse && (
                  <div className="card mb-4">
                    <div className="card-header bg-info-subtle">
                      <h6 className="mb-0 fw-semibold">AI Response</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-start gap-3">
                        <Brain size={24} className="text-info mt-1" />
                        <div className="flex-grow-1">
                          <p className="mb-2">{nlpResponse}</p>
                          <div className="d-flex gap-2 mt-3">
                            <button className="btn btn-sm btn-outline-primary">
                              <ThumbsUp size={14} className="me-1" />
                              Helpful
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                              <ThumbsDown size={14} className="me-1" />
                              Not Helpful
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-success ms-auto"
                              onClick={() => {
                                navigator.clipboard.writeText(nlpResponse);
                                addNotification('success', 'Response copied to clipboard');
                              }}
                            >
                              <Copy size={14} className="me-1" />
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h6 className="mb-3 fw-semibold">Query History</h6>
                  {nlpHistory.length > 0 ? (
                    <div className="list-group">
                      {nlpHistory.slice(0, 5).map((item, index) => (
                        <div key={item.id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="fw-medium small">{item.query}</div>
                              <div className="text-muted small mt-1">{item.response.substring(0, 100)}...</div>
                            </div>
                            <button 
                              className="btn btn-sm btn-link"
                              onClick={() => {
                                setNlpInput(item.query);
                                handleNLPQuery();
                              }}
                            >
                              <RefreshCw size={14} />
                            </button>
                          </div>
                          <small className="text-muted">
                            {new Date(item.timestamp).toLocaleString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <MessageSquare size={48} className="mb-2" />
                      <p>No query history yet. Start asking questions!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-lg-4">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0 fw-semibold">Example Queries & Tips</h6>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6 className="small fw-semibold mb-2">Try these examples:</h6>
                  <div className="d-grid gap-2">
                    {mockNLPQueries.map((example, index) => (
                      <button
                        key={index}
                        className="btn btn-outline-info text-start"
                        onClick={() => {
                          setNlpInput(example.query);
                          setTimeout(() => handleNLPQuery(), 100);
                        }}
                      >
                        <div className="small">{example.query}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h6 className="small fw-semibold mb-2">Query Tips:</h6>
                  <ul className="small text-muted">
                    <li>Use specific department names for better results</li>
                    <li>Include timeframes (last quarter, next month)</li>
                    <li>Ask for comparisons between departments</li>
                    <li>Request predictions and forecasts</li>
                    <li>Ask for recommendations based on data</li>
                  </ul>
                </div>
                
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="small fw-semibold mb-2">AI Model Details</h6>
                    <div className="mb-2">
                      <small className="text-muted">Model:</small>
                      <div className="fw-medium">{AIModels[selectedModel].name}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Accuracy:</small>
                      <div className="fw-medium">{AIModels[selectedModel].accuracy}%</div>
                    </div>
                    <div>
                      <small className="text-muted">Features Analyzed:</small>
                      <div className="fw-medium small">
                        Attendance, Leave, Expenses, Policy Compliance, Payroll
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Alert Details Modal */}
      {showAlertDetails && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            zIndex: 1050
          }}>
            <div className="modal-header" style={{
              padding: '1rem',
              borderBottom: '1px solid #dee2e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div className="d-flex align-items-center gap-3">
                <div className={`rounded-circle p-2 ${showAlertDetails.severity === 'high' ? 'bg-danger' : showAlertDetails.severity === 'medium' ? 'bg-warning' : 'bg-success'}`}>
                  <AlertTriangle size={24} className="text-white" />
                </div>
                <div>
                  <h6 className="mb-0 fw-semibold">{showAlertDetails.type} Anomaly Detected</h6>
                  <div className="text-muted">
                    ID: {showAlertDetails.id} • Confidence: {showAlertDetails.confidence}%
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close" 
                onClick={() => setShowAlertDetails(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: 0,
                  width: '30px',
                  height: '30px'
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body" style={{ padding: '1rem' }}>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <div className="card h-100" style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
                    <div className="card-body" style={{ padding: '1rem' }}>
                      <h6 className="card-title" style={{ fontWeight: '600', marginBottom: '1rem' }}>Details</h6>
                      <div className="mb-2">
                        <small className="text-muted">Description:</small>
                        <div className="fw-medium">{showAlertDetails.description}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Affected:</small>
                        <div className="fw-medium">{showAlertDetails.employee || showAlertDetails.department}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Date Detected:</small>
                        <div className="fw-medium">{showAlertDetails.date}</div>
                      </div>
                      <div>
                        <small className="text-muted">Impact:</small>
                        <div className="fw-medium">{showAlertDetails.severity === 'high' ? 'High' : showAlertDetails.severity === 'medium' ? 'Medium' : 'Low'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="card h-100" style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
                    <div className="card-body" style={{ padding: '1rem' }}>
                      <h6 className="card-title" style={{ fontWeight: '600', marginBottom: '1rem' }}>AI Analysis</h6>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small>Confidence Level</small>
                          <small className="fw-semibold">{showAlertDetails.confidence}%</small>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className={`progress-bar ${showAlertDetails.confidence > 85 ? 'bg-success' : showAlertDetails.confidence > 70 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ width: `${showAlertDetails.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <small className="text-muted">Suggested Action:</small>
                        <div className="fw-medium">Review and investigate immediately</div>
                      </div>
                      <div className="mb-3">
                        <small className="text-muted">Algorithm Used:</small>
                        <div className="fw-medium small">Random Forest Classifier v2.1</div>
                      </div>
                      <div>
                        <small className="text-muted">Similar Patterns:</small>
                        <div className="fw-medium small">
                          {Math.floor(Math.random() * 10) + 1} similar cases in last 90 days
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-3" style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
                <div className="card-body" style={{ padding: '1rem' }}>
                  <h6 className="card-title" style={{ fontWeight: '600', marginBottom: '1rem' }}>Take Action</h6>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-success flex-grow-1"
                      onClick={() => {
                        handleAnomalyAction(showAlertDetails.id, 'resolve');
                        setShowAlertDetails(null);
                      }}
                    >
                      <CheckCircle size={16} className="me-2" />
                      Mark as Resolved
                    </button>
                    <button 
                      className="btn btn-warning flex-grow-1"
                      onClick={() => {
                        handleAnomalyAction(showAlertDetails.id, 'review');
                        setShowAlertDetails(null);
                      }}
                    >
                      <Clock size={16} className="me-2" />
                      Schedule Review
                    </button>
                    <button 
                      className="btn btn-danger flex-grow-1"
                      onClick={() => {
                        handleAnomalyAction(showAlertDetails.id, 'ignore');
                        setShowAlertDetails(null);
                      }}
                    >
                      <X size={16} className="me-2" />
                      Ignore Alert
                    </button>
                  </div>
                </div>
              </div>

              <div className="card" style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
                <div className="card-body" style={{ padding: '1rem' }}>
                  <h6 className="card-title" style={{ fontWeight: '600', marginBottom: '1rem' }}>Historical Context</h6>
                  <div className="text-sm text-muted">
                    This pattern has been observed {Math.floor(Math.random() * 15) + 5} times in the last 90 days with an average resolution time of {Math.floor(Math.random() * 5) + 2} days. 
                    Previous actions taken: {['policy review', 'employee counseling', 'process audit', 'system update'][Math.floor(Math.random() * 4)]}.
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{
              padding: '1rem',
              borderTop: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem'
            }}>
              <button className="btn btn-outline-secondary" onClick={() => setShowAlertDetails(null)}>
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const exportToJSON = (data, filename) => {
                    const json = JSON.stringify(data, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    addNotification('success', 'Data exported as JSON');
                  };
                  exportToJSON([showAlertDetails], `anomaly-details-${showAlertDetails.id}`);
                  setShowAlertDetails(null);
                }}
              >
                Export Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main exported component
export default function AIDrivenInsights() {
  return <AIDrivenInsightsContent />;
}