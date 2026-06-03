import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiFileText,
  FiDollarSign,
  FiBriefcase,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiClock
} from 'react-icons/fi';
import { BASE_URL } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';

const OfferTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    template_content: '',
    salary_range_min: '',
    salary_range_max: '',
    benefits: [],
    validity_days: 30
  });
  const [newBenefit, setNewBenefit] = useState('');
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    position: '',
    department: ''
  });

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showAlert('Authentication required. Please log in again.', 'error');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (filters.position) params.append('position', filters.position);
      if (filters.department) params.append('department', filters.department);
      
      const url = `${BASE_URL}/api/offers/offer-templates/?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        showAlert('Error fetching templates', 'error');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      showAlert('Error fetching templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [filters]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      position: '',
      department: '',
      template_content: '',
      salary_range_min: '',
      salary_range_max: '',
      benefits: [],
      validity_days: 30
    });
    setShowModal(true);
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      position: template.position || '',
      department: template.department || '',
      template_content: template.template_content,
      salary_range_min: template.salary_range_min || '',
      salary_range_max: template.salary_range_max || '',
      benefits: template.benefits || [],
      validity_days: template.validity_days
    });
    setShowModal(true);
  };

  const saveTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showAlert('Authentication required. Please log in again.', 'error');
        return;
      }

      const url = editingTemplate
        ? `${BASE_URL}/api/offers/offer-templates/${editingTemplate.id}`
        : `${BASE_URL}/api/offers/offer-templates/`;
      
      const method = editingTemplate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showAlert(
          editingTemplate
            ? 'Template updated successfully'
            : 'Template created successfully',
          'success'
        );
        setShowModal(false);
        fetchTemplates();
      } else {
        showAlert('Error saving template', 'error');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      showAlert('Error saving template', 'error');
    }
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showAlert('Authentication required. Please log in again.', 'error');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/api/offers/offer-templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showAlert('Template deleted successfully', 'success');
        fetchTemplates();
      } else {
        showAlert('Error deleting template', 'error');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      showAlert('Error deleting template', 'error');
    }
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiFileText className="text-gray-600 text-xl sm:text-2xl" />
              Offer Templates
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Create and manage offer letter templates</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchTemplates}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
            >
              <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiPlus className="h-4 w-4" />
              Create Template
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 font-semibold mb-1">Position</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by position..."
                  value={filters.position}
                  onChange={(e) => setFilters((prev) => ({ ...prev, position: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 font-semibold mb-1">Department</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by department..."
                  value={filters.department}
                  onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Templates List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-gray-500 text-sm">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
            <FiFileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-midnight_text mb-1">No templates found</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first offer template to get started</p>
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
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-midnight_text truncate flex-1" title={template.name}>
                      {template.name}
                    </h3>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => openEditModal(template)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-all"
                        title="Edit"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiBriefcase className="h-4 w-4 text-gray-400" />
                      <span className="truncate">
                        {template.position || 'Not specified'}
                        {template.department && ` • ${template.department}`}
                      </span>
                    </div>

                    {template.salary_range_min && template.salary_range_max && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiDollarSign className="h-4 w-4 text-gray-400" />
                        <span>
                          ${template.salary_range_min.toLocaleString()} - ${template.salary_range_max.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiClock className="h-4 w-4 text-gray-400" />
                      <span>Validity: {template.validity_days} days</span>
                    </div>
                  </div>

                  {template.benefits && template.benefits.length > 0 && (
                    <div className="border-t border-gray-100 pt-3 mt-2">
                      <p className="text-xs text-gray-500 mb-2">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.benefits.slice(0, 3).map((benefit, idx) => (
                          <span key={idx} className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            {benefit}
                          </span>
                        ))}
                        {template.benefits.length > 3 && (
                          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                            +{template.benefits.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTemplate ? 'Edit Template' : 'Create Template'}
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Senior Developer Offer"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="e.g., Engineering"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
              <input
                type="number"
                value={formData.salary_range_min}
                onChange={(e) => handleInputChange('salary_range_min', parseFloat(e.target.value))}
                placeholder="e.g., 80000"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
              <input
                type="number"
                value={formData.salary_range_max}
                onChange={(e) => handleInputChange('salary_range_max', parseFloat(e.target.value))}
                placeholder="e.g., 120000"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="6"
              value={formData.template_content}
              onChange={(e) => handleInputChange('template_content', e.target.value)}
              placeholder="Dear [Candidate Name],\n\nWe are pleased to offer you the position of [Position] at [Company Name]...\n\nUse placeholders like [Candidate Name], [Position], [Salary], etc."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="e.g., Health Insurance"
                onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
              <button onClick={addBenefit} className="px-3 py-2 bg-white border border-gray-200 hover:border-primary/50 text-gray-600 hover:text-primary rounded-lg text-sm font-medium transition-all">
                <FiPlus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.benefits.map((benefit, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                  {benefit}
                  <button onClick={() => removeBenefit(index)} className="hover:text-rose-500">
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Validity (Days)</label>
            <input
              type="number"
              value={formData.validity_days}
              onChange={(e) => handleInputChange('validity_days', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
            >
              <FiSave className="h-4 w-4" />
              {editingTemplate ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OfferTemplates;