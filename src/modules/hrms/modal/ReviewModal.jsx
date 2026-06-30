import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ReviewModal = ({ isOpen, onClose, onSubmit, employee = null, formatDate }) => {
  const [formData, setFormData] = useState({
    reviewType: 'final',
    reviewDate: '',
    managerAssessment: '',
    hrAssessment: '',
    recommendations: '',
    rating: 'meets_expectations',
    decision: 'confirm',
    comments: '',
    attachments: []
  });

  useEffect(() => {
    if (isOpen && employee) {
      setFormData({
        reviewType: 'final',
        reviewDate: new Date().toISOString().split('T')[0],
        managerAssessment: employee.managerComments || '',
        hrAssessment: employee.hrComments || '',
        recommendations: '',
        rating: employee.currentRating?.toLowerCase().replace(/\s+/g, '_') || 'meets_expectations',
        decision: 'confirm',
        comments: '',
        attachments: []
      });
    }
  }, [isOpen, employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Final Confirmation Review - ${employee.name}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
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

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Submit Review
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;