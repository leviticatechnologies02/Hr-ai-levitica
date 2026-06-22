import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const PatternModal = ({ isOpen, onClose, alert, patternAnalysis, onAcknowledge }) => {
  if (!alert) return null;

  const severityConfig = {
    high: { color: 'rose', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
    medium: { color: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    low: { color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  };

  const severity = severityConfig[alert.severity] || severityConfig.low;

  const getStatusColor = (status) => {
    const map = {
      'Late': 'bg-amber-100 text-amber-700 border-amber-200',
      'Absent': 'bg-rose-100 text-rose-700 border-rose-200',
      'Overtime': 'bg-blue-100 text-blue-700 border-blue-200',
      'Alert': 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return map[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const handleClose = () => {
    onClose();
  };

  const handleAcknowledgeAndClose = () => {
    onAcknowledge?.(alert.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Pattern Analysis" size="lg">
      <div className="space-y-5 p-1">
        {/* Header */}
        <div>
          <h4 className="text-lg font-bold text-slate-800">
            {alert.employee || alert.department || 'Pattern Analysis'}
          </h4>
          <p className="text-sm text-slate-500 mt-1">{alert.message}</p>
        </div>

        {/* Severity Badge */}
        <div className={`${severity.bg} border ${severity.border} rounded-xl p-4 flex items-center gap-3`}>
          <Icon 
            icon="heroicons:exclamation-triangle" 
            className={`w-6 h-6 ${severity.text}`} 
          />
          <div>
            <div className={`text-sm font-bold ${severity.text} uppercase`}>
              {alert.severity.toUpperCase()} PRIORITY
            </div>
            <div className="text-xs text-slate-600">Detected on: {alert.date}</div>
          </div>
        </div>

        {/* Pattern Details */}
        <div>
          <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Pattern Details</h5>
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="text-sm">
              <span className="font-semibold text-slate-700">Pattern Type:</span>{' '}
              <span className="text-slate-600">{patternAnalysis?.trend || alert.patternData?.pattern || 'N/A'}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-slate-700">Recommendation:</span>{' '}
              <span className="text-slate-600">{patternAnalysis?.recommendation || 'Review pattern and take appropriate action'}</span>
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        {patternAnalysis?.days?.length > 0 && (
          <div>
            <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Timeline Visualization</h5>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between gap-2">
                {patternAnalysis.days.map((day, index) => (
                  <div key={index} className="flex-1 text-center">
                    <div className={`w-4 h-4 mx-auto rounded-full ${getStatusColor(day.status)} border-2`} />
                    <div className="text-xs font-medium text-slate-700 mt-2">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {day.date.split('-')[2]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Occurrences */}
        {patternAnalysis?.days?.length > 0 && (
          <div>
            <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Detailed Occurrences</h5>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600">Date</th>
                    <th className="p-3 font-semibold text-slate-600">Status</th>
                    <th className="p-3 font-semibold text-slate-600">Time</th>
                    <th className="p-3 font-semibold text-slate-600">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patternAnalysis.days.map((day, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-700">{day.date}</td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(day.status)}`}>
                          {day.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{day.time}</td>
                      <td className="p-3 text-slate-600">{day.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
            onClick={handleAcknowledgeAndClose}
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Acknowledge & Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PatternModal;