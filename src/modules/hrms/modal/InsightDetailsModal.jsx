import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const InsightDetailsModal = ({ isOpen, onClose, insight }) => {
  if (!insight) return null;

  const severityColors = {
    high: 'text-rose-600 bg-rose-50 border-rose-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  const severityIcons = {
    high: 'heroicons:exclamation-triangle',
    medium: 'heroicons:exclamation-circle',
    low: 'heroicons:information-circle'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Insight Details" size="lg">
      <div className="space-y-6 p-2">
        <div className={`p-4 rounded-xl border ${severityColors[insight.severity] || severityColors.low}`}>
          <div className="flex items-center gap-3 mb-3">
            <Icon icon={severityIcons[insight.severity] || severityIcons.low} className="w-6 h-6" />
            <span className={`text-sm font-semibold uppercase ${severityColors[insight.severity]?.split(' ')[0]}`}>
              {insight.severity} Severity
            </span>
          </div>
          <h6 className="font-bold text-lg text-slate-800">{insight.title}</h6>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <p className="text-sm text-slate-600">{insight.description}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Recommended Action</label>
            <p className="text-sm text-slate-600">{insight.recommendedAction}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
              {insight.type}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={() => {
              alert(`Action taken for: ${insight.title}`);
              onClose();
            }}
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Take Action
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InsightDetailsModal;