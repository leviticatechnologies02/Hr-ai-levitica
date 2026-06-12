import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiSearch,
  FiDownload,
  FiCalendar,
  FiRefreshCw,
  FiPieChart,
  FiFilter,
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiMail,
  FiBarChart2
} from 'react-icons/fi';
import { assessmentAPI } from "../../../shared/utils/api";
import { BASE_URL } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';
import StatCard from '../../../shared/components/StatCard';

const TestResultsViewer = () => {
  const [candidateResults, setCandidateResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filters, setFilters] = useState({
    assessment: '',
    candidate: '',
    minScore: 0,
    maxScore: 100,
    status: '',
    stage: ''
  });

  const fetchResults = async () => {
    setLoading(true);
    try {
      const resultsData = await assessmentAPI.getAllResults();
      setCandidateResults(resultsData || []);
    } catch (error) {
      console.error('Error fetching test results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const candidateStages = candidateResults;

  const stats = {
    totalCandidates: candidateStages.length,
    completed: candidateStages.filter(c => 
      c.aptitude?.status === 'Completed' || 
      c.communication?.status === 'Completed' || 
      c.coding?.status === 'Completed'
    ).length,
    passed: candidateStages.filter(c => 
      c.aptitude?.test_status === 'Qualified' || 
      c.communication?.test_status === 'Qualified' || 
      c.coding?.test_status === 'Qualified'
    ).length,
    failed: candidateStages.filter(c => 
      c.aptitude?.test_status === 'Regret' || 
      c.communication?.test_status === 'Regret' || 
      c.coding?.test_status === 'Regret'
    ).length,
    avgScore: (() => {
      const allScores = [];
      candidateStages.forEach(c => {
        if (c.aptitude?.score !== null && c.aptitude?.score !== undefined) {
          const qCount = c.aptitude.question_count || 25;
          allScores.push((c.aptitude.score / qCount) * 100);
        }
        if (c.communication?.score !== null && c.communication?.score !== undefined) {
          const qCount = c.communication.question_count || 20;
          allScores.push((c.communication.score / qCount) * 100);
        }
        if (c.coding?.score !== null && c.coding?.score !== undefined) {
          allScores.push(c.coding.score * 20);
        }
      });
      return allScores.length > 0 
        ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
        : 0;
    })()
  };

  const filteredCandidateStages = candidateStages.filter(candidateStage => {
    const matchesCandidate = 
      candidateStage.candidate_name?.toLowerCase().includes(filters.candidate.toLowerCase()) ||
      candidateStage.candidate_email?.toLowerCase().includes(filters.candidate.toLowerCase());
    
    if (!matchesCandidate) return false;
    
    if (filters.assessment && filters.assessment !== 'all') {
      const assessmentType = filters.assessment.toLowerCase();
      if (assessmentType === 'aptitude' && !candidateStage.aptitude) return false;
      if (assessmentType === 'communication' && !candidateStage.communication) return false;
      if (assessmentType === 'coding' && !candidateStage.coding) return false;
    }
    
    if (filters.status && filters.status !== 'all') {
      const statusLower = filters.status.toLowerCase();
      const hasMatchingStatus = 
        (candidateStage.aptitude?.status?.toLowerCase() === statusLower) ||
        (candidateStage.communication?.status?.toLowerCase() === statusLower) ||
        (candidateStage.coding?.status?.toLowerCase() === statusLower);
      
      if (!hasMatchingStatus) return false;
    }
    
    if (filters.minScore > 0 || filters.maxScore < 100) {
      const hasScoreInRange = 
        (candidateStage.aptitude?.score !== null && candidateStage.aptitude?.score !== undefined &&
         ((candidateStage.aptitude.score / (candidateStage.aptitude.question_count || 25)) * 100) >= filters.minScore &&
         ((candidateStage.aptitude.score / (candidateStage.aptitude.question_count || 25)) * 100) <= filters.maxScore) ||
        (candidateStage.communication?.score !== null && candidateStage.communication?.score !== undefined &&
         ((candidateStage.communication.score / (candidateStage.communication.question_count || 20)) * 100) >= filters.minScore &&
         ((candidateStage.communication.score / (candidateStage.communication.question_count || 20)) * 100) <= filters.maxScore) ||
        (candidateStage.coding?.score !== null && candidateStage.coding?.score !== undefined &&
         candidateStage.coding.score >= filters.minScore && candidateStage.coding.score <= filters.maxScore);
      
      if (!hasScoreInRange) return false;
    }
    
    return true;
  });

  const getStatusBadge = (status) => {
    if (!status) return <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">Not Assigned</span>;
    
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'passed':
      case 'qualified':
        return <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">Completed</span>;
      case 'in progress':
        return <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">In Progress</span>;
      case 'assigned':
        return <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700">Assigned</span>;
      case 'failed':
      case 'regret':
        return <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700">Failed</span>;
      default:
        return <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  const renderStageStatus = (stage) => {
    if (!stage) {
      return (
        <div className="text-center">
          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">Not Completed</span>
        </div>
      );
    }
    
    const status = stage.status || 'Completed';
    return (
      <div className="text-center">
        <div>{getStatusBadge(status)}</div>
        {stage.score !== null && stage.score !== undefined && (
          <div className="mt-1">
            <span className="text-xs text-gray-500">
              {stage.score}{stage.question_count ? `/${stage.question_count}` : ''}
            </span>
          </div>
        )}
        {stage.test_status && (
          <div className="mt-1">
            <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
              stage.test_status === 'Qualified' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {stage.test_status}
            </span>
          </div>
        )}
      </div>
    );
  };

  const exportToCSV = () => {
    const headers = ['Candidate Name', 'Email', 'Aptitude Status', 'Aptitude Score', 'Communication Status', 'Communication Score', 'Coding Status', 'Coding Score'];
    const rows = filteredCandidateStages.map(candidateStage => [
      candidateStage.candidate_name,
      candidateStage.candidate_email,
      candidateStage.aptitude?.status || 'Not Assigned',
      candidateStage.aptitude?.score ? `${candidateStage.aptitude.score}/${candidateStage.aptitude.question_count || 25}` : 'N/A',
      candidateStage.communication?.status || 'Not Assigned',
      candidateStage.communication?.score ? `${candidateStage.communication.score}/${candidateStage.communication.question_count || 20}` : 'N/A',
      candidateStage.coding?.status || 'Not Assigned',
      candidateStage.coding?.score ? `${candidateStage.coding.score}/${candidateStage.coding.question_count || 'N/A'}` : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiPieChart className="text-gray-600 text-xl sm:text-2xl" />
              Test Results
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Review candidate scores, performance, and detailed breakdowns</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button
                onClick={fetchResults}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
              >
                <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
              >
                <FiDownload className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard 
            title="Average Score"
            value={`${stats.avgScore}%`}
            subtitle="Across all tests"
            icon="lucide:bar-chart-2"
            color="blue"
          />
          <StatCard 
            title="Total Candidates"
            value={stats.totalCandidates}
            subtitle="With any test result"
            icon="lucide:users"
            color="purple"
          />
          <StatCard 
            title="Passed"
            value={stats.passed}
            subtitle="Qualified status"
            icon="lucide:check-circle"
            color="green"
          />
          <StatCard 
            title="Failed"
            value={stats.failed}
            subtitle="Regret status"
            icon="lucide:x-circle"
            color="yellow"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Assessment</label>
              <select
                value={filters.assessment}
                onChange={(e) => setFilters({ ...filters, assessment: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
              >
                <option value="all">All Assessments</option>
                <option value="aptitude">Aptitude</option>
                <option value="communication">Communication</option>
                <option value="coding">Coding</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Candidate</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={filters.candidate}
                  onChange={(e) => setFilters({ ...filters, candidate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Min score (%)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minScore}
                onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Max score (%)</label>
              <input
                type="number"
                placeholder="100"
                value={filters.maxScore}
                onChange={(e) => setFilters({ ...filters, maxScore: parseInt(e.target.value, 10) || 100 })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
                <option value="assigned">Assigned</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
              <p className="text-gray-500 text-sm">Loading results...</p>
            </div>
          ) : filteredCandidateStages.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No results found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Candidate Name</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Email</th>
                    <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Aptitude Stage</th>
                    <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Communication Stage</th>
                    <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Coding Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCandidateStages.map((candidateStage) => (
                    <tr 
                      key={candidateStage.candidate_email} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedCandidate(candidateStage)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {candidateStage.candidate_name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-midnight_text">{candidateStage.candidate_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{candidateStage.candidate_email}</span>
                      </td>
                      <td className="px-4 py-3">
                        {renderStageStatus(candidateStage.aptitude)}
                      </td>
                      <td className="px-4 py-3">
                        {renderStageStatus(candidateStage.communication)}
                      </td>
                      <td className="px-4 py-3">
                        {renderStageStatus(candidateStage.coding)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        title="Assessment Details"
        size="lg"
      >
        {selectedCandidate && (
          <div className="space-y-4">
            {/* Candidate Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Candidate Name</p>
                <p className="text-sm font-semibold text-midnight_text">{selectedCandidate.candidate_name || 'Unknown'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-semibold text-midnight_text">{selectedCandidate.candidate_email || 'N/A'}</p>
              </div>
            </div>

            {/* All Assessment Stages */}
            <div>
              <h6 className="text-sm font-semibold text-midnight_text mb-3">All Assessment Stages</h6>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Aptitude Stage */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 text-center">
                  <p className="text-xs text-gray-500 font-semibold mb-2">Aptitude Stage</p>
                  {selectedCandidate.aptitude ? (
                    <>
                      {getStatusBadge(selectedCandidate.aptitude.status)}
                      {selectedCandidate.aptitude.score !== null && selectedCandidate.aptitude.score !== undefined && (
                        <div className="mt-2">
                          <p className="text-sm font-bold text-primary">
                            {selectedCandidate.aptitude.score}/{selectedCandidate.aptitude.question_count || 25}
                          </p>
                          <span className="text-xs text-gray-500">
                            {Math.round((selectedCandidate.aptitude.score / (selectedCandidate.aptitude.question_count || 25)) * 100)}%
                          </span>
                        </div>
                      )}
                      {selectedCandidate.aptitude.test_status && (
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
                            selectedCandidate.aptitude.test_status === 'Qualified' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {selectedCandidate.aptitude.test_status}
                          </span>
                        </div>
                      )}
                      {selectedCandidate.aptitude.completed_at && (
                        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                          <FiCalendar className="h-3 w-3" />
                          {new Date(selectedCandidate.aptitude.completed_at).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">Not Assigned</span>
                  )}
                </div>

                {/* Communication Stage */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 text-center">
                  <p className="text-xs text-gray-500 font-semibold mb-2">Communication Stage</p>
                  {selectedCandidate.communication ? (
                    <>
                      {getStatusBadge(selectedCandidate.communication.status)}
                      {selectedCandidate.communication.score !== null && selectedCandidate.communication.score !== undefined && (
                        <div className="mt-2">
                          <p className="text-sm font-bold text-primary">
                            {selectedCandidate.communication.score}/{selectedCandidate.communication.question_count || 20}
                          </p>
                          <span className="text-xs text-gray-500">
                            {Math.round((selectedCandidate.communication.score / (selectedCandidate.communication.question_count || 20)) * 100)}%
                          </span>
                        </div>
                      )}
                      {selectedCandidate.communication.test_status && (
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
                            selectedCandidate.communication.test_status === 'Qualified' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {selectedCandidate.communication.test_status}
                          </span>
                        </div>
                      )}
                      {selectedCandidate.communication.completed_at && (
                        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                          <FiCalendar className="h-3 w-3" />
                          {new Date(selectedCandidate.communication.completed_at).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">Not Assigned</span>
                  )}
                </div>

                {/* Coding Stage */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 text-center">
                  <p className="text-xs text-gray-500 font-semibold mb-2">Coding Stage</p>
                  {selectedCandidate.coding ? (
                    <>
                      {getStatusBadge(selectedCandidate.coding.status)}
                      {selectedCandidate.coding.score !== null && selectedCandidate.coding.score !== undefined && (
                        <div className="mt-2">
                          <p className="text-sm font-bold text-primary">
                            {selectedCandidate.coding.score} successful
                          </p>
                          {selectedCandidate.coding.question_count && (
                            <span className="text-xs text-gray-500">
                              out of {selectedCandidate.coding.question_count}
                            </span>
                          )}
                        </div>
                      )}
                      {selectedCandidate.coding.test_status && (
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
                            selectedCandidate.coding.test_status === 'Qualified' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {selectedCandidate.coding.test_status}
                          </span>
                        </div>
                      )}
                      {selectedCandidate.coding.completed_at && (
                        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                          <FiCalendar className="h-3 w-3" />
                          {new Date(selectedCandidate.coding.completed_at).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">Not Assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TestResultsViewer;