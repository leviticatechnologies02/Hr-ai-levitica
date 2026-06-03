import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiClipboard,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings,
  FiMessageSquare,
  FiLink,
  FiCopy,
  FiCpu,
  FiBarChart2,
  FiList
} from 'react-icons/fi';
import { BASE_URL } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';

const ConfigureAIInterview = () => {
  const [templates, setTemplates] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    interview_type: 'technical',
    time_limit: 30,
    difficulty: 'medium',
    questions: []
  });
  const [newQuestion, setNewQuestion] = useState({ q: '', a: '' });
  const [alert, setAlert] = useState(null);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/interviews/get_questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/ai-interviews/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data || []);
      } else {
        setTemplates([]);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchTemplates();
  }, []);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    if (newQuestion.q.trim()) {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, { ...newQuestion }]
      }));
      setNewQuestion({ q: '', a: '' });
    }
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      interview_type: 'technical',
      time_limit: 30,
      difficulty: 'medium',
      questions: []
    });
    setShowModal(true);
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      interview_type: template.interview_type,
      time_limit: template.time_limit || 30,
      difficulty: template.difficulty || 'medium',
      questions: template.questions || []
    });
    setShowModal(true);
  };

  const saveTemplate = async () => {
    try {
      const payload = { ...formData };

      if (editingTemplate) {
        const response = await fetch(`${BASE_URL}/ai-interviews/${editingTemplate.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          showAlert('Template updated successfully!');
          setShowModal(false);
          fetchTemplates();
        } else {
          const errorData = await response.json().catch(() => ({ detail: 'Failed to update template' }));
          showAlert(errorData.detail || 'Failed to update template', 'danger');
        }
      } else {
        const response = await fetch(`${BASE_URL}/ai-interviews/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          showAlert('Template created successfully!');
          setShowModal(false);
          fetchTemplates();
        } else {
          const errorData = await response.json().catch(() => ({ detail: 'Failed to create template' }));
          showAlert(errorData.detail || 'Failed to create template', 'danger');
        }
      }
    } catch (error) {
      console.error('Error saving template:', error);
      showAlert('Failed to save template', 'danger');
    }
  };

  const deleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/ai-interviews/${templateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showAlert('Template deleted successfully!');
        fetchTemplates();
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to delete template' }));
        showAlert(errorData.detail || 'Failed to delete template', 'danger');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      showAlert('Failed to delete template', 'danger');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-emerald-50 text-emerald-700',
      medium: 'bg-amber-50 text-amber-700',
      hard: 'bg-rose-50 text-rose-700'
    };
    return colors[difficulty] || colors.medium;
  };

  const copyInterviewLink = (templateId, templateName) => {
    const link = `${window.location.origin}/ai-interview?template_id=${templateId}&name=Candidate&email=candidate@example.com`;
    navigator.clipboard.writeText(link).then(() => {
      showAlert(`Interview link for "${templateName}" copied to clipboard!`, 'success');
    }).catch(err => {
      console.error('Failed to copy:', err);
      showAlert('Failed to copy link', 'danger');
    });
  };

  const getInterviewTypeColor = (type) => {
    const colors = {
      technical: 'bg-indigo-50 text-indigo-700',
      behavioral: 'bg-purple-50 text-purple-700',
      hr: 'bg-emerald-50 text-emerald-700',
      mixed: 'bg-primary/10 text-primary'
    };
    return colors[type] || colors.mixed;
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiCpu className="text-gray-600 text-xl sm:text-2xl" />
              Configure AI Interview
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Create and manage AI interview templates</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiPlus className="h-4 w-4" />
              Create Template
            </button>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div className={`flex items-center justify-between gap-3 p-3 rounded-lg ${
            alert.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}>
            <div className="flex items-center gap-2">
              {alert.type === 'success' ? <FiCheckCircle className="h-5 w-5" /> : <FiAlertCircle className="h-5 w-5" />}
              <span className="text-sm">{alert.message}</span>
            </div>
            <button onClick={() => setAlert(null)} className="text-gray-400 hover:text-gray-600">
              <FiX className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Templates List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-gray-500 text-sm">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
            <FiSettings className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-midnight_text mb-1">No Templates Yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first AI interview template to get started</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiPlus className="h-4 w-4" />
              Create Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow hover:shadow-property transition-all">
                <div className="p-4">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-midnight_text truncate" title={template.name}>
                        {template.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium capitalize ${getInterviewTypeColor(template.interview_type)}`}>
                          {template.interview_type}
                        </span>
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium capitalize ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiClipboard className="h-4 w-4" />
                      <span>{template.questions?.length || 0} Questions</span>
                    </div>
                    {template.time_limit && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiClock className="h-4 w-4" />
                        <span>{template.time_limit} minutes</span>
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {template.questions && template.questions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Preview:</p>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-600 truncate">
                          {template.questions[0].q}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Interview Link */}
                  <div className="mb-3 p-2 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <FiLink className="h-3 w-3 text-primary" />
                      <span className="text-xs font-semibold text-primary">Interview Link</span>
                    </div>
                    <button
                      onClick={() => copyInterviewLink(template.id, template.name)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-primary/30 hover:bg-primary/5 text-primary rounded-md text-xs font-medium transition-all"
                    >
                      <FiCopy className="h-3 w-3" />
                      Copy Link
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(template)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-primary/50 text-gray-600 hover:text-primary rounded-lg text-sm font-medium transition-all"
                    >
                      <FiEdit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-rose-500/50 text-gray-600 hover:text-rose-600 rounded-lg text-sm font-medium transition-all"
                    >
                      <FiTrash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Template Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTemplate ? 'Edit Interview Template' : 'Create Interview Template'}
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Senior Developer Interview"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.interview_type}
              onChange={(e) => handleInputChange('interview_type', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
            >
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="hr">HR</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <select
              value={formData.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Time Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
            <input
              type="number"
              min="5"
              max="120"
              value={formData.time_limit}
              onChange={(e) => handleInputChange('time_limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Questions <span className="text-rose-500">*</span>
            </label>

            {/* Question List */}
            {formData.questions.length > 0 && (
              <div className="space-y-2 mb-3">
                {formData.questions.map((q, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-midnight_text mb-1">
                          {idx + 1}. {q.q}
                        </p>
                        {q.a && (
                          <p className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">Sample Answer:</span> {q.a}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeQuestion(idx)}
                        className="p-1 text-gray-400 hover:text-rose-500 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Question Form */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h6 className="text-sm font-semibold text-midnight_text mb-3 flex items-center gap-2">
                <FiMessageSquare className="h-4 w-4 text-primary" />
                Add Question
              </h6>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter question..."
                  value={newQuestion.q}
                  onChange={(e) => setNewQuestion({ ...newQuestion, q: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <textarea
                  rows="2"
                  placeholder="Sample answer (optional)..."
                  value={newQuestion.a}
                  onChange={(e) => setNewQuestion({ ...newQuestion, a: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={addQuestion}
                  disabled={!newQuestion.q.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-primary/50 text-gray-600 hover:text-primary rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus className="h-4 w-4" />
                  Add Question
                </button>
              </div>
            </div>

            {formData.questions.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">At least one question is required</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={saveTemplate}
              disabled={!formData.name.trim() || formData.questions.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="h-4 w-4" />
              {editingTemplate ? 'Update' : 'Create'} Template
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConfigureAIInterview;