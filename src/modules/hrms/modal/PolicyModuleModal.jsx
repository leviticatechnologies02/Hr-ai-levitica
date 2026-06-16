import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const PolicyModuleModal = ({
  showPolicyModuleModal,
  setShowPolicyModuleModal,
  selectedPolicy,
  policies,
  setSelectedPolicy,
  currentPolicyModule,
  setCurrentPolicyModule,
  setPolicies,
  setShowPolicyQuizModal,
  handleCompletePolicy
}) => {
  const policy = selectedPolicy || policies[0];
  const currentModule = policy?.modules?.[currentPolicyModule];

  if (!policy || !currentModule) return null;

  const allModulesRead = policy.modules?.every(m => m.read) || false;
  const isLastModule = currentPolicyModule === policy.modules.length - 1;
  const modulesReadCount = policy.modules?.filter(m => m.read).length || 0;
  const totalModules = policy.modules?.length || 0;

  const handleMarkAsRead = () => {
    const updatedModules = policy.modules.map(module => 
      module.id === currentModule.id ? { ...module, read: true } : module
    );
    
    setPolicies(prev => prev.map(p => 
      p.id === policy.id ? { ...p, modules: updatedModules } : p
    ));
    
    setSelectedPolicy(prev => prev ? { ...prev, modules: updatedModules } : null);
  };

  const handleNextModule = () => {
    if (!currentModule.read) {
      handleMarkAsRead();
    }
    setCurrentPolicyModule(currentPolicyModule + 1);
  };

  const handleQuizClick = () => {
    setShowPolicyModuleModal(false);
    setShowPolicyQuizModal(true);
  };

  const handleCompleteClick = () => {
    setShowPolicyModuleModal(false);
    handleCompletePolicy(policy.id);
  };

  return (
    <Modal
      isOpen={showPolicyModuleModal}
      onClose={() => setShowPolicyModuleModal(false)}
      title={policy.name}
      size="xl"
    >
      <div className="space-y-6 p-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-700">Module {currentPolicyModule + 1} of {totalModules}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">
              {Math.round(((currentPolicyModule + 1) / totalModules) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className="bg-blue-550 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentPolicyModule + 1) / totalModules) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Module Content */}
        <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-150 flex justify-between items-center">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Icon icon="heroicons:book-open" className="w-5 h-5 text-slate-400" />
              {currentModule.title}
            </span>
            {currentModule.read && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Icon icon="heroicons:check-circle-solid" className="w-3.5 h-3.5" />
                Read
              </span>
            )}
          </div>
          <div className="p-5 text-sm text-slate-600 leading-relaxed">
            <p>{currentModule.content}</p>
          </div>
        </div>

        {/* Mark as Read Checkbox */}
        <div className="flex flex-col gap-2">
          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={currentModule.read || false}
              onChange={handleMarkAsRead}
              className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-slate-700">Mark this module as read</span>
          </label>

          {currentModule.read && (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold w-fit border border-emerald-100">
              <Icon icon="heroicons:check-circle" className="w-4 h-4" />
              Module marked as read
            </div>
          )}
        </div>

        {/* Module Completion Summary */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-slate-800">{modulesReadCount}/{totalModules}</div>
              <small className="text-xs text-slate-400 font-medium">Modules Read</small>
            </div>
            <div>
              <div className={`text-xl font-bold ${allModulesRead ? 'text-emerald-600' : 'text-amber-500'}`}>
                {allModulesRead ? '✓ Completed' : `${Math.round((modulesReadCount / totalModules) * 100)}%`}
              </div>
              <small className="text-xs text-slate-400 font-medium">Progress</small>
            </div>
          </div>
          {allModulesRead && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-center text-xs font-semibold space-y-1">
              <div>All modules completed!</div>
              <p className="text-emerald-600 font-medium">
                {policy.quiz ? 'You can now take the quiz' : 'You can now acknowledge the policy'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <button 
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
            onClick={() => {
              if (currentPolicyModule > 0) {
                setCurrentPolicyModule(currentPolicyModule - 1);
              } else {
                setShowPolicyModuleModal(false);
              }
            }}
          >
            <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
            {currentPolicyModule > 0 ? 'Previous' : 'Close'}
          </button>

          {!isLastModule ? (
            <button 
              type="button"
              className="px-5 py-2.5 bg-blue-550 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
              onClick={handleNextModule}
              disabled={!currentModule.read}
            >
              Next Module
              <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-2">
              {!currentModule.read && (
                <button 
                  type="button"
                  className="px-5 py-2.5 bg-blue-550 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all"
                  onClick={handleMarkAsRead}
                >
                  Mark as Read
                </button>
              )}

              {allModulesRead && policy.quiz && policy.quiz.length > 0 && (
                <button 
                  type="button"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
                  onClick={handleQuizClick}
                >
                  <Icon icon="heroicons:bolt" className="w-4 h-4" />
                  Take Quiz
                </button>
              )}

              {allModulesRead && (!policy.quiz || policy.quiz.length === 0) && (
                <button 
                  type="button"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
                  onClick={handleCompleteClick}
                >
                  <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                  Complete Policy
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PolicyModuleModal;
