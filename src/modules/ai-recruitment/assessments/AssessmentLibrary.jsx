import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiFileText,
  FiCode,
  FiMessageSquare,
  FiSave,
  FiX,
  FiGrid,
  FiSmile,
  FiSliders,
  FiZap,
  FiChevronDown
} from 'react-icons/fi';
import { assessmentAPI } from "../../../shared/utils/api";
import Modal from '../../../shared/components/Modal';
import { FaBrain } from 'react-icons/fa';

const TEST_TYPE_OPTIONS = [
  {
    key: 'aptitude',
    label: 'Aptitude Test',
    description: 'Reasoning and analytical ability assessment',
    icon: FaBrain,
    badgeClass: 'bg-purple-100 text-purple-700'
  },
  {
    key: 'coding',
    label: 'Coding Test',
    description: 'Hands-on coding and problem-solving tasks',
    icon: FiCode,
    badgeClass: 'bg-blue-100 text-blue-700'
  },
  {
    key: 'communication',
    label: 'Communication Test',
    description: 'Written, listening, and language proficiency check',
    icon: FiMessageSquare,
    badgeClass: 'bg-green-100 text-green-700'
  }
];

const TYPE_DEFAULTS = {
  aptitude: {
    name: 'Aptitude Test Assessment',
    difficulty: 'medium',
    role: 'Analyst',
    skill: 'Logical Reasoning',
    question_count: 25
  },
  coding: {
    name: 'Coding Test Assessment',
    difficulty: 'medium',
    role: 'Software Developer',
    skill: 'Problem Solving',
    question_count: 2
  },
  communication: {
    name: 'Communication Test Assessment',
    difficulty: 'medium',
    role: 'Customer Support',
    skill: 'Verbal Communication',
    question_count: 10
  }
};

