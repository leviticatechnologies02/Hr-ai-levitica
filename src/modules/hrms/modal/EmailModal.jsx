import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const EmailModal = (props) => {
  const {
    employees = [],
    setEmployees = () => {},
    selectedEmployees = [],
    setSelectedEmployees = () => {},
    activeSection = '',
    setActiveSection = () => {},
    searchTerm = '',
    setSearchTerm = () => {},
    statusFilter = '',
    setStatusFilter = () => {},
    selectedRequest = null,
    setSelectedRequest = () => {},
    showRequestDetails = false,
    setShowRequestDetails = () => {},
    showEmailModal = false,
    setShowEmailModal = () => {},
    emailTemplate = '',
    setEmailTemplate = () => {},
    newRequestPhone = '',
    setNewRequestPhone = () => {},
    newRequestDepartment = '',
    setNewRequestDepartment = () => {},
    newRequestDesignation = '',
    setNewRequestDesignation = () => {},
    newRequestEmployeeId = '',
    setNewRequestEmployeeId = () => {},
    uploadedDocuments = [],
    setUploadedDocuments = () => {},
    emailUploads = [],
    setEmailUploads = () => {},
    emailUploadedDocuments = [],
    setEmailUploadedDocuments = () => {},
    isExperienced = false,
    setIsExperienced = () => {},
    yearsOfExperience = 0,
    setYearsOfExperience = () => {},
    currentOrganization = '',
    setCurrentOrganization = () => {},
    currentRole = '',
    setCurrentRole = () => {},
    employmentType = '',
    setEmploymentType = () => {},
    currentSalary = 0,
    setCurrentSalary = () => {},
    noticePeriod = '',
    setNoticePeriod = () => {},
    previousExperiences = [],
    setPreviousExperiences = () => {},
    globalUploadedDocuments = [],
    setGlobalUploadedDocuments = () => {},
    newRequestDob = '',
    setNewRequestDob = () => {},
    newRequestGender = '',
    setNewRequestGender = () => {},
    newRequestMaritalStatus = '',
    setNewRequestMaritalStatus = () => {},
    newRequestParentName = '',
    setNewRequestParentName = () => {},
    newRequestParentRelationship = '',
    setNewRequestParentRelationship = () => {},
    newRequestParentPhone = '',
    setNewRequestParentPhone = () => {},
    newRequestParentEmail = '',
    setNewRequestParentEmail = () => {},
    newRequestParentEmployment = '',
    setNewRequestParentEmployment = () => {},
    newRequestParentOrganization = '',
    setNewRequestParentOrganization = () => {},
    newRequestParentDesignation = '',
    setNewRequestParentDesignation = () => {},
    newRequestParentIncome = 0,
    setNewRequestParentIncome = () => {},
    newRequestParentAddress = '',
    setNewRequestParentAddress = () => {},
    newRequestIsGuardian = false,
    setNewRequestIsGuardian = () => {},
    educationQualifications = [],
    setEducationQualifications = () => {},
    showEducationForm = false,
    setShowEducationForm = () => {},
    editingEducation = null,
    setEditingEducation = () => {},
    educationLevel = '',
    setEducationLevel = () => {},
    schoolCollegeName = '',
    setSchoolCollegeName = () => {},
    boardUniversity = '',
    setBoardUniversity = () => {},
    passingYear = '',
    setPassingYear = () => {},
    joiningYear = '',
    setJoiningYear = () => {},
    degree = '',
    setDegree = () => {},
    branch = '',
    setBranch = () => {},
    percentage = '',
    setPercentage = () => {},
    cgpa = '',
    setCgpa = () => {},
    gradingSystem = '',
    setGradingSystem = () => {},
    experienceOrgName = '',
    setExperienceOrgName = () => {},
    experienceRole = '',
    setExperienceRole = () => {},
    experienceType = '',
    setExperienceType = () => {},
    experienceLocation = '',
    setExperienceLocation = () => {},
    experienceSalary = 0,
    setExperienceSalary = () => {},
    experienceJoiningDate = '',
    setExperienceJoiningDate = () => {},
    experienceRelievingDate = '',
    setExperienceRelievingDate = () => {},
    experienceHistory = [],
    setExperienceHistory = () => {},
    currentAddress = { address1: '', address2: '', country: '', state: '', district: '', city: '', pincode: '', nationality: '' },
    setCurrentAddress = () => {},
    permanentAddress = { address1: '', address2: '', country: '', state: '', district: '', city: '', pincode: '', nationality: '' },
    setPermanentAddress = () => {},
    sameAsCurrent = false,
    setSameAsCurrent = () => {},
    showDeleteModal = false,
    setShowDeleteModal = () => {},
    employeeToDelete = null,
    setEmployeeToDelete = () => {},
    deleting = false,
    setDeleting = () => {},
    editingEmployeeId = null,
    setEditingEmployeeId = () => {},
    editEmployeeName = '',
    setEditEmployeeName = () => {},
    editEmployeePhone = '',
    setEditEmployeePhone = () => {},
    editEmployeeEmail = '',
    setEditEmployeeEmail = () => {},
    editEmployeeDepartment = '',
    setEditEmployeeDepartment = () => {},
    editEmployeeDesignation = '',
    setEditEmployeeDesignation = () => {},
    editEmployeeId = '',
    setEditEmployeeId = () => {},
    emailSubject = '',
    setEmailSubject = () => {},
    documentRequests = [],
    setDocumentRequests = () => {},
    sendingEmail = false,
    setSendingEmail = () => {},
    emailStatus = { type: '', message: '' },
    setEmailStatus = () => {},
    emailMethod = 'api',
    setEmailMethod = () => {},
    ccEmails = '',
    setCcEmails = () => {},
    bccEmails = '',
    setBccEmails = () => {},
    showNewRequestModal = false,
    setShowNewRequestModal = () => {},
    newRequestEmail = '',
    setNewRequestEmail = () => {},
    newRequestName = '',
    setNewRequestName = () => {},
    newRequestTemplate = '',
    setNewRequestTemplate = () => {},
    newRequestSubject = '',
    setNewRequestSubject = () => {},
    handleNewRequest = () => {},
    handleSendEmail = () => {},
    getRequiredDocuments = () => [],
    handleDocumentUpload = () => {},
    handleReplaceDocumentClick = () => {},
    handleRemoveDocument = () => {},
    handleViewDocument = () => {},
    handleReuploadDocument = () => {},
    requiredDocuments = [],
    handleUpdateExistingDocument = () => {},
    handleSendNewRequest = () => {},
    handleSendBulkEmail = () => {},
    handleClearEmailUploads = () => {},
    handleEmailDocumentUpload = () => {},
    handleSelectEmployee = () => {},
    handleSelectAll = () => {},
    handleUpdateEmailDocument = () => {},
    handleConfirmSendEmail = () => {},
    handlePreviewDocument = () => {},
    handleUpdateDocument = () => {},
    handleEditEmployee = () => {},
    handleSaveEmployeeEdit = () => {},
    handleConfirmSendEmailWithEdits = () => {},
    handleDeleteEmployee = () => {},

    selectedEmployee = null,
    setSelectedEmployee = () => {},
    onSendEmail = () => {},
    employee = null,
    mode = 'document-requests'
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (mode === 'promotions') {
      if (onSendEmail) {
        onSendEmail({
          subject: emailSubject || '',
          message: emailTemplate || '',
          employee: selectedEmployee || employee
        });
      }
      setIsSubmitting(false);
      onClose();
    } else {
      if (handleConfirmSendEmailWithEdits) {
        handleConfirmSendEmailWithEdits();
      }
    }
  };

  const isOpen = mode === 'promotions' ? props.isOpen : showEmailModal;

  const handleClose = () => {
    if (mode === 'promotions') {
      if (props.onClose) props.onClose();
    } else {
      if (setShowEmailModal) setShowEmailModal(false);
    }
  };

  const getEmployee = () => {
    if (mode === 'promotions') {
      return selectedEmployee || employee;
    }
    return null;
  };

  const currentEmployee = getEmployee();

  const renderPromotionsMode = () => (
    <>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-4">
        <p className="text-sm text-blue-700">
          Sending email to <strong>{currentEmployee?.name}</strong> ({currentEmployee?.employeeId})
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Subject <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          value={emailSubject || ''}
          onChange={(e) => setEmailSubject ? setEmailSubject(e.target.value) : () => {}}
          placeholder="Email subject..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
          rows="8"
          value={emailTemplate || ''}
          onChange={(e) => setEmailTemplate ? setEmailTemplate(e.target.value) : () => {}}
          placeholder="Enter email content..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">CC</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={ccEmails || ''}
            onChange={(e) => setCcEmails ? setCcEmails(e.target.value) : () => {}}
            placeholder="cc@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">BCC</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={bccEmails || ''}
            onChange={(e) => setBccEmails ? setBccEmails(e.target.value) : () => {}}
            placeholder="bcc@example.com"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="notifyEmployee"
          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          defaultChecked
        />
        <label htmlFor="notifyEmployee" className="text-sm text-slate-700">
          Notify employee
        </label>
      </div>
    </>
  );

  if (mode === 'promotions') {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Send Email" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          {renderPromotionsMode()}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !emailTemplate || !emailSubject}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icon icon="heroicons:paper-airplane" className="w-4 h-4" />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={showEmailModal} 
      onClose={() => setShowEmailModal(false)} 
      title="Send Document Request Email" 
      size="xl"
    >
      {/* Email Status */}
      {emailStatus.message && (
        <div
          className={`alert alert-${emailStatus.type === "success" ? "success" : emailStatus.type === "error" ? "danger" : "info"} d-flex align-items-center mb-4`}
        >
          <Icon
            icon={
              emailStatus.type === "success"
                ? "heroicons:check-circle"
                : emailStatus.type === "error"
                  ? "heroicons:exclamation-circle"
                  : "heroicons:information-circle"
            }
            className="me-2 flex-shrink-0"
          />
          <div className="w-100">{emailStatus.message}</div>
        </div>
      )}

      {/* Recipients with Edit Option */}
      <div className="mb-4">
        <label className="form-label fw-semibold">To:</label>
        <div className="p-3 bg-light rounded">
          <div className="d-flex flex-wrap gap-2 mb-3">
            {employees
              .filter((emp) => selectedEmployees.includes(emp.id))
              .map((emp) => {
                const existingRequest = documentRequests.find(
                  (req) => req.employeeId === emp.id,
                );

                return (
                  <span
                    key={emp.id}
                    className="badge bg-primary d-flex align-items-center"
                  >
                    <Icon
                      icon="heroicons:user-circle"
                      className="me-1"
                    />
                    <span className="d-none d-sm-inline">
                      {emp.name}
                    </span>
                    <span
                      className="d-inline d-sm-none text-truncate"
                      style={{ maxWidth: "80px" }}
                    >
                      {emp.name.split(" ")[0]}
                    </span>
                    <small className="ms-1 opacity-75">
                      ({emp.email})
                    </small>
                    {existingRequest && (
                      <small className="ms-2 text-warning">
                        <Icon
                          icon="heroicons:document-text"
                          className="me-1"
                        />
                        Existing
                      </small>
                    )}
                    <button
                      type="button"
                      className="btn btn-link p-0 ms-2 text-white"
                      onClick={() => handleEditEmployee(emp)}
                      title="Edit Employee Details"
                    >
                      <Icon
                        icon="heroicons:pencil-square"
                        className="fs-6"
                      />
                    </button>
                  </span>
                );
              })}
          </div>

          {/* Edit Employee Form (shown when editing) */}
          {editingEmployeeId && (
            <div className="border rounded p-3 bg-white mt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-semibold">
                  <Icon
                    icon="heroicons:pencil-square"
                    className="me-2"
                  />
                  Edit Employee Details
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingEmployeeId(null)}
                />
              </div>

              <div className="row g-3">
                {/* Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editEmployeeName}
                    onChange={(e) =>
                      setEditEmployeeName(e.target.value)
                    }
                    placeholder="Enter employee name"
                    disabled={sendingEmail}
                  />
                </div>

                {/* Phone Number */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={editEmployeePhone}
                    onChange={(e) =>
                      setEditEmployeePhone(e.target.value)
                    }
                    placeholder="+91 98765 43210"
                    disabled={sendingEmail}
                  />
                </div>

                {/* Email */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Email ID <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={editEmployeeEmail}
                    onChange={(e) =>
                      setEditEmployeeEmail(e.target.value)
                    }
                    placeholder="Enter email address"
                    disabled={sendingEmail}
                  />
                </div>

                {/* Department */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Department{" "}
                  </label>
                  <select
                    className="form-select"
                    value={editEmployeeDepartment}
                    onChange={(e) =>
                      setEditEmployeeDepartment(e.target.value)
                    }
                    disabled={sendingEmail}
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="External">External</option>
                  </select>
                </div>

                {/* Designation */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Designation{" "}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editEmployeeDesignation}
                    onChange={(e) =>
                      setEditEmployeeDesignation(e.target.value)
                    }
                    placeholder="e.g., Software Engineer, Marketing Executive"
                    disabled={sendingEmail}
                  />
                </div>

                {/* Employee ID */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Employee ID{" "}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editEmployeeId}
                    onChange={(e) => setEditEmployeeId(e.target.value)}
                    placeholder="EMP001, CAND001, etc."
                    disabled={sendingEmail}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setEditingEmployeeId(null)}
                  disabled={sendingEmail}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={handleSaveEmployeeEdit}
                  disabled={
                    sendingEmail ||
                    !editEmployeeName.trim() ||
                    !editEmployeeEmail.trim()
                  }
                >
                  <Icon icon="heroicons:check" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Method */}
      <div className="mb-4">
        <label className="form-label fw-semibold">
          Email Sending Method:
        </label>
        <div className="btn-group w-100" role="group">
          {/* API */}
          <input
            type="radio"
            className="btn-check"
            name="emailMethod"
            id="method-api"
            value="api"
            checked={emailMethod === "api"}
            onChange={(e) => setEmailMethod(e.target.value)}
          />
          <label
            className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-1"
            htmlFor="method-api"
          >
            <Icon icon="heroicons:server" />
            <span>API Send</span>
          </label>

          {/* Clipboard */}
          <input
            type="radio"
            className="btn-check"
            name="emailMethod"
            id="method-clipboard"
            value="clipboard"
            checked={emailMethod === "clipboard"}
            onChange={(e) => setEmailMethod(e.target.value)}
          />
          <label
            className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-1"
            htmlFor="method-clipboard"
          >
            <Icon icon="heroicons:clipboard" />
            <span>Copy to Clipboard</span>
          </label>

          {/* Mailto */}
          <input
            type="radio"
            className="btn-check"
            name="emailMethod"
            id="method-mailto"
            value="mailto"
            checked={emailMethod === "mailto"}
            onChange={(e) => setEmailMethod(e.target.value)}
            disabled={selectedEmployees.length > 1}
          />
          <label
            className={`btn btn-outline-primary d-flex align-items-center justify-content-center gap-1 ${
              selectedEmployees.length > 1 ? "disabled" : ""
            }`}
            htmlFor="method-mailto"
          >
            <Icon icon="heroicons:envelope-open" />
            <span>Mailto (Single)</span>
          </label>
        </div>
      </div>

      {/* CC and BCC */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">
            CC (Optional):
          </label>
          <input
            type="text"
            className="form-control"
            value={ccEmails}
            onChange={(e) => setCcEmails(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
            disabled={emailMethod === "mailto" || sendingEmail}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">
            BCC (Optional):
          </label>
          <input
            type="text"
            className="form-control"
            value={bccEmails}
            onChange={(e) => setBccEmails(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
            disabled={emailMethod === "mailto" || sendingEmail}
          />
        </div>
      </div>

      {/* Subject */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Subject:</label>
        <input
          type="text"
          className="form-control"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          placeholder="Email subject..."
          disabled={sendingEmail}
        />
      </div>

      {/* Personal Information Section */}
      {selectedEmployees.length === 1 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-info bg-opacity-10 border-0">
            <h6 className="mb-0 fw-semibold d-flex align-items-center">
              <Icon icon="heroicons:user" className="me-2" />
              Personal Information 
            </h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Date of Birth */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Date of Birth</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestDob ? new Date(newRequestDob).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "Not specified"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Gender */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Gender</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestGender || "Not specified"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Marital Status */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Marital Status</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestMaritalStatus || "Not specified"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Education Qualification Section */}
      {selectedEmployees.length === 1 && educationQualifications && educationQualifications.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-info bg-opacity-10 border-0">
            <h6 className="mb-0 fw-semibold d-flex align-items-center">
              <Icon icon="heroicons:academic-cap" className="me-2" />
              Education Qualifications
            </h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Institution/Board</th>
                    <th>Degree/Branch</th>
                    <th>Year</th>
                    <th>Marks/CGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {educationQualifications
                    .sort((a, b) => {
                      const levelOrder = { '10th': 1, '12th': 2, 'diploma': 3, 'graduation': 4, 'post_graduation': 5, 'phd': 6, 'certification': 7 };
                      return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
                    })
                    .map((edu, idx) => (
                      <tr key={edu.id || idx}>
                        <td className="fw-medium align-middle">{edu.levelLabel || edu.level}</td>
                        <td>
                          {edu.institution}
                          {edu.boardUniversity && <div><small className="text-muted">{edu.boardUniversity}</small></div>}
                        </td>
                        <td>
                          {edu.degree && <div>{edu.degree}</div>}
                          {edu.branch && <small className="text-muted">{edu.branch}</small>}
                        </td>
                        <td>
                          {edu.passingYear}
                          {edu.joiningYear && <div><small className="text-muted">{edu.joiningYear} - {edu.passingYear}</small></div>}
                        </td>
                        <td>
                          {edu.percentage && <span className="badge bg-success bg-opacity-10 text-success p-2">{edu.percentage}%</span>}
                          {edu.cgpa && <span className="badge bg-info bg-opacity-10 text-info p-2">CGPA: {edu.cgpa}/10</span>}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Parent/Guardian Details Section */}
      {selectedEmployees.length === 1 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-primary bg-opacity-10 border-0">
            <h6 className="mb-0 fw-semibold d-flex align-items-center">
              <Icon icon="heroicons:users" className="me-2" />
              Parent / Guardian Details
            </h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Parent/Guardian Name */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Parent/Guardian Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestParentName || "Not specified"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Relationship */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Relationship</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestParentRelationship || "Not specified"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Parent/Guardian Phone */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestParentPhone || "Not specified"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Employment Status */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Employment Status</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestParentEmployment || "Not specified"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Organization */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Organization</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestParentOrganization || "Not specified"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Designation */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Designation</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestParentDesignation || "Not specified"}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Is Legal Guardian */}
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <Icon 
                    icon={newRequestIsGuardian ? "heroicons:check-circle" : "heroicons:minus-circle"} 
                    className={`me-2 ${newRequestIsGuardian ? "text-success" : "text-secondary"}`}
                  />
                  <span className={newRequestIsGuardian ? "fw-semibold" : "text-muted"}>
                    {newRequestIsGuardian ? "This person is the legal guardian" : "Not a legal guardian"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Details Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-primary bg-opacity-10 border-0">
          <h6 className="mb-0 fw-semibold d-flex align-items-center">
            <Icon icon="heroicons:map-pin" className="me-2" />
            Address Details
          </h6>
        </div>
        <div className="card-body">
          {/* CURRENT ADDRESS */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-semibold mb-0 d-flex align-items-center">
                <Icon icon="heroicons:home" className="me-2 text-primary" />
                Current Address
              </h6>
            </div>

            <div className="row g-3">
              {/* Address Line 1 */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Address Line 1 <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={currentAddress.address1}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      address1: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setPermanentAddress({
                        ...permanentAddress,
                        address1: e.target.value,
                      });
                    }
                  }}
                  placeholder="House/Flat No., Building Name, Street"
                  disabled={sendingEmail || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1}
                  style={selectedEmployees.length === 1 ? { backgroundColor: "#f8f9fa" } : {}}
                />
                {selectedEmployees.length === 1 && (
                  <small className="text-muted">
                    <Icon icon="heroicons:information-circle" className="me-1" />
                    Edit address in employee profile or create new request
                  </small>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Address Line 2 <span className="text-muted">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={currentAddress.address2}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      address2: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setPermanentAddress({
                        ...permanentAddress,
                        address2: e.target.value,
                      });
                    }
                  }}
                  placeholder="Area, Landmark, Colony"
                  disabled={sendingEmail || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1}
                  style={selectedEmployees.length === 1 ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* Country */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  Country <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={currentAddress.country}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      country: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setPermanentAddress({
                        ...permanentAddress,
                        country: e.target.value,
                      });
                    }
                  }}
                  disabled={sendingEmail || selectedEmployees.length > 1}
                  style={selectedEmployees.length === 1 ? { backgroundColor: "#f8f9fa", pointerEvents: "none" } : {}}
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* State */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  State <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={currentAddress.state}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      state: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setPermanentAddress({
                        ...permanentAddress,
                        state: e.target.value,
                      });
                    }
                  }}
                  placeholder="Enter state"
                  disabled={sendingEmail || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1}
                  style={selectedEmployees.length === 1 ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* District */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  District <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={currentAddress.district}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      district: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setPermanentAddress({
                        ...permanentAddress,
                        district: e.target.value,
                      });
                    }
                  }}
                  placeholder="Enter district"
                  disabled={sendingEmail || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1}
                  style={selectedEmployees.length === 1 ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* City */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  City <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={currentAddress.city}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      city: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setPermanentAddress({
                        ...permanentAddress,
                        city: e.target.value,
                      });
                    }
                  }}
                  placeholder="Enter city"
                  disabled={sendingEmail || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1}
                  style={selectedEmployees.length === 1 ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* Pincode */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  Pincode <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={currentAddress.pincode}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      pincode: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setPermanentAddress({
                        ...permanentAddress,
                        pincode: e.target.value,
                      });
                    }
                  }}
                  placeholder="Enter pincode"
                  maxLength="6"
                  disabled={sendingEmail || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1}
                  style={selectedEmployees.length === 1 ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* Nationality */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  Nationality <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={currentAddress.nationality || ""}
                  onChange={(e) => {
                    setCurrentAddress({
                      ...currentAddress,
                      nationality: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setPermanentAddress({
                        ...permanentAddress,
                        nationality: e.target.value,
                      });
                    }
                  }}
                  placeholder="Enter nationality"
                  disabled={sendingEmail || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1}
                  style={selectedEmployees.length === 1 ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>
            </div>
          </div>

          {/* PERMANENT ADDRESS */}
          <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-semibold mb-0 d-flex align-items-center">
                <Icon icon="heroicons:building-office" className="me-2 text-success" />
                Permanent Address
              </h6>
            </div>

            <div className="row g-3">
              {/* Address Line 1 */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Address Line 1 <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={permanentAddress.address1}
                  onChange={(e) => {
                    setPermanentAddress({
                      ...permanentAddress,
                      address1: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setSameAsCurrent(false);
                    }
                  }}
                  placeholder="House/Flat No., Building Name, Street"
                  disabled={sendingEmail || sameAsCurrent || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1 && !sameAsCurrent}
                  style={selectedEmployees.length === 1 && !sameAsCurrent ? { backgroundColor: "#f8f9fa" } : sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* Address Line 2 */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Address Line 2 <span className="text-muted">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={permanentAddress.address2}
                  onChange={(e) => {
                    setPermanentAddress({
                      ...permanentAddress,
                      address2: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setSameAsCurrent(false);
                    }
                  }}
                  placeholder="Area, Landmark, Colony"
                  disabled={sendingEmail || sameAsCurrent || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1 && !sameAsCurrent}
                  style={selectedEmployees.length === 1 && !sameAsCurrent ? { backgroundColor: "#f8f9fa" } : sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* Country */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  Country <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={permanentAddress.country}
                  onChange={(e) => {
                    setPermanentAddress({
                      ...permanentAddress,
                      country: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setSameAsCurrent(false);
                    }
                  }}
                  disabled={sendingEmail || sameAsCurrent || selectedEmployees.length > 1}
                  style={selectedEmployees.length === 1 && !sameAsCurrent ? { backgroundColor: "#f8f9fa", pointerEvents: "none" } : sameAsCurrent ? { backgroundColor: "#f8f9fa", pointerEvents: "none" } : {}}
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* State */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  State <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={permanentAddress.state}
                  onChange={(e) => {
                    setPermanentAddress({
                      ...permanentAddress,
                      state: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setSameAsCurrent(false);
                    }
                  }}
                  placeholder="Enter state"
                  disabled={sendingEmail || sameAsCurrent || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1 && !sameAsCurrent}
                  style={selectedEmployees.length === 1 && !sameAsCurrent ? { backgroundColor: "#f8f9fa" } : sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* District */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  District <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={permanentAddress.district}
                  onChange={(e) => {
                    setPermanentAddress({
                      ...permanentAddress,
                      district: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setSameAsCurrent(false);
                    }
                  }}
                  placeholder="Enter district"
                  disabled={sendingEmail || sameAsCurrent || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1 && !sameAsCurrent}
                  style={selectedEmployees.length === 1 && !sameAsCurrent ? { backgroundColor: "#f8f9fa" } : sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* City */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  City <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={permanentAddress.city}
                  onChange={(e) => {
                    setPermanentAddress({
                      ...permanentAddress,
                      city: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setSameAsCurrent(false);
                    }
                  }}
                  placeholder="Enter city"
                  disabled={sendingEmail || sameAsCurrent || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1 && !sameAsCurrent}
                  style={selectedEmployees.length === 1 && !sameAsCurrent ? { backgroundColor: "#f8f9fa" } : sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* Pincode */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  Pincode <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={permanentAddress.pincode}
                  onChange={(e) => {
                    setPermanentAddress({
                      ...permanentAddress,
                      pincode: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setSameAsCurrent(false);
                    }
                  }}
                  placeholder="Enter pincode"
                  maxLength="6"
                  disabled={sendingEmail || sameAsCurrent || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1 && !sameAsCurrent}
                  style={selectedEmployees.length === 1 && !sameAsCurrent ? { backgroundColor: "#f8f9fa" } : sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>

              {/* Nationality */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  Nationality <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={permanentAddress.nationality || ""}
                  onChange={(e) => {
                    setPermanentAddress({
                      ...permanentAddress,
                      nationality: e.target.value,
                    });
                    if (sameAsCurrent) {
                      setSameAsCurrent(false);
                    }
                  }}
                  placeholder="Enter nationality"
                  disabled={sendingEmail || sameAsCurrent || selectedEmployees.length > 1}
                  readOnly={selectedEmployees.length === 1 && !sameAsCurrent}
                  style={selectedEmployees.length === 1 && !sameAsCurrent ? { backgroundColor: "#f8f9fa" } : sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}}
                />
              </div>
            </div>

            {/* Manual Edit Hint */}
            {sameAsCurrent && (
              <div className="mt-2">
                <small className="text-muted d-flex align-items-center">
                  <Icon icon="heroicons:information-circle" className="me-1" />
                  Uncheck "Same as Current Address" to edit permanent address independently
                </small>
              </div>
            )}

            {selectedEmployees.length === 1 && !sameAsCurrent && (
              <div className="mt-2">
                <small className="text-muted d-flex align-items-center">
                  <Icon icon="heroicons:information-circle" className="me-1" />
                  Address is read-only. Edit in employee profile or create new request.
                </small>
              </div>
            )}

            {selectedEmployees.length > 1 && (
              <div className="mt-2">
                <small className="text-warning d-flex align-items-center">
                  <Icon icon="heroicons:exclamation-triangle" className="me-1" />
                  Address editing disabled when multiple employees are selected
                </small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experience Status Display */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Candidate Type</label>
        <div className="p-3 bg-light rounded">
          <div className="d-flex align-items-center">
            <Icon
              icon={isExperienced ? "heroicons:briefcase" : "heroicons:user"}
              className={`me-2 ${isExperienced ? "text-success" : "text-secondary"}`}
            />
            <input
              type="text"
              className="form-control bg-white"
              value={isExperienced ? "Experienced" : "Fresher"}
              readOnly
              style={{ maxWidth: "200px" }}
            />
          </div>
        </div>
      </div>

      {/* Experience Details */}
      {selectedEmployees.length === 1 && isExperienced && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-info bg-opacity-10 border-0">
            <h6 className="mb-0 fw-semibold d-flex align-items-center">
              <Icon icon="heroicons:briefcase" className="me-2" />
              Work Experience Details 
            </h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Current/Last Organization */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Organization Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={currentOrganization || "Not specified"}
                  readOnly
                />
              </div>

              {/* Current/Last Role */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Role</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentRole || "Not specified"}
                  readOnly
                />
              </div>

              {/* Employment Type */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Employment Type
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    employmentType
                      ? employmentType
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1),
                          )
                          .join(" ")
                      : "Not specified"
                  }
                  readOnly
                />
              </div>

              {/* Location */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={experienceLocation || "Not specified"}
                  readOnly
                />
              </div>

              {/* Current/Last Salary */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Salary (CTC)
                </label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      currentSalary
                        ? new Intl.NumberFormat("en-IN").format(
                            currentSalary,
                          )
                        : "Not specified"
                    }
                    readOnly
                  />
                </div>
              </div>

              {/* Notice Period */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Notice Period
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    noticePeriod
                      ? noticePeriod
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1),
                          )
                          .join(" ")
                      : "Not specified"
                  }
                  readOnly
                />
              </div>

              {/* Years of Experience */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Years of Experience
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={
                      yearsOfExperience
                        ? `${yearsOfExperience} years`
                        : "Not specified"
                    }
                    readOnly
                  />
                </div>
              </div>

              {/* Joining Date */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Joining Date
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    experienceJoiningDate
                      ? new Date(
                          experienceJoiningDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not specified"
                  }
                  readOnly
                />
              </div>

              {/* Relieving Date */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Relieving Date
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    experienceRelievingDate
                      ? new Date(
                          experienceRelievingDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not specified"
                  }
                  readOnly
                />
              </div>

              {/* Previous Experiences List */}
              {previousExperiences &&
                previousExperiences.length > 0 && (
                  <div className="col-12 mt-3">
                    <label className="form-label fw-semibold">
                      Previous Work Experiences
                    </label>
                    <div className="list-group">
                      {previousExperiences.map((exp, index) => (
                        <div
                          key={exp.id || index}
                          className="list-group-item border rounded p-3 mb-2"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0 fw-semibold">
                              Experience {index + 1}
                            </h6>
                          </div>
                          <div className="row g-2">
                            <div className="col-md-6">
                              <small className="text-muted">
                                Organization:
                              </small>
                              <div className="fw-medium">
                                {exp.organization || "Not specified"}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <small className="text-muted">
                                Role:
                              </small>
                              <div className="fw-medium">
                                {exp.role || "Not specified"}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <small className="text-muted">
                                Employment Type:
                              </small>
                              <div className="fw-medium">
                                {exp.type
                                  ? exp.type
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1),
                                      )
                                      .join(" ")
                                  : "Not specified"}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <small className="text-muted">
                                Location:
                              </small>
                              <div className="fw-medium">
                                {exp.location || "Not specified"}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <small className="text-muted">
                                Salary (CTC):
                              </small>
                              <div className="fw-medium">
                                {exp.salary
                                  ? `₹${new Intl.NumberFormat("en-IN").format(exp.salary)}`
                                  : "Not specified"}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <small className="text-muted">
                                Years of Experience:
                              </small>
                              <div className="fw-medium">
                                {exp.years
                                  ? `${exp.years} years`
                                  : "Not specified"}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <small className="text-muted">
                                From Date:
                              </small>
                              <div className="fw-medium">
                                {exp.fromDate
                                  ? new Date(
                                      exp.fromDate,
                                    ).toLocaleDateString("en-US")
                                  : "Not specified"}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <small className="text-muted">
                                To Date:
                              </small>
                              <div className="fw-medium">
                                {exp.toDate
                                  ? new Date(
                                      exp.toDate,
                                    ).toLocaleDateString("en-US")
                                  : "Not specified"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Section */}
      <div className="mb-4">
        <label className="form-label fw-semibold">
          Uploaded Documents
        </label>

        <div className="bg-light rounded p-3">
          <div className="table-responsive">
            <table className="table table-borderless table-sm mb-0">
              <thead>
                <tr>
                  <th className="fw-semibold text-muted" style={{ width: "40%" }}>
                    Document Name
                  </th>
                  <th className="fw-semibold text-muted" style={{ width: "20%" }}>
                    Type
                  </th>
                  <th className="fw-semibold text-muted" style={{ width: "20%" }}>
                    Upload Status
                  </th>
                  <th className="fw-semibold text-muted text-center" style={{ width: "20%" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {requiredDocuments.map((doc, index) => {
                  const uploadedDoc = uploadedDocuments.find(
                    (ud) => ud.id === doc.id,
                  );
                  const isUploaded = !!uploadedDoc;

                  const handleViewDocument = () => {
                    if (!uploadedDoc) {
                      setEmailStatus({
                        type: "error",
                        message: "No document found to view",
                      });
                      return;
                    }

                    if (
                      uploadedDoc.fileUrl &&
                      typeof uploadedDoc.fileUrl === "string"
                    ) {
                      try {
                        window.open(uploadedDoc.fileUrl, "_blank");
                        return;
                      } catch (error) {
                        console.warn("Direct URL failed:", error);
                      }
                    }

                    if (
                      uploadedDoc.file &&
                      uploadedDoc.file instanceof File
                    ) {
                      try {
                        const newUrl = URL.createObjectURL(
                          uploadedDoc.file,
                        );
                        window.open(newUrl, "_blank");
                        return;
                      } catch (error) {
                        console.warn(
                          "File object URL creation failed:",
                          error,
                        );
                      }
                    }

                    if (
                      uploadedDoc.dataUrl &&
                      typeof uploadedDoc.dataUrl === "string"
                    ) {
                      try {
                        window.open(uploadedDoc.dataUrl, "_blank");
                        return;
                      } catch (error) {
                        console.warn("Data URL failed:", error);
                      }
                    }

                    if (
                      uploadedDoc.originalDocument &&
                      uploadedDoc.originalDocument.fileUrl
                    ) {
                      try {
                        window.open(
                          uploadedDoc.originalDocument.fileUrl,
                          "_blank",
                        );
                        return;
                      } catch (error) {
                        console.warn(
                          "Original document URL failed:",
                          error,
                        );
                      }
                    }

                    setEmailStatus({
                      type: "error",
                      message:
                        "Cannot view document. The file may have been removed or is inaccessible.",
                    });
                  };

                  const handleReplaceDocument = () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
                    input.style.display = "none";

                    input.onchange = (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const file = files[0];

                        const allowedTypes = [
                          "application/pdf",
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                          "application/msword",
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        ];

                        if (!allowedTypes.includes(file.type)) {
                          setEmailStatus({
                            type: "error",
                            message:
                              "Please upload PDF, JPG, PNG, or DOC files only",
                          });
                          document.body.removeChild(input);
                          return;
                        }

                        const maxSize = 5 * 1024 * 1024;
                        if (file.size > maxSize) {
                          setEmailStatus({
                            type: "error",
                            message:
                              "File size should be less than 5MB",
                          });
                          document.body.removeChild(input);
                          return;
                        }

                        const fileUrl = URL.createObjectURL(file);

                        const updatedDoc = {
                          id: doc.id,
                          name: file.name,
                          file: file,
                          fileUrl: fileUrl,
                          size: file.size,
                          type: file.type,
                          uploadDate: new Date().toISOString(),
                        };

                        setUploadedDocuments((prev) => {
                          const oldDoc = prev.find(
                            (d) => d.id === doc.id,
                          );
                          if (oldDoc && oldDoc.fileUrl) {
                            URL.revokeObjectURL(oldDoc.fileUrl);
                          }

                          return prev.map((d) =>
                            d.id === doc.id ? updatedDoc : d,
                          );
                        });

                        setEmailStatus({
                          type: "success",
                          message: "Document replaced successfully",
                        });
                      }

                      document.body.removeChild(input);
                    };

                    document.body.appendChild(input);
                    input.click();
                  };

                  const handleRemoveDocument = () => {
                    if (uploadedDoc?.fileUrl) {
                      URL.revokeObjectURL(uploadedDoc.fileUrl);
                    }

                    setUploadedDocuments((prev) =>
                      prev.filter((d) => d.id !== doc.id),
                    );

                    setEmailStatus({
                      type: "success",
                      message: "Document removed successfully",
                    });
                  };

                  const handleNewUpload = (e, docId) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const allowedTypes = [
                      "application/pdf",
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ];

                    if (!allowedTypes.includes(file.type)) {
                      setEmailStatus({
                        type: "error",
                        message:
                          "Please upload PDF, JPG, PNG, or DOC files only",
                      });
                      return;
                    }

                    const maxSize = 5 * 1024 * 1024;
                    if (file.size > maxSize) {
                      setEmailStatus({
                        type: "error",
                        message: "File size should be less than 5MB",
                      });
                      return;
                    }

                    const fileUrl = URL.createObjectURL(file);

                    const newDoc = {
                      id: docId,
                      name: file.name,
                      file: file,
                      fileUrl: fileUrl,
                      size: file.size,
                      type: file.type,
                      uploadDate: new Date().toISOString(),
                    };

                    setUploadedDocuments((prev) => {
                      const filtered = prev.filter(
                        (d) => d.id !== docId,
                      );
                      return [...filtered, newDoc];
                    });

                    setEmailStatus({
                      type: "success",
                      message: `${doc.name} uploaded successfully`,
                    });
                  };

                  return (
                    <tr
                      key={doc.id}
                      className={
                        index % 2 === 0 ? "bg-white" : "bg-light"
                      }
                    >
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <Icon
                            icon={
                              isUploaded
                                ? "heroicons:document-check"
                                : "heroicons:document"
                            }
                            className={`me-2 ${isUploaded ? "text-success" : "text-secondary"}`}
                          />
                          <div>
                            <div className="fw-medium">{doc.name}</div>
                            {uploadedDoc && (
                              <div>
                                <small className="text-muted">
                                  Uploaded:{" "}
                                  {new Date(
                                    uploadedDoc.uploadDate ||
                                      new Date(),
                                  ).toLocaleDateString()}
                                </small>
                                {uploadedDoc.size && (
                                  <>
                                    <br />
                                    <small className="text-muted">
                                      File: {uploadedDoc.name} (
                                      {(
                                        uploadedDoc.size /
                                        1024 /
                                        1024
                                      ).toFixed(2)}{" "}
                                      MB)
                                    </small>
                                  </>
                                )}
                                <br />
                                <small className="text-muted">
                                  Type: {uploadedDoc.type || "Unknown"}
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <span
                          className={`badge bg-${doc.required ? "danger" : "secondary"}`}
                        >
                          {doc.required ? "Required" : "Optional"}
                        </span>
                      </td>
                      <td className="align-middle">
                        {isUploaded ? (
                          <span className="badge bg-success">
                            Uploaded
                          </span>
                        ) : (
                          <span
                            className={`badge bg-${doc.required ? "warning" : "secondary"}`}
                          >
                            {doc.required ? "Pending" : "Optional"}
                          </span>
                        )}
                      </td>
                      <td className="align-middle">
                        <div className="d-flex flex-wrap gap-1">
                          {isUploaded ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                onClick={handleViewDocument}
                                title="View Document"
                                disabled={sendingEmail}
                              >
                                <Icon
                                  icon="heroicons:eye"
                                  className="fs-6"
                                />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-warning d-flex align-items-center"
                                onClick={handleReplaceDocument}
                                title="Replace Document"
                                disabled={sendingEmail}
                              >
                                <Icon
                                  icon="heroicons:pencil"
                                  className="fs-6"
                                />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                onClick={handleRemoveDocument}
                                title="Remove Document"
                                disabled={sendingEmail}
                              >
                                <Icon
                                  icon="heroicons:trash"
                                  className="fs-6"
                                />
                              </button>
                            </>
                          ) : (
                            <div className="w-100">
                              <input
                                type="file"
                                id={`email-upload-${doc.id}`}
                                className="d-none"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => handleNewUpload(e, doc.id)}
                                disabled={sendingEmail}
                              />
                              <label
                                htmlFor={`email-upload-${doc.id}`}
                                className={`btn btn-sm w-100 ${doc.required ? "btn-outline-success" : "btn-outline-secondary"} upload-btn`}
                                style={{
                                  cursor: "pointer",
                                  height: "60px",
                                  padding: "6px",
                                  gap: "4px",
                                }}
                                title={
                                  sendingEmail
                                    ? "Please wait..."
                                    : `Upload ${doc.name}`
                                }
                              >
                                <Icon
                                  icon="heroicons:arrow-up-tray"
                                  className="mb-1"
                                  style={{ fontSize: "18px" }}
                                />
                                <span>Upload</span>
                              </label>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Upload Summary */}
          {uploadedDocuments.length > 0 && (
            <div className="mt-3 pt-3 border-top">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    {uploadedDocuments.length} document(s) uploaded in current session
                  </small>
                  <br />
                  <small className="text-muted d-flex align-items-center gap-1">
                    <Icon
                      icon="heroicons:pencil"
                      style={{ fontSize: "12px" }}
                    />
                    <span>
                      Click the pencil icon to replace uploaded documents
                    </span>
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Clear all documents uploaded in this session?",
                      )
                    ) {
                      uploadedDocuments.forEach((doc) => {
                        if (doc.fileUrl) {
                          URL.revokeObjectURL(doc.fileUrl);
                        }
                      });
                      setUploadedDocuments([]);
                      setEmailStatus({
                        type: "success",
                        message: "All documents cleared from session",
                      });
                    }
                  }}
                  disabled={
                    uploadedDocuments.length === 0 || sendingEmail
                  }
                >
                  <Icon icon="heroicons:trash" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Body */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Email Body:</label>
        <textarea
          className="form-control"
          rows="8"
          value={emailTemplate}
          onChange={(e) => setEmailTemplate(e.target.value)}
          placeholder="Enter email content..."
          disabled={sendingEmail}
          style={{ resize: "vertical" }}
        />
      </div>

      {/* Info Alert */}
      <div className="alert alert-info d-flex align-items-start">
        <Icon
          icon="heroicons:information-circle"
          className="me-2 mt-1 flex-shrink-0"
        />
        <div>
          <strong className="d-block mb-1">Note:</strong>
          This email will request employees to submit scanned copies (PDF format) of the required documents.
          {selectedEmployees.length > 0 && (
            <div className="mt-2">
              <strong>
                Employee details can be edited by clicking the edit icon next to their name.
              </strong>{" "}
              Changes will be saved to the employee record.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="modal-footer bg-light rounded-bottom-3 px-4 py-3">
        <div className="d-flex flex-column flex-md-row w-100 gap-2">
          <button
            type="button"
            className="btn btn-danger order-2 order-md-1 flex-fill"
            onClick={() => {
              setShowEmailModal(false);
              setEmailStatus({ type: "", message: "" });
              setCcEmails("");
              setBccEmails("");
              setEditingEmployeeId(null);
              setCurrentAddress({
                address1: "",
                address2: "",
                country: "",
                state: "",
                district: "",
                city: "",
                pincode: "",
                nationality: "",
              });
              setPermanentAddress({
                address1: "",
                address2: "",
                country: "",
                state: "",
                district: "",
                city: "",
                pincode: "",
                nationality: "",
              });
              setSameAsCurrent(false);
              emailUploads.forEach((doc) => {
                if (doc.fileUrl) URL.revokeObjectURL(doc.fileUrl);
              });
              setEmailUploads([]);
            }}
            disabled={sendingEmail}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary order-1 order-md-2 flex-fill d-flex align-items-center justify-content-center"
            onClick={handleConfirmSendEmailWithEdits}
            disabled={
              sendingEmail ||
              !emailTemplate.trim() ||
              !emailSubject.trim()
            }
          >
            {sendingEmail ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Icon icon="heroicons:paper-airplane" className="me-2" />
                <span>
                  {emailMethod === "api"
                    ? "Send via API"
                    : emailMethod === "clipboard"
                      ? "Copy to Clipboard"
                      : "Open Email Client"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EmailModal;