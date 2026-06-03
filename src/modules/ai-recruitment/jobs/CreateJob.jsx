import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import { X, MapPin, DollarSign, Building2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { BASE_URL, API_ENDPOINTS } from "../../../shared/constants/api.config";

const CreateJob = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in edit mode
  const isEditMode = location.state?.editMode || false;
  const existingJobData = location.state?.jobData || null;

  const [formData, setFormData] = useState({
    title: '',
    department: '',
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

  

  // Pre-fill form if in edit mode
  useEffect(() => {
    if (isEditMode && existingJobData) {
      console.log('📝 Edit mode - Pre-filling form with:', existingJobData);

      setFormData({
        title: existingJobData.title || '',
        department: existingJobData.department || '',
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
        jdFile: null // File can't be pre-filled
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
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  const benefitOptions = ['Health Insurance', 'Dental Insurance', 'Vision Insurance', '401k Match', 'Remote Work', 'Flexible Hours', 'PTO', 'Stock Options', 'Gym Membership', 'Learning Budget'];
  const skillSuggestions = ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Project Management', 'Leadership', 'Communication', 'Analytics', 'Other'];

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

    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setServerError('You must be logged in to create a job. Please login first.');
      return;
    }

    try {
      setIsSubmitting(true);

      console.log('=== FORM SUBMISSION DATA ===');
      console.log('Mode:', isEditMode ? 'Update' : 'Create');
      console.log('Submission Type:', asDraft ? 'Draft' : 'Publish');
      console.log('Form Data:', formData);
      console.log('============================');

      if (isEditMode && existingJobData) {
        // UPDATE MODE - Build query parameters
        const params = new URLSearchParams();

        // Add all fields as query parameters
        params.append('title', formData.title);
        params.append('department', formData.department);
        params.append('employment_type', formData.employmentType);
        params.append('description', formData.description);
        params.append('is_remote', String(formData.isRemote));
        params.append('currency', formData.currency);
        params.append('status', asDraft ? 'Draft' : 'Active');

        // Optional fields - only add if not empty
        if (formData.location && formData.location.trim()) {
          params.append('location', formData.location);
        }
        if (formData.responsibilities && formData.responsibilities.trim()) {
          params.append('responsibilities', formData.responsibilities);
        }
        if (formData.requirements && formData.requirements.trim()) {
          params.append('requirements', formData.requirements);
        }
        if (formData.salaryMin && formData.salaryMin !== '') {
          params.append('salary_min', formData.salaryMin);
        }
        if (formData.salaryMax && formData.salaryMax !== '') {
          params.append('salary_max', formData.salaryMax);
        }
        if (formData.expiryDate) {
          params.append('expiry_date', formData.expiryDate);
        }
        if (formData.referenceId && formData.referenceId.trim()) {
          params.append('reference_id', formData.referenceId);
        }

        // Arrays - FastAPI accepts JSON arrays as query params
        if (formData.benefits && formData.benefits.length > 0) {
          formData.benefits.forEach(benefit => {
            params.append('benefits', benefit);
          });
        }
        if (formData.skills && formData.skills.length > 0) {
          formData.skills.forEach(skill => {
            params.append('skills', skill);
          });
        }

        const baseUrl = `${BASE_URL}${API_ENDPOINTS.JOBS.UPDATE(existingJobData.id)}`;
        const url = `${baseUrl}?${params.toString()}`;

        console.log('📤 Updating job at:', url);
        console.log('📤 Query params:', params.toString());

        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const resText = await res.text();
        let resJson = null;
        try {
          resJson = JSON.parse(resText);
        } catch (e) {
          console.log('Response is not JSON:', resText);
        }

        if (!res.ok) {
          console.error('❌ Server error response:', res.status, resJson || resText);

          if (res.status === 401) {
            setServerError('Session expired. Please login again.');
            setTimeout(() => navigate('/login'), 2000);
            return;
          }

          if (res.status === 403) {
            setServerError('You do not have permission to update this job.');
            return;
          }

          if (res.status === 404) {
            setServerError('Job not found or you are not authorized to update it.');
            return;
          }

          const message = (resJson && (resJson.detail || resJson.message)) || res.statusText || resText || 'Server error';
          throw new Error(message);
        }

        console.log('✅ Job updated successfully:', resJson || resText);
        setIsDraft(asDraft);
        setShowSuccessModal(true);

        // Redirect to jobs list after 2 seconds
        setTimeout(() => {
          navigate('/jobslist');
        }, 2000);

      } else {
        // CREATE MODE - Use FormData
        const payload = new FormData();

        // Required fields
        payload.append('title', formData.title);
        payload.append('department', formData.department);
        payload.append('employmentType', formData.employmentType);
        payload.append('description', formData.description);

        // Optional string fields (only add if not empty)
        if (formData.location && formData.location.trim()) {
          payload.append('location', formData.location);
        }
        if (formData.responsibilities && formData.responsibilities.trim()) {
          payload.append('responsibilities', formData.responsibilities);
        }
        if (formData.requirements && formData.requirements.trim()) {
          payload.append('requirements', formData.requirements);
        }
        if (formData.referenceId && formData.referenceId.trim()) {
          payload.append('referenceId', formData.referenceId);
        }
        if (formData.expiryDate) {
          payload.append('expiryDate', formData.expiryDate);
        }

        // Boolean field - send as string 'true' or 'false'
        payload.append('isRemote', String(formData.isRemote));

        // Number fields (only add if not empty)
        if (formData.salaryMin && formData.salaryMin !== '') {
          payload.append('salaryMin', formData.salaryMin);
        }
        if (formData.salaryMax && formData.salaryMax !== '') {
          payload.append('salaryMax', formData.salaryMax);
        }

        // Currency (always send, has default)
        payload.append('currency', formData.currency);

        // Status
        payload.append('status', asDraft ? 'Draft' : 'Active');

        // Arrays: send as JSON strings
        payload.append('benefits', JSON.stringify(formData.benefits));
        payload.append('skills', JSON.stringify(formData.skills));

        // File upload
        if (formData.jdFile) {
          payload.append('jdFile', formData.jdFile);
        }

        // Build URL using config
        const url = `${BASE_URL}${API_ENDPOINTS.JOBS.CREATE}`;

        // Debug: Log what we're sending
        console.log('📤 Sending to:', url);
        console.log('📤 FormData contents:');
        for (let [key, value] of payload.entries()) {
          console.log(`  ${key}:`, value);
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}` // Add JWT token
            // Note: Don't set Content-Type for FormData - browser sets it automatically with boundary
          },
          body: payload,
        });

        const resText = await res.text();
        let resJson = null;
        try {
          resJson = JSON.parse(resText);
        } catch (e) {
          console.log('Response is not JSON:', resText);
        }

        if (!res.ok) {
          console.error('❌ Server error response:', res.status, resJson || resText);

          // Handle different error cases
          if (res.status === 401) {
            setServerError('Session expired. Please login again.');
            setTimeout(() => navigate('/login'), 2000);
            return;
          }

          if (res.status === 403) {
            setServerError('You do not have permission to create jobs. Only recruiters can create jobs.');
            return;
          }

          if (res.status === 422) {
            // Validation error - show detailed message
            let errorMsg = 'Validation failed: ';
            if (resJson && resJson.detail) {
              if (Array.isArray(resJson.detail)) {
                errorMsg += resJson.detail.map(err => `${err.loc?.join('.')} - ${err.msg}`).join(', ');
              } else {
                errorMsg += resJson.detail;
              }
            } else {
              errorMsg += 'Please check all fields are filled correctly.';
            }
            setServerError(errorMsg);
            return;
          }

          const message = (resJson && (resJson.detail || resJson.message)) || res.statusText || resText || 'Server error';
          throw new Error(message);
        }

        console.log('✅ Job created successfully:', resJson || resText);
        setIsDraft(asDraft);
        setShowSuccessModal(true);

        // Redirect to jobs list after 2 seconds
        setTimeout(() => {
          navigate('/jobslist');
        }, 2000);
      }

    } catch (err) {
      console.error('❌ Submit error:', err);
      setServerError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} job. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const JobPreview = () => (
    <div className='card border shadow-none'>
      <div className='card-body p-24'>
        <div className='mb-12'>
          <h5 className='mb-4'>{formData.title || 'Job Title'}</h5>
          <div className='job-preview-meta-cards'>
            <span className='job-preview-meta-card'>
              <Building2 size={16} className='icon' /> {formData.department || 'Department'}
            </span>
            <span className='job-preview-meta-card'>
              <MapPin size={16} className='icon' /> {formData.isRemote ? 'Remote' : formData.location || 'Location'}
            </span>
            <span className='job-preview-meta-card'>
              <Clock size={16} className='icon' /> {formData.employmentType || 'Employment Type'}
            </span>
          </div>
        </div>

        {(formData.salaryMin || formData.salaryMax) && (
          <div className='alert alert-success'>
            <div className='d-inline-flex align-items-center'>
              <DollarSign size={16} className='me-2' />
              <span className='fw-medium'>
                {formData.currency} {formData.salaryMin || '0'} - {formData.salaryMax || '0'} per year
              </span>
            </div>
          </div>
        )}

        {formData.description && (
          <div className='mb-12'>
            <h6 className='mb-4'>About This Role</h6>
            <p className='text-secondary-light' style={{ whiteSpace: 'pre-line' }}>{formData.description}</p>
          </div>
        )}

        {formData.responsibilities && (
          <div className='mb-12'>
            <h6 className='mb-4'>Responsibilities</h6>
            <p className='text-secondary-light' style={{ whiteSpace: 'pre-line' }}>{formData.responsibilities}</p>
          </div>
        )}

        {formData.requirements && (
          <div className='mb-12'>
            <h6 className='mb-4'>Requirements</h6>
            <p className='text-secondary-light' style={{ whiteSpace: 'pre-line' }}>{formData.requirements}</p>
          </div>
        )}

        {formData.skills.length > 0 && (
          <div className='mb-12'>
            <h6 className='mb-4'>Required Skills</h6>
            <div className='d-flex flex-wrap gap-2'>
              {formData.skills.map((skill) => (
                <span key={skill} className='badge bg-primary-50 text-primary-600 border rounded-pill'>{skill}</span>
              ))}
            </div>
          </div>
        )}

        {formData.benefits.length > 0 && (
          <div className='mb-12'>
            <h6 className='mb-4'>Benefits</h6>
            <div className='row g-2'>
              {formData.benefits.map((benefit) => (
                <div key={benefit} className='col-12 col-md-6 d-inline-flex align-items-center text-secondary-light'>
                  <CheckCircle size={14} className='text-success me-2' /> {benefit}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='container-fluid py-4'>
      {/* Top left: icon + page title (Create Job / Edit Job) */}
      <div className='mb-2'>
        <h4 className='fw-bold d-flex align-items-center gap-2 mb-0'>
          <Icon icon='solar:clipboard-list-outline' className='text-black' style={{ fontSize: 28 }} />
          {isEditMode ? 'Edit Job' : 'Post a New Job'}
        </h4>
      </div>
     
      <p className='text-secondary-light mb-4'>
        {isEditMode
          ? 'Update the job details below and save your changes.'
          : 'Fill in the details below to publish your job listing.'}
      </p>

      <div className='row g-3'>
        <div className='col-12'>
          <form className='create-job-form d-grid gap-3'>
            <div className='card border shadow-none'>
              <div className='card-body p-24'>
                <h4 className="fw-semibold fs-3 mb-0 text-dark">Basic Information</h4>
                <div className='row g-3 flex-wrap'>
                  <div className='col-12 col-lg-8'>
                    <label className='form-label'>Job Title <span className='text-danger'>*</span></label>
                    <input
                      type='text'
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      placeholder='e.g. Senior Software Engineer'
                    />
                    {errors.title && (
                      <div className='invalid-feedback d-inline-flex align-items-center'><AlertCircle size={14} className='me-1' /> {errors.title}</div>
                    )}
                  </div>

                  <div className='col-12 col-md-6 col-lg-4'>
                    <label className="form-label">Department <span className='text-danger'>*</span></label>

                    {formData.department === 'Other' ? (
                      // 👉 Input field when "Other" is selected
                      <input
                        type="text"
                        className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                        placeholder="Enter Department"
                        value={formData.customDepartment || ''}
                        onChange={(e) =>
                          handleInputChange('customDepartment', e.target.value)
                        }
                        onBlur={() =>
                          handleInputChange('department', formData.customDepartment)
                        }
                      />
                    ) : (
                      // 👉 Normal select dropdown
                      <select
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    )}

                    {errors.department && (
                      <div className="invalid-feedback d-inline-flex align-items-center">
                        <AlertCircle size={14} className="me-1" /> {errors.department}
                      </div>
                    )}
                  </div>


                  <div className='col-12 col-md-6 col-lg-4'>
                    <label className='form-label'>Employment Type <span className='text-danger'>*</span></label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => handleInputChange('employmentType', e.target.value)}
                      className={`form-select ${errors.employmentType ? 'is-invalid' : ''}`}
                    >
                      <option value=''>Select Type</option>
                      {employmentTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.employmentType && (
                      <div className='invalid-feedback d-inline-flex align-items-center'><AlertCircle size={14} className='me-1' /> {errors.employmentType}</div>
                    )}
                  </div>

                  <div className='col-12 col-lg-8'>
                    <div className='d-flex align-items-center justify-content-between flex-wrap gap-2'>
                      <label className='form-label mb-0'>Location {!formData.isRemote && <span className='text-danger'>*</span>}</label>
                      <label className={`custom-checkbox mb-0 ${formData.isRemote ? 'checked' : ''}`} style={{ cursor: 'pointer' }}>
                        <input type='checkbox' className='d-none' id='remote' checked={formData.isRemote} onChange={(e) => handleInputChange('isRemote', e.target.checked)} />
                        <span className='checkbox-box'>{formData.isRemote && <span className='checkmark'>✓</span>}</span>
                        <span className='checkbox-label'>Remote</span>
                      </label>
                    </div>
                    <input
                      type='text'
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                      placeholder='e.g. Hyderabad, India'
                      disabled={formData.isRemote}
                    />
                    {errors.location && (
                      <div className='invalid-feedback d-inline-flex align-items-center'><AlertCircle size={14} className='me-1' /> {errors.location}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='card border shadow-none'>
              <div className='card-body p-24'>
                <h4 className="fw-semibold fs-3 mb-0 text-dark">Job Details</h4>
                <div className='d-grid gap-3'>
                  <div className='row'>
                    <div className='col-12 col-lg-10'>
                      <label className='form-label'>Job Description <span className='text-danger'>*</span></label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={6}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        placeholder='Describe the role, what the candidate will be doing, and what makes this opportunity exciting...'
                      />
                      {errors.description && (
                        <div className='invalid-feedback d-inline-flex align-items-center'><AlertCircle size={14} className='me-1' /> {errors.description}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className='form-label'>Key Responsibilities</label>
                    <textarea
                      value={formData.responsibilities}
                      onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                      rows={4}
                      className='form-control'
                      placeholder='List the main responsibilities and duties for this role...'
                    />
                  </div>

                  <div>
                    <label className='form-label'>Requirements & Qualifications</label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      rows={4}
                      className='form-control'
                      placeholder='List the required skills, experience, and qualifications...'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='card border shadow-none'>
              <div className='card-body p-24'>
                <h4 className="fw-semibold fs-3 mb-0 text-dark">Compensation & Benefits</h4>
                <div className='d-grid gap-3'>
                  <div className='row g-3 flex-wrap'>
                    <div className='col-12 col-md-4'>
                      <label className='form-label'>Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className='form-select'
                      >
                        {currencies.map((currency) => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                    <div className='col-12 col-md-4'>
                      <label className='form-label'>Min Salary</label>
                      <input
                        type='number'
                        value={formData.salaryMin}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        className='form-control'
                        placeholder='50000'
                      />
                    </div>
                    <div className='col-12 col-md-4'>
                      <label className='form-label'>Max Salary</label>
                      <input
                        type='number'
                        value={formData.salaryMax}
                        onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                        className='form-control'
                        placeholder='80000'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='form-label'>Benefits</label>
                    <div className='row g-2 flex-wrap'>
                      {benefitOptions.map((benefit) => (
                        <div key={benefit} className='col-12 col-sm-6 col-md-4'>
                          <label
                            className={`custom-checkbox mb-0 py-1 ${formData.benefits.includes(benefit) ? 'checked' : ''}`}
                            style={{ cursor: 'pointer' }}
                          >
                            <input
                              type='checkbox'
                              className='d-none'
                              checked={formData.benefits.includes(benefit)}
                              onChange={() => handleBenefitToggle(benefit)}
                              id={`benefit-${benefit}`}
                            />
                            <span className='checkbox-box'>
                              {formData.benefits.includes(benefit) && <span className='checkmark'>✓</span>}
                            </span>
                            <span className='checkbox-label'>{benefit}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='card border shadow-none'>
              <div className='card-body p-24'>
                <h4 className="fw-semibold fs-3 mb-0 text-dark">Skills & Keywords</h4>
                <div>
                  <label className='form-label'>Required Skills</label>
                  <div className='mb-2 d-flex flex-wrap gap-2'>
                    {skillSuggestions.map((skill) => (
                      <button key={skill} type='button' onClick={() => handleSkillAdd(skill)} className='btn btn-light btn-sm rounded-pill' disabled={formData.skills.includes(skill)}>
                        + {skill}
                      </button>
                    ))}
                  </div>
                  <div className='d-flex flex-wrap gap-2'>
                    {formData.skills.map((skill) => (
                      <span key={skill} className='badge rounded-pill bg-primary-50 text-primary-600 border d-inline-flex align-items-center'>
                        {skill}
                        <button type='button' onClick={() => handleSkillRemove(skill)} className='btn btn-link btn-sm p-0 ms-2'>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='card border shadow-none'>
              <div className='card-body p-24'>
                <h6 className='mb-16'>Additional Information</h6>
                <div className='row g-3 flex-wrap'>
                  <div className='col-12 col-md-6'>
                    <label className='form-label'>Job Expiry Date</label>
                    <input
                      type='date'
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className='form-control'
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <label className='form-label'>Internal Reference ID</label>
                    <input
                      type='text'
                      value={formData.referenceId}
                      onChange={(e) => handleInputChange('referenceId', e.target.value)}
                      className='form-control'
                      placeholder='e.g. ENG-2025-001'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='card border shadow-none'>
              <div className='card-body p-24'>
                <h4 className="fw-semibold fs-3 mb-0 text-dark">Attachments</h4>
                <div>
                  <label className='form-label'>Upload JD Document (PDF/DOC/DOCX)</label>
                  <input
                    type='file'
                    className='form-control'
                    accept='.pdf,.doc,.docx'
                    onChange={(e) => handleInputChange('jdFile', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                  />
                  {formData.jdFile && (
                    <small className='text-secondary-light d-block mt-1'>Selected: {formData.jdFile.name}</small>
                  )}
                </div>
              </div>
            </div>

            {/* Action row: Back to Jobs (left) + Save as Draft, Preview, Publish Job (right) - below Attachments */}
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2'>
              <Link to='/jobslist' className='back-to-jobs-link'>
                <Icon icon='heroicons:arrow-left' style={{ width: 18, height: 18 }} />
                Back to Jobs
              </Link>
              <div className='d-flex flex-wrap gap-2'>
                <button
                  type='button'
                  onClick={() => handleSubmit(true)}
                  className='create-job-draft-btn'
                  disabled={isSubmitting}
                >
                  <Icon icon='heroicons:document' style={{ width: 16, height: 16 }} />
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Save as Draft' : 'Save as Draft')}
                </button>
                <button
                  type='button'
                  onClick={() => setShowPreview(true)}
                  className='create-job-preview-btn'
                  disabled={isSubmitting}
                >
                  <Icon icon='heroicons:eye' style={{ width: 16, height: 16 }} />
                  Preview
                </button>
                <button
                  type='button'
                  onClick={() => handleSubmit(false)}
                  className='create-job-submit-btn'
                  disabled={isSubmitting}
                >
                  <Icon icon='heroicons:paper-airplane' style={{ width: 16, height: 16 }} />
                  {isSubmitting ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Job' : 'Publish Job')}
                </button>
              </div>
            </div>

            {serverError && (
              <div className='pt-2'>
                <div className='alert alert-danger d-flex align-items-center' role='alert'>
                  <AlertCircle size={18} className='me-2' /> {serverError}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {showPreview && (
        <>
          <div className='modal-backdrop fade show' style={{ zIndex: 1045 }} />
          <div className='job-modal-overlay' tabIndex='-1' role='dialog' onClick={() => setShowPreview(false)}>
            <div className='job-modal-dialog job-modal-dialog-xl' role='document' onClick={e => e.stopPropagation()}>
              <div className='job-modal-content'>
                <div className='job-modal-header'>
                  <div>
                    <p className='job-modal-subtitle'>Preview</p>
                    <h5 className='job-modal-title mb-0'>Job Preview</h5>
                  </div>
                  <button type='button' className='job-modal-close' onClick={() => setShowPreview(false)} aria-label='Close'>&times;</button>
                </div>
                <div className='job-modal-body job-preview-modal-wrapper'>
                  <JobPreview />
                </div>
                <div className='job-modal-footer'>
                  <button type='button' className='job-btn-secondary' onClick={() => setShowPreview(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showSuccessModal && (
        <div className='hrms-modal-overlay' role='dialog' aria-modal='true'>
          <div className='hrms-modal hrms-modal-sm' role='document' onClick={e => e.stopPropagation()}>
            <div className='hrms-modal-body text-center p-24'>
              <div className='rounded-circle bg-success-subtle d-inline-flex align-items-center justify-content-center mb-16 w-64-px h-64-px'>
                <CheckCircle size={28} className='text-success' />
              </div>
              <h6 className='mb-4'>
                {isEditMode
                  ? (isDraft ? 'Draft Saved!' : 'Job Updated Successfully!')
                  : (isDraft ? 'Draft Saved!' : 'Job Posted Successfully!')}
              </h6>
              <p className='text-secondary-light mb-16'>
                {isEditMode
                  ? (isDraft
                    ? 'Your job draft has been saved. You can continue editing it later.'
                    : 'Your job changes have been saved successfully.')
                  : (isDraft
                    ? 'Your job draft has been saved. You can continue editing it later.'
                    : 'Your job listing is now live and candidates can apply.')}
              </p>
              <div className='d-flex justify-content-center gap-2'>
                <button type='button' className='btn btn-link' onClick={() => setShowSuccessModal(false)}>
                  {isDraft ? 'Continue Editing' : 'Post Another Job'}
                </button>
                <button type='button' className='btn btn-primary' onClick={() => setShowSuccessModal(false)}>
                  {isDraft ? 'Go to Drafts' : 'View Job'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateJob;
