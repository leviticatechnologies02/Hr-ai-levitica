import React, { useState, useEffect } from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiSend,
  FiUsers,
  FiSearch,
  FiMail
} from 'react-icons/fi';
import { BASE_URL } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';

const SELECTED_STAGES = ['selected', 'offer', 'offered', 'hired'];

const SelectionResults = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('selected');
  const [searchTerm, setSearchTerm] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerTemplates, setOfferTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [offerData, setOfferData] = useState({
    position: '',
    department: '',
    salary_offered: '',
    benefits: '',
    offer_content: '',
    expiry_days: 30,
    notes: ''
  });
  const [sendingOffer, setSendingOffer] = useState(false);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  // Candidates who completed the AI interview, joined with their current pipeline stage
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (!localStorage.getItem('token')) {
        setRows([]);
        setError('Authentication required. Please log in again.');
        return;
      }
      const [interviewRes, recordsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/interviews/results`, { headers: authHeaders() }),
        fetch(`${BASE_URL}/api/resume/candidates?show_all=true`, { headers: authHeaders() })
      ]);
      if (!interviewRes.ok || !recordsRes.ok) {
        throw new Error('Failed to load selection results');
      }
      const interviews = await interviewRes.json();
      const records = await recordsRes.json();

      const stageByEmail = {};
      records.forEach(r => {
        if (r.candidate_email) {
          stageByEmail[r.candidate_email.toLowerCase().trim()] = r;
        }
      });

      const joined = interviews
        .map(i => {
          const email = (i.candidate_email || '').toLowerCase().trim();
          const rec = stageByEmail[email];
          return {
            candidate_id: i.candidate_id,
            name: i.candidate_name,
            email: i.candidate_email,
            role: rec?.role || 'Candidate',
            aiScore: Math.round(i.avg_score || 0),
            stage: (rec?.stage || '').trim()
          };
        })
        .filter(r => r.stage.toLowerCase() === 'rejected' || SELECTED_STAGES.includes(r.stage.toLowerCase()));

      setRows(joined);
    } catch (e) {
      console.error('Error loading selection results:', e);
      setError('Could not load selection results. Please try again.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchOfferTemplates = async () => {
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
        setOfferTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching offer templates:', error);
    }
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    if (templateId) {
      const template = offerTemplates.find(t => t.id === parseInt(templateId));
      if (template) {
        let offerContent = template.template_content || '';
        offerContent = offerContent.replace(/\[Candidate Name\]/g, candidate.name);
        offerContent = offerContent.replace(/\[Position\]/g, template.position || candidate.role || 'Software Developer');
        offerContent = offerContent.replace(/\[Department\]/g, template.department || '');
        
        setOfferData(prev => ({
          ...prev,
          position: template.position || prev.position,
          department: template.department || prev.department,
          salary_offered: template.salary_range_min ? String(template.salary_range_min) : prev.salary_offered,
          benefits: template.benefits ? template.benefits.join(', ') : prev.benefits,
          offer_content: offerContent,
          expiry_days: template.validity_days || prev.expiry_days
        }));
      }
    }
  };

  const handleSendOffer = async () => {
    if (!candidate) return;
    
    if (!selectedTemplateId) {
      alert('Please select an offer template first.');
      return;
    }
    
    if (!offerData.position || !offerData.offer_content) {
      alert('Please fill in Position and Offer Content fields.');
      return;
    }
    
    setSendingOffer(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        setSendingOffer(false);
        return;
      }

      const benefitsList = offerData.benefits 
        ? offerData.benefits.split(',').map(b => b.trim()).filter(b => b)
        : [];
      
      const requestBody = {
        candidate_id: candidate.candidate_id,
        candidate_name: candidate.name,
        candidate_email: candidate.email,
        template_id: selectedTemplateId ? parseInt(selectedTemplateId) : null,
        position: offerData.position,
        department: offerData.department || null,
        salary_offered: offerData.salary_offered ? parseFloat(offerData.salary_offered) : null,
        benefits: benefitsList,
        offer_content: offerData.offer_content,
        expiry_days: parseInt(offerData.expiry_days) || 30,
        notes: offerData.notes || null
      };

      const response = await fetch(`${BASE_URL}/api/offers/offer-tracking/send-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        alert(`✅ Offer sent successfully to ${candidate.name}!`);
        setShowOfferModal(false);
        fetchData();
      } else {
        alert(`❌ Failed to send offer`);
      }
    } catch (error) {
      console.error('Error sending offer:', error);
      alert('Error sending offer. Please try again.');
    } finally {
      setSendingOffer(false);
    }
  };

  const openOfferModal = async (row) => {
    setCandidate(row);
    await fetchOfferTemplates();
    setOfferData({
      position: row.role && row.role !== 'Candidate' ? row.role : '',
      department: '',
      salary_offered: '',
      benefits: '',
      offer_content: '',
      expiry_days: 30,
      notes: ''
    });
    setSelectedTemplateId('');
    setShowOfferModal(true);
  };

  const stageLower = (r) => r.stage.toLowerCase();
  const selectedRows = rows.filter(r => SELECTED_STAGES.includes(stageLower(r)));
  const rejectedRows = rows.filter(r => stageLower(r) === 'rejected');
  const term = searchTerm.toLowerCase().trim();
  const visible = (activeTab === 'selected' ? selectedRows : rejectedRows).filter(r =>
    !term || (r.name || '').toLowerCase().includes(term) || (r.email || '').toLowerCase().includes(term)
  );

  const stageBadge = (r) => {
    const s = stageLower(r);
    if (s === 'rejected') return { text: 'Rejected', cls: 'bg-rose-100 text-rose-700' };
    if (s === 'hired') return { text: 'Hired', cls: 'bg-emerald-100 text-emerald-700' };
    if (s === 'offer' || s === 'offered') return { text: 'Offer Sent', cls: 'bg-blue-100 text-blue-700' };
    return { text: 'Selected', cls: 'bg-emerald-100 text-emerald-700' };
  };

  const scoreCls = (s) => s >= 80 ? 'bg-emerald-500 text-white' : s >= 60 ? 'bg-primary text-white' : 'bg-amber-500 text-white';

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiUsers className="text-gray-600" />
              Selection Results
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Candidates selected or rejected after the AI interview review. Send offers to selected candidates.
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('selected')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'selected' ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiCheckCircle className="h-4 w-4" />
                Selected ({selectedRows.length})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'rejected' ? 'bg-rose-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiXCircle className="h-4 w-4" />
                Rejected ({rejectedRows.length})
              </button>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name or email"
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary w-full sm:w-64"
              />
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3" />
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            ) : error ? (
              <p className="text-center text-sm text-rose-600 py-10">{error}</p>
            ) : visible.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-10">
                {activeTab === 'selected' ? 'No selected candidates yet.' : 'No rejected candidates yet.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-100">
                      <th className="py-2 pr-4">Candidate</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2 pr-4">AI Score</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((r) => {
                      const badge = stageBadge(r);
                      return (
                        <tr key={`${r.candidate_id}-${r.email}`} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 pr-4 font-medium text-midnight_text">{r.name}</td>
                          <td className="py-3 pr-4 text-gray-600">
                            <span className="inline-flex items-center gap-1"><FiMail className="h-3 w-3" />{r.email}</span>
                          </td>
                          <td className="py-3 pr-4 text-gray-600">{r.role}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${scoreCls(r.aiScore)}`}>{r.aiScore}%</span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${badge.cls}`}>{badge.text}</span>
                          </td>
                          <td className="py-3 text-right">
                            {stageLower(r) === 'selected' && (
                              <button
                                onClick={() => openOfferModal(r)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-all"
                              >
                                <FiSend className="h-3 w-3" />
                                Send Offer
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        title={`Send Job Offer to ${candidate?.name || ''}`}
        size="lg"
      >
        {candidate && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Offer Template <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                disabled={sendingOffer}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="">-- Select a Template --</option>
                {offerTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} {template.position ? `- ${template.position}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={offerData.position}
                onChange={(e) => setOfferData({ ...offerData, position: e.target.value })}
                disabled={sendingOffer}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={offerData.department}
                onChange={(e) => setOfferData({ ...offerData, department: e.target.value })}
                disabled={sendingOffer}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Offered</label>
              <input
                type="number"
                value={offerData.salary_offered}
                onChange={(e) => setOfferData({ ...offerData, salary_offered: e.target.value })}
                disabled={sendingOffer}
                placeholder="e.g., 50000"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (comma-separated)</label>
              <input
                type="text"
                value={offerData.benefits}
                onChange={(e) => setOfferData({ ...offerData, benefits: e.target.value })}
                disabled={sendingOffer}
                placeholder="e.g., Health Insurance, 401k, Paid Time Off"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="6"
                value={offerData.offer_content}
                onChange={(e) => setOfferData({ ...offerData, offer_content: e.target.value })}
                disabled={sendingOffer}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offer Validity (Days)</label>
              <input
                type="number"
                value={offerData.expiry_days}
                onChange={(e) => setOfferData({ ...offerData, expiry_days: e.target.value })}
                disabled={sendingOffer}
                min="1"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes (Optional)</label>
              <textarea
                rows="2"
                value={offerData.notes}
                onChange={(e) => setOfferData({ ...offerData, notes: e.target.value })}
                disabled={sendingOffer}
                placeholder="Internal notes (not sent to candidate)"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowOfferModal(false)}
                disabled={sendingOffer}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOffer}
                disabled={sendingOffer || !selectedTemplateId || !offerData.position || !offerData.offer_content}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {sendingOffer ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <FiCheckCircle className="h-4 w-4" />
                )}
                Send Offer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SelectionResults;
