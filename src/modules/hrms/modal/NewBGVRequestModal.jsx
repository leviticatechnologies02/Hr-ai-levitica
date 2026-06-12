import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const NewBGVRequestModal = (props) => {
  const { employees, setEmployees, selectedEmployees, setSelectedEmployees, activeSection, setActiveSection, searchTerm, setSearchTerm, statusFilter, setStatusFilter, selectedRequest, setSelectedRequest, showRequestDetails, setShowRequestDetails, showEmailModal, setShowEmailModal, emailTemplate, setEmailTemplate, newRequestPhone, setNewRequestPhone, newRequestDepartment, setNewRequestDepartment, newRequestDesignation, setNewRequestDesignation, newRequestEmployeeId, setNewRequestEmployeeId, uploadedDocuments, setUploadedDocuments, emailUploads, setEmailUploads, emailUploadedDocuments, setEmailUploadedDocuments, isExperienced, setIsExperienced, yearsOfExperience, setYearsOfExperience, currentOrganization, setCurrentOrganization, currentRole, setCurrentRole, employmentType, setEmploymentType, currentSalary, setCurrentSalary, noticePeriod, setNoticePeriod, previousExperiences, setPreviousExperiences, globalUploadedDocuments, setGlobalUploadedDocuments, newRequestDob, setNewRequestDob, newRequestGender, setNewRequestGender, newRequestMaritalStatus, setNewRequestMaritalStatus, newRequestParentName, setNewRequestParentName, newRequestParentRelationship, setNewRequestParentRelationship, newRequestParentPhone, setNewRequestParentPhone, newRequestParentEmail, setNewRequestParentEmail, newRequestParentEmployment, setNewRequestParentEmployment, newRequestParentOrganization, setNewRequestParentOrganization, newRequestParentDesignation, setNewRequestParentDesignation, newRequestParentIncome, setNewRequestParentIncome, newRequestParentAddress, setNewRequestParentAddress, newRequestIsGuardian, setNewRequestIsGuardian, educationQualifications, setEducationQualifications, showEducationForm, setShowEducationForm, editingEducation, setEditingEducation, educationLevel, setEducationLevel, schoolCollegeName, setSchoolCollegeName, boardUniversity, setBoardUniversity, passingYear, setPassingYear, joiningYear, setJoiningYear, degree, setDegree, branch, setBranch, percentage, setPercentage, cgpa, setCgpa, gradingSystem, setGradingSystem, experienceOrgName, setExperienceOrgName, experienceRole, setExperienceRole, experienceType, setExperienceType, experienceLocation, setExperienceLocation, experienceSalary, setExperienceSalary, experienceJoiningDate, setExperienceJoiningDate, experienceRelievingDate, setExperienceRelievingDate, experienceHistory, setExperienceHistory, currentAddress, setCurrentAddress, permanentAddress, setPermanentAddress, sameAsCurrent, setSameAsCurrent, showDeleteModal, setShowDeleteModal, employeeToDelete, setEmployeeToDelete, deleting, setDeleting, editingEmployeeId, setEditingEmployeeId, editEmployeeName, setEditEmployeeName, editEmployeePhone, setEditEmployeePhone, editEmployeeEmail, setEditEmployeeEmail, editEmployeeDepartment, setEditEmployeeDepartment, editEmployeeDesignation, setEditEmployeeDesignation, editEmployeeId, setEditEmployeeId, emailSubject, setEmailSubject, documentRequests, setDocumentRequests, sendingEmail, setSendingEmail, emailStatus, setEmailStatus, emailMethod, setEmailMethod, ccEmails, setCcEmails, bccEmails, setBccEmails, showNewRequestModal, setShowNewRequestModal, newRequestEmail, setNewRequestEmail, newRequestName, setNewRequestName, newRequestTemplate, setNewRequestTemplate, newRequestSubject, setNewRequestSubject, handleNewRequest, handleSendEmail, getRequiredDocuments, handleDocumentUpload, handleReplaceDocumentClick, handleRemoveDocument, handleViewDocument, handleReuploadDocument, requiredDocuments, handleUpdateExistingDocument, handleSendNewRequest } = props;

  return (
    <>
      <Modal 
  isOpen={showNewRequestModal} 
  onClose={() => { setShowNewRequestModal(false); setEmailStatus({ type: "", message: "" }); setCcEmails(""); setBccEmails(""); }} 
  title="New Document Request" 
  size="xl"
>
{/* Email Status */}
              {emailStatus.message && (
                <div
                  className={`alert alert-${emailStatus.type === "success" ? "success" : emailStatus.type === "error" ? "danger" : "info"} d-flex align-items-center mb-3`}
                >
                  <Icon
                    icon={
                      emailStatus.type === "success"
                        ? "heroicons:check-circle"
                        : emailStatus.type === "error"
                          ? "heroicons:exclamation-circle"
                          : "heroicons:information-circle"
                    }
                    className="me-2"
                  />
                  {emailStatus.message}
                </div>
              )}

              {/* Contact Information Row */}
              <div className="row g-3 mb-3">
                {/* Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestName}
                    onChange={(e) => setNewRequestName(e.target.value)}
                    placeholder="Enter candidate/employee name"
                    disabled={sendingEmail}
                  />
                </div>
                                    {/* Employee ID */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Employee ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestEmployeeId}
                    onChange={(e) => setNewRequestEmployeeId(e.target.value)}
                    placeholder="EMP001, CAND001, etc."
                    disabled={sendingEmail}
                  />
                </div>
              </div>

              {/* Email Row */}
              <div className="row g-3 mb-3">

                     {/* Email */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Email ID <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={newRequestEmail}
                    onChange={(e) => setNewRequestEmail(e.target.value)}
                    placeholder="Enter email address"
                    disabled={sendingEmail}
                  />
                </div>

                     {/* Phone Number */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={newRequestPhone}
                    onChange={(e) => setNewRequestPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    disabled={sendingEmail}
                  />
                </div>

              </div>

                            {/* Additional Info Row */}
              <div className="row g-3 mb-4">
                    {/* Department/Designation */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Department</label>
                  <select
                    className="form-select"
                    value={newRequestDepartment}
                    onChange={(e) => setNewRequestDepartment(e.target.value)}
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
                  <label className="form-label fw-semibold">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestDesignation}
                    onChange={(e) => setNewRequestDesignation(e.target.value)}
                    placeholder="e.g., Software Engineer, Marketing Executive"
                    disabled={sendingEmail}
                  />
                </div>
              </div>
              {/* Personal Information Row */}

                  <div className="row g-3 mb-3">
                    {/* Date of Birth */}
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">
                        Date of Birth <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={newRequestDob}
                        onChange={(e) => setNewRequestDob(e.target.value)}
                        max={new Date().toISOString().split('T')[0]} // Prevent future dates
                        disabled={sendingEmail}
                      />
                    </div>
                    {/* Gender - NEW FIELD */}
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">
                        Gender <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={newRequestGender}
                        onChange={(e) => setNewRequestGender(e.target.value)}
                        disabled={sendingEmail}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Marital Status - NEW FIELD */}
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">
                        Marital Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={newRequestMaritalStatus}
                        onChange={(e) => setNewRequestMaritalStatus(e.target.value)}
                        disabled={sendingEmail}
                      >
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                      </select>
                    </div>
                  </div>


              {/* Email Method */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Email Sending Method
                </label>
                <div className="btn-group w-100 flex-wrap" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="newRequestEmailMethod"
                    id="method-api"
                    value="api"
                    checked={emailMethod === "api"}
                    onChange={(e) => setEmailMethod(e.target.value)}
                    disabled={sendingEmail}
                  />
                  <label
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                    htmlFor="method-api"
                  >
                    <Icon icon="heroicons:server" className="me-1" />
                    API Send
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="newRequestEmailMethod"
                    id="method-clipboard"
                    value="clipboard"
                    checked={emailMethod === "clipboard"}
                    onChange={(e) => setEmailMethod(e.target.value)}
                    disabled={sendingEmail}
                  />
                  <label
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                    htmlFor="method-clipboard"
                  >
                    <Icon icon="heroicons:clipboard" className="me-1" />
                    Copy to Clipboard
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="newRequestEmailMethod"
                    id="method-mailto"
                    value="mailto"
                    checked={emailMethod === "mailto"}
                    onChange={(e) => setEmailMethod(e.target.value)}
                    disabled={sendingEmail}
                  />
                  <label
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                    htmlFor="method-mailto"
                  >
                    <Icon icon="heroicons:envelope-open" className="me-1" />
                    Mailto
                  </label>
                </div>
              </div>

              {/* CC / BCC */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    CC (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={ccEmails}
                    onChange={(e) => setCcEmails(e.target.value)}
                    placeholder="email1@example.com"
                    disabled={emailMethod === "mailto" || sendingEmail}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    BCC (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={bccEmails}
                    placeholder="email1@example.com"
                    onChange={(e) => setBccEmails(e.target.value)}
                    disabled={emailMethod === "mailto" || sendingEmail}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Subject <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestSubject}
                  onChange={(e) => setNewRequestSubject(e.target.value)}
                  placeholder="Email subject..."
                  disabled={sendingEmail}
                />
              </div>

              {/* ========== EDUCATION QUALIFICATION SECTION ========== */}
<div className="card border-0 shadow-sm mb-4">
  <div className="card-header bg-info bg-opacity-10 border-0 d-flex justify-content-between align-items-center">
    <h6 className="mb-0 fw-semibold d-flex align-items-center">
      <Icon icon="heroicons:academic-cap" className="me-2" />
      Education Qualification
    </h6>
    <button
      type="button"
      className="btn btn-sm btn-outline-primary d-flex align-items-center"
      onClick={() => {
        setShowEducationForm(true);
        setEditingEducation(null);
        // Reset form fields
        setEducationLevel("");
        setSchoolCollegeName("");
        setBoardUniversity("");
        setPassingYear("");
        setJoiningYear("");
        setDegree("");
        setBranch("");
        setPercentage("");
        setCgpa("");
        setGradingSystem("percentage");
      }}
      disabled={sendingEmail}
    >
      <Icon icon="heroicons:plus-circle" className="me-1" />
      Add Education
    </button>
  </div>
  
  <div className="card-body">
    {/* Education Form - Collapsible */}
    {showEducationForm && (
      <div className="border rounded p-3 mb-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold mb-0">
            {editingEducation ? 'Edit Education' : 'Add New Education'}
          </h6>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setShowEducationForm(false);
              setEditingEducation(null);
            }}
            disabled={sendingEmail}
          />
        </div>
        
        <div className="row g-3">
          {/* Education Level */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              Education Level <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              disabled={sendingEmail}
            >
              <option value="">Select Education Level</option>
              <option value="10th">10th / Matriculation</option>
              <option value="12th">12th / Intermediate</option>
              <option value="diploma">Diploma</option>
              <option value="graduation">Graduation (Bachelor's)</option>
              <option value="post_graduation">Post Graduation (Master's)</option>
              <option value="phd">Ph.D / Doctorate</option>
              <option value="certification">Professional Certification</option>
            </select>
          </div>
          
          {/* School/College Name */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              School/College Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={schoolCollegeName}
              onChange={(e) => setSchoolCollegeName(e.target.value)}
              placeholder="Enter school/college name"
              disabled={sendingEmail}
            />
          </div>
          
          {/* Board/University - For 10th, 12th, Graduation, etc. */}
          {['10th', '12th', 'diploma', 'graduation', 'post_graduation', 'phd'].includes(educationLevel) && (
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                {educationLevel === '10th' || educationLevel === '12th' ? 'Board' : 'University'} 
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={boardUniversity}
                onChange={(e) => setBoardUniversity(e.target.value)}
                placeholder={educationLevel === '10th' || educationLevel === '12th' ? 'e.g., CBSE, ICSE, State Board' : 'e.g., Mumbai University, VTU'}
                disabled={sendingEmail}
              />
            </div>
          )}
          
          {/* Degree Name - For Graduation, Post Graduation, etc. */}
          {['graduation', 'post_graduation', 'diploma', 'phd'].includes(educationLevel) && (
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Degree Name <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                disabled={sendingEmail}
              >
                <option value="">Select Degree</option>
                {educationLevel === 'graduation' && (
                  <>
                    <option value="B.Tech">B.Tech / B.E.</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="B.Com">B.Com</option>
                    <option value="BA">B.A.</option>
                    <option value="BCA">BCA</option>
                    <option value="BBA">BBA</option>
                    <option value="B.Pharm">B.Pharm</option>
                    <option value="Other">Other</option>
                  </>
                )}
                {educationLevel === 'post_graduation' && (
                  <>
                    <option value="M.Tech">M.Tech / M.E.</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="M.Com">M.Com</option>
                    <option value="MA">M.A.</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="M.Pharm">M.Pharm</option>
                    <option value="Other">Other</option>
                  </>
                )}
                {educationLevel === 'diploma' && (
                  <>
                    <option value="Diploma in Engineering">Diploma in Engineering</option>
                    <option value="Diploma in Computer Science">Diploma in Computer Science</option>
                    <option value="Diploma in Business">Diploma in Business</option>
                    <option value="Other">Other</option>
                  </>
                )}
                {educationLevel === 'phd' && (
                  <>
                    <option value="Ph.D">Ph.D</option>
                    <option value="D.Phil">D.Phil</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
              
              {/* Other Degree Input */}
              {degree === 'Other' && (
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Enter degree name"
                  value={branch} // Reusing branch for custom degree
                  onChange={(e) => setBranch(e.target.value)}
                  disabled={sendingEmail}
                />
              )}
            </div>
          )}
          
          {/* Branch/Specialization - For Graduation, Post Graduation */}
          {['10th', '12th', 'diploma', 'graduation', 'post_graduation', 'phd'].includes(educationLevel) && degree !== 'Other' && (
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Branch / Specialization
              </label>
              <input
                type="text"
                className="form-control"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g., Computer Science, Electronics, Mechanical"
                disabled={sendingEmail}
              />
            </div>
          )}
          
          {/* For 10th and 12th - Only Passing Year */}
          {['10th', '12th'].includes(educationLevel) && (
            <>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Passing Year <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  placeholder="YYYY"
                  disabled={sendingEmail}
                />
              </div>
              
              {/* Percentage/CGPA for 10th/12th */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Percentage / CGPA
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="100"
                    step="0.01"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="Enter percentage or CGPA"
                    disabled={sendingEmail}
                  />
                  <span className="input-group-text">%</span>
                </div>
              </div>
            </>
          )}
          
          {/* For Graduation, Post Graduation, Diploma - Joining Year, Passing Year, Marks */}
          {['graduation', 'post_graduation', 'diploma', 'phd'].includes(educationLevel) && (
            <>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Joining Year <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={joiningYear}
                  onChange={(e) => setJoiningYear(e.target.value)}
                  placeholder="YYYY"
                  disabled={sendingEmail}
                />
              </div>
              
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Passing Year <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="1950"
                  max={new Date().getFullYear() + 10}
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  placeholder="YYYY"
                  disabled={sendingEmail}
                />
              </div>
              
              {/* Grading System Selection */}
<div className="col-12 col-md-6">

  <label className="form-label fw-semibold">
    Grading System
  </label>

  <div className="d-flex gap-4">

    {/* Percentage Option */}
    <label
      htmlFor="gradingPercentage"
      style={{
        display: "flex",
        alignItems: "center",
        cursor: sendingEmail ? "not-allowed" : "pointer",
        opacity: sendingEmail ? 0.6 : 1,
      }}
    >
      {/* Custom Radio */}
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: `2px solid ${
            gradingSystem === "percentage" ? "#3B82F6" : "#9CA3AF"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "8px",
          transition: "all 0.2s ease",
        }}
      >
        {gradingSystem === "percentage" && (
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#3B82F6",
            }}
          />
        )}
      </div>

      {/* Hidden Native Radio */}
      <input
        type="radio"
        name="gradingSystem"
        id="gradingPercentage"
        value="percentage"
        checked={gradingSystem === "percentage"}
        onChange={(e) => setGradingSystem(e.target.value)}
        disabled={sendingEmail}
        style={{ display: "none" }}
      />

      <span>Percentage (%)</span>
    </label>


    {/* CGPA Option */}
    <label
      htmlFor="gradingCGPA"
      style={{
        display: "flex",
        alignItems: "center",
        cursor: sendingEmail ? "not-allowed" : "pointer",
        opacity: sendingEmail ? 0.6 : 1,
      }}
    >
      {/* Custom Radio */}
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: `2px solid ${
            gradingSystem === "cgpa" ? "#3B82F6" : "#9CA3AF"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "8px",
          transition: "all 0.2s ease",
        }}
      >
        {gradingSystem === "cgpa" && (
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#3B82F6",
            }}
          />
        )}
      </div>

      {/* Hidden Native Radio */}
      <input
        type="radio"
        name="gradingSystem"
        id="gradingCGPA"
        value="cgpa"
        checked={gradingSystem === "cgpa"}
        onChange={(e) => setGradingSystem(e.target.value)}
        disabled={sendingEmail}
        style={{ display: "none" }}
      />

      <span>CGPA (out of 10)</span>
    </label>

  </div>
</div>

              
              {/* Percentage Input */}
              {gradingSystem === 'percentage' && (
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Percentage <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="100"
                      step="0.01"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      placeholder="Enter percentage"
                      disabled={sendingEmail}
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              )}
              
              {/* CGPA Input */}
              {gradingSystem === 'cgpa' && (
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    CGPA <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="10"
                      step="0.01"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="Enter CGPA"
                      disabled={sendingEmail}
                    />
                    <span className="input-group-text">/10</span>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Add/Update Button */}
          <div className="col-12 mt-3">
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowEducationForm(false);
                  setEditingEducation(null);
                }}
                disabled={sendingEmail}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  // Validation
                  if (!educationLevel || !schoolCollegeName) {
                    alert("Please fill all required fields");
                    return;
                  }
                  
                  if (['10th', '12th'].includes(educationLevel) && !passingYear) {
                    alert("Please enter passing year");
                    return;
                  }
                  
                  if (['graduation', 'post_graduation', 'diploma', 'phd'].includes(educationLevel)) {
                    if (!joiningYear || !passingYear) {
                      alert("Please enter joining and passing year");
                      return;
                    }
                    if (gradingSystem === 'percentage' && !percentage) {
                      alert("Please enter percentage");
                      return;
                    }
                    if (gradingSystem === 'cgpa' && !cgpa) {
                      alert("Please enter CGPA");
                      return;
                    }
                  }
                  
                  // Create education entry
                  const educationEntry = {
                    id: editingEducation?.id || Date.now(),
                    level: educationLevel,
                    levelLabel: document.querySelector(`select option[value="${educationLevel}"]`)?.textContent || educationLevel,
                    institution: schoolCollegeName,
                    boardUniversity: boardUniversity,
                    degree: degree,
                    branch: branch,
                    joiningYear: joiningYear,
                    passingYear: passingYear,
                    percentage: percentage,
                    cgpa: cgpa,
                    gradingSystem: gradingSystem,
                    isPursuing: educationLevel === 'phd' ? false : false, // Can add checkbox for pursuing
                  };
                  
                  if (editingEducation) {
                    // Update existing
                    setEducationQualifications(prev => 
                      prev.map(e => e.id === editingEducation.id ? educationEntry : e)
                    );
                  } else {
                    // Add new
                    setEducationQualifications(prev => [...prev, educationEntry]);
                  }
                  
                  // Reset form
                  setShowEducationForm(false);
                  setEditingEducation(null);
                  setEducationLevel("");
                  setSchoolCollegeName("");
                  setBoardUniversity("");
                  setPassingYear("");
                  setJoiningYear("");
                  setDegree("");
                  setBranch("");
                  setPercentage("");
                  setCgpa("");
                  setGradingSystem("percentage");
                }}
                disabled={sendingEmail}
              >
                {editingEducation ? 'Update' : 'Add'} Education
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    
    {/* Education List - Display Added Qualifications */}
    {educationQualifications.length > 0 ? (
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="fw-semibold">Level</th>
              <th className="fw-semibold">Institution/Board</th>
              <th className="fw-semibold">Degree/Branch</th>
              <th className="fw-semibold">Year</th>
              <th className="fw-semibold">Marks</th>
              <th className="fw-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {educationQualifications
              .sort((a, b) => {
                // Sort by education level (10th, 12th, graduation, etc.)
                const levelOrder = { '10th': 1, '12th': 2, 'diploma': 3, 'graduation': 4, 'post_graduation': 5, 'phd': 6, 'certification': 7 };
                return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
              })
              .map((edu, idx) => (
                <tr key={edu.id} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
                  <td className="align-middle">
                    <div className="fw-medium">{edu.levelLabel}</div>
                  </td>
                  <td className="align-middle">
                    <div>{edu.institution}</div>
                    {edu.boardUniversity && (
                      <small className="text-muted">{edu.boardUniversity}</small>
                    )}
                  </td>
                  <td className="align-middle">
                    {edu.degree && <div className="fw-medium">{edu.degree}</div>}
                    {edu.branch && <small className="text-muted">{edu.branch}</small>}
                    {/* {!edu.degree && edu.level === '10th' && <span>Matriculation</span>}
                    {!edu.degree && edu.level === '12th' && <span>Intermediate</span>} */}
                  </td>
                  <td className="align-middle">
                    {edu.passingYear && (
                      <>
                        <div>{edu.passingYear}</div>
                        {edu.joiningYear && (
                          <small className="text-muted">
                            {edu.joiningYear} - {edu.passingYear}
                          </small>
                        )}
                      </>
                    )}
                  </td>
                  <td className="align-middle">
                    {edu.percentage && (
                      <span className="badge bg-success bg-opacity-10 text-success p-2">
                        {edu.percentage}%
                      </span>
                    )}
                    {edu.cgpa && (
                      <span className="badge bg-info bg-opacity-10 text-info p-2">
                        CGPA: {edu.cgpa}/10
                      </span>
                    )}
                  </td>
                  <td className="align-middle">
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setEditingEducation(edu);
                          setEducationLevel(edu.level);
                          setSchoolCollegeName(edu.institution);
                          setBoardUniversity(edu.boardUniversity || "");
                          setPassingYear(edu.passingYear || "");
                          setJoiningYear(edu.joiningYear || "");
                          setDegree(edu.degree || "");
                          setBranch(edu.branch || "");
                          setPercentage(edu.percentage || "");
                          setCgpa(edu.cgpa || "");
                          setGradingSystem(edu.gradingSystem || "percentage");
                          setShowEducationForm(true);
                        }}
                        title="Edit"
                      >
                        <Icon icon="heroicons:pencil-square" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (window.confirm("Remove this education qualification?")) {
                            setEducationQualifications(prev => 
                              prev.filter(e => e.id !== edu.id)
                            );
                          }
                        }}
                        title="Delete"
                      >
                        <Icon icon="heroicons:trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-4">
        <div className="d-flex flex-column align-items-center text-muted">
          <Icon icon="heroicons:academic-cap" style={{ fontSize: "36px" }} className="mb-2 opacity-50" />
          <p className="mb-1 fw-medium">No education qualifications added</p>
          <small>Click "Add Education" button to add educational details</small>
        </div>
      </div>
    )}
  </div>
</div>

                            {/* ========== PARENT/GUARDIAN DETAILS SECTION - NEW ========== */}
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
                      <label className="form-label fw-semibold">
                        Parent/Guardian Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRequestParentName}
                        onChange={(e) => setNewRequestParentName(e.target.value)}
                        placeholder="Enter parent/guardian full name"
                        disabled={sendingEmail}
                      />
                    </div>

                    {/* Relationship */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Relationship <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={newRequestParentRelationship}
                        onChange={(e) => setNewRequestParentRelationship(e.target.value)}
                        disabled={sendingEmail}
                      >
                        <option value="">Select Relationship</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Parent/Guardian Phone Number */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        value={newRequestParentPhone}
                        onChange={(e) => setNewRequestParentPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        disabled={sendingEmail}
                      />
                    </div>


                    {/* Employment Status */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Employment Status
                      </label>
                      <select
                        className="form-select"
                        value={newRequestParentEmployment}
                        onChange={(e) => setNewRequestParentEmployment(e.target.value)}
                        disabled={sendingEmail}
                      >
                        <option value="">Select Status</option>
                        <option value="Employed">Employed</option>
                        <option value="Self Employed">Self Employed</option>
                        <option value="Business">Business</option>
                        <option value="Retired">Retired</option>
                        <option value="Homemaker">Homemaker</option>
                        <option value="Not Employed">Not Employed</option>
                        <option value="Deceased">Deceased</option>
                      </select>
                    </div>

                    {/* Organization/Company */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Organization/Company
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRequestParentOrganization}
                        onChange={(e) => setNewRequestParentOrganization(e.target.value)}
                        placeholder="Company name (if employed)"
                        disabled={sendingEmail}
                      />
                    </div>

                    {/* Designation */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Designation
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRequestParentDesignation}
                        onChange={(e) => setNewRequestParentDesignation(e.target.value)}
                        placeholder="Job title (if employed)"
                        disabled={sendingEmail}
                      />
                    </div>

{/* Is Guardian checkbox */}
<div className="col-12">
  <label
    htmlFor="isLegalGuardian"
    style={{
      display: "flex",
      alignItems: "center",
      cursor: sendingEmail ? "not-allowed" : "pointer",
      opacity: sendingEmail ? 0.6 : 1,
    }}
  >
    {/* Custom Checkbox UI */}
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${
          newRequestIsGuardian ? "#3B82F6" : "#9CA3AF"
        }`,
        background: newRequestIsGuardian ? "#3B82F6" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "10px",
        transition: "all 0.2s ease",
      }}
    >
      {newRequestIsGuardian && (
        <span
          style={{
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            lineHeight: 1,
          }}
        >
          ✓
        </span>
      )}
    </div>

    {/* Hidden Native Checkbox */}
    <input
      type="checkbox"
      id="isLegalGuardian"
      checked={newRequestIsGuardian}
      disabled={sendingEmail}
      onChange={(e) => setNewRequestIsGuardian(e.target.checked)}
      style={{ display: "none" }}
    />

    <span>This person is the legal guardian (if not parent)</span>
  </label>
</div>


                  </div>
                </div>
              </div>

              {/* ========== ADDRESS DETAILS SECTION ========== */}
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
                        <Icon
                          icon="heroicons:home"
                          className="me-2 text-primary"
                        />
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
                            // If same as current is checked, update permanent address automatically
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                address1: e.target.value,
                              });
                            }
                          }}
                          placeholder="House/Flat No., Building Name, Street"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address Line 2{" "}
                          <span className="text-muted">(Optional)</span>
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
                          disabled={sendingEmail}
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
                          disabled={sendingEmail}
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
                          disabled={sendingEmail}
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
                          disabled={sendingEmail}
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
                          disabled={sendingEmail}
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
                          disabled={sendingEmail}
                        />
                      </div>

                      {/*Nationality */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Nationality <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.Nationality || ""}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              Nationality: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                Nationality: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter nationality"
                          disabled={sendingEmail}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SAME AS CURRENT ADDRESS CHECKBOX */}
                  <div className="mb-4 pb-2 border-bottom">
                    <label
                      htmlFor="sameAsCurrentAddress"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: sendingEmail ? "not-allowed" : "pointer",
                        opacity: sendingEmail ? 0.6 : 1,
                      }}
                    >
                      {/* Custom Checkbox */}
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: `2px solid ${
                            sameAsCurrent ? "#3B82F6" : "#9CA3AF"
                          }`,
                          background: sameAsCurrent ? "#3B82F6" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "10px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {sameAsCurrent && (
                          <span
                            style={{
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "bold",
                              lineHeight: 1,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Hidden Native Checkbox */}
                      <input
                        type="checkbox"
                        id="sameAsCurrentAddress"
                        checked={sameAsCurrent}
                        disabled={sendingEmail}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setSameAsCurrent(isChecked);

                          if (isChecked) {
                            setPermanentAddress({
                              address1: currentAddress.address1,
                              address2: currentAddress.address2,
                              country: currentAddress.country,
                              state: currentAddress.state,
                              district: currentAddress.district,
                              city: currentAddress.city,
                              pincode: currentAddress.pincode,
                            });
                          }
                        }}
                        style={{ display: "none" }}
                      />

                      <span className="fw-semibold">
                        Same as Current Address
                      </span>
                    </label>
                  </div>

                  {/* PERMANENT ADDRESS */}
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="fw-semibold mb-0 d-flex align-items-center">
                        <Icon
                          icon="heroicons:building-office"
                          className="me-2 text-success"
                        />
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
                            // Uncheck "same as current" if user manually modifies permanent address
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="House/Flat No., Building Name, Street"
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address Line 2{" "}
                          <span className="text-muted">(Optional)</span>
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
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
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
                          disabled={sendingEmail || sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
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
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
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
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
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
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
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
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
                        />
                      </div>
                    </div>

                    {/* Manual Edit Hint */}
                    {sameAsCurrent && (
                      <div className="mt-2">
                        <small className="text-muted d-flex align-items-center">
                          <Icon
                            icon="heroicons:information-circle"
                            className="me-1"
                          />
                          Uncheck "Same as Current Address" to edit permanent
                          address independently
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Experienced Checkbox - Add this new section */}
              <div className="mb-3 justify-items-center">
                <div className="form-check form-switch d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="isExperienced"
                    checked={isExperienced}
                    onChange={(e) => setIsExperienced(e.target.checked)}
                    disabled={sendingEmail}
                    style={{ width: "3em", height: "1.5em" }}
                  />

                  <label
                    className="form-check-label fw-semibold ms-3 d-flex align-items-center cursor-pointer"
                    htmlFor="isExperienced"
                    style={{ cursor: "pointer" }}
                  >
                    {isExperienced ? (
                      <>
                        <Icon
                          icon="heroicons:briefcase"
                          className="me-2 text-success"
                        />
                        <span className="text-success">Experienced</span>
                      </>
                    ) : (
                      <>
                        <Icon
                          icon="heroicons:user"
                          className="me-2 text-secondary"
                        />
                        <span className="text-secondary">Fresher</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Experience Details - Only show when Experienced is checked */}
              {isExperienced && (
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-info bg-opacity-10 border-0">
                    <h6 className="mb-0 fw-semibold d-flex align-items-center">
                      <Icon icon="heroicons:briefcase" className="me-2" />
                      Previous Work Experience Details
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      {/* Current/Last Organization */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Organization Name{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentOrganization}
                          onChange={(e) =>
                            setCurrentOrganization(e.target.value)
                          }
                          placeholder="e.g., ABC Technologies Pvt Ltd"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Current/Last Role */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Role <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentRole}
                          onChange={(e) => setCurrentRole(e.target.value)}
                          placeholder="e.g., Senior Software Engineer"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Employment Type */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Employment Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={employmentType}
                          onChange={(e) => setEmploymentType(e.target.value)}
                          disabled={sendingEmail}
                        >
                          <option value="">Select Type</option>
                          <option value="full_time">Full Time</option>
                          <option value="part_time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="freelance">Freelance</option>
                        </select>
                      </div>

                      {/* Location */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Location <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={experienceLocation}
                          onChange={(e) =>
                            setExperienceLocation(e.target.value)
                          }
                          placeholder="e.g., Bangalore, Remote, etc."
                          disabled={sendingEmail}
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
                            type="number"
                            className="form-control"
                            min="0"
                            value={currentSalary}
                            onChange={(e) => setCurrentSalary(e.target.value)}
                            placeholder="e.g., 1200000"
                            disabled={sendingEmail}
                          />
                        </div>
                      </div>

                      {/* Notice Period */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Notice Period
                        </label>
                        <select
                          className="form-select"
                          value={noticePeriod}
                          onChange={(e) => setNoticePeriod(e.target.value)}
                          disabled={sendingEmail}
                        >
                          <option value="">Select Notice Period</option>
                          <option value="immediate">Immediate</option>
                          <option value="15_days">15 Days</option>
                          <option value="30_days">30 Days</option>
                          <option value="45_days">45 Days</option>
                          <option value="60_days">60 Days</option>
                          <option value="90_days">90 Days</option>
                          <option value="negotiable">Negotiable</option>
                        </select>
                      </div>

                      {/* Years of Experience */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Years of Experience{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            max="50"
                            step="0.5"
                            value={yearsOfExperience}
                            onChange={(e) =>
                              setYearsOfExperience(e.target.value)
                            }
                            placeholder="e.g., 3.5"
                            disabled={sendingEmail}
                          />
                          <span className="input-group-text">years</span>
                        </div>
                      </div>

                      {/* Joining Date */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Joining Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={experienceJoiningDate}
                          onChange={(e) =>
                            setExperienceJoiningDate(e.target.value)
                          }
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Relieving Date */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Relieving Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={experienceRelievingDate}
                          onChange={(e) =>
                            setExperienceRelievingDate(e.target.value)
                          }
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Add Previous Experience Button */}
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm d-flex align-items-center"
                          onClick={() => {
                            setPreviousExperiences([
                              ...previousExperiences,
                              {
                                id: Date.now(),
                                organization: "",
                                role: "",
                                type: "",
                                location: "",
                                salary: "",
                                years: "",
                                fromDate: "",
                                toDate: "",
                              },
                            ]);
                          }}
                          disabled={sendingEmail}
                        >
                          <Icon icon="heroicons:plus-circle" className="me-1" />
                          Add Previous Experience
                        </button>
                      </div>

                      {/* Previous Experiences List */}
                      {previousExperiences.map((exp, index) => (
                        <div
                          key={exp.id}
                          className="col-12 border rounded p-3 mt-2"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0 fw-semibold">
                              Previous Experience {index + 1}
                            </h6>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                const updated = previousExperiences.filter(
                                  (e) => e.id !== exp.id,
                                );
                                setPreviousExperiences(updated);
                              }}
                              disabled={sendingEmail}
                            >
                              <Icon icon="heroicons:trash" />
                            </button>
                          </div>

                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Organization
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={exp.organization}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].organization = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                placeholder="Organization name"
                                disabled={sendingEmail}
                              />
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Role
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={exp.role}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].role = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                placeholder="Designation/Role"
                                disabled={sendingEmail}
                              />
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Employment Type
                              </label>
                              <select
                                className="form-select"
                                value={exp.type}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].type = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                disabled={sendingEmail}
                              >
                                <option value="">Select Type</option>
                                <option value="full_time">Full Time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                              </select>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Location
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={exp.location}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].location = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                placeholder="Location"
                                disabled={sendingEmail}
                              />
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Salary (CTC)
                              </label>
                              <div className="input-group">
                                <span className="input-group-text">₹</span>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={exp.salary}
                                  onChange={(e) => {
                                    const updated = [...previousExperiences];
                                    updated[index].salary = e.target.value;
                                    setPreviousExperiences(updated);
                                  }}
                                  placeholder="Annual CTC"
                                  disabled={sendingEmail}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Year of Experience
                              </label>
                              <div className="input-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  min="0"
                                  max="50"
                                  step="0.5"
                                  value={exp.years}
                                  onChange={(e) => {
                                    const updated = [...previousExperiences];
                                    updated[index].years = e.target.value;
                                    setPreviousExperiences(updated);
                                  }}
                                  placeholder="Years of experience"
                                  disabled={sendingEmail}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Joining Date
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                value={exp.fromDate}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].fromDate = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                disabled={sendingEmail}
                              />
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Relieving Date
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                value={exp.toDate}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].toDate = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                disabled={sendingEmail}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Required Documents */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Required Documents
                </label>
                <div className="bg-light rounded p-3">
                  <div className="table-responsive">
                    <table className="table table-borderless table-sm mb-0">
                      <thead>
                        <tr>
                          <th
                            className="fw-semibold text-muted"
                            style={{ width: "40%" }}
                          >
                            Document Name
                          </th>
                          <th
                            className="fw-semibold text-muted"
                            style={{ width: "20%" }}
                          >
                            Type
                          </th>
                          <th
                            className="fw-semibold text-muted"
                            style={{ width: "20%" }}
                          >
                            Upload Status
                          </th>
                          <th
                            className="fw-semibold text-muted text-center justify-items-center"
                            style={{ width: "20%" }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Dynamic required documents based on experience */}
                        {getRequiredDocuments().map((doc, index) => {
                          // Check if this document is already uploaded
                          const isUploaded = uploadedDocuments.some(
                            (ud) => ud.id === doc.id,
                          );
                          const uploadedDoc = uploadedDocuments.find(
                            (ud) => ud.id === doc.id,
                          );

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
                                            uploadedDoc.uploadDate,
                                          ).toLocaleDateString()}
                                        </small>
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
                              <td className="align-middle justify-items-center">
                                <div className="d-flex flex-nowrap gap-2">
                                  {isUploaded ? (
                                    <>
                                      {/* View Button */}
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                        onClick={() =>
                                          handleViewDocument(uploadedDoc)
                                        }
                                        title="View Document"
                                      >
                                        <Icon
                                          icon="heroicons:eye"
                                          className="fs-6"
                                        />
                                      </button>

                                      {/* Edit/Re-upload Button */}
                                      <div>
                                        <input
                                          type="file"
                                          id={`reupload-${doc.id}`}
                                          className="d-none"
                                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                          onChange={(e) =>
                                            handleReuploadDocument(e, doc.id)
                                          }
                                          disabled={sendingEmail}
                                        />
                                        <label
                                          htmlFor={`reupload-${doc.id}`}
                                          className="btn btn-sm btn-outline-warning d-flex align-items-center"
                                          title="Re-upload Document"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <Icon
                                            icon="heroicons:pencil-square"
                                            className="fs-6"
                                          />
                                        </label>
                                      </div>

                                      {/* Remove Button */}
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                        onClick={() =>
                                          handleRemoveDocument(doc.id)
                                        }
                                        title="Remove Document"
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
                                        id={`upload-${doc.id}`}
                                        className="d-none"
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        onChange={(e) =>
                                          handleDocumentUpload(e, doc.id)
                                        }
                                        disabled={sendingEmail}
                                      />
                                      <label
                                        htmlFor={`upload-${doc.id}`}
                                        className={`btn btn-sm w-100 ${doc.required ? "btn-outline-success" : "btn-outline-secondary"} upload-btn`}
                                        style={{
                                          cursor: "pointer",
                                          height: "60px",
                                          padding: "6px",
                                          gap: "4px",
                                        }}
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
                            {uploadedDocuments.length} of{" "}
                            {getRequiredDocuments().length} documents uploaded
                          </small>
                          <div
                            className="progress mt-1"
                            style={{ height: "6px", width: "200px" }}
                          >
                            <div
                              className="progress-bar bg-success"
                              style={{
                                width: `${(uploadedDocuments.length / getRequiredDocuments().length) * 100}%`,
                              }}
                            ></div>
                          </div>

                          {/* Required Documents Summary */}
                          <div className="mt-2">
                            <small className="text-muted d-block">
                              Required:{" "}
                              {
                                uploadedDocuments.filter((ud) =>
                                  getRequiredDocuments().find(
                                    (rd) => rd.id === ud.id && rd.required,
                                  ),
                                ).length
                              }{" "}
                              of{" "}
                              {
                                getRequiredDocuments().filter((d) => d.required)
                                  .length
                              }
                            </small>
                            <div
                              className="progress mt-1"
                              style={{
                                height: "4px",
                                width: "200px",
                                backgroundColor: "#e9ecef",
                              }}
                            >
                              <div
                                className="progress-bar bg-danger"
                                style={{
                                  width: `${(uploadedDocuments.filter((ud) => getRequiredDocuments().find((rd) => rd.id === ud.id && rd.required)).length / getRequiredDocuments().filter((d) => d.required).length) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          {/* Optional Documents Summary */}
                          {getRequiredDocuments().filter((d) => !d.required)
                            .length > 0 && (
                            <div className="mt-2">
                              <small className="text-muted d-block">
                                Optional:{" "}
                                {
                                  uploadedDocuments.filter((ud) =>
                                    getRequiredDocuments().find(
                                      (rd) => rd.id === ud.id && !rd.required,
                                    ),
                                  ).length
                                }{" "}
                                of{" "}
                                {
                                  getRequiredDocuments().filter(
                                    (d) => !d.required,
                                  ).length
                                }
                              </small>
                              <div
                                className="progress mt-1"
                                style={{
                                  height: "4px",
                                  width: "200px",
                                  backgroundColor: "#e9ecef",
                                }}
                              >
                                <div
                                  className="progress-bar bg-secondary"
                                  style={{
                                    width: `${(uploadedDocuments.filter((ud) => getRequiredDocuments().find((rd) => rd.id === ud.id && !rd.required)).length / getRequiredDocuments().filter((d) => !d.required).length) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to clear all uploaded documents?",
                              )
                            ) {
                              // Revoke object URLs to prevent memory leaks
                              uploadedDocuments.forEach((doc) => {
                                if (doc.fileUrl) {
                                  URL.revokeObjectURL(doc.fileUrl);
                                }
                              });
                              setUploadedDocuments([]);
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

              {/* Email Template */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email Template <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="8"
                  value={newRequestTemplate}
                  onChange={(e) => setNewRequestTemplate(e.target.value)}
                  disabled={sendingEmail}
                />
                <small className="text-muted">
                  You can use [Employee Name] placeholder which will be replaced
                  automatically
                </small>
              </div>

              {/* Info */}
              <div className="alert alert-info d-flex align-items-start">
                <Icon
                  icon="heroicons:information-circle"
                  className="me-2 mt-1"
                />
                <div>
                  <strong>Note:</strong> This email will request the
                  candidate/employee to submit scanned copies (PDF format) of
                  the required documents.
                </div>
              </div>

            {/* Footer */}
            <div className="modal-footer bg-light rounded-bottom-3 px-4 py-3">
              <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                <button
                  type="button"
                  className="btn btn-danger flex-fill"
                  onClick={() => {
                    setShowNewRequestModal(false);
                    setEmailStatus({ type: "", message: "" });
                    setCcEmails("");
                    setBccEmails("");
                    setNewRequestEmail("");
                    setNewRequestName("");
                    setNewRequestPhone("");
                    setNewRequestDepartment("");
                    setNewRequestDesignation("");
                    setNewRequestEmployeeId("");
                    setNewRequestDob("");
                    setNewRequestGender("");
                    setNewRequestMaritalStatus("");
                    setNewRequestTemplate("");
                    setNewRequestSubject("");
                    setEmailMethod("email_client");
                    setNewRequestParentName("");
                    setNewRequestParentRelationship("");
                    setNewRequestParentPhone("");
                    setNewRequestParentEmployment("");
                    setNewRequestParentOrganization("");
                    setNewRequestParentDesignation("");
                    setNewRequestIsGuardian(false);
                        // ===== ADD EDUCATION RESET HERE =====
    setEducationQualifications([]);
    setShowEducationForm(false);
    setEditingEducation(null);
    setEducationLevel("");
    setSchoolCollegeName("");
    setBoardUniversity("");
    setPassingYear("");
    setJoiningYear("");
    setDegree("");
    setBranch("");
    setPercentage("");
    setCgpa("");
    setGradingSystem("percentage");
                    // Reset experience fields
                    setIsExperienced(false);
                    setExperienceOrgName("");
                    setExperienceRole("");
                    setExperienceType("");
                    setExperienceLocation("");
                    setYearsOfExperience("");
                    setExperienceSalary("");
                    setExperienceJoiningDate("");
                    setExperienceRelievingDate("");
                    setExperienceHistory([]);
                    setPreviousExperiences([]);
                    setUploadedDocuments([]);
                    // In the Cancel button onClick handler, add these reset lines:
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
                    });
                    setSameAsCurrent(false);
                  }}
                  disabled={sendingEmail}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-success flex-fill d-flex align-items-center justify-content-center"
                  onClick={handleSendNewRequest}
                  disabled={
                    sendingEmail ||
                    !newRequestTemplate.trim() ||
                    !newRequestSubject.trim() ||
                    !newRequestEmail.trim() ||
                    !newRequestName.trim() ||
                    (isExperienced && !yearsOfExperience) // Validate years if experienced
                  }
                >
                  {sendingEmail ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon icon="heroicons:paper-airplane" className="me-2" />
                      {emailMethod === "api"
                        ? "Send via API"
                        : emailMethod === "clipboard"
                          ? "Copy to Clipboard"
                          : "Open Email Client"}
                    </>
                  )}
                </button>
              </div>
            </div>
      </Modal>
    </>
  );
};

export default NewBGVRequestModal;
