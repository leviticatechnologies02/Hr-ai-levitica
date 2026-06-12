import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEye,
  FiSend,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiDollarSign,
  FiBriefcase,
  FiClock,
  FiX,
  FiPlus,
  FiFileText,
  FiCalendar,
  FiTag,
  FiUsers,
  FiAward
} from 'react-icons/fi';
import { BASE_URL, API_ENDPOINTS } from "../../../shared/constants/api.config";

const CreateJob = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = location.state?.editMode || false;
  const existingJobData = location.state?.jobData || null;

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    customDepartment: '',
    employmentType: '',
    location: '',
    isRemote: false,
    description: '',
    responsibilities: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    benefits: [],
    skills: [],
    expiryDate: '',
    referenceId: '',
    jdFile: null
  });

  useEffect(() => {
    if (isEditMode && existingJobData) {
      setFormData({
        title: existingJobData.title || '',
        department: existingJobData.department || '',
        customDepartment: '',
        employmentType: existingJobData.employment_type || '',
        location: existingJobData.location || '',
        isRemote: existingJobData.is_remote || false,
        description: existingJobData.description || '',
        responsibilities: existingJobData.responsibilities || '',
        requirements: existingJobData.requirements || '',
        salaryMin: existingJobData.salary_min || '',
        salaryMax: existingJobData.salary_max || '',
        currency: existingJobData.currency || 'Rupees',
        benefits: existingJobData.benefits || [],
        skills: existingJobData.skills || [],
        expiryDate: existingJobData.expiry_date || '',
        referenceId: existingJobData.reference_id || '',
        jdFile: null
      });
    }
  }, [isEditMode, existingJobData]);

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Customer Success', 'Design', 'Product', "Other"];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD','Rupees'];
  const benefitOptions = ['Health Insurance', 'Dental Insurance', 'Vision Insurance', '401k Match', 'Remote Work', 'Flexible Hours', 'PTO', 'Stock Options', 'Gym Membership', 'Learning Budget'];
  const skillSuggestions = ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Project Management', 'Leadership', 'Communication', 'Analytics', 'AWS', 'Docker', 'Project Management', 'Leadership', 'Data-Analytics', 'Other'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSkillAdd = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleSkillRemove = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleBenefitToggle = (benefit) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
    if (!formData.location.trim() && !formData.isRemote) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (asDraft = false) => {
    setServerError(null);
    if (!asDraft && !validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setServerError('You must be logged in to create a job. Please login first.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditMode && existingJobData) {
        const params = new URLSearchParams();
        params.append('title', formData.title);
        params.append('department', formData.department);
        params.append('employment_type', formData.employmentType);
        params.append('description', formData.description);
        params.append('is_remote', String(formData.isRemote));
        params.append('currency', formData.currency);
        params.append('status', asDraft ? 'Draft' : 'Active');

        if (formData.location && formData.location.trim()) params.append('location', formData.location);
        if (formData.responsibilities && formData.responsibilities.trim()) params.append('responsibilities', formData.responsibilities);
        if (formData.requirements && formData.requirements.trim()) params.append('requirements', formData.requirements);
        if (formData.salaryMin && formData.salaryMin !== '') params.append('salary_min', formData.salaryMin);
        if (formData.salaryMax && formData.salaryMax !== '') params.append('salary_max', formData.salaryMax);
        if (formData.expiryDate) params.append('expiry_date', formData.expiryDate);
        if (formData.referenceId && formData.referenceId.trim()) params.append('reference_id', formData.referenceId);

        formData.benefits.forEach(benefit => params.append('benefits', benefit));
        formData.skills.forEach(skill => params.append('skills', skill));

        const url = `${BASE_URL}${API_ENDPOINTS.JOBS.UPDATE(existingJobData.id)}?${params.toString()}`;

        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 401) {
            setServerError('Session expired. Please login again.');
            setTimeout(() => navigate('/login'), 2000);
            return;
          }
          throw new Error('Failed to update job');
        }

        setIsDraft(asDraft);
        setShowSuccessModal(true);
        setTimeout(() => navigate('/jobslist'), 2000);
      } else {
        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('department', formData.department);
        payload.append('employmentType', formData.employmentType);
        payload.append('description', formData.description);
        if (formData.location && formData.location.trim()) payload.append('location', formData.location);
        if (formData.responsibilities && formData.responsibilities.trim()) payload.append('responsibilities', formData.responsibilities);
        if (formData.requirements && formData.requirements.trim()) payload.append('requirements', formData.requirements);
        if (formData.referenceId && formData.referenceId.trim()) payload.append('referenceId', formData.referenceId);
        if (formData.expiryDate) payload.append('expiryDate', formData.expiryDate);
        payload.append('isRemote', String(formData.isRemote));
        if (formData.salaryMin && formData.salaryMin !== '') payload.append('salaryMin', formData.salaryMin);
        if (formData.salaryMax && formData.salaryMax !== '') payload.append('salaryMax', formData.salaryMax);
        payload.append('currency', formData.currency);
        payload.append('status', asDraft ? 'Draft' : 'Active');
        payload.append('benefits', JSON.stringify(formData.benefits));
        payload.append('skills', JSON.stringify(formData.skills));
        if (formData.jdFile) payload.append('jdFile', formData.jdFile);

        const url = `${BASE_URL}${API_ENDPOINTS.JOBS.CREATE}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: payload
        });

        if (!res.ok) {
          if (res.status === 401) {
            setServerError('Session expired. Please login again.');
            setTimeout(() => navigate('/login'), 2000);
            return;
          }
          if (res.status === 403) {
            setServerError('You do not have permission to create jobs.');
            return;
          }
          throw new Error('Failed to create job');
        }

        setIsDraft(asDraft);
        setShowSuccessModal(true);
        setTimeout(() => navigate('/jobslist'), 2000);
      }
    } catch (err) {
      setServerError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} job. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const JobPreview = () => (
    <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-6">
      <div className="mb-6">
        <h5 className="text-lg font-bold text-midnight_text mb-3">{formData.title || 'Job Title'}</h5>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
            <FiBriefcase className="h-4 w-4" /> {formData.department || 'Department'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
            <FiMapPin className="h-4 w-4" /> {formData.isRemote ? 'Remote' : formData.location || 'Location'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
            <FiClock className="h-4 w-4" /> {formData.employmentType || 'Employment Type'}
          </span>
        </div>
      </div>

      {(formData.salaryMin || formData.salaryMax) && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2 text-emerald-700">
            <FiDollarSign className="h-4 w-4" />
            <span className="font-medium">{formData.currency} {formData.salaryMin || '0'} - {formData.salaryMax || '0'} per year</span>
          </div>
        </div>
      )}

      {formData.description && (
        <div className="mb-6">
          <h6 className="text-sm font-semibold text-midnight_text mb-2">About This Role</h6>
          <p className="text-sm text-gray-600 whitespace-pre-line">{formData.description}</p>
        </div>
      )}

      {formData.responsibilities && (
        <div className="mb-6">
          <h6 className="text-sm font-semibold text-midnight_text mb-2">Responsibilities</h6>
          <p className="text-sm text-gray-600 whitespace-pre-line">{formData.responsibilities}</p>
        </div>
      )}

      {formData.requirements && (
        <div className="mb-6">
          <h6 className="text-sm font-semibold text-midnight_text mb-2">Requirements</h6>
          <p className="text-sm text-gray-600 whitespace-pre-line">{formData.requirements}</p>
        </div>
      )}

      {formData.skills.length > 0 && (
        <div className="mb-6">
          <h6 className="text-sm font-semibold text-midnight_text mb-2">Required Skills</h6>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span key={skill} className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {formData.benefits.length > 0 && (
        <div className="mb-6">
          <h6 className="text-sm font-semibold text-midnight_text mb-2">Benefits</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {formData.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm text-gray-600">
                <FiCheckCircle className="h-3.5 w-3.5 text-emerald-500" /> {benefit}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="">
      <div className=" mx-auto space-y-6">
        <div>
          <Link to="/jobslist" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm font-medium">
            <FiArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-midnight_text flex items-center gap-2">
            <FiBriefcase className="text-gray-600 text-2xl" />
            {isEditMode ? 'Edit Job' : 'Post a New Job'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEditMode ? 'Update the job details below and save your changes.' : 'Fill in the details below to publish your job listing.'}
          </p>
        </div>

        <form className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-6">
            <h4 className="text-base font-semibold text-midnight_text mb-4">Basic Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.title ? 'border-rose-500 bg-rose-50' : 'border-gray-200'}`}
                  placeholder="e.g. Senior Software Engineer"
                />
                {errors.title && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><FiAlertCircle className="h-3 w-3" /> {errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-rose-500">*</span></label>
                {formData.department === 'Other' ? (
                  <input
                    type="text"
                    placeholder="Enter Department"
                    value={formData.customDepartment}
                    onChange={(e) => handleInputChange('customDepartment', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.department ? 'border-rose-500' : 'border-gray-200'}`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                )}
                {errors.department && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><FiAlertCircle className="h-3 w-3" /> {errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type <span className="text-rose-500">*</span></label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.employmentType ? 'border-rose-500' : 'border-gray-200'}`}
                >
                  <option value="">Select Type</option>
                  {employmentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                {errors.employmentType && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><FiAlertCircle className="h-3 w-3" /> {errors.employmentType}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Location {!formData.isRemote && <span className="text-rose-500">*</span>}</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${formData.isRemote ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                      {formData.isRemote && <FiCheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-700">Remote</span>
                    <input type="checkbox" className="hidden" checked={formData.isRemote} onChange={(e) => handleInputChange('isRemote', e.target.checked)} />
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.location ? 'border-rose-500' : 'border-gray-200'} ${formData.isRemote ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="e.g. Hyderabad, India"
                  disabled={formData.isRemote}
                />
                {errors.location && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><FiAlertCircle className="h-3 w-3" /> {errors.location}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-6">
            <h4 className="text-base font-semibold text-midnight_text mb-4">Job Details</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description <span className="text-rose-500">*</span></label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.description ? 'border-rose-500' : 'border-gray-200'}`}
                  placeholder="Describe the role, what the candidate will be doing, and what makes this opportunity exciting..."
                />
                {errors.description && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><FiAlertCircle className="h-3 w-3" /> {errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Responsibilities</label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="List the main responsibilities and duties for this role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements & Qualifications</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="List the required skills, experience, and qualifications..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-6">
            <h4 className="text-base font-semibold text-midnight_text mb-4">Compensation & Benefits</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="80000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {benefitOptions.map((benefit) => (
                    <label key={benefit} className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${formData.benefits.includes(benefit) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                        {formData.benefits.includes(benefit) && <FiCheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                      <input type="checkbox" className="hidden" checked={formData.benefits.includes(benefit)} onChange={() => handleBenefitToggle(benefit)} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-6">
            <h4 className="text-base font-semibold text-midnight_text mb-4">Skills & Keywords</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skillSuggestions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillAdd(skill)}
                    disabled={formData.skills.includes(skill)}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiPlus className="h-3 w-3 inline mr-1" /> {skill}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                    {skill}
                    <button type="button" onClick={() => handleSkillRemove(skill)} className="hover:text-rose-500">
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-6">
            <h4 className="text-base font-semibold text-midnight_text mb-4">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="w-full px-2 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Reference ID</label>
                <input
                  type="text"
                  value={formData.referenceId}
                  onChange={(e) => handleInputChange('referenceId', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. ENG-2025-001"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-6">
            <h4 className="text-base font-semibold text-midnight_text mb-4">Attachments</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload JD Document (PDF/DOC/DOCX)</label>
              <input
                type="file"
                className="w-full px-2 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleInputChange('jdFile', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              />
              {formData.jdFile && <p className="text-xs text-gray-500 mt-1">Selected: {formData.jdFile.name}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-100 w-full">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:border-primary transition-all disabled:opacity-50 w-full sm:w-auto"
            >
              <FiSave className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:border-primary transition-all disabled:opacity-50 w-full sm:w-auto"
            >
              <FiEye className="h-4 w-4" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 w-full sm:w-auto"
            >
              <FiSend className="h-4 w-4" />
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Job' : 'Publish Job')}
            </button>
          </div>

          {serverError && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700">
              <FiAlertCircle className="h-5 w-5 text-rose-500" />
              <span className="text-sm flex-1">{serverError}</span>
            </div>
          )}
        </form>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-deatail_shadow" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Preview</p>
                <h5 className="text-lg font-bold text-midnight_text">Job Preview</h5>
              </div>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <JobPreview />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-deatail_shadow text-center p-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-midnight_text mb-2">
              {isEditMode ? (isDraft ? 'Draft Saved!' : 'Job Updated Successfully!') : (isDraft ? 'Draft Saved!' : 'Job Posted Successfully!')}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {isEditMode
                ? (isDraft ? 'Your job draft has been saved. You can continue editing it later.' : 'Your job changes have been saved successfully.')
                : (isDraft ? 'Your job draft has been saved. You can continue editing it later.' : 'Your job listing is now live and candidates can apply.')}
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowSuccessModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                {isDraft ? 'Continue Editing' : 'Post Another Job'}
              </button>
              <button onClick={() => setShowSuccessModal(false)} className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all">
                {isDraft ? 'Go to Drafts' : 'View Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateJob;