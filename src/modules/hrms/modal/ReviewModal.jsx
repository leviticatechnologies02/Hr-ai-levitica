import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employee = null, 
  formatDate,
  mode = 'confirmation' 
}) => {
  const [formData, setFormData] = useState({
    reviewType: 'final',
    reviewDate: '',
    managerAssessment: '',
    hrAssessment: '',
    recommendations: '',
    rating: 'meets_expectations',
    decision: 'confirm',
    comments: '',
    attachments: [],
    meetingDate: '',
    actionItems: [],
    committeeReview: '',
    eligibilityCheck: '',
    performanceScore: 0,
    promotionRecommendation: 'recommend'
  });

  const [actionItem, setActionItem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && employee) {
      const today = new Date().toISOString().split('T')[0];
      
      if (mode === 'probation') {
        setFormData({
          reviewType: 'probation',
          reviewDate: today,
          managerAssessment: employee.managerComments || '',
          hrAssessment: employee.hrComments || '',
          recommendations: '',
          rating: employee.currentRating?.toLowerCase().replace(/\s+/g, '_') || 'meets_expectations',
          decision: 'confirm',
          comments: '',
          attachments: [],
          meetingDate: today,
          actionItems: [],
          committeeReview: '',
          eligibilityCheck: '',
          performanceScore: employee.performanceScore || 0,
          promotionRecommendation: 'recommend'
        });
      } else if (mode === 'promotion') {
        setFormData({
          reviewType: 'promotion',
          reviewDate: today,
          managerAssessment: employee.managerComments || '',
          hrAssessment: employee.hrComments || '',
          recommendations: '',
          rating: employee.currentRating?.toLowerCase().replace(/\s+/g, '_') || 'meets_expectations',
          decision: 'promote',
          comments: '',
          attachments: [],
          meetingDate: today,
          actionItems: [],
          committeeReview: '',
          eligibilityCheck: employee.eligibilityStatus || 'eligible',
          performanceScore: employee.performanceScore || 0,
          promotionRecommendation: 'recommend'
        });
      } else {
        setFormData({
          reviewType: 'final',
          reviewDate: today,
          managerAssessment: employee.managerComments || '',
          hrAssessment: employee.hrComments || '',
          recommendations: '',
          rating: employee.currentRating?.toLowerCase().replace(/\s+/g, '_') || 'meets_expectations',
          decision: 'confirm',
          comments: '',
          attachments: [],
          meetingDate: '',
          actionItems: [],
          committeeReview: '',
          eligibilityCheck: '',
          performanceScore: 0,
          promotionRecommendation: 'recommend'
        });
      }
      setActionItem('');
      setIsSubmitting(false);
    }
  }, [isOpen, employee, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const addActionItem = () => {
    if (actionItem.trim()) {
      setFormData({
        ...formData,
        actionItems: [...formData.actionItems, actionItem.trim()]
      });
      setActionItem('');
    }
  };

  const removeActionItem = (index) => {
    setFormData({
      ...formData,
      actionItems: formData.actionItems.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit(formData);
  };

  if (!employee) return null;

  const getTitle = () => {
    if (mode === 'probation') {
      return `Conduct Probation Review - ${employee.name}`;
    }
    if (mode === 'promotion') {
      return `Review Promotion Nomination - ${employee.name}`;
    }
    return `Final Confirmation Review - ${employee.name}`;
  };

  const renderProbationReview = () => (
    <>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-700">
          Conducting probation review for <strong>{employee.name}</strong> ({employee.employeeId})
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Performance Rating <span className="text-rose-500">*</span>
        </label>
        <select
          name="rating"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="exceeds_expectations">Exceeds Expectations</option>
          <option value="meets_expectations">Meets Expectations</option>
          <option value="needs_improvement">Needs Improvement</option>
          <option value="unsatisfactory">Unsatisfactory</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Manager Assessment <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="managerAssessment"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
          rows="3"
          placeholder="Enter manager's assessment..."
          value={formData.managerAssessment}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          HR Assessment
        </label>
        <textarea
          name="hrAssessment"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
          rows="2"
          placeholder="Enter HR's assessment..."
          value={formData.hrAssessment}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Recommendations</label>
        <textarea
          name="recommendations"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
          rows="2"
          placeholder="Enter recommendations..."
          value={formData.recommendations}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Meeting Date</label>
        <input
          type="date"
          name="meetingDate"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          value={formData.meetingDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Action Items</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={actionItem}
            onChange={(e) => setActionItem(e.target.value)}
            placeholder="Add action item..."
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
            onClick={addActionItem}
          >
            Add
          </button>
        </div>
        {formData.actionItems.length > 0 && (
          <div className="mt-2 space-y-1">
            {formData.actionItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">{item}</span>
                <button
                  type="button"
                  className="text-rose-500 hover:text-rose-700 transition"
                  onClick={() => removeActionItem(index)}
                >
                  <Icon icon="heroicons:x-mark" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderPromotionReview = () => (
    <>
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
        <p className="text-sm text-purple-700">
          Reviewing promotion nomination for <strong>{employee.name}</strong> ({employee.employeeId})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Performance Rating <span className="text-rose-500">*</span>
          </label>
          <select
            name="rating"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="exceeds_expectations">Exceeds Expectations</option>
            <option value="meets_expectations">Meets Expectations</option>
            <option value="needs_improvement">Needs Improvement</option>
            <option value="unsatisfactory">Unsatisfactory</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Performance Score
          </label>
          <input
            type="number"
            name="performanceScore"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.performanceScore}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Eligibility Status
        </label>
        <select
          name="eligibilityCheck"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
          value={formData.eligibilityCheck}
          onChange={handleChange}
        >
          <option value="eligible">Eligible</option>
          <option value="conditional">Conditional</option>
          <option value="not_eligible">Not Eligible</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Committee Review <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="committeeReview"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
          rows="3"
          placeholder="Enter committee review comments..."
          value={formData.committeeReview}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Promotion Recommendation <span className="text-rose-500">*</span>
        </label>
        <select
          name="promotionRecommendation"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
          value={formData.promotionRecommendation}
          onChange={handleChange}
          required
        >
          <option value="recommend">Recommend Promotion</option>
          <option value="recommend_with_conditions">Recommend with Conditions</option>
          <option value="defer">Defer Decision</option>
          <option value="not_recommend">Not Recommend</option>
        </select>
      </div>
    </>
  );

  const renderConfirmationReview = () => (
    <>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-700">
          Reviewing <strong>{employee.name}</strong> ({employee.employeeId}) for confirmation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Review Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="reviewDate"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.reviewDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Performance Rating <span className="text-rose-500">*</span>
          </label>
          <select
            name="rating"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="exceeds_expectations">Exceeds Expectations</option>
            <option value="meets_expectations">Meets Expectations</option>
            <option value="needs_improvement">Needs Improvement</option>
            <option value="unsatisfactory">Unsatisfactory</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Manager Assessment <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="managerAssessment"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
          rows="3"
          placeholder="Enter manager's final assessment..."
          value={formData.managerAssessment}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          HR Assessment <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="hrAssessment"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
          rows="3"
          placeholder="Enter HR's final assessment..."
          value={formData.hrAssessment}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Recommendation <span className="text-rose-500">*</span>
          </label>
          <select
            name="decision"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.decision}
            onChange={handleChange}
            required
          >
            <option value="confirm">Confirm Employment</option>
            <option value="extend">Extend Probation</option>
            <option value="reject">Reject Confirmation</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Additional Comments</label>
          <input
            type="text"
            name="comments"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            placeholder="Any additional comments..."
            value={formData.comments}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        {mode === 'probation' && renderProbationReview()}
        {mode === 'promotion' && renderPromotionReview()}
        {mode === 'confirmation' && renderConfirmationReview()}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                {mode === 'probation' ? 'Submit Review' : 
                 mode === 'promotion' ? 'Submit Review' : 
                 'Submit Review'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;