const AssessmentLibrary = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedTestType, setSelectedTestType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    skill: '',
    difficulty: 'medium',
    role: '',
    question_count: 25,
    created_by: null
  });

  const [errors, setErrors] = useState({});

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const data = await assessmentAPI.list();
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assessment.role && assessment.role.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || assessment.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || assessment.difficulty === filterDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editMode && !selectedTestType) newErrors.type = 'Please select an assignment type';
    if (!formData.name.trim()) newErrors.name = 'Assessment name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (formData.question_count < 1) newErrors.question_count = 'Must have at least 1 question';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectAssignmentType = (type) => {
    const defaults = TYPE_DEFAULTS[type];
    if (!defaults) return;

    setSelectedTestType(type);
    setFormData((prev) => ({
      ...prev,
      ...defaults
    }));
    setErrors((prev) => ({ ...prev, type: null }));
    setShowTypeDropdown(false);
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    try {
      const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null;
      const assessmentData = {
        ...formData,
        type: selectedTestType,
        created_by: userId
      };
      
      await assessmentAPI.create(assessmentData);
      setShowModal(false);
      fetchAssessments();
      resetForm();
    } catch (error) {
      console.error('Error creating assessment:', error);
      alert('Failed to create assessment');
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    try {
      const updateData = {
        ...formData,
        type: selectedTestType
      };
      await assessmentAPI.update(selectedAssessment.id, updateData);
      setShowModal(false);
      setEditMode(false);
      fetchAssessments();
      resetForm();
    } catch (error) {
      console.error('Error updating assessment:', error);
      alert('Failed to update assessment');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await assessmentAPI.delete(id);
        fetchAssessments();
      } catch (error) {
        console.error('Error deleting assessment:', error);
        alert('Failed to delete assessment');
      }
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedAssessments(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelectedAssessments([]);
  };

  const handleBulkDelete = async () => {
    if (selectedAssessments.length === 0) return;
    const names = assessments
      .filter(a => selectedAssessments.includes(a.id))
      .map(a => `• ${a.name}`)
      .join('\n');
    if (!window.confirm(`Are you sure you want to delete these assessments?\n\n${names}`)) {
      return;
    }
    try {
      await Promise.all(selectedAssessments.map(id => assessmentAPI.delete(id)));
      await fetchAssessments();
      setSelectedAssessments([]);
    } catch (error) {
      console.error('Error deleting selected assessments:', error);
      alert('Failed to delete some assessments');
    }
  };

  const handleEdit = (assessment) => {
    setSelectedAssessment(assessment);
    setFormData({
      name: assessment.name,
      skill: assessment.skill || '',
      difficulty: assessment.difficulty || 'medium',
      role: assessment.role || '',
      question_count: assessment.question_count || 25,
      created_by: assessment.created_by
    });
    setSelectedTestType(assessment.type || 'aptitude');
    setEditMode(true);
    setShowModal(true);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      skill: '',
      difficulty: 'medium',
      role: '',
      question_count: 25,
      created_by: null
    });
    setErrors({});
    setSelectedTestType('');
    setSelectedAssessment(null);
    setEditMode(false);
    setShowTypeDropdown(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'aptitude': return <FaBrain className="h-5 w-5" />;
      case 'coding': return <FiCode className="h-5 w-5" />;
      case 'communication': return <FiMessageSquare className="h-5 w-5" />;
      default: return <FiFileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'aptitude': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'coding': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'communication': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-emerald-50 text-emerald-700';
      case 'medium': return 'bg-amber-50 text-amber-700';
      case 'hard': return 'bg-rose-50 text-rose-700';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const totalAssessments = assessments.length;
  const easyCount = assessments.filter(a => (a.difficulty || '').toLowerCase() === 'easy').length;
  const mediumCount = assessments.filter(a => (a.difficulty || '').toLowerCase() === 'medium').length;
  const hardCount = assessments.filter(a => (a.difficulty || '').toLowerCase() === 'hard').length;

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiGrid className="text-gray-700 text-xl sm:text-2xl" />
              Assessment Library
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Create and manage assessment templates for candidate evaluation</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button
                onClick={fetchAssessments}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
              >
                <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
              >
                <FiPlus className="h-4 w-4" />
                Add Assignment
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Total Templates</p>
                <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{totalAssessments}</p>
                <p className="text-xs text-gray-400 mt-1">All test types</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FiGrid className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Easy</p>
                <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{easyCount}</p>
                <p className="text-xs text-gray-400 mt-1">Across all types</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FiSmile className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Medium</p>
                <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{mediumCount}</p>
                <p className="text-xs text-gray-400 mt-1">Across all types</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <FiSliders className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Hard</p>
                <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{hardCount}</p>
                <p className="text-xs text-gray-400 mt-1">Across all types</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                <FiZap className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
            >
              <option value="all">All Types</option>
              <option value="aptitude">Aptitude</option>
              <option value="coding">Coding</option>
              <option value="communication">Communication</option>
            </select>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button
              onClick={fetchAssessments}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
            >
              <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Reload
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAssessments.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary">
                {selectedAssessments.length} assessment{selectedAssessments.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleClearSelection}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-sm font-medium transition-all"
            >
              <FiTrash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>
        )}

        {/* Assessments Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-gray-500 text-sm">Loading assessments...</p>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
            <FiFileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-midnight_text mb-1">No Assessments Found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || filterType !== 'all' || filterDifficulty !== 'all'
                ? 'No assessments found matching your filters'
                : 'No assessments created yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssessments.map((assessment) => (
              <div key={assessment.id} className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow hover:shadow-property transition-all">
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedAssessments.includes(assessment.id)}
                        onChange={() => handleToggleSelect(assessment.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className={`p-2 rounded-lg ${getTypeColor(assessment.type)}`}>
                        {getTypeIcon(assessment.type)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(assessment)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-all"
                        title="Edit"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(assessment.id, assessment.name)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-midnight_text mb-3 line-clamp-1" title={assessment.name}>
                    {assessment.name}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Type:</span>
                      <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                        {assessment.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Difficulty:</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${getDifficultyColor(assessment.difficulty)} capitalize`}>
                        {assessment.difficulty || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Questions:</span>
                      <span className="font-semibold text-midnight_text">{assessment.question_count || 0}</span>
                    </div>
                    {assessment.role && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Role:</span>
                        <span className="text-gray-700 truncate max-w-[150px]" title={assessment.role}>
                          {assessment.role}
                        </span>
                      </div>
                    )}
                    {assessment.skill && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Skill:</span>
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                          {assessment.skill}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-100 mt-3 pt-3">
                    <p className="text-xs text-gray-400">
                      Updated: {new Date(assessment.last_updated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editMode ? 'Edit Assessment' : 'Add Assignment'}
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          {!editMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Assignment Type <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className={`w-full px-3 py-2 text-left text-sm border rounded-lg flex items-center justify-between bg-white ${
                    errors.type ? 'border-rose-500' : 'border-gray-200'
                  } focus:outline-none focus:border-primary`}
                >
                  <span>
                    {TEST_TYPE_OPTIONS.find((option) => option.key === selectedTestType)?.label || 'Choose assignment type'}
                  </span>
                  <FiChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showTypeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {TEST_TYPE_OPTIONS.map((option) => {
                      const OptionIcon = option.icon;
                      return (
                        <button
                          key={option.key}
                          onClick={() => handleSelectAssignmentType(option.key)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg"
                        >
                          <div className={`p-1 rounded ${option.badgeClass}`}>
                            <OptionIcon size={14} />
                          </div>
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {errors.type && <p className="text-xs text-rose-600 mt-1">{errors.type}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Python Developer Assessment"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                errors.name ? 'border-rose-500' : 'border-gray-200'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Role <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Backend Developer"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                  errors.role ? 'border-rose-500' : 'border-gray-200'
                }`}
              />
              {errors.role && <p className="text-xs text-rose-600 mt-1">{errors.role}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Python, JavaScript"
              value={formData.skill}
              onChange={(e) => handleInputChange('skill', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
            <input
              type="number"
              min="1"
              value={formData.question_count}
              onChange={(e) => handleInputChange('question_count', parseInt(e.target.value))}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                errors.question_count ? 'border-rose-500' : 'border-gray-200'
              }`}
            />
            {errors.question_count && <p className="text-xs text-rose-600 mt-1">{errors.question_count}</p>}
            <p className="text-xs text-gray-400 mt-1">Number of questions for this assessment</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={editMode ? handleUpdate : handleCreate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
            >
              <FiSave className="h-4 w-4" />
              {editMode ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssessmentLibrary;