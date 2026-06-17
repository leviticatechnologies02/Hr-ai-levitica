import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BuddyFeedbackModal = ({
  isOpen,
  onClose,
  feedbackForm,
  setFeedbackForm,
  handleSubmitFeedback,
  buddyPrograms = []
}) => {
  const [localForm, setLocalForm] = useState(feedbackForm);

  useEffect(() => {
    if (isOpen) {
      setLocalForm(feedbackForm);
    }
  }, [feedbackForm, isOpen]);

  const assignment = localForm.assignmentId
    ? buddyPrograms
      .flatMap((p) => p.assignments)
      .find((a) => a.id === Number(localForm.assignmentId))
    : null;

  const handleChange = (field, value) => {
    setLocalForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (index, field, value) => {
    setLocalForm((prev) => {
      const newCategories = [...prev.categories];
      newCategories[index] = {
        ...newCategories[index],
        [field]: value,
      };
      return {
        ...prev,
        categories: newCategories,
      };
    });
  };

  const handleSubmit = () => {
    setFeedbackForm(localForm);
    setTimeout(() => {
      handleSubmitFeedback(localForm);
    }, 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Program Feedback"
      size="xl"
    >
      <div className="space-y-4 sm:space-y-6 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
            Select Assignment <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
            value={localForm.assignmentId || ""}
            onChange={(e) =>
              handleChange("assignmentId", parseInt(e.target.value) || null)
            }
          >
            <option value="">Select assignment...</option>
            {buddyPrograms.flatMap((program) =>
              program.assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.buddy.name} → {assignment.newJoiner.name} ({program.name})
                </option>
              ))
            )}
          </select>
        </div>

        {assignment && (
          <div className="p-3 sm:p-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block text-[10px] sm:text-xs">Buddy</span>
              <span className="font-bold text-slate-800 text-sm sm:text-base truncate block">{assignment.buddy.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] sm:text-xs">New Joiner</span>
              <span className="font-bold text-slate-800 text-sm sm:text-base truncate block">{assignment.newJoiner.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] sm:text-xs">Assignment Date</span>
              <span className="font-bold text-slate-800 text-sm sm:text-base">{assignment.assignmentDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] sm:text-xs">Current Progress</span>
              <span className="font-bold text-slate-800 text-sm sm:text-base">{assignment.completionPercentage || 0}% Complete</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Your Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={localForm.submittedBy || ""}
              onChange={(e) => handleChange("submittedBy", e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Your Role <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
              value={localForm.role || "newJoiner"}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="newJoiner">New Joiner (Mentee)</option>
              <option value="buddy">Buddy (Mentor)</option>
              <option value="hr">HR Representative</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
            Overall Rating <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-1 sm:gap-2 items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform active:scale-95 p-1"
                onClick={() => handleChange("overallRating", star)}
              >
                <Icon
                  icon="heroicons:star-solid"
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${star <= (localForm.overallRating || 0) ? "text-amber-400" : "text-slate-200"}`}
                />
              </button>
            ))}
            <span className="text-xs sm:text-sm text-slate-500 ml-1 sm:ml-2">
              ({localForm.overallRating || 0} / 5 stars)
            </span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Detailed Review Categories</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {localForm.categories?.map((cat, index) => (
              <div key={index} className="border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-white space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <span className="text-sm font-bold text-slate-800">{cat.category}</span>
                  <div className="flex gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none transition-transform active:scale-95 p-0.5"
                        onClick={() => handleCategoryChange(index, "rating", star)}
                      >
                        <Icon
                          icon="heroicons:star-solid"
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= (cat.rating || 0) ? "text-amber-400" : "text-slate-200"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm resize-y"
                  rows="2"
                  value={cat.comment || ''}
                  onChange={(e) => handleCategoryChange(index, "comment", e.target.value)}
                  placeholder={`Comment on ${cat.category.toLowerCase()}...`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Overall Comments</label>
          <textarea
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm resize-y"
            rows="3"
            value={localForm.overallComment || ""}
            onChange={(e) => handleChange("overallComment", e.target.value)}
            placeholder="Share your experience, what went well, and what could be improved..."
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors active:bg-slate-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-blue-800 flex items-center justify-center gap-2 whitespace-nowrap min-w-[140px] sm:min-w-[160px]"
            onClick={handleSubmit}
            disabled={!localForm.assignmentId || !localForm.submittedBy || !localForm.overallRating}
          >
            <Icon icon="heroicons:paper-airplane" className="w-4 h-4" />
            Submit Feedback
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BuddyFeedbackModal;