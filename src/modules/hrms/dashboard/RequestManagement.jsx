import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';
import StatCard from '../../../shared/components/StatCard';
import { requestCategories, allRequests } from '../../../shared/services/RequestData';

const RequestManagement = () => {
  const [activeCategory, setActiveCategory] = useState('personal');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [workflowFilter, setWorkflowFilter] = useState('All Workflows');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const [requestHistory, setRequestHistory] = useState([]);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [charCount, setCharCount] = useState({});
  const filteredRequests = allRequests.filter(req => req.category === activeCategory);

  const filteredHistory = requestHistory.filter(req => {
    const matchesSearch = searchTerm === '' ||
      req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;

    let matchesDate = true;
    if (fromDate || toDate) {
      const reqDateStr = req.submittedDate.split(' ')[0];
      const reqDate = new Date(reqDateStr);

      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        matchesDate = reqDate >= from && reqDate <= to;
      } else if (fromDate) {
        const from = new Date(fromDate);
        matchesDate = reqDate >= from;
      } else if (toDate) {
        const to = new Date(toDate);
        matchesDate = reqDate <= to;
      }
    }

    const matchesLocation = locationFilter === 'All Locations' || req.location === locationFilter;
    const matchesWorkflow = workflowFilter === 'All Workflows' || req.workflow === workflowFilter;
    const matchesStatus2 = statusFilter === 'All Status' || req.status === statusFilter;

    return matchesSearch && matchesStatus && matchesDate && matchesLocation && matchesWorkflow && matchesStatus2;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
      'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
      'Approved': 'bg-green-50 text-green-700 border-green-200',
      'Rejected': 'bg-red-50 text-red-700 border-red-200',
      'Completed': 'bg-slate-50 text-slate-700 border-slate-200'
    };
    const classes = statusConfig[status] || statusConfig['Submitted'];
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${classes}`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'high': 'bg-red-50 text-red-700 border-red-200',
      'medium': 'bg-amber-50 text-amber-700 border-amber-200',
      'low': 'bg-green-50 text-green-700 border-green-200'
    };
    const classes = priorityConfig[priority] || priorityConfig['medium'];
    return <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${classes}`}>{priority}</span>;
  };

  const handleQuickAction = (requestName, prefillData = {}) => {
    const request = allRequests.find(r => r.name === requestName);
    if (request) {
      setSelectedRequest(request);
      setShowRequestModal(true);
      setFormData(prefillData);
      setFormErrors({});
      setCharCount({});
    }
  };

  const handleFormChange = (fieldName, value, maxLength) => {
    if (maxLength && typeof value === 'string') {
      setCharCount(prev => ({ ...prev, [fieldName]: value.length }));
      if (value.length > maxLength) value = value.substring(0, maxLength);
    }

    setFormData({ ...formData, [fieldName]: value });
    if (formErrors[fieldName]) setFormErrors({ ...formErrors, [fieldName]: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedRequest) return errors;

    selectedRequest.fields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[field.name] = `${field.label} is required`;
        }
        if (field.maxLength && value && value.length > field.maxLength) {
          errors[field.name] = `Maximum ${field.maxLength} characters allowed`;
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const generatedDescription = selectedRequest.autoDescription
      ? selectedRequest.autoDescription(formData)
      : selectedRequest.description;

    const newRequest = {
      id: requestHistory.length + 1,
      requestId: `REQ-${1000 + requestHistory.length + 1}`,
      type: selectedRequest.name,
      category: selectedRequest.category,
      location: 'Hyderabad',
      workflow: 'Open',
      submittedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      status: 'Submitted',
      priority: selectedRequest.priority,
      description: generatedDescription,
      sla: selectedRequest.sla,
      approvers: ['HR Department'],
      attachments: []
    };

    setRequestHistory([newRequest, ...requestHistory]);
    setShowRequestModal(false);
    setSelectedRequest(null);
    setFormData({});
    setFormErrors({});
    setCharCount({});
  };

  const getStats = () => {
    return {
      total: requestHistory.length,
      submitted: requestHistory.filter(req => req.status === 'Submitted').length,
      inProgress: requestHistory.filter(req => req.status === 'In Progress').length,
      approved: requestHistory.filter(req => req.status === 'Approved').length,
      completed: requestHistory.filter(req => req.status === 'Completed').length
    };
  };

  const stats = getStats();

  const getGeneratedDescription = () => {
    if (!selectedRequest?.autoDescription) return selectedRequest?.description;
    try {
      const safeData = { ...formData };
      selectedRequest.fields.forEach(field => {
        if (!safeData[field.name]) safeData[field.name] = `[${field.label}]`;
      });
      return selectedRequest.autoDescription(safeData);
    } catch {
      return selectedRequest.description;
    }
  };

  const renderFormField = (field) => {
    const fieldValue = formData[field.name] || '';
    const baseClasses = `w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors[field.name] ? 'border-red-500 bg-red-50' : 'border-slate-200'}`;

    switch (field.type) {
      case 'textarea':
        return (
          <div>
            <textarea
              className={baseClasses}
              rows={field.maxLength > 200 ? 4 : 3}
              value={fieldValue}
              onChange={(e) => handleFormChange(field.name, e.target.value, field.maxLength)}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
            {field.maxLength && (
              <div className="text-right mt-1">
                <span className={`text-xs ${charCount[field.name] > field.maxLength * 0.9 ? 'text-amber-500 font-medium' : 'text-slate-400'}`}>
                  {charCount[field.name] || 0}/{field.maxLength}
                </span>
              </div>
            )}
            {formErrors[field.name] && <p className="text-red-500 text-xs mt-1">{formErrors[field.name]}</p>}
          </div>
        );
      case 'select':
        return (
          <select className={baseClasses} value={fieldValue} onChange={(e) => handleFormChange(field.name, e.target.value)}>
            <option value="">Select {field.label}</option>
            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      case 'multiselect':
        return (
          <select className={baseClasses} multiple value={Array.isArray(fieldValue) ? fieldValue : []} onChange={(e) => handleFormChange(field.name, Array.from(e.target.selectedOptions, o => o.value))} style={{ height: '100px' }}>
            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      case 'radio':
        return (
          <div className="flex gap-4">
            {field.options.map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="radio" className="text-blue-600 focus:ring-blue-500" name={field.name} value={opt} checked={fieldValue === opt} onChange={(e) => handleFormChange(field.name, e.target.value)} />
                {opt}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" checked={fieldValue || false} onChange={(e) => handleFormChange(field.name, e.target.checked)} />
            {field.label}
          </label>
        );
      case 'file':
        return (
          <div>
            <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => handleFormChange(field.name, e.target.files[0])} />
            <p className="text-xs text-slate-400 mt-1">Max 10MB, PDF, JPG, PNG, DOC formats</p>
          </div>
        );
      default:
        return (
          <input type={field.type} className={baseClasses} value={fieldValue} onChange={(e) => handleFormChange(field.name, e.target.value, field.maxLength)} maxLength={field.maxLength} max={field.max} min={field.min} placeholder={`Enter ${field.label.toLowerCase()}`} />
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Icon icon="heroicons:inbox-stack" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Request Management</h1>
            <p className="text-sm text-slate-500">Submit and track requests with auto-generated descriptions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-slate-50 transition" onClick={() => setShowGuideModal(true)}>
            <Icon icon="heroicons:question-mark-circle" className="w-5 h-5" /> Quick Guide
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition" onClick={() => { if (filteredRequests.length > 0) handleQuickAction(filteredRequests[0].name); }}>
            <Icon icon="heroicons:plus-circle" className="w-5 h-5" /> New Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Requests"
          value={stats.total}
          icon="heroicons:rectangle-stack"
          color="blue"
          subtitle="All time requests"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon="heroicons:clock"
          color="yellow"
          subtitle="Currently active"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon="heroicons:check-circle"
          color="green"
          subtitle="Successfully processed"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon="heroicons:check-badge"
          color="slate"
          subtitle="Closed requests"
        />
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
        {Object.entries(requestCategories).map(([key, category]) => (
          <button key={key} onClick={() => setActiveCategory(key)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeCategory === key ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'}`}>
            <Icon icon={category.icon} className="w-4 h-4" /> {category.title}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Icon icon={requestCategories[activeCategory].icon} className="text-slate-400" />
            {requestCategories[activeCategory].title} Requests
          </h2>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{filteredRequests.length} Available</span>
        </div>
        <div className="p-6">
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredRequests.map(request => (
                <div key={request.id} onClick={() => handleQuickAction(request.name)} className="border border-slate-200 rounded-xl p-3.5 cursor-pointer hover:border-blue-300 hover:shadow-sm transition bg-white group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg ${requestCategories[activeCategory].color} bg-opacity-10 group-hover:bg-opacity-20 transition shrink-0`}>
                        <Icon icon={request.icon} className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-slate-800 text-sm leading-tight">{request.name}</h3>
                    </div>
                    {getPriorityBadge(request.priority)}
                  </div>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-1">{request.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-2.5 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1"><Icon icon="heroicons:clock" className="w-3.5 h-3.5" /> {request.sla}</span>
                    <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1"><Icon icon="heroicons:sparkles" className="w-3.5 h-3.5" /> Auto-fill</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon icon="heroicons:inbox" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-600 font-medium">No requests available in this category</h3>
              <p className="text-sm text-slate-400">Select a different category to view options</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:clipboard-document-list" className="text-slate-400" />
            Request History
          </h2>
          <div className="relative w-full md:w-64">
            <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search requests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
            <select className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option>All Locations</option><option>Hyderabad</option><option>Bangalore</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option><option value="Submitted">Submitted</option><option value="Approved">Approved</option>
            </select>
          </div>
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">From Date</label>
              <input type="date" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">To Date</label>
              <input type="date" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                <th className="px-6 py-3 font-semibold">Request ID</th>
                <th className="px-6 py-3 font-semibold">Category / Type</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length > 0 ? filteredHistory.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3 font-medium text-blue-600 text-sm">{req.requestId}</td>
                  <td className="px-6 py-3">
                    <div className="text-sm font-semibold text-slate-800">{req.type}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Icon icon={requestCategories[req.category]?.icon} className="w-3 h-3" />
                      {requestCategories[req.category]?.title}
                    </div>
                  </td>
                  <td className="px-6 py-3">{getStatusBadge(req.status)}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{req.submittedDate}</td>
                  <td className="px-6 py-3 text-sm text-slate-500 max-w-[200px] truncate" title={req.description}>{req.description}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">No request history found matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Icon icon="heroicons:bolt" className="text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <button onClick={() => handleQuickAction('Bank Account Change')} className="p-3 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition text-center group">
            <Icon icon="heroicons:building-library" className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-blue-600 transition" />
            <span className="text-xs font-semibold text-slate-700 block">Bank Change</span>
          </button>
          <button onClick={() => {
            const today = new Date(); const next = new Date(); next.setDate(today.getDate() + 7);
            handleQuickAction('Work-from-Home Request', { wfhStartDate: today.toISOString().split('T')[0], wfhEndDate: next.toISOString().split('T')[0] })
          }} className="p-3 border border-slate-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition text-center group">
            <Icon icon="heroicons:home" className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-emerald-600 transition" />
            <span className="text-xs font-semibold text-slate-700 block">WFH Request</span>
          </button>
          <button onClick={() => handleQuickAction('Reimbursement Claim')} className="p-3 border border-slate-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition text-center group">
            <Icon icon="heroicons:receipt-refund" className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-purple-600 transition" />
            <span className="text-xs font-semibold text-slate-700 block">Reimbursement</span>
          </button>
          <button onClick={() => handleQuickAction('Software Access')} className="p-3 border border-slate-200 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition text-center group">
            <Icon icon="heroicons:computer-desktop" className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-teal-600 transition" />
            <span className="text-xs font-semibold text-slate-700 block">IT Request</span>
          </button>
          <button onClick={() => handleQuickAction('General Feedback')} className="p-3 border border-slate-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition text-center group">
            <Icon icon="heroicons:chat-bubble-bottom-center-text" className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-orange-600 transition" />
            <span className="text-xs font-semibold text-slate-700 block">Feedback</span>
          </button>
          <button onClick={() => setShowGuideModal(true)} className="p-3 border border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-100 transition text-center group">
            <Icon icon="heroicons:question-mark-circle" className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-slate-700 transition" />
            <span className="text-xs font-semibold text-slate-700 block">Help Guide</span>
          </button>
        </div>
      </div>

      <Modal isOpen={showRequestModal} onClose={() => { setShowRequestModal(false); setFormData({}); setFormErrors({}); }} title={selectedRequest ? selectedRequest.name : ''} size="lg">
        {selectedRequest && (
          <div className="p-2">
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6">
              <div className="flex flex-wrap gap-6 mb-3">
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">Category</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Icon icon={requestCategories[selectedRequest.category].icon} className="text-blue-600" />
                    {requestCategories[selectedRequest.category].title}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">Priority</span>
                  {getPriorityBadge(selectedRequest.priority)}
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">SLA</span>
                  <span className="text-sm font-bold text-slate-800">{selectedRequest.sla}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 border-t border-blue-100 pt-3">{selectedRequest.description}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 relative">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                <Icon icon="heroicons:sparkles" className="text-blue-600" /> Auto-Generated Description Preview
              </h4>
              <p className="text-sm text-slate-700 italic">{getGeneratedDescription()}</p>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRequest.fields.map(field => (
                  <div key={field.name} className={field.type === 'textarea' || field.type === 'file' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>
              <div className="pt-6 mt-6 border-t border-slate-200 flex justify-end gap-3 md:gap-2 flex-col md:flex-row">
                <button type="button" onClick={() => setShowRequestModal(false)} className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700">
                  <Icon icon="heroicons:paper-airplane" /> Submit Request
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      <Modal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} title="Quick Guide" size="md">
        <div className="p-2 space-y-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Icon icon="heroicons:information-circle" className="w-5 h-5" /> How Auto-Description Works
            </h4>
            <p className="text-sm text-blue-800">
              When you fill out any request form, a standardized, professional description is automatically generated from your inputs. This ensures consistency and clarity for all approvers.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Icon icon="heroicons:bolt" className="text-amber-500" /> Quick Actions
            </h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li><strong className="text-slate-800">Bank Change:</strong> Automatically focuses the required form.</li>
              <li><strong className="text-slate-800">WFH Request:</strong> Pre-fills with next week's dates instantly.</li>
              <li><strong className="text-slate-800">IT & Feedback:</strong> Bypasses category navigation.</li>
            </ul>
          </div>
          <div className="pt-4 border-t border-slate-200 text-right">
            <button onClick={() => setShowGuideModal(false)} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl">Got it!</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RequestManagement;