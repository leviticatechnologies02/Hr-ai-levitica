import React from 'react';
import { Icon } from '@iconify/react';

const CandidateDetailsView = ({ candidate, onClose }) => {
  const fullData = candidate.fullData || candidate;
  const name = fullData.name || 'Unknown Candidate';
  const email = fullData.email || 'Not provided';
  const role = fullData.role || 'Not specified';
  const stage = fullData.stage || 'Applied';
  const skills = fullData.skills || '';
  const resumeUrl = fullData.resume_url || '';
  const notes = fullData.notes || '';
  const recruiterComments = fullData.recruiter_comments || '';
  
  const skillsList = skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [];
  
  const avatar = name.charAt(0).toUpperCase() || '?';
  
  const getStageColor = () => {
    switch(stage) {
      case 'Hired': return 'bg-emerald-50 text-emerald-700';
      case 'Rejected': return 'bg-rose-50 text-rose-700';
      case 'Interview': return 'bg-indigo-50 text-indigo-700';
      case 'Offer': return 'bg-primary/10 text-primary';
      default: return 'bg-primary/10 text-primary';
    }
  };
  
  const handleDownload = () => {
    if (resumeUrl) {
      const backendBaseUrl = "http://localhost:8000";
      let downloadUrl;
      
      if (resumeUrl.startsWith('http')) {
        downloadUrl = resumeUrl;
      } else if (resumeUrl.startsWith('/uploads/')) {
        downloadUrl = `${backendBaseUrl}${resumeUrl}`;
      } else if (resumeUrl.startsWith('uploads/')) {
        downloadUrl = `${backendBaseUrl}/${resumeUrl}`;
      } else {
        downloadUrl = `${backendBaseUrl}/uploads/${resumeUrl}`;
      }
      
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white text-base font-bold uppercase">
          {avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-bold text-midnight_text">{name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStageColor()}`}>
              {stage}
            </span>
          </div>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      </div>

      <div className="bg-gray-50 px-3 py-2 rounded-lg">
        <p className="text-xs text-gray-500 mb-0.5">Applied for</p>
        <p className="text-sm font-medium text-midnight_text">{role}</p>
      </div>

      {skillsList.length > 0 && skillsList[0] !== '' && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skillsList.map((skill, index) => (
              <span key={index} className="px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {notes && (
        <div className="bg-amber-50/30 px-3 py-2 rounded-lg border border-amber-100">
          <p className="text-xs text-amber-700 font-medium mb-1 flex items-center gap-1">
            <Icon icon="heroicons:document-text" className="h-3 w-3" />
            Notes
          </p>
          <p className="text-sm text-gray-700">{notes}</p>
        </div>
      )}

      {recruiterComments && (
        <div className="bg-blue-50/30 px-3 py-2 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700 font-medium mb-1 flex items-center gap-1">
            <Icon icon="heroicons:chat-bubble-left-right" className="h-3 w-3" />
            Recruiter Comments
          </p>
          <p className="text-sm text-gray-700">{recruiterComments}</p>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-medium transition-all"
        >
          Close
        </button>
        {resumeUrl && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-all shadow-sm"
          >
            <Icon icon="heroicons:arrow-down-tray" className="h-3.5 w-3.5" />
            Resume
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailsView;