import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const FeedbackModal = ({
  showFeedbackModal,
  setShowFeedbackModal,
  selectedProgram,
  feedbackData,
  setFeedbackData,
  inductionPrograms,
  setInductionPrograms,
  userInfo
}) => {
  const [selectedFeedbackProgram, setSelectedFeedbackProgram] = useState(selectedProgram || null);
  const [localFeedback, setLocalFeedback] = useState({
    rating: 0,
    comments: '',
    likedMost: '',
    suggestions: '',
    additionalFeedback: '',
    submittedBy: userInfo?.name || 'System User',
    anonymous: false
  });

  // Update local feedback when program changes
  useEffect(() => {
    if (selectedFeedbackProgram) {
      const existingFeedback = feedbackData[selectedFeedbackProgram.id] || {
        rating: 0,
        comments: '',
        likedMost: '',
        suggestions: '',
        additionalFeedback: '',
        submittedBy: userInfo?.name || 'System User',
        anonymous: false
      };
      setLocalFeedback(existingFeedback);
    }
  }, [selectedFeedbackProgram, feedbackData]);

  const handleInputChange = (field, value) => {
    setLocalFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!selectedFeedbackProgram) {
      alert('Please select a program first');
      return;
    }

    if (!localFeedback.rating || localFeedback.rating === 0) {
      alert('Please provide a rating (1-5 stars)');
      return;
    }

    const completeFeedback = {
      id: Date.now(),
      programId: selectedFeedbackProgram.id,
      programName: selectedFeedbackProgram.name,
      ...localFeedback,
      submittedDate: new Date().toISOString().split('T')[0],
      submittedTime: new Date().toLocaleTimeString(),
      status: 'submitted'
    };

    setFeedbackData(prev => ({
      ...prev,
      [selectedFeedbackProgram.id]: completeFeedback
    }));

    setInductionPrograms(prev => prev.map(program => {
      if (program.id === selectedFeedbackProgram.id) {
        const updatedFeedback = [...(program.feedback || []), completeFeedback];
        const totalRating = updatedFeedback.reduce((sum, f) => sum + f.rating, 0);
        const averageRating = updatedFeedback.length > 0 
          ? parseFloat((totalRating / updatedFeedback.length).toFixed(1))
          : 0;

        return {
          ...program,
          feedback: updatedFeedback,
          overallRating: averageRating,
          lastFeedbackDate: new Date().toISOString().split('T')[0]
        };
      }
      return program;
    }));

    alert(`Feedback submitted successfully for "${selectedFeedbackProgram.name}"!`);
    setShowFeedbackModal(false);
    setSelectedFeedbackProgram(null);
    setLocalFeedback({
      rating: 0,
      comments: '',
      likedMost: '',
      suggestions: '',
      additionalFeedback: '',
      submittedBy: userInfo?.name || 'System User',
      anonymous: false
    });
  };

  return (
    <Modal
      isOpen={showFeedbackModal}
      onClose={() => {
        setShowFeedbackModal(false);
        setSelectedFeedbackProgram(null);
      }}
      title="Program Feedback"
      size="xl"
    >
      <div className="space-y-6 p-4">
        {/* Program Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Select Program <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
            value={selectedFeedbackProgram?.id || ''}
            onChange={(e) => {
              const programId = e.target.value ? parseInt(e.target.value) : null;
              const program = inductionPrograms.find(p => p.id === programId);
              setSelectedFeedbackProgram(program);
            }}
            required
          >
            <option value="">Choose a program...</option>
            {inductionPrograms.map(program => (
              <option key={program.id} value={program.id}>
                {program.name} ({program.status})
              </option>
            ))}
          </select>
        </div>

        {/* Feedback Form */}
        <div className="space-y-4">
          {/* Rating Section */}
          <div className="text-center space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Overall Rating <span className="text-rose-500">*</span>
            </label>
            
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`p-2 rounded-xl border transition-all ${
                    localFeedback.rating >= star 
                      ? 'bg-amber-500 border-amber-500 text-white' 
                      : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                  onClick={() => handleInputChange('rating', star)}
                >
                  <Icon icon="heroicons:star-solid" className="w-6 h-6" />
                </button>
              ))}
            </div>
            
            <div className="text-xs font-bold">
              <span className={
                localFeedback.rating >= 4 ? 'text-emerald-600' :
                localFeedback.rating >= 3 ? 'text-amber-600' : 
                localFeedback.rating > 0 ? 'text-rose-600' : 'text-slate-400'
              }>
                {(() => {
                  const ratings = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
                  const descriptions = { 1: 'Very dissatisfied', 2: 'Needs improvement', 3: 'Met expectations', 4: 'Exceeded expectations', 5: 'Outstanding experience' };
                  return localFeedback.rating > 0 
                    ? `${ratings[localFeedback.rating]} - ${descriptions[localFeedback.rating]}`
                    : 'Select a rating';
                })()}
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Overall Comments</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              rows="3"
              value={localFeedback.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              placeholder="Share your overall feedback about the program. What did you like? What could be better?"
            />
          </div>

          {/* Liked Most Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">What did you like most?</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              rows="2"
              value={localFeedback.likedMost}
              onChange={(e) => handleInputChange('likedMost', e.target.value)}
              placeholder="Specific sessions, trainers, materials, or activities..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Suggestions for improvement</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              rows="2"
              value={localFeedback.suggestions}
              onChange={(e) => handleInputChange('suggestions', e.target.value)}
              placeholder="How can we make this program better?"
            />
          </div>

          {/* Additional Feedback */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Additional Feedback (Optional)</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              rows="2"
              value={localFeedback.additionalFeedback}
              onChange={(e) => handleInputChange('additionalFeedback', e.target.value)}
              placeholder="Any other comments, suggestions, or feedback..."
            />
          </div>

          {/* Anonymous Submission */}
          <div>
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={localFeedback.anonymous}
                onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Submit feedback anonymously</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button 
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => {
              setShowFeedbackModal(false);
              setSelectedFeedbackProgram(null);
              setLocalFeedback({
                rating: 0,
                comments: '',
                likedMost: '',
                suggestions: '',
                additionalFeedback: '',
                submittedBy: userInfo?.name || 'System User',
                anonymous: false
              });
            }}
          >
            Cancel
          </button>  
          <button 
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50" 
            onClick={handleSubmit}
            disabled={!selectedFeedbackProgram || !localFeedback.rating || localFeedback.rating === 0}
          >
             Submit Feedback
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
