import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  BarChart3,
  Users,
  TrendingDown,
  TrendingUp,
  UserPlus,
  MoveRight,
  Calendar,
  Building,
  Briefcase,
  PieChart,
  Clock,
  DollarSign,
  MapPin,
  UserCheck,
  FileText,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';

const EmployeeReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('monthly');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('active'); // active, inactive, on-notice
  const [reportData, setReportData] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    headcount: true,
    attrition: false,
    joining: true,
    movement: false,
    demographics: false,
    trends: false,
    employeeList: false,
    newJoiners: false,
    attritionReasons: false,
    offerAnalysis: false,
    salaryRevision: false,
    departmentStrength: false
  });

  // Enhanced Headcount & Demographics Data
  const headcountData = [];
    

  // Age Distribution Data
  const ageDistribution = [
    { range: '20-25', count: 0, percentage: 0.0 },
    { range: '26-30', count: 0, percentage: 0.0 },
    { range: '31-35', count: 0, percentage: 0.0 },
    { range: '36-40', count: 0, percentage: 0.0 },
    { range: '41-45', count: 0, percentage: 0.0 },
    { range: '46-50', count: 0, percentage: 0.0 },
    { range: '50+', count: 0, percentage: 0.0 },
  ];

  // Tenure Distribution Data
  const tenureDistribution = [
    { range: '0-1 years', count: 0, percentage: 0.0 },
    { range: '1-3 years', count: 0, percentage: 0.0 },
    { range: '3-5 years', count: 0, percentage: 0.0 },
    { range: '5-7 years', count: 0, percentage: 0.0},
    { range: '7-10 years', count: 0, percentage: 0.0 },
    { range: '10+ years', count: 0, percentage: 0.0 },
  ];

  // New Joiner Reports by Period
  const newJoinerReports = {
    daily: [],
    weekly: [],
    monthly: []
  };

  // Employee List Sample Data
  const employeeListData = [];

  // Enhanced Attrition Data
  const attritionData = [];

  // Attrition Reasons
  const attritionReasons = [
    { reason: 'Better opportunity', count: 0, percentage: 0.0 },
    { reason: 'Salary/Compensation', count: 0, percentage: 0.0 },
    { reason: 'Work-life balance', count: 0, percentage: 0.0 },
    { reason: 'Career growth', count: 0, percentage: 0.0 },
    { reason: 'Relocation', count: 0, percentage: 0.0 },

  ];

  // Attrition Trends
  const attritionTrends = [];

  // Replacement Cost Analysis
  const replacementCostData = [];

  // Exit Interview Insights
  const exitInterviewInsights = [
    { insight: 'Lack of career growth opportunities', mentions: 0, severity: 'High' },
    { insight: 'Inadequate compensation', mentions: 0, severity: 'High' },
    { insight: 'Poor work-life balance', mentions: 0, severity: 'Medium' },
    { insight: 'Limited learning opportunities', mentions: 0, severity: 'Medium' },

  ];

  // Enhanced Onboarding Data
  const onboardingData = [];

  // Offer Decline Reasons
  const offerDeclineReasons = [
    { reason: 'Accepted another offer', count: 0, percentage: 0.0 },
    { reason: 'Salary expectations', count: 0, percentage: 0.0 },
    { reason: 'Location concerns', count: 0, percentage: 0.0 },
    { reason: 'Personal reasons', count: 0, percentage: 0.0 }
  ];

  // Joining Variance Data
  const joiningVarianceData = [
    { department: 'Engineering', onTime: 0, delayed: 0, avgVariance: 0.0},
    { department: 'Sales', onTime: 0, delayed: 0, avgVariance: 0.0 },
    { department: 'Marketing', onTime: 0, delayed: 0, avgVariance: 0.0 },

  ];

  // Enhanced Movement Data
  const movementData = [];

  // Salary Revision Reports
  const salaryRevisionData = [];

  // KPI Metrics
  const kpiMetrics = {
    totalHeadcount: 0,
    activeEmployees: 0,
    newJoiners: 0,
    attritionRate: 0,
    retentionRate: 0,
    avgTimeToJoin: 0,
    promotionRate: 0,
    onboardingCompletion: 0
  };

  const reports = [
    { id: 'headcount', name: 'Headcount & Demographics', icon: <Users size={16} />, color: 'primary' },
    { id: 'attrition', name: 'Attrition Analytics', icon: <TrendingDown size={16} />, color: 'danger' },
    { id: 'joining', name: 'Joining & Onboarding', icon: <UserPlus size={16} />, color: 'success' },
    { id: 'movement', name: 'Employee Movement', icon: <MoveRight size={16} />, color: 'warning' },
  ];

  const departments = ['All Departments', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Product'];
  const locations = ['All Locations', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad'];
  const grades = ['All Grades', 'L1', 'L2', 'L3', 'L4', 'L5'];
  const timeRanges = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleExportReport = (type) => {
    const dataMapping = {
      headcount: headcountData,
      attrition: attritionData,
      joining: onboardingData,
      movement: movementData,
      salaryRevision: salaryRevisionData,
      employeeList: employeeListData,
      newJoiners: newJoinerReports[selectedTimeRange.toLowerCase()],
      demographics: ageDistribution,
      trends: attritionTrends,
      attritionReasons: attritionReasons,
      offerAnalysis: offerDeclineReasons
    };

    const data = dataMapping[type] || [];

    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }

    // Convert data to CSV format
    const headers = Object.keys(data[0]);
    const csv = [
      ['Report Type', type.toUpperCase()],
      ['Generated On', new Date().toLocaleDateString()],
      [],
      headers.join(','),
      ...data.map(item => headers.map(header => {
        const value = item[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderReportSection = (title, section, data, columns, actions = true, customRender = null) => {
    return (
      <div className="card border shadow-none mb-4">
        <div
          className="card-header d-flex justify-content-between align-items-center cursor-pointer"
          onClick={() => toggleSection(section)}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <h6 className="mb-0">{title}</h6>
          </div>
          <div className="d-flex align-items-center gap-2">
            {actions && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExportReport(section);
                }}
                className="
    inline-flex items-center gap-2
    rounded-md border border-gray-300
    bg-blue-500 px-3 py-1.5
    text-xs font-medium text-gray-700
    shadow-sm
    hover:bg-blue-600 hover:text-white
    focus:outline-none focus:ring-2 focus:ring-blue-200
    transition
  "
              >
                <Download size={14} />
                Export
              </button>

            )}
            <span className={`transform ${expandedSections[section] ? 'rotate-180' : ''}`}>
              <i className="ri-arrow-down-s-line"></i>
            </span>
          </div>
        </div>
        {expandedSections[section] && (
          <div className="card-body">
            {customRender || (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      {columns.map((col, index) => (
                        <th key={index} className="text-start">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id}>
                        {Object.values(item).slice(1).map((value, idx) => (
                          <td key={idx} className="text-start">
                            {typeof value === 'number' && value < 10 && !Number.isInteger(value) ? value.toFixed(1) : value}
                            {idx === columns.length - 2 && value.toString().includes('%') && ' %'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Distribution Chart (Simple bar chart using CSS)
  const renderDistributionChart = (data, labelKey, valueKey, color = '#3b82f6') => {
    const maxValue = Math.max(...data.map(d => d[valueKey])) || 1;
    return (
      <div className="mt-3">
        {data.map((item, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span className="small fw-medium">{item[labelKey]}</span>
              <span className="small text-muted">{item[valueKey]} ({item.percentage}%)</span>
            </div>
            <div className="progress" style={{ height: '20px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${(item[valueKey] / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              >
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Wrap the entire content with RecruiterDashboardLayout
  return (

    <div className="container-fluid ">
      {/* Page Header */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">

        <div className="mb-4">
          <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
            <i className='ri-bar-chart-line m-2'></i>
            Employee Reports & Analytics
          </h5>
          <p className="text-muted">
            Comprehensive workforce analytics and insights dashboard.
          </p>
        </div>

        {/* Print Button */}
        <div className="flex items-end">
          <button
            onClick={handlePrint}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
          >
            <Printer size={16} />
            Print
          </button>
        </div>

      </div>


      {/* KPI Summary */}
      <div className="row g-3 mb-4">

        {/* Total Headcount */}
        <div className="col-xl-2 col-lg-3 col-md-4 col-6">
          <div className="card h-100 border-0 shadow-sm bg-primary bg-opacity-10 hover-shadow">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold text-primary small">Total Headcount</div>
                <div className="h4 mb-0">{kpiMetrics.totalHeadcount.toLocaleString()}</div>
              </div>
              <div className="bg-primary text-white rounded-circle p-3">
                <Users size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Active Employees */}
        <div className="col-xl-2 col-lg-3 col-md-4 col-6">
          <div className="card h-100 border-0 shadow-sm bg-info bg-opacity-10">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold text-info small">Active Employees</div>
                <div className="h4 mb-0">{kpiMetrics.activeEmployees.toLocaleString()}</div>
              </div>
              <div className="bg-info text-white rounded-circle p-3">
                <UserCheck size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Retention Rate */}
        <div className="col-xl-2 col-lg-3 col-md-4 col-6">
          <div className="card h-100 border-0 shadow-sm bg-success bg-opacity-10">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold text-success small">Retention Rate</div>
                <div className="h4 mb-0">{kpiMetrics.retentionRate}%</div>
              </div>
              <div className="bg-success text-white rounded-circle p-3">
                <TrendingUp size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Attrition Rate */}
        <div className="col-xl-2 col-lg-3 col-md-4 col-6">
          <div className="card h-100 border-0 shadow-sm bg-danger bg-opacity-10">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold text-danger small">Attrition Rate</div>
                <div className="h4 mb-0">{kpiMetrics.attritionRate}%</div>
              </div>
              <div className="bg-danger text-white rounded-circle p-3">
                <TrendingDown size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Avg Time to Join */}
        <div className="col-xl-2 col-lg-3 col-md-4 col-6">
          <div className="card h-100 border-0 shadow-sm bg-warning bg-opacity-10">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold text-warning small">Avg Time to Join</div>
                <div className="h4 mb-0">{kpiMetrics.avgTimeToJoin} days</div>
              </div>
              <div className="bg-warning text-white rounded-circle p-3">
                <Clock size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Promotion Rate */}
        <div className="col-xl-2 col-lg-3 col-md-4 col-6">
          <div className="card h-100 border-0 shadow-sm bg-secondary bg-opacity-10">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold text-secondary small">Promotion Rate</div>
                <div className="h4 mb-0">{kpiMetrics.promotionRate}%</div>
              </div>
              <div className="bg-secondary text-white rounded-circle p-3">
                <ArrowUpDown size={22} />
              </div>
            </div>
          </div>
        </div>

      </div>


      {/* Report Type Selector */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-5">
          <h5 className="mb-4 text-lg font-bold text-gray-700">
            Report Categories
          </h5>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`
            cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center text-center
            transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
            ${selectedReport === report.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-300"}
          `}
              >
                {/* Icon Circle */}
                <div
                  className={`
              mb-3 flex h-14 w-14 items-center justify-center rounded-full
              bg-${report.color}-100
            `}
                >
                  <span className={`text-${report.color}-600 text-2xl`}>
                    {report.icon}
                  </span>
                </div>

                {/* Title */}
                <div className="text-sm font-medium text-gray-700">
                  {report.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 items-end">

            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Search
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                {departments.map((dept) => (
                  <option
                    key={dept}
                    value={dept === "All Departments" ? "all" : dept.toLowerCase()}
                  >
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Status
              </label>
              <select
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-notice">On Notice</option>
                <option value="all">All Status</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                {locations.map((loc) => (
                  <option
                    key={loc}
                    value={loc === "All Locations" ? "all" : loc.toLowerCase()}
                  >
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                {grades.map((grade) => (
                  <option
                    key={grade}
                    value={grade === "All Grades" ? "all" : grade.toLowerCase()}
                  >
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Time Range
              </label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                {timeRanges.map((range) => (
                  <option key={range} value={range.toLowerCase()}>
                    {range}
                  </option>
                ))}
              </select>
            </div>



          </div>
        </div>
      </div>


      {/* Headcount & Demographics Reports */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Headcount & Demographics Reports</h5>,
        'headcount',
        headcountData,
        ['Department', 'Location', 'Headcount', 'Growth %', 'Male', 'Female', 'Permanent', 'Contract', 'Intern']
      )}

      {/* Demographics Analytics */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Demographics Analytics</h5>,
        'demographics',
        [],
        [],
        true,
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="mb-3">Age Distribution</h6>
              {renderDistributionChart(ageDistribution, 'range', 'count', '#3b82f6')}
            </div>
            <div className="col-md-6">
              <h6 className="mb-3">Tenure Distribution</h6>
              {renderDistributionChart(tenureDistribution, 'range', 'count', '#10b981')}
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="mb-3">Gender Diversity by Department</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Male</th>
                      <th>Female</th>
                      <th>Female %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headcountData.map((dept) => (
                      <tr key={dept.id}>
                        <td>{dept.department}</td>
                        <td>{dept.male}</td>
                        <td>{dept.female}</td>
                        <td>{((dept.female / dept.headcount) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="mb-3">Employment Type Breakdown</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Permanent</th>
                      <th>Contract</th>
                      <th>Intern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headcountData.map((dept) => (
                      <tr key={dept.id}>
                        <td>{dept.department}</td>
                        <td>{dept.permanent}</td>
                        <td>{dept.contract}</td>
                        <td>{dept.intern || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h6 className="mb-3">Location-wise Distribution</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Total Employees</th>
                      <th>% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.filter(loc => loc !== 'All Locations').map((location) => {
                      const locationCount = headcountData
                        .filter(dept => dept.location === location)
                        .reduce((sum, dept) => sum + dept.headcount, 0);
                      return (
                        <tr key={location}>
                          <td>{location}</td>
                          <td>{locationCount}</td>
                          <td>{((locationCount / kpiMetrics.totalHeadcount) * 100).toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="mb-3">Grade/Level-wise Distribution</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Grade</th>
                      <th>Count</th>
                      <th>% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['grade1', 'grade2', 'grade3', 'grade4'].map((grade, idx) => {
                      const gradeCount = headcountData
                        .reduce((sum, dept) => sum + (dept[grade] || 0), 0);
                      return (
                        <tr key={grade}>
                          <td>L{idx + 1}</td>
                          <td>{gradeCount}</td>
                          <td>{((gradeCount / kpiMetrics.totalHeadcount) * 100).toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Joiner Reports */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">New Joiner Reports ({selectedTimeRange})</h5>,
        'newJoiners',
        newJoinerReports[selectedTimeRange.toLowerCase()] || newJoinerReports.monthly,
        selectedTimeRange.toLowerCase() === 'daily'
          ? ['Date', 'Count', 'Department', 'Accepted']
          : ['Period', 'Count', 'Accepted', 'Declined'],
        true
      )}

      {/* Employee List */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Employee List with Filters</h5>,
        'employeeList',
        employeeListData,
        ['Name', 'Employee ID', 'Department', 'Location', 'Status', 'Grade', 'Tenure', 'Joining Date'],
        true,
        <div>
          <div className="mb-3">
            <small className="text-muted">
              Showing employees with status: <strong>{employeeFilter === 'all' ? 'All' : employeeFilter.charAt(0).toUpperCase() + employeeFilter.slice(1).replace('-', ' ')}</strong>
            </small>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-start">Name</th>
                  <th className="text-start">Employee ID</th>
                  <th className="text-start">Department</th>
                  <th className="text-start">Location</th>
                  <th className="text-start">Status</th>
                  <th className="text-start">Grade</th>
                  <th className="text-start">Tenure</th>
                  <th className="text-start">Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {employeeListData
                  .filter(emp => employeeFilter === 'all' || emp.status.toLowerCase().replace(' ', '-') === employeeFilter)
                  .map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.employeeId}</td>
                      <td>{item.department}</td>
                      <td>{item.location}</td>
                      <td>
                        <span className={`badge bg-${item.status === 'Active' ? 'success' :
                          item.status === 'On Notice' ? 'warning' : 'secondary'
                          }`}>
                          {item.status}
                          {item.noticePeriod && ` (${item.noticePeriod})`}
                        </span>
                      </td>
                      <td>{item.grade}</td>
                      <td>{item.tenure}</td>
                      <td>{new Date(item.joiningDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attrition Analytics Reports */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Attrition Analytics Reports</h5>,
        'attrition',
        attritionData,
        ['Department', 'Location', 'Total', 'Voluntary', 'Involuntary', 'Regrettable', 'Non-Regrettable', 'Attrition Rate %', 'Avg Tenure']
      )}

      {/* Attrition Trends */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Attrition Trends & Forecasting</h5>,
        'trends',
        attritionTrends,
        ['Period', 'Attrition Rate %', 'Voluntary %', 'Involuntary %'],
        true
      )}

      {/* Attrition Reasons & Insights */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Attrition Reasons & Exit Interview Insights</h5>,
        'attritionReasons',
        [],
        [],
        true,
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="mb-3">Top Attrition Reasons</h6>
              {renderDistributionChart(attritionReasons, 'reason', 'count', '#ef4444')}
            </div>
            <div className="col-md-6">
              <h6 className="mb-3">Exit Interview Insights</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Insight</th>
                      <th>Mentions</th>
                      <th>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exitInterviewInsights.map((insight, idx) => (
                      <tr key={idx}>
                        <td>{insight.insight}</td>
                        <td>{insight.mentions}</td>
                        <td>
                          <span className={`badge bg-${insight.severity === 'High' ? 'danger' : 'warning'}`}>
                            {insight.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h6 className="mb-3">Replacement Cost Analysis</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Avg Cost per Hire</th>
                      <th>Total Replacement Cost</th>
                      <th>Hires Needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {replacementCostData.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.department}</td>
                        <td>₹{item.avgCost.toLocaleString()}</td>
                        <td>₹{item.totalCost.toLocaleString()}</td>
                        <td>{item.hiresNeeded}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Joining & Onboarding Reports */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Joining & Onboarding Reports</h5>,
        'joining',
        onboardingData,
        ['Department', 'Location', 'New Joiners', 'Accepted', 'Declined', 'Acceptance Rate %', 'Time to Join', 'Variance', 'Onboarding Complete', 'Onboarding Rate %', 'Probation Complete', 'Confirmation Rate %', '1st Year Attrition', '1st Year Attrition Rate %']
      )}

      {/* Offer Analysis */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Offer Acceptance & Decline Analysis</h5>,
        'offerAnalysis',
        [],
        [],
        true,
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="mb-3">Offer Decline Reasons</h6>
              {renderDistributionChart(offerDeclineReasons, 'reason', 'count', '#f59e0b')}
            </div>
            <div className="col-md-6">
              <h6 className="mb-3">Joining Date Variance</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>On Time</th>
                      <th>Delayed</th>
                      <th>Avg Variance (days)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {joiningVarianceData.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.department}</td>
                        <td>{item.onTime}</td>
                        <td>{item.delayed}</td>
                        <td>{item.avgVariance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Movement Reports */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Employee Movement Reports</h5>,
        'movement',
        movementData,
        ['Type', 'Employee', 'Employee ID', 'From', 'To', 'Department', 'Location', 'Date', 'Salary Change', 'Effective Date']
      )}

      {/* Salary Revision Reports */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Salary Revision Reports</h5>,
        'salaryRevision',
        salaryRevisionData,
        ['Employee', 'Employee ID', 'Department', 'Type', 'Old Salary', 'New Salary', 'Change %', 'Effective Date']
      )}

      {/* Department Strength Over Time */}
      {renderReportSection(
        <h5 className="text-lg font-bold ">Department Strength Over Time</h5>,
        'departmentStrength',
        [],
        [],
        true,
        <div>
          <div className="mb-3">
            <p className="text-muted small">Track headcount trends across departments over the past 6 months</p>
          </div>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Oct 2023</th>
                  <th>Nov 2023</th>
                  <th>Dec 2023</th>
                  <th>Jan 2024</th>
                  <th>Feb 2024</th>
                  <th>Mar 2024</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {headcountData.map((dept) => {
                  const baseCount = dept.headcount;
                  const trend = dept.growth > 0 ? <TrendingUp className="text-success" size={16} /> : <TrendingDown className="text-danger" size={16} />;
                  return (
                    <tr key={dept.id}>
                      <td>{dept.department}</td>
                      <td>{Math.round(baseCount * 0.92)}</td>
                      <td>{Math.round(baseCount * 0.94)}</td>
                      <td>{Math.round(baseCount * 0.96)}</td>
                      <td>{Math.round(baseCount * 0.98)}</td>
                      <td>{Math.round(baseCount * 0.99)}</td>
                      <td><strong>{baseCount}</strong></td>
                      <td>{trend}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Additional Analytics */}
      <div className="card border shadow-none mb-4">
        <div className="card-header">
           <h5 className="text-lg font-bold ">Available Reports and Analytics</h5>,
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <h6 className="mb-3 small text-muted">Headcount & Demographics</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Total Headcount Reports</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Age Distribution Analysis</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Gender Diversity Metrics</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Employment Type Breakdown</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Tenure Distribution</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Department Strength Over Time</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Location-wise Distribution</span>
                  <span className="badge bg-success">✓</span>
                </li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6 className="mb-3 small text-muted">Attrition Analytics</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Attrition Rate Calculation</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Voluntary vs Involuntary</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Regrettable vs Non-Regrettable</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Attrition Trends & Forecasting</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Exit Interview Insights</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Retention Rate Metrics</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Replacement Cost Analysis</span>
                  <span className="badge bg-success">✓</span>
                </li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6 className="mb-3 small text-muted">Joining & Movement</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Offer Acceptance Rate</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Time-to-Join Metrics</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Onboarding Completion</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Probation Completion Reports</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">First-year Attrition Rate</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Internal Transfer Reports</span>
                  <span className="badge bg-success">✓</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small">Salary Revision Reports</span>
                  <span className="badge bg-success">✓</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-3 col-6">
          <div className="card border shadow-none text-center">
            <div className="card-body">
              <div className="text-secondary-light small">Offer Acceptance Rate</div>
              <div className="h5 mb-0">0.0%</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border shadow-none text-center">
            <div className="card-body">
              <div className="text-secondary-light small">Onboarding Completion</div>
              <div className="h5 mb-0">0.0%</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border shadow-none text-center">
            <div className="card-body">
              <div className="text-secondary-light small">Probation Completion</div>
              <div className="h5 mb-0">0.0%</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border shadow-none text-center">
            <div className="card-body">
              <div className="text-secondary-light small">First Year Attrition</div>
              <div className="h5 mb-0">0.0%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default EmployeeReports;