// components/modals/ReviewProbationModal.jsx
import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ReviewProbationModal = ({
  isOpen,
  onClose,
  selectedEmployee,
  reviewForm,
  setReviewForm,
  reviewStep,
  setReviewStep,
  onSubmit,
  onSelfAssessmentSubmit,
  onScheduleMeeting
}) => {
  const renderStepIndicator = () => (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {['self', 'manager', 'skip_level', 'hr'].map((step, index) => (
        <React.Fragment key={step}>
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${
              reviewStep === step
                ? 'bg-blue-600 text-white'
                : ['self', 'manager'].includes(step) && reviewStep !== 'self'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            <Icon 
              icon={
                step === 'self' ? 'heroicons:user' :
                step === 'manager' ? 'heroicons:briefcase' :
                step === 'skip_level' ? 'heroicons:users' :
                'heroicons:building-office'
              }
              className="w-4 h-4"
            />
            {index + 1}. {step.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          {index < 3 && (
            <Icon icon="heroicons:chevron-right" className="w-4 h-4 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderSelfAssessment = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-blue-700">
        <Icon icon="heroicons:information-circle" className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">Step 1: Self-Assessment - Employee completes self-assessment</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Self Rating <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            value={reviewForm.selfRating}
            onChange={(e) => setReviewForm({ ...reviewForm, selfRating: e.target.value })}
          >
            <option value="">Select rating...</option>
            <option value="exceeds_expectations">Exceeds Expectations</option>
            <option value="meets_expectations">Meets Expectations</option>
            <option value="needs_improvement">Needs Improvement</option>
            <option value="unsatisfactory">Unsatisfactory</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={reviewForm.reviewType}
            onChange={(e) => setReviewForm({ ...reviewForm, reviewType: e.target.value })}
          >
            <option value="30_day">30 Day Review</option>
            <option value="60_day">60 Day Review</option>
            <option value="90_day">90 Day Review</option>
            <option value="final">Final Review</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Self Assessment <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Describe your performance, achievements, and areas of growth..."
            value={reviewForm.selfAssessment}
            onChange={(e) => setReviewForm({ ...reviewForm, selfAssessment: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Achievements</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="List your key achievements..."
            value={reviewForm.achievements}
            onChange={(e) => setReviewForm({ ...reviewForm, achievements: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Challenges Faced</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Describe challenges and how you addressed them..."
            value={reviewForm.challenges}
            onChange={(e) => setReviewForm({ ...reviewForm, challenges: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Goals for Next Period</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="What are your goals for the next review period?"
            value={reviewForm.goals}
            onChange={(e) => setReviewForm({ ...reviewForm, goals: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderManagerReview = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-blue-700">
        <Icon icon="heroicons:information-circle" className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">Step 2: Manager Review - Direct manager assessment</span>
      </div>

      {reviewForm.selfAssessment && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h6 className="font-semibold flex items-center gap-2 text-gray-700 mb-2">
            <Icon icon="heroicons:user-circle" className="w-5 h-5" />
            Employee Self-Assessment
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div>
              <span className="text-xs text-gray-500 block">Self Rating</span>
              <span className="font-medium text-gray-700">
                {reviewForm.selfRating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div className="md:col-span-3">
              <span className="text-xs text-gray-500 block">Assessment</span>
              <p className="text-sm text-gray-700">{reviewForm.selfAssessment}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={reviewForm.reviewDate}
            onChange={(e) => setReviewForm({ ...reviewForm, reviewDate: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Performance Rating <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            value={reviewForm.rating}
            onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
          >
            <option value="exceeds_expectations">Exceeds Expectations</option>
            <option value="meets_expectations">Meets Expectations</option>
            <option value="needs_improvement">Needs Improvement</option>
            <option value="unsatisfactory">Unsatisfactory</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={reviewForm.reviewType}
            onChange={(e) => setReviewForm({ ...reviewForm, reviewType: e.target.value })}
          >
            <option value="30_day">30 Day Review</option>
            <option value="60_day">60 Day Review</option>
            <option value="90_day">90 Day Review</option>
            <option value="final">Final Review</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manager Assessment <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Enter detailed feedback from manager..."
            value={reviewForm.managerComments}
            onChange={(e) => setReviewForm({ ...reviewForm, managerComments: e.target.value })}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderSkipLevelReview = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-blue-700">
        <Icon icon="heroicons:information-circle" className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">Step 3: Skip-Level Manager Review - Senior manager assessment</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skip-Level Manager Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={reviewForm.skipLevelManager}
            onChange={(e) => setReviewForm({ ...reviewForm, skipLevelManager: e.target.value })}
            placeholder="Enter skip-level manager name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skip-Level Manager Comments</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Enter skip-level manager's observations and feedback..."
            value={reviewForm.skipLevelManagerComments}
            onChange={(e) => setReviewForm({ ...reviewForm, skipLevelManagerComments: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="notifySkipLevel"
            checked={reviewForm.notifySkipLevelManager}
            onChange={(e) => setReviewForm({ ...reviewForm, notifySkipLevelManager: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="notifySkipLevel" className="text-sm text-gray-700 cursor-pointer">
            Notify skip-level manager about this review
          </label>
        </div>
      </div>
    </div>
  );

  const renderHRReview = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-blue-700">
        <Icon icon="heroicons:information-circle" className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">Step 4: HR Review & Recommendation - Final review and decision</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            HR Assessment <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Enter HR's observations and feedback..."
            value={reviewForm.hrComments}
            onChange={(e) => setReviewForm({ ...reviewForm, hrComments: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HR Recommendation <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              value={reviewForm.recommendation}
              onChange={(e) => setReviewForm({ ...reviewForm, recommendation: e.target.value })}
            >
              <option value="">Select recommendation...</option>
              <option value="continue">Continue Probation</option>
              <option value="confirm">Confirm Employment</option>
              <option value="extend">Extend Probation</option>
              <option value="terminate">Terminate Probation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (Optional)</label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              multiple
              onChange={(e) => setReviewForm({ ...reviewForm, attachments: Array.from(e.target.files) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Recommendations</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Any additional recommendations or action items..."
            value={reviewForm.recommendations}
            onChange={(e) => setReviewForm({ ...reviewForm, recommendations: e.target.value })}
          />
        </div>

        {reviewForm.meetingScheduled && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2 text-green-700">
            <Icon icon="heroicons:calendar-days" className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">Meeting Scheduled:</span>
              <span className="ml-1">{reviewForm.meetingDate} at {reviewForm.meetingTime}</span>
              {reviewForm.meetingLink && (
                <div className="mt-1">
                  <a href={reviewForm.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                    <Icon icon="heroicons:link" className="w-4 h-4" />
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFooterButtons = () => {
    const buttons = [];

    if (reviewStep === 'self') {
      buttons.push(
        <button
          key="cancel"
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>,
        <button
          key="next"
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={onSelfAssessmentSubmit}
          disabled={!reviewForm.selfAssessment || !reviewForm.selfRating}
        >
          Next: Manager Review
          <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
        </button>
      );
    } else if (reviewStep === 'manager') {
      buttons.push(
        <button
          key="prev"
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => setReviewStep('self')}
        >
          Previous
        </button>,
        <button
          key="next"
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={() => setReviewStep('skip_level')}
          disabled={!reviewForm.managerComments || !reviewForm.rating}
        >
          Next: Skip-Level Review
          <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
        </button>
      );
    } else if (reviewStep === 'skip_level') {
      buttons.push(
        <button
          key="prev"
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => setReviewStep('manager')}
        >
          Previous
        </button>,
        <button
          key="next"
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={() => setReviewStep('hr')}
        >
          Next: HR Review
          <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
        </button>
      );
    } else if (reviewStep === 'hr') {
      buttons.push(
        <button
          key="prev"
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => setReviewStep('skip_level')}
        >
          Previous
        </button>,
        <button
          key="submit"
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          disabled={!reviewForm.hrComments || !reviewForm.recommendation}
        >
          <Icon icon="heroicons:check-circle" className="w-4 h-4" />
          Submit Review
        </button>
      );
    }

    return buttons;
  };

  if (!isOpen || !selectedEmployee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Icon 
            icon={
              reviewStep === 'self' ? 'heroicons:user' :
              reviewStep === 'manager' ? 'heroicons:briefcase' :
              reviewStep === 'skip_level' ? 'heroicons:users' :
              'heroicons:building-office'
            }
            className="w-5 h-5 text-blue-600"
          />
          <span>{reviewForm.reviewType.replace('_', ' ').toUpperCase()} Review - {selectedEmployee.name}</span>
        </div>
      }
      size="xl"
    >
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          {/* Employee Info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{selectedEmployee.designation} • {selectedEmployee.department}</p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              onClick={() => onScheduleMeeting(selectedEmployee, reviewForm.reviewType)}
            >
              <Icon icon="heroicons:calendar" className="w-4 h-4" />
              Schedule Meeting
            </button>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          {reviewStep === 'self' && renderSelfAssessment()}
          {reviewStep === 'manager' && renderManagerReview()}
          {reviewStep === 'skip_level' && renderSkipLevelReview()}
          {reviewStep === 'hr' && renderHRReview()}
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
          {renderFooterButtons()}
        </div>
      </form>
    </Modal>
  );
};

export default ReviewProbationModal;