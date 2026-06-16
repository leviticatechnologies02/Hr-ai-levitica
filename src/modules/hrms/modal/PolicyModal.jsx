import React from 'react';
import Modal from '../../../shared/components/Modal';

const PolicyModal = ({
  showPolicyModal,
  setShowPolicyModal,
  selectedPolicy,
  policies,
  setSelectedPolicy,
  setCurrentPolicyModule,
  setShowPolicyModuleModal,
  setShowPolicyQuizModal,
  handleCompletePolicy
}) => {
  const policy = selectedPolicy || policies[0];
  if (!policy) return null;

  return (
    <Modal
      isOpen={showPolicyModal}
      onClose={() => setShowPolicyModal(false)}
      title={policy.name}
      size="xl"
    >
      <div className="space-y-6 p-4">
        {/* Policy Meta Info */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <small className="text-xs text-slate-400 block font-medium">Version</small>
              <span className="font-semibold text-slate-800">{policy.version}</span>
            </div>
            <div>
              <small className="text-xs text-slate-400 block font-medium">Effective Date</small>
              <span className="font-semibold text-slate-800">{policy.effectiveDate}</span>
            </div>
            <div>
              <small className="text-xs text-slate-400 block font-medium">Read Time</small>
              <span className="font-semibold text-slate-800">{policy.readTime}</span>
            </div>
            <div>
              <small className="text-xs text-slate-400 block font-medium mb-0.5">Status</small>
              <div>
                {policy.status === 'mandatory' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                    Mandatory
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Published
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div>
          <h6 className="text-sm font-bold text-slate-800 mb-2">Policy Content</h6>
          <p className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-2xl p-4">
            {policy.description}
          </p>
        </div>
        
        {/* Completion Statistics */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
          <h6 className="text-sm font-bold text-slate-800 mb-4">Completion Statistics</h6>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded-2xl border border-slate-50">
              <div className="text-xl font-bold text-slate-800">{policy.completionTracking?.completed || 0}</div>
              <div className="text-xs text-slate-400 font-medium">Completed</div>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-50">
              <div className="text-xl font-bold text-slate-800">{policy.completionTracking?.pending || 0}</div>
              <div className="text-xs text-slate-400 font-medium">Pending</div>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-50">
              <div className="text-xl font-bold text-slate-800">{(policy.completionTracking?.averageScore || 0).toFixed(1)}</div>
              <div className="text-xs text-slate-400 font-medium">Avg Score</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowPolicyModal(false)}
          >
            Close
          </button>
          
          {policy.modules && policy.modules.length > 0 && (
            <button 
              type="button"
              className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold transition-all"
              onClick={() => {
                setSelectedPolicy(policy);
                setCurrentPolicyModule(0);
                setShowPolicyModuleModal(true);
                setShowPolicyModal(false);
              }}
            >
              Read Modules
            </button>
          )}

          {policy.quiz && policy.quiz.length > 0 && (
            <button 
              type="button"
              className="px-5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-sm font-semibold transition-all"
              onClick={() => {
                setSelectedPolicy(policy);
                setShowPolicyQuizModal(true);
                setShowPolicyModal(false);
              }}
            >
              Take Quiz
            </button>
          )}

          <button 
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all"
            onClick={() => handleCompletePolicy(policy.id)}
          >
            Acknowledge Policy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PolicyModal;
