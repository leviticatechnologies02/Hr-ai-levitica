import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AddPositionModal from '../modal/AddPositionModal';
import EditRelationshipModal from '../modal/EditRelationshipModal';
import ExportModal from '../modal/ExportOrgModal';
import StatCard from '../../../shared/components/StatCard';

const OrganizationHierarchy = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('organization');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDate, setSelectedDate] = useState('current');
  const [selectedNode, setSelectedNode] = useState(null);
  const [drillDownPath, setDrillDownPath] = useState(['ceo']);
  const [showDirectReports, setShowDirectReports] = useState(true);
  const [showDottedLineReports, setShowDottedLineReports] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState('current');
  const [isExporting, setIsExporting] = useState(false);
  const [showAddPositionModal, setShowAddPositionModal] = useState(false);
  const [showEditRelationshipModal, setShowEditRelationshipModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [activeTab, setActiveTab] = useState('org-chart');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [orgHierarchy, setOrgHierarchy] = useState({});
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [reportingRelationships, setReportingRelationships] = useState([]);
  const [matrixReports, setMatrixReports] = useState([]);
  const [modificationRequests, setModificationRequests] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [spanAnalytics, setSpanAnalytics] = useState([]);
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    pendingChanges: 0,
    avgSpanOfControl: 0,
    departmentsCount: 0
  });

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        hierarchyData,
        departmentsData,
        locationsData,
        relationshipsData,
        matrixData,
        requestsData,
        historyData,
        analyticsData,
        statsData
      ] = await Promise.all([
        fetchOrganizationHierarchy(),
        fetchDepartments(),
        fetchLocations(),
        fetchReportingRelationships(),
        fetchMatrixReports(),
        fetchModificationRequests(),
        fetchHistoricalData(),
        fetchSpanAnalytics(),
        fetchStatistics()
      ]);

      setOrgHierarchy(hierarchyData);
      setDepartments(departmentsData);
      setLocations(locationsData);
      setReportingRelationships(relationshipsData);
      setMatrixReports(matrixData);
      setModificationRequests(requestsData);
      setHistoricalData(historyData);
      setSpanAnalytics(analyticsData);
      setStatistics(statsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load organization data');
      toast.error('Failed to load organization data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!isLoading && Object.keys(orgHierarchy).length > 0) {
      loadFilteredData();
    }
  }, [searchTerm, selectedDepartment, selectedLocation, selectedView]);

  const loadFilteredData = async () => {
    try {
      const params = {
        search: searchTerm || undefined,
        department: selectedDepartment !== 'all' ? selectedDepartment : undefined,
        location: selectedLocation !== 'all' ? selectedLocation : undefined,
        view: selectedView
      };
    } catch (err) {
      console.error('Failed to load filtered data:', err);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'completed': { label: 'Completed', color: 'emerald' },
      'pending': { label: 'Pending', color: 'amber' },
      'approved': { label: 'Approved', color: 'emerald' },
      'rejected': { label: 'Rejected', color: 'rose' },
      'in-review': { label: 'In Review', color: 'blue' },
      'in-process': { label: 'In Process', color: 'amber' },
      'active': { label: 'Active', color: 'emerald' },
      'inactive': { label: 'Inactive', color: 'rose' }
    };
    const { label, color } = config[status] || { label: status || 'Unknown', color: 'gray' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const getReportTypeBadge = (type) => {
    const config = {
      'direct': { label: 'Direct', color: 'blue' },
      'dotted-line': { label: 'Dotted-Line', color: 'amber' },
      'matrix': { label: 'Matrix', color: 'purple' },
      'project-based': { label: 'Project-Based', color: 'cyan' },
      'functional-matrix': { label: 'Functional Matrix', color: 'emerald' },
      'program-based': { label: 'Program-Based', color: 'rose' }
    };
    const { label, color } = config[type] || { label: type || 'N/A', color: 'gray' };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await approveModificationRequest(requestId);
      setModificationRequests(prev =>
        prev.map(request =>
          request.id === requestId ? { ...request, status: 'approved' } : request
        )
      );
      toast.success('Request approved successfully!');
    } catch (err) {
      console.error('Failed to approve request:', err);
      toast.error('Failed to approve request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectModificationRequest(requestId);
      setModificationRequests(prev =>
        prev.map(request =>
          request.id === requestId ? { ...request, status: 'rejected' } : request
        )
      );
      toast.info('Request rejected');
    } catch (err) {
      console.error('Failed to reject request:', err);
      toast.error('Failed to reject request. Please try again.');
    }
  };

  const handleExport = async (format, includeOptions) => {
    setIsExporting(true);
    try {
      const blob = await exportOrganizationChart({
        format,
        includeOptions,
        date: new Date().toISOString()
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `org-chart-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : format === 'excel' ? 'csv' : 'png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Organization chart exported as ${format.toUpperCase()}!`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export organization chart');
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  const handleAddPosition = async (formData) => {
    try {
      const newPosition = await addPosition(formData);
      const hierarchy = await fetchOrganizationHierarchy();
      setOrgHierarchy(hierarchy);
      toast.success(`Position "${formData.position}" added successfully!`);
      setShowAddPositionModal(false);
    } catch (err) {
      console.error('Failed to add position:', err);
      toast.error('Failed to add position. Please try again.');
    }
  };

  const handleEditRelationship = async (formData) => {
    try {
      await updateRelationship(formData);
      const relationships = await fetchReportingRelationships();
      setReportingRelationships(relationships);
      toast.success(`Reporting relationship updated for ${formData.employeeName}`);
      setShowEditRelationshipModal(false);
      setSelectedRelationship(null);
    } catch (err) {
      console.error('Failed to update relationship:', err);
      toast.error('Failed to update relationship. Please try again.');
    }
  };

  const handleDrillDown = (nodeId) => {
    if (!orgHierarchy[nodeId]) {
      toast.warning('Node not found in hierarchy');
      return;
    }
    setSelectedNode(nodeId);
    setDrillDownPath([...drillDownPath, nodeId]);
  };

  const handleDrillUp = () => {
    if (drillDownPath.length > 1) {
      const newPath = [...drillDownPath];
      newPath.pop();
      setDrillDownPath(newPath);
      setSelectedNode(newPath[newPath.length - 1]);
    } else {
      setDrillDownPath(['ceo']);
      setSelectedNode(null);
    }
  };

  const getCurrentNode = () => {
    const currentNodeId = drillDownPath[drillDownPath.length - 1];
    return orgHierarchy[currentNodeId] || null;
  };

  const getDirectReports = (nodeId) => {
    const node = orgHierarchy[nodeId];
    if (!node || !node.reports) return [];
    return node.reports
      .map(id => orgHierarchy[id])
      .filter(Boolean);
  };

  const getDottedLineReports = (nodeId) => {
    const node = orgHierarchy[nodeId];
    if (!node || !node.dottedLineReports) return [];
    return node.dottedLineReports
      .map(id => orgHierarchy[id])
      .filter(Boolean);
  };

  const handleTimeTravel = async (version) => {
    setSelectedVersion(version);
    if (version === 'current') {
      setSelectedDate('current');
      await loadInitialData();
    } else {
      try {
        const historyItem = historicalData.find(h => h.version === version);
        if (historyItem) {
          setSelectedDate(historyItem.date);
          const historicalHierarchy = await loadHistoricalVersion(version);
          setOrgHierarchy(historicalHierarchy);
          toast.info(`Loaded historical view: ${historyItem.version} from ${historyItem.date}`);
        }
      } catch (err) {
        console.error('Failed to load historical version:', err);
        toast.error('Failed to load historical version');
      }
    }
  };

  const tabs = [
    { id: 'org-chart', label: 'Organization Chart', icon: 'heroicons:chart-pie' },
    { id: 'reporting', label: 'Reporting Relationships', icon: 'heroicons:arrow-right-circle' },
    { id: 'analytics', label: 'Span Analytics', icon: 'heroicons:chart-bar' },
    { id: 'management', label: 'Modification Requests', icon: 'heroicons:adjustments-horizontal' },
    { id: 'historical', label: 'Historical View', icon: 'heroicons:clock' },
  ];

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading organization data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Icon icon="heroicons:exclamation-triangle" className="w-12 h-12 text-rose-500 mb-3" />
          <p className="text-sm font-medium text-slate-800">Failed to load data</p>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
          <button
            onClick={loadInitialData}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'org-chart':
        return renderOrgChart();
      case 'reporting':
        return renderReportingRelationships();
      case 'analytics':
        return renderSpanAnalytics();
      case 'management':
        return renderManagement();
      case 'historical':
        return renderHistoricalView();
      default:
        return renderOrgChart();
    }
  };

  const renderOrgChart = () => {
    const currentNode = getCurrentNode();
    if (!currentNode) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Icon icon="heroicons:building-office" className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">No organization data available</p>
        </div>
      );
    }

    const directReports = getDirectReports(drillDownPath[drillDownPath.length - 1]);
    const dottedLineReports = getDottedLineReports(drillDownPath[drillDownPath.length - 1]);

    return (
      <div className="space-y-6">
        {drillDownPath.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <button
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1 border border-slate-200"
              onClick={handleDrillUp}
            >
              <Icon icon="heroicons:arrow-left" className="w-3 h-3" />
              Back
            </button>
            <div className="flex items-center gap-1 text-xs text-slate-600">
              {drillDownPath.map((nodeId, index) => {
                const node = orgHierarchy[nodeId];
                return (
                  <React.Fragment key={nodeId}>
                    <span
                      className={`cursor-pointer ${index === drillDownPath.length - 1 ? 'font-bold text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                      onClick={() => {
                        const newPath = drillDownPath.slice(0, index + 1);
                        setDrillDownPath(newPath);
                        setSelectedNode(nodeId);
                      }}
                    >
                      {node?.name || nodeId}
                    </span>
                    {index < drillDownPath.length - 1 && (
                      <Icon icon="heroicons:chevron-right" className="w-3 h-3 text-slate-400" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Direct Reports</span>
              <button
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showDirectReports ? 'bg-blue-600' : 'bg-slate-300'}`}
                onClick={() => setShowDirectReports(!showDirectReports)}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${showDirectReports ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Dotted-Line</span>
              <button
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showDottedLineReports ? 'bg-blue-600' : 'bg-slate-300'}`}
                onClick={() => setShowDottedLineReports(!showDottedLineReports)}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${showDottedLineReports ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddPositionModal(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
            >
              <Icon icon="heroicons:plus" className="w-3 h-3" />
              Add Position
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3" />
              Export
            </button>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50 min-h-[500px] overflow-x-auto">
          <div className="flex flex-col items-center min-w-max pb-10 pt-8 px-4">
            <div className="relative">
              <div className={`bg-white border-2 ${selectedNode ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-blue-600'} rounded-2xl w-64 hover:shadow-md transition-all relative z-10`}>
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 ${selectedNode ? 'bg-blue-500' : 'bg-blue-600'} rounded-full border-4 border-white shadow-sm flex items-center justify-center`}>
                  <Icon icon="heroicons:user" className="text-white text-2xl" />
                </div>
                <div className="p-5 pt-8 text-center">
                  <h6 className="font-bold text-slate-800 text-base truncate">{currentNode.name}</h6>
                  <p className="text-xs text-slate-500 mt-1 truncate">{currentNode.title}</p>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {currentNode.department}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200">
                      {currentNode.location}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                      Span: {currentNode.spanOfControl}
                    </span>
                  </div>
                  {directReports.length > 0 && (
                    <button
                      className="mt-4 px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition flex items-center gap-1 mx-auto w-full justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDrillDown(drillDownPath[drillDownPath.length - 1]);
                      }}
                    >
                      <Icon icon="heroicons:chevron-down" className="w-3 h-3" />
                      Drill Down ({directReports.length})
                    </button>
                  )}
                </div>
              </div>
            </div>

            {((showDirectReports && directReports.length > 0) || (drillDownPath.length === 1 && Object.keys(orgHierarchy).length > 1)) && (
              <div className="w-px h-8 bg-slate-300"></div>
            )}
            {drillDownPath.length === 1 && Object.keys(orgHierarchy).length > 1 && (
              <div className="flex justify-center gap-6 relative w-full">
                {Object.keys(orgHierarchy)
                  .filter(key => key !== 'ceo' && orgHierarchy[key]?.reports)
                  .slice(0, 3)
                  .map((key, i, arr) => {
                    const node = orgHierarchy[key];
                    const colors = ['emerald', 'amber', 'cyan'];
                    const icons = ['heroicons:computer-desktop', 'heroicons:banknotes', 'heroicons:cog-6-tooth'];
                    const labels = ['Technology', 'Finance', 'Operations'];
                    const color = colors[i % colors.length];
                    const icon = icons[i % icons.length];
                    const label = labels[i % labels.length];

                    return (
                      <div key={key} className="relative flex flex-col items-center pt-8">
                        <div className="absolute top-0 w-px h-8 bg-slate-300"></div>
                        {arr.length > 1 && (
                          <>
                            {i !== 0 && <div className="absolute top-0 left-[-0.75rem] w-[calc(50%+0.75rem)] h-px bg-slate-300"></div>}
                            {i !== arr.length - 1 && <div className="absolute top-0 right-[-0.75rem] w-[calc(50%+0.75rem)] h-px bg-slate-300"></div>}
                          </>
                        )}

                        <div
                          className={`relative z-10 bg-white border border-slate-200 rounded-2xl p-4 pt-6 w-52 hover:shadow-md transition cursor-pointer hover:border-${color}-400 text-center`}
                          onClick={() => handleDrillDown(key)}
                        >
                          <div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-${color}-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm`}>
                            <Icon icon={icon} className="text-white text-sm" />
                          </div>
                          <h6 className="font-semibold text-slate-800 text-sm truncate">{node.name}</h6>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{node.title}</p>
                          <div className="flex flex-col items-center gap-2 mt-2">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
                              {label}
                            </span>
                            <button
                              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-medium transition flex items-center gap-1 w-full justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDrillDown(key);
                              }}
                            >
                              <Icon icon="heroicons:eye" className="w-3 h-3" />
                              View Team ({node.spanOfControl})
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {showDirectReports && drillDownPath.length > 1 && directReports.length > 0 && (
              <div className="flex justify-center gap-6 relative w-full">
                {directReports.map((report, i, arr) => {
                  const reportKey = Object.keys(orgHierarchy).find(key => orgHierarchy[key]?.id === report.id);
                  return (
                    <div key={report.id} className="relative flex flex-col items-center pt-8">
                      <div className="absolute top-0 w-px h-8 bg-slate-300"></div>
                      {arr.length > 1 && (
                        <>
                          {i !== 0 && <div className="absolute top-0 left-[-0.75rem] w-[calc(50%+0.75rem)] h-px bg-slate-300"></div>}
                          {i !== arr.length - 1 && <div className="absolute top-0 right-[-0.75rem] w-[calc(50%+0.75rem)] h-px bg-slate-300"></div>}
                        </>
                      )}

                      <div
                        className="relative z-10 bg-white border border-slate-200 rounded-2xl p-4 pt-6 w-48 hover:shadow-md transition cursor-pointer hover:border-blue-400 text-center"
                        onClick={() => handleDrillDown(reportKey)}
                      >
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                          <Icon icon="heroicons:user" className="text-white text-sm" />
                        </div>
                        <h6 className="font-semibold text-slate-800 text-sm truncate">{report.name}</h6>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{report.title}</p>
                        <div className="flex justify-center mt-2 gap-1 flex-wrap">
                          <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {report.department}
                          </span>
                          {report.spanOfControl > 0 && (
                            <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                              Span: {report.spanOfControl}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {showDottedLineReports && drillDownPath.length > 1 && dottedLineReports.length > 0 && (
              <>
                <div className="w-px h-10 border-l-2 border-dashed border-amber-300 mt-6 relative"></div>
                <div className="text-center mb-2 mt-2">
                  <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                    Dotted-Line Reports
                  </span>
                </div>
                <div className="flex justify-center gap-6 relative w-full pt-4">
                  {dottedLineReports.map((report, i, arr) => (
                    <div key={report.id} className="relative flex flex-col items-center pt-8">
                      <div className="absolute top-0 w-px h-8 border-l-2 border-dashed border-amber-300"></div>
                      {arr.length > 1 && (
                        <>
                          {i !== 0 && <div className="absolute top-0 left-[-0.75rem] w-[calc(50%+0.75rem)] h-px border-t-2 border-dashed border-amber-300"></div>}
                          {i !== arr.length - 1 && <div className="absolute top-0 right-[-0.75rem] w-[calc(50%+0.75rem)] h-px border-t-2 border-dashed border-amber-300"></div>}
                        </>
                      )}

                      <div className="relative z-10 bg-white border border-amber-200 border-dashed rounded-2xl p-4 pt-6 w-48 opacity-90 text-center">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                          <Icon icon="heroicons:user" className="text-white text-sm" />
                        </div>
                        <h6 className="font-semibold text-slate-800 text-sm truncate">{report.name}</h6>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{report.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-12 pt-6 border-t border-slate-200 w-full sticky left-0 right-0">
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-slate-600">Direct Report</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-xs text-slate-600">Dotted-Line Report</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-slate-600">Matrix Report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReportingRelationships = () => {
    const directRelationships = reportingRelationships.filter(r => r.type === 'direct');
    const dottedRelationships = reportingRelationships.filter(r => r.type === 'dotted-line');

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">Reporting Relationships</h3>
          <button
            onClick={() => setShowEditRelationshipModal(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
          >
            <Icon icon="heroicons:plus" className="w-3 h-3" />
            Add Relationship
          </button>
        </div>

        {reportingRelationships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <Icon icon="heroicons:arrow-right-circle" className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-600">No reporting relationships found</p>
            <button
              onClick={() => setShowEditRelationshipModal(true)}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
            >
              Add First Relationship
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Direct Reporting ({directRelationships.length})</h6>
              </div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50/50 sticky top-0">
                    <tr>
                      <th className="p-3 font-semibold text-slate-600">Employee</th>
                      <th className="p-3 font-semibold text-slate-600">Manager</th>
                      <th className="p-3 font-semibold text-slate-600">Date</th>
                      <th className="p-3 font-semibold text-slate-600 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {directRelationships.map(rel => (
                      <tr key={rel.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-medium text-slate-700">{rel.employeeName}</div>
                          <div className="text-[10px] text-slate-400">{rel.employeeId}</div>
                        </td>
                        <td className="p-3 text-slate-600">{rel.managerName}</td>
                        <td className="p-3 text-slate-500">{rel.effectiveDate}</td>
                        <td className="p-3 text-center">
                          <button
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            onClick={() => {
                              setSelectedRelationship(rel);
                              setShowEditRelationshipModal(true);
                            }}
                          >
                            <Icon icon="heroicons:pencil-square" className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Matrix & Dotted-Line ({dottedRelationships.length})</h6>
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Dotted-Line</span>
              </div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50/50 sticky top-0">
                    <tr>
                      <th className="p-3 font-semibold text-slate-600">Employee</th>
                      <th className="p-3 font-semibold text-slate-600">Reports To</th>
                      <th className="p-3 font-semibold text-slate-600">Type</th>
                      <th className="p-3 font-semibold text-slate-600 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dottedRelationships.map(rel => (
                      <tr key={rel.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-medium text-slate-700">{rel.employeeName}</div>
                          <div className="text-[10px] text-slate-400">{rel.employeeId}</div>
                        </td>
                        <td className="p-3 text-slate-600">{rel.managerName}</td>
                        <td className="p-3">{getReportTypeBadge(rel.type)}</td>
                        <td className="p-3 text-center">
                          <button
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            onClick={() => {
                              setSelectedRelationship(rel);
                              setShowEditRelationshipModal(true);
                            }}
                          >
                            <Icon icon="heroicons:pencil-square" className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSpanAnalytics = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800">Span of Control Analytics</h3>

      {spanAnalytics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <Icon icon="heroicons:chart-bar" className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">No analytics data available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Span of Control by Level</h6>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="p-3 font-semibold text-slate-600">Level</th>
                      <th className="p-3 font-semibold text-slate-600 text-center">Average</th>
                      <th className="p-3 font-semibold text-slate-600 text-center">Max</th>
                      <th className="p-3 font-semibold text-slate-600 text-center">Min</th>
                      <th className="p-3 font-semibold text-slate-600 text-center">Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {spanAnalytics.map(analytic => (
                      <tr key={analytic.level} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-700">{analytic.level}</td>
                        <td className="p-3 text-center text-slate-600">{analytic.avgSpan}</td>
                        <td className="p-3 text-center text-slate-600">{analytic.maxSpan}</td>
                        <td className="p-3 text-center text-slate-600">{analytic.minSpan}</td>
                        <td className="p-3 text-center">
                          {analytic.level === 'Overall Average' ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100">Optimal</span>
                          ) : analytic.avgSpan > 30 ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">High</span>
                          ) : analytic.avgSpan < 5 ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">Low</span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Optimal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4">
                <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Span Distribution</h6>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Optimal Range (5-15)</span>
                      <span className="font-semibold text-emerald-600">65% of managers</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">High Span (&gt;15)</span>
                      <span className="font-semibold text-amber-600">25% of managers</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Low Span (&lt;5)</span>
                      <span className="font-semibold text-rose-600">10% of managers</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Recommendations</h6>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <Icon icon="heroicons:check-circle" className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Consider splitting high-span teams (15+ reports)</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <Icon icon="heroicons:check-circle" className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Review low-span managers for consolidation opportunities</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <Icon icon="heroicons:check-circle" className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Implement dotted-line reporting for specialized functions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatCard title="Overloaded Managers" value={spanAnalytics.find(a => a.level === 'Manager-Level')?.maxSpan || 'N/A'} subtitle="15+ direct reports" icon="heroicons:exclamation-triangle" color="red" />
            <StatCard title="Optimal Managers" value={spanAnalytics.find(a => a.level === 'Manager-Level')?.avgSpan || 'N/A'} subtitle="5-15 direct reports" icon="heroicons:check-badge" color="green" />
            <StatCard title="Underloaded Managers" value="8" subtitle="Less than 5 reports" icon="heroicons:arrow-down-circle" color="yellow" />
            <StatCard title="Manager to IC Ratio" value="4:1" subtitle="Industry avg: 5:1" icon="heroicons:scale" color="blue" />
          </div>
        </>
      )}
    </div>
  );

  const renderManagement = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-sm font-bold text-slate-800">Hierarchy Modification Requests</h3>
        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1">
          <Icon icon="heroicons:plus" className="w-3 h-3" />
          New Request
        </button>
      </div>

      {modificationRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <Icon icon="heroicons:adjustments-horizontal" className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">No modification requests found</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold text-slate-600">Type</th>
                <th className="p-3 font-semibold text-slate-600">Details</th>
                <th className="p-3 font-semibold text-slate-600">Requester</th>
                <th className="p-3 font-semibold text-slate-600">Date</th>
                <th className="p-3 font-semibold text-slate-600 text-center">Status</th>
                <th className="p-3 font-semibold text-slate-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modificationRequests.map(request => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                      {request.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-slate-700">
                      {request.type === 'add-position' && `Add ${request.position} in ${request.department}`}
                      {request.type === 'modify-reporting' && `Move ${request.employee} to ${request.newManager}`}
                      {request.type === 'dotted-line-add' && `Add dotted-line: ${request.employee} → ${request.manager}`}
                      {request.type === 'restructure' && request.description}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Approvals: {request.approvalNeeded?.join(', ')}
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">{request.requester}</td>
                  <td className="p-3 text-slate-500">{request.date}</td>
                  <td className="p-3 text-center">{getStatusBadge(request.status)}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {request.status === 'pending' && (
                        <>
                          <button
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                            onClick={() => handleApproveRequest(request.id)}
                            title="Approve"
                          >
                            <Icon icon="heroicons:check" className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                            onClick={() => handleRejectRequest(request.id)}
                            title="Reject"
                          >
                            <Icon icon="heroicons:x-mark" className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition" title="View Details">
                        <Icon icon="heroicons:eye" className="w-4 h-4" />
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
  );

  const renderHistoricalView = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800">Historical Hierarchy View</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border border-slate-200 rounded-xl p-4">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Time-Travel Control</h6>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Select Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={selectedDate === 'current' ? new Date().toISOString().split('T')[0] : selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Or Select Version</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
              >
                <option value="current">Current Structure</option>
                {historicalData.map(history => (
                  <option key={history.version} value={history.version}>
                    {history.version} - {new Date(history.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
              onClick={() => handleTimeTravel(selectedVersion)}
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
              Load Historical View
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Version History</h6>
          </div>
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            {historicalData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Icon icon="heroicons:clock" className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-600">No historical data available</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50/50 sticky top-0">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600">Version</th>
                    <th className="p-3 font-semibold text-slate-600">Date</th>
                    <th className="p-3 font-semibold text-slate-600">Changes</th>
                    <th className="p-3 font-semibold text-slate-600">By</th>
                    <th className="p-3 font-semibold text-slate-600 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historicalData.map(history => (
                    <tr key={history.version} className="hover:bg-slate-50">
                      <td className="p-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {history.version}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{history.date}</td>
                      <td className="p-3 text-slate-600">{history.changes}</td>
                      <td className="p-3 text-slate-600">{history.by}</td>
                      <td className="p-3 text-center">
                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          onClick={() => handleTimeTravel(history.version)}
                        >
                          <Icon icon="heroicons:eye" className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <div className="mx-auto space-y-3 sm:space-y-4 md:space-y-6 px-2 sm:px-3 md:px-4 min-h-screen pb-8 sm:pb-10">

      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
              <Icon icon="heroicons:building-office" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
                Organizational Hierarchy
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 flex flex-wrap items-center gap-1 sm:gap-2">
                <span>Visualize and manage organizational structure</span>
                <span className="w-0.5 h-0.5 rounded-full bg-slate-300 hidden xs:inline"></span>
                <span className="hidden xs:inline">Reporting relationships & hierarchy analytics</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowAddPositionModal(true)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 sm:gap-2"
            >
              <Icon icon="heroicons:plus" className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Add</span> Position
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 sm:gap-2"
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Departments" value={departments.length} icon="heroicons:building-office" color="blue" />
        <StatCard title="Total Employees" value={statistics.totalEmployees} icon="heroicons:users" color="green" />
        <StatCard title="Avg. Span of Control" value={statistics.avgSpanOfControl} icon="heroicons:chart-bar" color="yellow" />
        <StatCard title="Pending Changes" value={statistics.pendingChanges} icon="heroicons:arrow-path" color="red" />
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4 md:p-5">
        <button
          className="w-full sm:hidden flex items-center justify-between py-2 text-sm font-semibold text-slate-700"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <span className="flex items-center gap-2">
            <Icon icon="heroicons:funnel" className="w-4 h-4" />
            Filters
          </span>
          <Icon icon={showMobileFilters ? "heroicons:chevron-up" : "heroicons:chevron-down"} className="w-4 h-4" />
        </button>

        <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
            <div className="relative flex-1 min-w-[120px]">
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
              >
                <option value="organization">Organization View</option>
                <option value="department">Department View</option>
                <option value="location">Location View</option>
                <option value="function">Functional View</option>
              </select>
              <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-[120px]">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-[120px]">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Locations</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-[140px]">
              <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 sm:h-10 pl-8 sm:pl-10 pr-3 sm:pr-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              />
            </div>

            <button
              type="button"
              className="h-8 sm:h-10 px-3 sm:px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1 sm:gap-2"
              onClick={() => {
                setSelectedView('organization');
                setSelectedDepartment('all');
                setSelectedLocation('all');
                setSearchTerm('');
                setShowMobileFilters(false);
                loadInitialData();
              }}
            >
              <Icon icon="heroicons:arrow-path" className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-0 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-sm font-semibold transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap border-b-2 ${activeTab === tab.id
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon icon={tab.icon} className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4 md:p-6">
        {renderTabContent()}
      </div>

      <AddPositionModal
        isOpen={showAddPositionModal}
        onClose={() => setShowAddPositionModal(false)}
        onSubmit={handleAddPosition}
        departments={departments}
      />

      <EditRelationshipModal
        isOpen={showEditRelationshipModal}
        onClose={() => {
          setShowEditRelationshipModal(false);
          setSelectedRelationship(null);
        }}
        onSubmit={handleEditRelationship}
        relationship={selectedRelationship}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        className="text-xs sm:text-sm"
        toastClassName="rounded-xl shadow-lg"
      />
    </div>
  );
};

export default OrganizationHierarchy;