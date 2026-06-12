import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const EditBGVRequestModal = (props) => {
  const { employees, setEmployees, selectedEmployees, setSelectedEmployees, activeSection, setActiveSection, searchTerm, setSearchTerm, statusFilter, setStatusFilter, selectedRequest, setSelectedRequest, showRequestDetails, setShowRequestDetails, showEmailModal, setShowEmailModal, emailTemplate, setEmailTemplate, newRequestPhone, setNewRequestPhone, newRequestDepartment, setNewRequestDepartment, newRequestDesignation, setNewRequestDesignation, newRequestEmployeeId, setNewRequestEmployeeId, uploadedDocuments, setUploadedDocuments, emailUploads, setEmailUploads, emailUploadedDocuments, setEmailUploadedDocuments, isExperienced, setIsExperienced, yearsOfExperience, setYearsOfExperience, currentOrganization, setCurrentOrganization, currentRole, setCurrentRole, employmentType, setEmploymentType, currentSalary, setCurrentSalary, noticePeriod, setNoticePeriod, previousExperiences, setPreviousExperiences, globalUploadedDocuments, setGlobalUploadedDocuments, newRequestDob, setNewRequestDob, newRequestGender, setNewRequestGender, newRequestMaritalStatus, setNewRequestMaritalStatus, newRequestParentName, setNewRequestParentName, newRequestParentRelationship, setNewRequestParentRelationship, newRequestParentPhone, setNewRequestParentPhone, newRequestParentEmail, setNewRequestParentEmail, newRequestParentEmployment, setNewRequestParentEmployment, newRequestParentOrganization, setNewRequestParentOrganization, newRequestParentDesignation, setNewRequestParentDesignation, newRequestParentIncome, setNewRequestParentIncome, newRequestParentAddress, setNewRequestParentAddress, newRequestIsGuardian, setNewRequestIsGuardian, educationQualifications, setEducationQualifications, showEducationForm, setShowEducationForm, editingEducation, setEditingEducation, educationLevel, setEducationLevel, schoolCollegeName, setSchoolCollegeName, boardUniversity, setBoardUniversity, passingYear, setPassingYear, joiningYear, setJoiningYear, degree, setDegree, branch, setBranch, percentage, setPercentage, cgpa, setCgpa, gradingSystem, setGradingSystem, experienceOrgName, setExperienceOrgName, experienceRole, setExperienceRole, experienceType, setExperienceType, experienceLocation, setExperienceLocation, experienceSalary, setExperienceSalary, experienceJoiningDate, setExperienceJoiningDate, experienceRelievingDate, setExperienceRelievingDate, experienceHistory, setExperienceHistory, currentAddress, setCurrentAddress, permanentAddress, setPermanentAddress, sameAsCurrent, setSameAsCurrent, showDeleteModal, setShowDeleteModal, employeeToDelete, setEmployeeToDelete, deleting, setDeleting, editingEmployeeId, setEditingEmployeeId, editEmployeeName, setEditEmployeeName, editEmployeePhone, setEditEmployeePhone, editEmployeeEmail, setEditEmployeeEmail, editEmployeeDepartment, setEditEmployeeDepartment, editEmployeeDesignation, setEditEmployeeDesignation, editEmployeeId, setEditEmployeeId, emailSubject, setEmailSubject, documentRequests, setDocumentRequests, sendingEmail, setSendingEmail, emailStatus, setEmailStatus, emailMethod, setEmailMethod, ccEmails, setCcEmails, bccEmails, setBccEmails, showNewRequestModal, setShowNewRequestModal, newRequestEmail, setNewRequestEmail, newRequestName, setNewRequestName, newRequestTemplate, setNewRequestTemplate, newRequestSubject, setNewRequestSubject, handleNewRequest, handleSendEmail, getRequiredDocuments, handleDocumentUpload, handleReplaceDocumentClick, handleRemoveDocument, handleViewDocument, handleReuploadDocument, requiredDocuments, handleUpdateExistingDocument } = props;

  if (!selectedRequest) return null;

  return (
    <>
      <Modal 
  isOpen={showRequestDetails} 
  onClose={() => { setShowRequestDetails(false); }} 
  title="Document Request Details" 
  size="xl"
>
{/* Employee Info Card */}
        <div className="p-4 border-bottom">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
              <Icon icon="heroicons:user" className="text-primary fs-5" />
            </div>
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1">
                {selectedRequest.employeeName}
              </h5>
              <p className="text-muted small mb-0 d-flex align-items-center gap-1">
                <Icon icon="heroicons:envelope" />
                <span>
                  {selectedRequest.email} | ID:{" "}
                  {selectedRequest.employeeId || "N/A"}
                </span>
              </p>
              <p className="text-muted small mb-0 d-flex align-items-center gap-1">
                <Icon icon="heroicons:phone" />
                <span>{selectedRequest.phone || "No Phone Number"}</span>
              </p>
            </div>
            <span
              className={`badge bg-${getStatusColor(selectedRequest.status)} rounded-pill px-3 py-2`}
            >
              {selectedRequest.status}
            </span>
          </div>
          
          {/* Request Info */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h6 className="fw-semibold mb-3">
                    Request Information
                  </h6>

                  <div className="d-flex mb-2">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Requested:
                    </span>
                    <span className="fw-medium">
                      {new Date(
                        selectedRequest.requestedDate,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="d-flex mb-2">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Department:
                    </span>
                    <span className="fw-medium">
                      {selectedRequest.department || "Not specified"}
                    </span>
                  </div>

                  <div className="d-flex mb-2">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Designation:
                    </span>
                    <span className="fw-medium">
                      {selectedRequest.designation || "Not specified"}
                    </span>
                  </div>

                  <div className="d-flex mb-2">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Email Sent:
                    </span>
                    <span className="fw-medium">
                      {selectedRequest.emailSent ? "Yes" : "No"}
                      {selectedRequest.emailSentDate && (
                        <small className="text-muted ms-2">
                          (
                          {new Date(
                            selectedRequest.emailSentDate,
                          ).toLocaleDateString()}
                          )
                        </small>
                      )}
                    </span>
                  </div>

                  <div className="d-flex">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Email Method:
                    </span>
                    <span className="fw-medium text-capitalize">
                      {selectedRequest.emailMethod || "Not specified"}
                    </span>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <h6 className="fw-semibold mb-3">
                    Candidate Information
                  </h6>

                  <div className="d-flex mb-2">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Candidate Type:
                    </span>
                    <span className="fw-medium">
                      {selectedRequest.isExperienced ? "Experienced" : "Fresher"}
                    </span>
                  </div>

                  {selectedRequest.yearsOfExperience && (
                    <div className="d-flex mb-2">
                      <span
                        className="text-muted me-3"
                        style={{ minWidth: "120px" }}
                      >
                        Total Experience:
                      </span>
                      <span className="fw-medium">
                        {selectedRequest.yearsOfExperience} years
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== PERSONAL INFORMATION SECTION ========== */}
        {selectedRequest.personalInfo && (
          <div className="p-4 border-bottom">
            <div className="card border-0 shadow-sm">
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
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Date of Birth
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:calendar" className="me-2 text-info" />
                      <span className="fw-medium">
                        {selectedRequest.personalInfo.dob 
                          ? new Date(selectedRequest.personalInfo.dob).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : selectedRequest.dob
                            ? new Date(selectedRequest.dob).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Gender
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:user-group" className="me-2 text-info" />
                      <span className="fw-medium">
                        {selectedRequest.personalInfo.gender || 
                         selectedRequest.gender || 
                         "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Marital Status */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Marital Status
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:heart" className="me-2 text-info" />
                      <span className="fw-medium">
                        {selectedRequest.personalInfo.maritalStatus || 
                         selectedRequest.maritalStatus || 
                         "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== ADDRESS DETAILS SECTION ========== */}
        {selectedRequest && (
          <div className="p-4 border-bottom">
            <div className="card border-0 shadow-sm">
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
                    {/* Check if current address object exists AND has any non-empty fields */}
                    {selectedRequest.currentAddress &&
                    (selectedRequest.currentAddress.address1 ||
                      selectedRequest.currentAddress.address2 ||
                      selectedRequest.currentAddress.country ||
                      selectedRequest.currentAddress.state ||
                      selectedRequest.currentAddress.district ||
                      selectedRequest.currentAddress.city ||
                      selectedRequest.currentAddress.pincode ||
                      selectedRequest.currentAddress.nationality ||
                      selectedRequest.currentAddress.Nationality) ? (
                      <>
                        {/* Address Line 1 */}
                        <div className="col-12">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Address Line 1
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-start">
                            <Icon
                              icon="heroicons:map"
                              className="me-2 text-primary mt-1"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.address1 ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Address Line 2 */}
                        {selectedRequest.currentAddress.address2 && (
                          <div className="col-12">
                            <label className="form-label fw-semibold text-muted small mb-1">
                              Address Line 2
                            </label>
                            <div className="p-2 bg-light rounded border d-flex align-items-start">
                              <Icon
                                icon="heroicons:map"
                                className="me-2 text-primary mt-1"
                              />
                              <span className="fw-medium">
                                {selectedRequest.currentAddress.address2}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Country */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Country
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:globe-alt"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.country ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* State */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            State
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:map"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.state ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* District */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            District
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:building-library"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.district ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* City */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            City
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:building-office"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.city ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Pincode */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Pincode
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:inbox"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.pincode ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Nationality */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Nationality
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:identification"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.nationality ||
                                selectedRequest.currentAddress.Nationality ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="col-12">
                        <div className="p-3 bg-light rounded border text-center text-muted d-flex flex-column align-items-center">
                          <Icon
                            icon="heroicons:map-pin"
                            width="28"
                            height="28"
                            className="mb-2"
                          />
                          <span>
                            No current address information available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
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
                    {/* Check if permanent address exists, has data, and not same as current */}
                    {selectedRequest.permanentAddress &&
                    !selectedRequest.sameAsCurrentAddress &&
                    (selectedRequest.permanentAddress.address1 ||
                      selectedRequest.permanentAddress.address2 ||
                      selectedRequest.permanentAddress.country ||
                      selectedRequest.permanentAddress.state ||
                      selectedRequest.permanentAddress.district ||
                      selectedRequest.permanentAddress.city ||
                      selectedRequest.permanentAddress.pincode ||
                      selectedRequest.permanentAddress.nationality) ? (
                      <>
                        {/* Address Line 1 */}
                        <div className="col-12">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Address Line 1
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-start">
                            <Icon
                              icon="heroicons:map"
                              className="me-2 text-success mt-1"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress
                                .address1 || "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Address Line 2 */}
                        {selectedRequest.permanentAddress.address2 && (
                          <div className="col-12">
                            <label className="form-label fw-semibold text-muted small mb-1">
                              Address Line 2
                            </label>
                            <div className="p-2 bg-light rounded border d-flex align-items-start">
                              <Icon
                                icon="heroicons:map"
                                className="me-2 text-success mt-1"
                              />
                              <span className="fw-medium">
                                {
                                  selectedRequest.permanentAddress
                                    .address2
                                }
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Country */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Country
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:globe-alt"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress.country ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* State */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            State
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:map"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress.state ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* District */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            District
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:building-library"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress
                                .district || "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* City */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            City
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:building-office"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress.city ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Pincode */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Pincode
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:inbox"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress.pincode ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Nationality */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Nationality
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:identification"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress.nationality ||
                                selectedRequest.permanentAddress.Nationality ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : selectedRequest.sameAsCurrentAddress ? (
                      <div className="col-12">
                        <div className="p-3 bg-light rounded border">
                          <div className="d-flex align-items-center text-dark">
                            <Icon
                              icon="heroicons:information-circle"
                              className="me-2"
                            />
                            <span className="fw-medium">
                              Permanent address is same as current address
                            </span>
                          </div>
                          {selectedRequest.currentAddress && (
                            <div className="mt-2 ps-4 small text-muted">
                              <div>
                                Address:{" "}
                                {selectedRequest.currentAddress.address1}
                              </div>
                              {selectedRequest.currentAddress
                                .address2 && (
                                <div>
                                  {
                                    selectedRequest.currentAddress
                                      .address2
                                  }
                                </div>
                              )}
                              <div>
                                {[
                                  selectedRequest.currentAddress.city,
                                  selectedRequest.currentAddress.district,
                                  selectedRequest.currentAddress.state,
                                  selectedRequest.currentAddress.pincode,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                              <div>
                                Country:{" "}
                                {selectedRequest.currentAddress.country}
                              </div>
                              <div>
                                Nationality:{" "}
                                {selectedRequest.currentAddress
                                  .nationality ||
                                  selectedRequest.currentAddress
                                    .Nationality}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="col-12">
                        <div className="p-4 bg-light rounded border text-center text-muted d-flex flex-column align-items-center justify-content-center">
                          <Icon
                            icon="heroicons:building-office-2"
                            width="28"
                            height="28"
                            className="mb-2 opacity-75"
                          />
                          <span className="fw-medium">
                            No permanent address information available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Verification Status - Optional */}
                {selectedRequest.addressVerified && (
                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2">
                        <Icon
                          icon="heroicons:check-badge"
                          className="me-1"
                        />
                        Address Verified on{" "}
                        {new Date(
                          selectedRequest.addressVerified,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========== EDUCATION QUALIFICATIONS SECTION ========== */}
        {selectedRequest.educationQualifications && selectedRequest.educationQualifications.length > 0 && (
          <div className="p-4 border-bottom">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-info bg-opacity-10 border-0">
                <h6 className="mb-0 fw-semibold d-flex align-items-center">
                  <Icon icon="heroicons:academic-cap" className="me-2" />
                  Education Qualifications
                </h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold">Level</th>
                        <th className="fw-semibold">Institution/Board</th>
                        <th className="fw-semibold">Degree/Branch</th>
                        <th className="fw-semibold">Year</th>
                        <th className="fw-semibold">Marks/CGPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequest.educationQualifications
                        .sort((a, b) => {
                          const levelOrder = { '10th': 1, '12th': 2, 'diploma': 3, 'graduation': 4, 'post_graduation': 5, 'phd': 6, 'certification': 7 };
                          return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
                        })
                        .map((edu, idx) => (
                          <tr key={edu.id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
                            <td className="align-middle">
                              <span className="fw-medium">{edu.levelLabel || edu.level}</span>
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
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== PARENT/GUARDIAN DETAILS SECTION ========== */}
        {selectedRequest.parentGuardian && (
          <div className="p-4 border-bottom">
            <div className="card border-0 shadow-sm">
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
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Parent/Guardian Name
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:user" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.name || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Relationship */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Relationship
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:heart" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.relationship || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Phone Number
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:phone" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.phone || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Employment Status */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Employment Status
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:briefcase" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.employment || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Organization */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Organization
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:building-office-2" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.organization || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Designation
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:identification" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.designation || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Is Legal Guardian */}
                  <div className="col-12">
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon 
                        icon={selectedRequest.parentGuardian.isLegalGuardian ? "heroicons:check-circle" : "heroicons:minus-circle"} 
                        className={`me-2 ${selectedRequest.parentGuardian.isLegalGuardian ? "text-success" : "text-secondary"}`}
                      />
                      <span className={selectedRequest.parentGuardian.isLegalGuardian ? "fw-medium" : "text-muted"}>
                        {selectedRequest.parentGuardian.isLegalGuardian 
                          ? "This person is the legal guardian" 
                          : "Not a legal guardian"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Experience Information */}
        {selectedRequest.isExperienced && selectedRequest.experienceData && (
          <div className="p-4 border-bottom">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-info bg-opacity-10 border-0">
                <h6 className="mb-0 fw-semibold d-flex align-items-center">
                  <Icon icon="heroicons:briefcase" className="me-2" />
                  Work Experience Details
                </h6>
              </div>
              <div className="card-body">
                {/* Current Experience Section */}
                <div className="row g-3">
                  {/* Current/Last Organization */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Organization Name
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:building-office-2"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.currentOrganization ||
                          selectedRequest.experienceData.orgName ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Current/Last Role */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Role
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:briefcase"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.currentRole ||
                          selectedRequest.experienceData.role ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Employment Type */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Employment Type
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:clock"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.employmentType
                          ? selectedRequest.experienceData.employmentType
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1),
                              )
                              .join(" ")
                          : selectedRequest.experienceData.type
                            ? selectedRequest.experienceData.type
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                                )
                                .join(" ")
                            : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Location
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:map-pin"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.location ||
                          selectedRequest.experienceData.experienceLocation ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Current/Last Salary */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Salary (CTC)
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:currency-rupee"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.currentSalary
                          ? `₹ ${new Intl.NumberFormat("en-IN").format(selectedRequest.experienceData.currentSalary)}`
                          : selectedRequest.experienceData.salary
                            ? `₹ ${new Intl.NumberFormat("en-IN").format(selectedRequest.experienceData.salary)}`
                            : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Notice Period */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Notice Period
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:calendar"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.noticePeriod
                          ? selectedRequest.experienceData.noticePeriod
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1),
                              )
                              .join(" ")
                          : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Years of Experience */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Years of Experience
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:chart-bar"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.yearsOfExperience ||
                          selectedRequest.yearsOfExperience ||
                          "0"}{" "}
                        years
                      </span>
                    </div>
                  </div>

                  {/* Joining Date */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Joining Date
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:calendar-days"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.joiningDate
                          ? new Date(
                              selectedRequest.experienceData.joiningDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : selectedRequest.experienceData.experienceJoiningDate
                            ? new Date(
                                selectedRequest.experienceData.experienceJoiningDate,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Relieving Date */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Relieving Date
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:calendar-days"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.relievingDate
                          ? new Date(
                              selectedRequest.experienceData.relievingDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : selectedRequest.experienceData.experienceRelievingDate
                            ? new Date(
                                selectedRequest.experienceData.experienceRelievingDate,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Previous Work Experience History */}
                {selectedRequest.experienceData.previousExperiences &&
                  selectedRequest.experienceData.previousExperiences.length > 0 && (
                    <div className="mt-5 pt-4 border-top">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-info bg-opacity-10 rounded-circle p-2 me-2">
                          <Icon
                            icon="heroicons:briefcase"
                            className="text-info"
                          />
                        </div>
                        <h6 className="fw-semibold mb-0">
                          Previous Work Experience History
                        </h6>
                        <span className="ms-2 badge bg-info bg-opacity-25 text-info border border-info">
                          {selectedRequest.experienceData.previousExperiences.length}{" "}
                          {selectedRequest.experienceData.previousExperiences.length === 1
                            ? "Entry"
                            : "Entries"}
                        </span>
                      </div>

                      {/* Map through each previous experience */}
                      {selectedRequest.experienceData.previousExperiences.map(
                        (exp, index) => (
                          <div
                            key={exp.id || index}
                            className="card mb-4 border-0 shadow-sm"
                          >
                            <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center py-3">
                              <div className="d-flex align-items-center">
                                <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                                  <Icon
                                    icon="heroicons:briefcase"
                                    className="text-info"
                                  />
                                </div>
                                <div>
                                  <h6 className="fw-semibold mb-0">
                                    {exp.organization ||
                                      "Previous Organization"}
                                  </h6>
                                  <small className="text-muted">
                                    {exp.role || "Previous Role"} •
                                    {exp.years
                                      ? ` ${exp.years} years`
                                      : " Not specified"}
                                  </small>
                                </div>
                              </div>
                              <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                                Experience {index + 1}
                              </span>
                            </div>

                            <div className="card-body p-4">
                              <div className="row g-3">
                                {/* Organization */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Organization Name
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:building-office-2"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.organization ||
                                        "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* Role */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Role
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:briefcase"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.role || "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* Employment Type */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Employment Type
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:clock"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.type
                                        ? exp.type
                                            .split("_")
                                            .map(
                                              (word) =>
                                                word
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                word.slice(1),
                                            )
                                            .join(" ")
                                        : "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* Location */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Location
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:map-pin"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.location || "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* Salary */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Salary (CTC)
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:currency-rupee"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.salary
                                        ? `₹ ${new Intl.NumberFormat("en-IN").format(exp.salary)}`
                                        : "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* Years of Experience */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Experience Duration
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:chart-bar"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.years
                                        ? `${exp.years} years`
                                        : "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* From Date */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    From Date
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:calendar"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.fromDate
                                        ? new Date(
                                            exp.fromDate,
                                          ).toLocaleDateString(
                                            "en-US",
                                            {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                            },
                                          )
                                        : "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* To Date */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    To Date
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:calendar"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.toDate
                                        ? new Date(
                                            exp.toDate,
                                          ).toLocaleDateString(
                                            "en-US",
                                            {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                            },
                                          )
                                        : "Not specified"}
                                      {!exp.toDate &&
                                        exp.fromDate &&
                                        " (Present)"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                {/* Empty state for no previous experience */}
                {(!selectedRequest.experienceData.previousExperiences ||
                  selectedRequest.experienceData.previousExperiences.length === 0) && (
                  <div className="mt-5 pt-4 border-top text-center">
                    <div className="d-inline-flex align-items-center justify-content-center bg-info bg-opacity-10 rounded-circle p-3 mb-3">
                      <Icon
                        icon="heroicons:briefcase"
                        className="text-info"
                        style={{ fontSize: "24px" }}
                      />
                    </div>
                    <h6 className="fw-semibold mb-1">
                      No Previous Experience
                    </h6>
                    <p className="text-muted small mb-0">
                      This candidate has no previous work experience history recorded.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="p-4 border-bottom">
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Document Collection</span>
              <span className="fw-semibold">
                {getCompletionPercentage(selectedRequest)}%
              </span>
            </div>
            <div className="progress rounded" style={{ height: "10px" }}>
              <div
                className={`progress-bar bg-${getCompletionPercentage(selectedRequest) === 100 ? "success" : "info"}`}
                style={{
                  width: `${getCompletionPercentage(selectedRequest)}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="row text-center">
            <div className="col-4">
              <div className="fw-bold text-success fs-4">
                {
                  selectedRequest.documents.filter(
                    (d) => d.status === "Completed",
                  ).length
                }
              </div>
              <div className="text-muted small">Completed</div>
            </div>
            <div className="col-4">
              <div className="fw-bold text-warning fs-4">
                {
                  selectedRequest.documents.filter(
                    (d) => d.status === "Pending",
                  ).length
                }
              </div>
              <div className="text-muted small">Pending</div>
            </div>
            <div className="col-4">
              <div className="fw-bold text-dark fs-4">
                {selectedRequest.documents.length}
              </div>
              <div className="text-muted small">Total</div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="p-4">
          <h6 className="fw-semibold mb-3">Documents Status</h6>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th
                    className="fw-semibold text-muted"
                    style={{ width: "25%" }}
                  >
                    Document
                  </th>
                  <th
                    className="fw-semibold text-muted"
                    style={{ width: "20%" }}
                  >
                    Details
                  </th>
                  <th
                    className="fw-semibold text-muted text-center"
                    style={{ width: "20%" }}
                  >
                    Type
                  </th>
                  <th
                    className="fw-semibold text-muted text-center"
                    style={{ width: "20%" }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedRequest.documents.map((doc, index) => {
                  const uploadedDate = doc.uploadedDate || doc.lastUpdated;
                  const fileSize = doc.fileSize
                    ? (doc.fileSize / 1024 / 1024).toFixed(2) + " MB"
                    : null;

                  return (
                    <tr
                      key={doc.id}
                      className={index % 2 === 0 ? "table-light" : ""}
                    >
                      {/* Document */}
                      <td className="align-middle">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center bg-${
                              doc.status === "Completed"
                                ? "success"
                                : "warning"
                            }-subtle`}
                            style={{ width: 34, height: 34 }}
                          >
                            <Icon
                              icon={
                                doc.status === "Completed"
                                  ? "heroicons:check-circle"
                                  : "heroicons:clock"
                              }
                              className={`text-${
                                doc.status === "Completed"
                                  ? "success"
                                  : "warning"
                              }`}
                            />
                          </div>

                          <div>
                            <div className="fw-medium">{doc.name}</div>
                            {doc.description && (
                              <small className="text-muted d-block">
                                {doc.description}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Details */}
                      <td>
                        {doc.status === "Completed" ? (
                          <div className="small text-muted">
                            {uploadedDate && (
                              <div>
                                Uploaded:{" "}
                                {new Date(
                                  uploadedDate,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {fileSize && <div>Size: {fileSize}</div>}
                            {doc.fileType && (
                              <div>
                                Type: {doc.fileType.toUpperCase()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted small">
                            Pending submission
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="align-middle text-center">
                        <span
                          className={`badge rounded-pill bg-${
                            doc.required ? "danger" : "secondary"
                          }`}
                        >
                          {doc.required ? "Required" : "Optional"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="align-middle text-center">
                        <span
                          className={`badge rounded-pill bg-${
                            doc.status === "Completed"
                              ? "success"
                              : "warning"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      {/* Modal Footer */}
      <div className="modal-footer border-top-0">
        <button
          type="button"
          className="close-btn"
          onClick={() => setShowRequestDetails(false)}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm d-flex align-items-center px-3"
          onClick={() => {
            // Find the employee and send email
            const employee = employees.find(
              (e) => e.id === selectedRequest.employeeId,
            );
            if (employee) {
              setSelectedEmployees([employee.id]);
              setShowRequestDetails(false);
              setTimeout(() => handleSendEmail(), 300);
            }
          }}
        >
          <Icon icon="heroicons:envelope" className="me-2" />
          Send Email
        </button>
      </div>
      </Modal>
    </>
  );
};

export default EditBGVRequestModal;
