import React, { useState } from 'react';
import { 
  FiDownload, 
  FiMail, 
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiAward,
  FiMessageCircle,
  FiFileText
} from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import { BASE_URL } from "../../../shared/constants/api.config";

const CandidateProfilePage = ({ candidate, onClose }) => {
  const fullData = candidate.fullData || candidate;
  const backendBaseUrl = BASE_URL; // Use BASE_URL from config

  const [activeTab, setActiveTab] = useState('overview');
  const [currentStage, setCurrentStage] = useState(fullData.stage || 'Applied');
  const [actionMessage, setActionMessage] = useState(null);

  // Only backend fields from Candidate model
  const name = fullData.name || 'Unknown Candidate';
  const email = fullData.email || 'Not provided';
  const role = fullData.role || 'Not specified';
  const skills = fullData.skills || '';
  const resumeUrl = fullData.resume_url || '';
  const notes = fullData.notes || '';
  const recruiterComments = fullData.recruiter_comments || '';

  // Parse skills if it's a string
  const skillsList = skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [];
  
  const avatar = name.charAt(0).toUpperCase() || '?';

  const showActionMessage = (message, type = 'success') => {
    setActionMessage({ message, type });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleShortlist = () => {
    if (currentStage === 'Applied') {
      setCurrentStage('Screening');
      showActionMessage(`✅ ${name} has been shortlisted and moved to Screening stage!`);
    } else {
      showActionMessage(`✅ ${name} has been shortlisted!`);
    }
  };

  const handleReject = () => {
    if (window.confirm(`Are you sure you want to reject ${name}?`)) {
      setCurrentStage('Rejected');
      showActionMessage(`❌ ${name} has been rejected.`, 'danger');
    }
  };

  const handleDownload = () => {
    if (resumeUrl) {
      let downloadUrl;

      if (resumeUrl.startsWith('http')) {
        downloadUrl = resumeUrl;
      } else if (resumeUrl.startsWith('/uploads/')) {
        downloadUrl = `${backendBaseUrl}${resumeUrl}`;
      } else if (resumeUrl.startsWith('uploads/')) {
        downloadUrl = `${backendBaseUrl}/${resumeUrl}`;
      } else if (resumeUrl.startsWith('/')) {
        downloadUrl = `${backendBaseUrl}${resumeUrl}`;
      } else {
        downloadUrl = `${backendBaseUrl}/uploads/${resumeUrl}`;
      }

      window.open(downloadUrl, "_blank");
    } else {
      showActionMessage('No resume available for download', 'danger');
    }
  };

  const handleStageChange = (newStage) => {
    if (newStage && newStage !== currentStage) {
      setCurrentStage(newStage);
      showActionMessage(`✅ ${name} has been moved to ${newStage} stage!`);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      'Applied': 'bg-primary/10 text-primary',
      'Screening': 'bg-amber-50 text-amber-700',
      'Interview': 'bg-indigo-50 text-indigo-700',
      'Offer': 'bg-primary/10 text-primary',
      'Hired': 'bg-emerald-50 text-emerald-700',
      'Rejected': 'bg-rose-50 text-rose-700'
    };
    return colors[stage] || 'bg-gray-100 text-gray-600';
  };

  const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

  return (
    <Modal isOpen={true} onClose={onClose} title="Candidate Profile" size="3xl">
      <div className=" space-y-6">
        {/* Action Message */}
        {actionMessage && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            actionMessage.type === 'danger' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {actionMessage.type === 'danger' ? <FiXCircle className="h-4 w-4" /> : <FiCheckCircle className="h-4 w-4" />}
            <span className="text-sm flex-1">{actionMessage.message}</span>
          </div>
        )}

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-white text-xl font-bold uppercase flex-shrink-0">
            {avatar}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-midnight_text">{name}</h2>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStageColor(currentStage)}`}>
                {currentStage}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{role}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FiMail className="h-4 w-4" />
                {email}
              </span>
            </div>
          </div>
        </div>

        {/* Stage Selector */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <label className="text-xs text-gray-500 font-semibold uppercase mb-2 block">Update Stage</label>
          <div className="flex flex-wrap gap-2">
            {stages.map(stageOption => (
              <button
                key={stageOption}
                onClick={() => handleStageChange(stageOption)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentStage === stageOption
                    ? getStageColor(stageOption)
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                {stageOption}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 text-sm font-medium capitalize transition-all ${
                activeTab === 'overview' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`pb-2 text-sm font-medium capitalize transition-all ${
                activeTab === 'skills' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2 text-sm font-medium capitalize transition-all ${
                activeTab === 'notes' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Notes & Comments
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FiUser className="h-4 w-4" />
                    Role Applied For
                  </h4>
                  <p className="text-sm font-semibold text-midnight_text">{role}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FiFileText className="h-4 w-4" />
                    Current Stage
                  </h4>
                  <p className="text-sm font-semibold text-midnight_text">{currentStage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiAward className="h-4 w-4" />
                Skills
              </h4>
              {skillsList.length > 0 && skillsList[0] !== '' ? (
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, index) => (
                    <span key={index} className="px-3 py-1 rounded-lg text-sm font-medium bg-primary/10 text-primary">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiAward className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No skills listed</p>
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {notes && notes.trim() !== '' ? (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FiMessageCircle className="h-4 w-4" />
                    Notes
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{notes}</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FiMessageCircle className="h-4 w-4" />
                    Notes
                  </h4>
                  <p className="text-sm text-gray-400 italic">No notes available</p>
                </div>
              )}
              
              {recruiterComments && recruiterComments.trim() !== '' ? (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FiUser className="h-4 w-4" />
                    Recruiter Comments
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{recruiterComments}</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FiUser className="h-4 w-4" />
                    Recruiter Comments
                  </h4>
                  <p className="text-sm text-gray-400 italic">No recruiter comments available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-end items-center gap-3 pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={handleShortlist}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              Shortlist
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              Reject
            </button>
            <button
              onClick={handleDownload}
              disabled={!resumeUrl}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload className="h-4 w-4" />
              Resume
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CandidateProfilePage;