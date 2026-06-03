import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSend,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiFileText,
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiRefreshCw,
  FiSave,
  FiX,
  FiFilter,
  FiBriefcase,
  FiUser,
  FiUsers
} from 'react-icons/fi';
import { BASE_URL } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';

const OfferTracking = () => {
  const [offers, setOffers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [formData, setFormData] = useState({
    candidate_id: '',
    job_id: '',
    template_id: '',
    candidate_name: '',
    candidate_email: '',
    position: '',
    department: '',
    salary_offered: '',
    benefits: [],
    offer_content: '',
    expiry_date: '',
    notes: ''
  });
  const [newBenefit, setNewBenefit] = useState('');
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    position: ''
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showAlert('Authentication required. Please log in again.', 'error');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.position) params.append('position', filters.position);
      
      const url = `${BASE_URL}/api/offers/offer-tracking?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      } else {
        showAlert('Error fetching offers', 'error');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      showAlert('Error fetching offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) return;

      const response = await fetch(`${BASE_URL}/api/offers/offer-tracking/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${BASE_URL}/api/offers/offer-templates/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${BASE_URL}/api/recruiter_dashboard/candidates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchStats();
    fetchTemplates();
    fetchCandidates();
  }, [filters]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'template_id' && value) {
      const template = templates.find(t => t.id === parseInt(value));
      if (template) {
        setFormData(prev => ({
          ...prev,
          position: template.position || prev.position,
          department: template.department || prev.department,
          offer_content: template.template_content,
          benefits: template.benefits || []
        }));
      }
    }

    if (field === 'candidate_id' && value) {
      const candidate = candidates.find(c => c.id === parseInt(value));
      if (candidate) {
        setFormData(prev => ({
          ...prev,
          candidate_name: candidate.name,
          candidate_email: candidate.email
        }));
      }
    }
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
    setEditingOffer(null);
    setFormData({
      candidate_id: '',
      job_id: '',
      template_id: '',
      candidate_name: '',
      candidate_email: '',
      position: '',
      department: '',
      salary_offered: '',
      benefits: [],
      offer_content: '',
      expiry_date: '',
      notes: ''
    });
    setShowModal(true);
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setFormData({
      candidate_id: offer.candidate_id,
      job_id: offer.job_id || '',
      template_id: offer.template_id || '',
      candidate_name: offer.candidate_name,
      candidate_email: offer.candidate_email,
      position: offer.position,
      department: offer.department || '',
      salary_offered: offer.salary_offered || '',
      benefits: offer.benefits || [],
      offer_content: offer.offer_content,
      expiry_date: offer.expiry_date || '',
      notes: offer.notes || ''
    });
    setShowModal(true);
  };

  const viewOffer = (offer) => {
    setSelectedOffer(offer);
    setShowDetailModal(true);
  };

  const saveOffer = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showAlert('Authentication required. Please log in again.', 'error');
        return;
      }

      const url = editingOffer
        ? `${BASE_URL}/api/offers/offer-tracking/${editingOffer.id}`
        : `${BASE_URL}/api/offers/offer-tracking/`;
      
      const method = editingOffer ? 'PUT' : 'POST';
      
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
          editingOffer
            ? 'Offer updated successfully'
            : 'Offer created successfully',
          'success'
        );
        setShowModal(false);
        fetchOffers();
        fetchStats();
      } else {
        showAlert('Error saving offer', 'error');
      }
    } catch (error) {
      console.error('Error saving offer:', error);
      showAlert('Error saving offer', 'error');
    }
  };

  const updateStatus = async (offerId, status) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showAlert('Authentication required. Please log in again.', 'error');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/api/offers/offer-tracking/${offerId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        showAlert('Status updated successfully', 'success');
        fetchOffers();
        fetchStats();
      } else {
        showAlert('Error updating status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showAlert('Error updating status', 'error');
    }
  };

  const deleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showAlert('Authentication required. Please log in again.', 'error');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/api/offers/offer-tracking/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showAlert('Offer deleted successfully', 'success');
        fetchOffers();
        fetchStats();
      } else {
        showAlert('Error deleting offer', 'error');
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      showAlert('Error deleting offer', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Draft: { color: 'bg-gray-100 text-gray-600', icon: FiFileText },
      Sent: { color: 'bg-primary/10 text-primary', icon: FiSend },
      Accepted: { color: 'bg-emerald-50 text-emerald-700', icon: FiCheckCircle },
      Rejected: { color: 'bg-rose-50 text-rose-700', icon: FiXCircle },
      Expired: { color: 'bg-amber-50 text-amber-700', icon: FiClock }
    };

    const config = statusConfig[status] || statusConfig.Draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span>{status}</span>
      </span>
    );
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
              Offer Tracking
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Track and manage job offers</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchOffers}
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
              Create Offer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Offers</p>
                  <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{stats.total}</p>
                  <p className="text-xs text-gray-400 mt-1">All statuses</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FiBriefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Sent</p>
                  <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{stats.sent}</p>
                  <p className="text-xs text-gray-400 mt-1">Offers sent to candidates</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <FiSend className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Accepted</p>
                  <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{stats.accepted}</p>
                  <p className="text-xs text-gray-400 mt-1">Candidates who accepted</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Acceptance Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{stats.acceptance_rate}%</p>
                  <p className="text-xs text-gray-400 mt-1">Accepted / Sent</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <FiTrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Position</label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by position..."
                  value={filters.position}
                  onChange={(e) => setFilters((prev) => ({ ...prev, position: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchOffers}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
              >
                <FiFilter className="h-4 w-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Offers Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-gray-500 text-sm">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
            <FiFileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-midnight_text mb-1">No offers found</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first offer to get started</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiPlus className="h-4 w-4" />
              Create Offer
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Candidate</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Position</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Salary</th>
                    <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Sent Date</th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Expiry Date</th>
                    <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {offers.map(offer => (
                    <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <FiUser className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-midnight_text">{offer.candidate_name}</p>
                            <p className="text-xs text-gray-500">{offer.candidate_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{offer.position}</p>
                        {offer.department && (
                          <p className="text-xs text-gray-500">{offer.department}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">
                          {offer.salary_offered ? `$${offer.salary_offered.toLocaleString()}` : '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(offer.status)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">
                          {offer.sent_date ? new Date(offer.sent_date).toLocaleDateString() : '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">
                          {offer.expiry_date ? new Date(offer.expiry_date).toLocaleDateString() : '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => viewOffer(offer)}
                            className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all"
                            title="View"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(offer)}
                            className="p-1.5 text-gray-500 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-all"
                            title="Edit"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          {offer.status === 'Draft' && (
                            <button
                              onClick={() => updateStatus(offer.id, 'Sent')}
                              className="p-1.5 text-gray-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all"
                              title="Send Offer"
                            >
                              <FiSend className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteOffer(offer.id)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingOffer ? 'Edit Offer' : 'Create Offer'}
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template (Optional)</label>
              <select
                value={formData.template_id}
                onChange={(e) => handleInputChange('template_id', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="">Select a template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Candidate <span className="text-rose-500">*</span></label>
              <select
                value={formData.candidate_id}
                onChange={(e) => handleInputChange('candidate_id', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="">Select a candidate...</option>
                {candidates.map(candidate => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} ({candidate.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.candidate_name}
                onChange={(e) => handleInputChange('candidate_name', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Email <span className="text-rose-500">*</span></label>
              <input
                type="email"
                value={formData.candidate_email}
                onChange={(e) => handleInputChange('candidate_email', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Offered</label>
              <input
                type="number"
                value={formData.salary_offered}
                onChange={(e) => handleInputChange('salary_offered', parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Offer Content <span className="text-rose-500">*</span></label>
            <textarea
              rows="6"
              value={formData.offer_content}
              onChange={(e) => handleInputChange('offer_content', e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Internal notes about this offer..."
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
              onClick={saveOffer}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
            >
              <FiSave className="h-4 w-4" />
              {editingOffer ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Offer Details"
        size="lg"
      >
        {selectedOffer && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <h6 className="text-sm font-semibold text-midnight_text mb-3">Candidate Information</h6>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Name:</span> {selectedOffer.candidate_name}</p>
                <p><span className="text-gray-500">Email:</span> {selectedOffer.candidate_email}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h6 className="text-sm font-semibold text-midnight_text mb-3">Position Details</h6>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Position:</span> {selectedOffer.position}</p>
                {selectedOffer.department && <p><span className="text-gray-500">Department:</span> {selectedOffer.department}</p>}
                {selectedOffer.salary_offered && (
                  <p><span className="text-gray-500">Salary:</span> ${selectedOffer.salary_offered.toLocaleString()}</p>
                )}
              </div>
            </div>

            {selectedOffer.benefits && selectedOffer.benefits.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h6 className="text-sm font-semibold text-midnight_text mb-3">Benefits</h6>
                <div className="flex flex-wrap gap-2">
                  {selectedOffer.benefits.map((benefit, idx) => (
                    <span key={idx} className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h6 className="text-sm font-semibold text-midnight_text mb-3">Offer Letter</h6>
              <div className="bg-white rounded-lg p-3 border border-gray-200 whitespace-pre-wrap text-sm text-gray-700">
                {selectedOffer.offer_content}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h6 className="text-sm font-semibold text-midnight_text mb-3">Status & Dates</h6>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">Status:</span>
                  {getStatusBadge(selectedOffer.status)}
                </p>
                {selectedOffer.sent_date && (
                  <p><span className="text-gray-500">Sent Date:</span> {new Date(selectedOffer.sent_date).toLocaleString()}</p>
                )}
                {selectedOffer.expiry_date && (
                  <p><span className="text-gray-500">Expiry Date:</span> {new Date(selectedOffer.expiry_date).toLocaleDateString()}</p>
                )}
                {selectedOffer.response_date && (
                  <p><span className="text-gray-500">Response Date:</span> {new Date(selectedOffer.response_date).toLocaleString()}</p>
                )}
              </div>
            </div>

            {selectedOffer.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h6 className="text-sm font-semibold text-midnight_text mb-3">Notes</h6>
                <p className="text-sm text-gray-700">{selectedOffer.notes}</p>
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-gray-100">
              {selectedOffer.status === 'Sent' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateStatus(selectedOffer.id, 'Accepted');
                      setShowDetailModal(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <FiCheckCircle className="h-4 w-4" />
                    Mark as Accepted
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedOffer.id, 'Rejected');
                      setShowDetailModal(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <FiXCircle className="h-4 w-4" />
                    Mark as Rejected
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OfferTracking;