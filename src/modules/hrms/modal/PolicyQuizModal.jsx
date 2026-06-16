import React from 'react';
import Modal from '../../../shared/components/Modal';

const PolicyQuizModal = ({
  showPolicyQuizModal,
  setShowPolicyQuizModal,
  selectedPolicy,
  policies,
  quizAnswers,
  setQuizAnswers,
  handleSubmitQuiz
}) => {
  const policy = selectedPolicy || policies[0];

  if (!policy || !policy.quiz || policy.quiz.length === 0) return null;

  return (
    <Modal
      isOpen={showPolicyQuizModal}
      onClose={() => setShowPolicyQuizModal(false)}
      title={`${policy.name} - Quiz`}
      size="xl"
    >
      <div className="space-y-6 p-4">
        <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-2xl text-sm font-semibold">
          <strong>Instructions:</strong> Answer all questions. Passing score: {policy.passingScore}%
        </div>

        <div className="space-y-4">
          {policy.quiz.map((question, index) => (
            <div key={question.id} className="bg-white border border-slate-150 rounded-3xl p-5 shadow-sm space-y-3">
              <h6 className="font-bold text-slate-800 text-base">
                Question {index + 1}: {question.question}
              </h6>

              <div className="flex flex-col gap-2.5">
                {question.options.map((option, optIndex) => {
                  const isChecked = quizAnswers[question.id] === optIndex;
                  return (
                    <label
                      key={optIndex}
                      className={`inline-flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all text-sm font-semibold ${
                        isChecked 
                          ? 'border-blue-500 bg-blue-50/50 text-blue-700' 
                          : 'border-slate-200 text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={isChecked}
                        onChange={() =>
                          setQuizAnswers({
                            ...quizAnswers,
                            [question.id]: optIndex,
                          })
                        }
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button 
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowPolicyQuizModal(false)}
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            onClick={() => handleSubmitQuiz(policy.id)}
            disabled={Object.keys(quizAnswers).length < policy.quiz.length}
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PolicyQuizModal;
