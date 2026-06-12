import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiUsers, 
  FiUserPlus, 
  FiMessageCircle, 
  FiCheckCircle, 
  FiXCircle,
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
  FiEye,
  FiChevronRight,
  FiClock,
  FiMail,
  FiUser,
  FiAward,
  FiBarChart2
} from 'react-icons/fi';
import { BASE_URL } from "../../../shared/constants/api.config";
import StatCard from '../../../shared/components/StatCard';
const PipelineOverview = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [resumeCandidates, setResumeCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [screeningThreshold, setScreeningThreshold] = useState(null);

  const fetchCandidates = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please login to view pipeline');
      setLoading(false);
      return;
    }

    try {
      const [candidatesRes, screeningRes, configRes] = await Promise.all([
        fetch(`${BASE_URL}/api/recruiter_dashboard/candidates`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${BASE_URL}/api/resume/candidates?limit=1000&offset=0&show_all=true`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${BASE_URL}/api/resume/screening-config`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      let resolvedScreeningTh = null;
      if (configRes.ok) {
        try {
          const cfg = await configRes.json();
          const t = Number(cfg?.score_threshold);
          if (Number.isFinite(t)) {
            resolvedScreeningTh = t;
            setScreeningThreshold(t);
          }
        } catch {
          // ignore
        }
      }

      if (candidatesRes.ok) {
        const data = await candidatesRes.json();
        setCandidates(Array.isArray(data) ? data : []);
      } else {
        setCandidates([]);
      }

      if (screeningRes.ok) {
        const data = await screeningRes.json();
        const inferStage = (r) => {
          const th = r.threshold ?? resolvedScreeningTh;
          if (th == null || !Number.isFinite(Number(th))) return 'Applied';
          return Number(r.score) < Number(th) ? 'Rejected' : 'Applied';
        };
        const mapped = Array.isArray(data)
          ? data.map((r) => ({
              id: r.id,
              name: r.candidate_name,
              email: r.candidate_email,
              role: r.role,
              stage: r.stage || inferStage(r),
              score: r.score,
              threshold: r.threshold,
              email_sent: r.email_sent,
              resume_screened: r.resume_screened,
              fullData: r
            }))
          : [];
        setResumeCandidates(mapped);
      } else {
        setResumeCandidates([]);
      }

      if (!candidatesRes.ok && !screeningRes.ok) {
        setError('Failed to fetch candidates');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Pipeline fetch error:', err);
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const normalizeStage = (stage) => {
    const value = (stage || '').toLowerCase();
    if (value === 'applied') return 'Applied';
    if (value === 'screening') return 'Screening';
    if (value === 'interview') return 'Interview';
    if (value === 'offer') return 'Offer';
    if (value === 'hired') return 'Hired';
    if (value === 'rejected') return 'Rejected';
    return 'Applied';
  };

  const mergedCandidates = () => {
    const byKey = new Map();

    candidates.forEach((candidate) => {
      const key = candidate.email?.toLowerCase().trim() || `candidate-id-${candidate.id}`;
      byKey.set(key, {
        ...candidate,
        stage: normalizeStage(candidate.stage)
      });
    });

    resumeCandidates.forEach((candidate) => {
      const key = candidate.email?.toLowerCase().trim() || `resume-id-${candidate.id}`;
      const resumeStage = normalizeStage(candidate.stage);
      const resumeThreshold = Number.isFinite(Number(candidate.threshold))
        ? Number(candidate.threshold)
        : (Number.isFinite(screeningThreshold) ? screeningThreshold : null);
      const resumeIsRejected =
        resumeStage === 'Rejected' ||
        (resumeThreshold != null && Number(candidate.score) < resumeThreshold);

      if (!byKey.has(key)) {
        byKey.set(key, {
          ...candidate,
          stage: resumeStage
        });
      } else if (resumeIsRejected) {
        const existing = byKey.get(key);
        byKey.set(key, {
          ...existing,
          stage: 'Rejected'
        });
      }
    });

    return Array.from(byKey.values());
  };

  const groupCandidatesByStage = () => {
    const allCandidates = mergedCandidates();
    const stages = {
      'Applied': [],
      'Screening': [],
      'Interview': [],
      'Offer': [],
      'Hired': [],
      'Rejected': []
    };

    allCandidates.forEach(candidate => {
      const stage = normalizeStage(candidate.stage);
      if (stages[stage]) {
        stages[stage].push(candidate);
      }
    });

    return stages;
  };

  const getFilteredCandidates = () => {
    let filtered = mergedCandidates();

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        (candidate.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (candidate.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (candidate.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStage !== 'all') {
      filtered = filtered.filter(candidate => candidate.stage === selectedStage);
    }

    return filtered;
  };

  const stages = groupCandidatesByStage();
  const filteredCandidates = getFilteredCandidates();
  const totalCandidates = Object.values(stages).reduce((sum, stageCandidates) => sum + stageCandidates.length, 0);

  const getStageColor = (stage) => {
    const colors = {
      'Applied': 'bg-primary/10 text-primary border-primary/20',
      'Screening': 'bg-amber-50 text-amber-700 border-amber-200',
      'Interview': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Offer': 'bg-primary/10 text-primary border-primary/20',
      'Hired': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Rejected': 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return colors[stage] || 'bg-gray-100 text-gray-600';
  };

  const StageCard = ({ stage, candidates: stageCandidates }) => (
    <div
      className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4 hover:shadow-property transition-all cursor-pointer"
      onClick={() => {
        setSelectedStage(stage);
        navigate('/candidates', { state: { stage } });
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            stage === 'Applied' ? 'bg-primary/10' :
            stage === 'Screening' ? 'bg-amber-50' :
            stage === 'Interview' ? 'bg-indigo-50' :
            stage === 'Offer' ? 'bg-primary/10' :
            stage === 'Hired' ? 'bg-emerald-50' : 'bg-rose-50'
          }`}>
            {stage === 'Applied' && <FiUsers className="h-5 w-5 text-primary" />}
            {stage === 'Screening' && <FiClock className="h-5 w-5 text-amber-600" />}
            {stage === 'Interview' && <FiMessageCircle className="h-5 w-5 text-indigo-600" />}
            {stage === 'Offer' && <FiMail className="h-5 w-5 text-primary" />}
            {stage === 'Hired' && <FiCheckCircle className="h-5 w-5 text-emerald-600" />}
            {stage === 'Rejected' && <FiXCircle className="h-5 w-5 text-rose-600" />}
          </div>
          <h6 className="font-semibold text-midnight_text">{stage}</h6>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
          {stageCandidates.length}
        </span>
      </div>
      <div className="space-y-2">
        {stageCandidates.slice(0, 3).map((candidate) => (
          <div key={candidate.id} className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-midnight_text">{candidate.name}</p>
            <p className="text-xs text-gray-500">{candidate.role}</p>
          </div>
        ))}
        {stageCandidates.length > 3 && (
          <button
            className="text-xs text-primary hover:text-primary/80 font-medium mt-1"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedStage(stage);
              navigate('/candidates', { state: { stage } });
            }}
          >
            View {stageCandidates.length - 3} more
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
        <p className="text-gray-500 text-sm">Loading pipeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-700">
          <FiAlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
          <div className="flex-1 text-sm">{error}</div>
          <button onClick={fetchCandidates} className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-all">
            <FiRefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiGrid className="text-gray-700 text-xl sm:text-2xl" />
              Recruitment Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Track candidates through each stage</p>
          </div>
          <button
            onClick={fetchCandidates}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all w-full sm:w-auto"
          >
            <FiRefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard 
            title="Total Candidates"
            value={totalCandidates}
            subtitle="All candidates"
            icon="lucide:users"
            color="blue"
          />
          <StatCard 
            title="Applied"
            value={stages.Applied.length}
            subtitle="New applications"
            icon="lucide:user-plus"
            color="purple"
          />
          <StatCard 
            title="In Interview"
            value={stages.Interview.length}
            subtitle="Currently active"
            icon="lucide:message-circle"
            color="yellow"
          />
          <StatCard 
            title="Hired"
            value={stages.Hired.length}
            subtitle="Successfully joined"
            icon="lucide:check-circle"
            color="green"
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white w-full sm:w-auto"
            >
              <option value="all">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map((stage) => (
            <StageCard key={stage} stage={stage} candidates={stages[stage]} />
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4 sm:p-6">
          <h5 className="font-semibold text-midnight_text mb-4">Pipeline Flow</h5>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {Object.entries(stages).map(([stage, stageCandidates], index) => (
              <React.Fragment key={stage}>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 ${
                    stage === 'Applied' ? 'bg-primary' :
                    stage === 'Screening' ? 'bg-amber-500' :
                    stage === 'Interview' ? 'bg-indigo-500' :
                    stage === 'Offer' ? 'bg-primary' :
                    stage === 'Hired' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}>
                    {stageCandidates.length}
                  </div>
                  <p className="text-sm font-medium text-midnight_text">{stage}</p>
                  <p className="text-xs text-gray-500">{stageCandidates.length} candidates</p>
                </div>
                {index < Object.keys(stages).length - 1 && (
                  <FiChevronRight className="text-gray-400 h-5 w-5 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {selectedStage !== 'all' && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4 sm:p-6">
            <h5 className="font-semibold text-midnight_text mb-4">
              {selectedStage} Candidates ({filteredCandidates.length})
            </h5>
            <div className="space-y-2">
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{candidate.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-midnight_text">{candidate.name}</p>
                      <p className="text-xs text-gray-500">{candidate.role}</p>
                      <p className="text-xs text-gray-400">{candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStageColor(candidate.stage)}`}>
                      {candidate.stage}
                    </span>
                    <button
                      onClick={() => navigate('/candidates', { state: { stage: selectedStage } })}
                      className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all"
                      title="View"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredCandidates.length === 0 && (
                <div className="text-center py-8">
                  <FiUsers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No candidates found in {selectedStage} stage</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineOverview;