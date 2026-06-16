import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const PolicyUploadModal = ({
  showPolicyUploadModal,
  setShowPolicyUploadModal,
  policies,
  setPolicies
}) => {
  const [policyForm, setPolicyForm] = useState({
    name: '',
    category: 'general',
    description: '',
    version: '1.0',
    effectiveDate: '',
    readTime: '',
    status: 'published',
    required: true,
    addQuiz: false,
    addModules: false,
    passingScore: 70
  });

  const [quizQuestions, setQuizQuestions] = useState([
    { id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const [readingModules, setReadingModules] = useState([
    { id: 1, title: '', content: '' }
  ]);

  const handleAddQuizQuestion = () => {
    setQuizQuestions([...quizQuestions, {
      id: quizQuestions.length + 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]);
  };

  const handleRemoveQuizQuestion = (id) => {
    if (quizQuestions.length > 1) {
      setQuizQuestions(quizQuestions.filter(q => q.id !== id));
    }
  };

  const handleQuizQuestionChange = (id, field, value) => {
    setQuizQuestions(quizQuestions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleQuizOptionChange = (questionId, optionIndex, value) => {
    setQuizQuestions(quizQuestions.map(q => 
      q.id === questionId 
        ? {
            ...q,
            options: q.options.map((opt, idx) => 
              idx === optionIndex ? value : opt
            )
          }
        : q
    ));
  };

  const handleAddModule = () => {
    setReadingModules([...readingModules, {
      id: readingModules.length + 1,
      title: '',
      content: ''
    }]);
  };

  const handleRemoveModule = (id) => {
    if (readingModules.length > 1) {
      setReadingModules(readingModules.filter(m => m.id !== id));
    }
  };

  const handleModuleChange = (id, field, value) => {
    setReadingModules(readingModules.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleUploadPolicy = () => {
    if (!policyForm.name || !policyForm.effectiveDate || !policyForm.version) {
      alert('Please fill all required fields');
      return;
    }

    if (policyForm.addQuiz) {
      const invalidQuestions = quizQuestions.filter(q => 
        !q.question.trim() || q.options.some(opt => !opt.trim())
      );
      if (invalidQuestions.length > 0) {
        alert('Please fill all quiz questions and options');
        return;
      }
    }

    if (policyForm.addModules) {
      const invalidModules = readingModules.filter(m => 
        !m.title.trim() || !m.content.trim()
      );
      if (invalidModules.length > 0) {
        alert('Please fill all module titles and content');
        return;
      }
    }

    const newPolicy = {
      id: policies.length + 1,
      ...policyForm,
      acknowledgments: 0,
      lastAcknowledged: '',
      modules: policyForm.addModules ? readingModules.map(m => ({ ...m, read: false })) : [],
      quiz: policyForm.addQuiz ? quizQuestions : [],
      passingScore: policyForm.passingScore,
      documents: [],
      completionTracking: {
        totalEmployees: 150,
        completed: 0,
        pending: 150,
        averageScore: 0
      }
    };

    setPolicies([...policies, newPolicy]);
    setShowPolicyUploadModal(false);
    
    // Reset form
    setPolicyForm({
      name: '',
      category: 'general',
      description: '',
      version: '1.0',
      effectiveDate: '',
      readTime: '',
      status: 'published',
      required: true,
      addQuiz: false,
      addModules: false,
      passingScore: 70
    });
    setQuizQuestions([{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    setReadingModules([{ id: 1, title: '', content: '' }]);
    
    alert('Policy uploaded successfully!');
  };

  return (
    <Modal
      isOpen={showPolicyUploadModal}
      onClose={() => setShowPolicyUploadModal(false)}
      title="Upload New Policy"
      size="xl"
    >
      <div className="space-y-6 p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Policy Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={policyForm.name}
              onChange={(e) => setPolicyForm({...policyForm, name: e.target.value})}
              placeholder="e.g., Social Media Policy"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category <span className="text-rose-500">*</span></label>
              <select
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
                value={policyForm.category}
                onChange={(e) => setPolicyForm({...policyForm, category: e.target.value})}
              >
                <option value="general">General</option>
                <option value="compliance">Compliance</option>
                <option value="security">Security</option>
                <option value="hr">HR</option>
                <option value="it">IT</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Version <span className="text-rose-500">*</span></label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                value={policyForm.version}
                onChange={(e) => setPolicyForm({...policyForm, version: e.target.value})}
                placeholder="e.g., 1.0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              rows="3"
              value={policyForm.description}
              onChange={(e) => setPolicyForm({...policyForm, description: e.target.value})}
              placeholder="Brief description of the policy"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Effective Date <span className="text-rose-500">*</span></label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                value={policyForm.effectiveDate}
                onChange={(e) => setPolicyForm({...policyForm, effectiveDate: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Read Time</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                value={policyForm.readTime}
                onChange={(e) => setPolicyForm({...policyForm, readTime: e.target.value})}
                placeholder="e.g., 15 minutes"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
                value={policyForm.status}
                onChange={(e) => setPolicyForm({...policyForm, status: e.target.value})}
              >
                <option value="published">Published</option>
                <option value="mandatory">Mandatory</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Passing Score (%)</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                min="0"
                max="100"
                value={policyForm.passingScore}
                onChange={(e) => setPolicyForm({...policyForm, passingScore: parseInt(e.target.value) || 70})}
              />
              <span className="text-xs text-slate-400">Minimum score required to pass the quiz</span>
            </div>
          </div>

          {/* Required Checkbox */}
          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="required"
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              checked={policyForm.required}
              onChange={(e) => setPolicyForm({...policyForm, required: e.target.checked})}
            />
            <label htmlFor="required" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Required for all employees
            </label>
          </div>

          {/* File Upload */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Upload Policy Document</label>
            <input
              type="file"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx"
            />
            <span className="text-xs text-slate-400 block mt-1">Supported formats: PDF, DOC, DOCX (Max 10MB)</span>
          </div>

          {/* Add Quiz Checkbox */}
          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="addQuiz"
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              checked={policyForm.addQuiz}
              onChange={(e) => setPolicyForm({ ...policyForm, addQuiz: e.target.checked })}
            />
            <label htmlFor="addQuiz" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Add quiz for this policy
            </label>
          </div>

          {/* Quiz Questions Section */}
          {policyForm.addQuiz && (
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
              <h6 className="text-sm font-bold text-slate-800">Quiz Questions</h6>
              {quizQuestions.map((question, index) => (
                <div key={question.id} className="p-4 rounded-2xl bg-white border border-slate-100 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">Question {index + 1}</span>
                    {quizQuestions.length > 1 && (
                      <button
                        type="button"
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        onClick={() => handleRemoveQuizQuestion(question.id)}
                      >
                        <Icon icon="heroicons:trash" className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Question Text</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                      value={question.question}
                      onChange={(e) => handleQuizQuestionChange(question.id, 'question', e.target.value)}
                      placeholder="Enter the question"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-500">Options</label>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex gap-2 items-center">
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-2 rounded-lg">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <input
                          type="text"
                          className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                          value={option}
                          onChange={(e) => handleQuizOptionChange(question.id, optIndex, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        />
                        <button
                          type="button"
                          className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                            question.correctAnswer === optIndex 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                          onClick={() => handleQuizQuestionChange(question.id, 'correctAnswer', optIndex)}
                        >
                          {question.correctAnswer === optIndex ? 'Correct ✓' : 'Mark Correct'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-550 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all"
                onClick={handleAddQuizQuestion}
              >
                <Icon icon="heroicons:plus" className="w-4 h-4" /> Add Another Question
              </button>
            </div>
          )}

          {/* Add Reading Modules Checkbox */}
          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="addModules"
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              checked={policyForm.addModules}
              onChange={(e) => setPolicyForm({ ...policyForm, addModules: e.target.checked })}
            />
            <label htmlFor="addModules" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Add reading modules
            </label>
          </div>

          {/* Reading Modules Section */}
          {policyForm.addModules && (
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
              <h6 className="text-sm font-bold text-slate-800">Reading Modules</h6>
              {readingModules.map((module, index) => (
                <div key={module.id} className="p-4 rounded-2xl bg-white border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">Module {index + 1}</span>
                    {readingModules.length > 1 && (
                      <button
                        type="button"
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        onClick={() => handleRemoveModule(module.id)}
                      >
                        <Icon icon="heroicons:trash" className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Module Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                      value={module.title}
                      onChange={(e) => handleModuleChange(module.id, 'title', e.target.value)}
                      placeholder="Enter module title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Content</label>
                    <textarea
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                      rows="4"
                      value={module.content}
                      onChange={(e) => handleModuleChange(module.id, 'content', e.target.value)}
                      placeholder="Enter module content"
                    />
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-550 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all"
                onClick={handleAddModule}
              >
                <Icon icon="heroicons:plus" className="w-4 h-4" /> Add Another Module
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowPolicyUploadModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            onClick={handleUploadPolicy}
            disabled={!policyForm.name || !policyForm.effectiveDate || !policyForm.version}
          >
            Upload Policy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PolicyUploadModal;
