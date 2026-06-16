import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const DeleteConfirmationModal = (props) => {
  const { employees, setEmployees, selectedEmployees, setSelectedEmployees, activeSection, setActiveSection, searchTerm, setSearchTerm, statusFilter, setStatusFilter, selectedRequest, setSelectedRequest, showRequestDetails, setShowRequestDetails, showEmailModal, setShowEmailModal, emailTemplate, setEmailTemplate, newRequestPhone, setNewRequestPhone, newRequestDepartment, setNewRequestDepartment, newRequestDesignation, setNewRequestDesignation, newRequestEmployeeId, setNewRequestEmployeeId, uploadedDocuments, setUploadedDocuments, emailUploads, setEmailUploads, emailUploadedDocuments, setEmailUploadedDocuments, isExperienced, setIsExperienced, yearsOfExperience, setYearsOfExperience, currentOrganization, setCurrentOrganization, currentRole, setCurrentRole, employmentType, setEmploymentType, currentSalary, setCurrentSalary, noticePeriod, setNoticePeriod, previousExperiences, setPreviousExperiences, globalUploadedDocuments, setGlobalUploadedDocuments, newRequestDob, setNewRequestDob, newRequestGender, setNewRequestGender, newRequestMaritalStatus, setNewRequestMaritalStatus, newRequestParentName, setNewRequestParentName, newRequestParentRelationship, setNewRequestParentRelationship, newRequestParentPhone, setNewRequestParentPhone, newRequestParentEmail, setNewRequestParentEmail, newRequestParentEmployment, setNewRequestParentEmployment, newRequestParentOrganization, setNewRequestParentOrganization, newRequestParentDesignation, setNewRequestParentDesignation, newRequestParentIncome, setNewRequestParentIncome, newRequestParentAddress, setNewRequestParentAddress, newRequestIsGuardian, setNewRequestIsGuardian, educationQualifications, setEducationQualifications, showEducationForm, setShowEducationForm, editingEducation, setEditingEducation, educationLevel, setEducationLevel, schoolCollegeName, setSchoolCollegeName, boardUniversity, setBoardUniversity, passingYear, setPassingYear, joiningYear, setJoiningYear, degree, setDegree, branch, setBranch, percentage, setPercentage, cgpa, setCgpa, gradingSystem, setGradingSystem, experienceOrgName, setExperienceOrgName, experienceRole, setExperienceRole, experienceType, setExperienceType, experienceLocation, setExperienceLocation, experienceSalary, setExperienceSalary, experienceJoiningDate, setExperienceJoiningDate, experienceRelievingDate, setExperienceRelievingDate, experienceHistory, setExperienceHistory, currentAddress, setCurrentAddress, permanentAddress, setPermanentAddress, sameAsCurrent, setSameAsCurrent, showDeleteModal, setShowDeleteModal, employeeToDelete, setEmployeeToDelete, deleting, setDeleting, editingEmployeeId, setEditingEmployeeId, editEmployeeName, setEditEmployeeName, editEmployeePhone, setEditEmployeePhone, editEmployeeEmail, setEditEmployeeEmail, editEmployeeDepartment, setEditEmployeeDepartment, editEmployeeDesignation, setEditEmployeeDesignation, editEmployeeId, setEditEmployeeId, emailSubject, setEmailSubject, documentRequests, setDocumentRequests, sendingEmail, setSendingEmail, emailStatus, setEmailStatus, emailMethod, setEmailMethod, ccEmails, setCcEmails, bccEmails, setBccEmails, showNewRequestModal, setShowNewRequestModal, newRequestEmail, setNewRequestEmail, newRequestName, setNewRequestName, newRequestTemplate, setNewRequestTemplate, newRequestSubject, setNewRequestSubject, handleNewRequest, handleSendEmail, getRequiredDocuments, handleDocumentUpload, handleReplaceDocumentClick, handleRemoveDocument, handleViewDocument, handleReuploadDocument, requiredDocuments, handleUpdateExistingDocument, handleSendNewRequest, handleSendBulkEmail, handleClearEmailUploads, handleDeleteEmployee, handleEmailDocumentUpload, handleSelectEmployee, handleSelectAll, handleUpdateEmailDocument, handleConfirmSendEmail, handlePreviewDocument, handleUpdateDocument, handleEditEmployee, handleSaveEmployeeEdit, handleConfirmSendEmailWithEdits } = props;

  if (!employeeToDelete) return null;

  return (
    <>
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        title="Confirm Delete" 
        size="md"
      >
        <div className="p-4">
          <div className="text-center">
            {/* Compact warning icon */}
            <div className="mb-3">
              <div className="inline-flex items-center justify-content-center bg-rose-50 rounded-full p-3">
                <Icon
                  icon="heroicons:trash"
                  className="text-rose-600 w-8 h-8"
                />
              </div>
            </div>

            {/* Main message - more compact */}
            <h6 className="text-lg font-bold text-gray-900 mb-2">Delete Permanently?</h6>
            <p className="text-gray-500 text-sm mb-4">
              Delete document request for{" "}
              <strong className="font-semibold text-gray-900">{employeeToDelete.name}</strong>?
            </p>

            {/* Compact warning alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left">
              <div className="flex items-start gap-2 text-amber-800 text-sm">
                <Icon
                  icon="heroicons:exclamation-circle"
                  className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <strong className="font-semibold block mb-0.5">Warning:</strong>
                  <span className="text-xs text-amber-700">This action cannot be undone.</span>
                </div>
              </div>
            </div>

            {/* Compact employee details */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4 text-sm space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Employee:</span>
                <span className="font-semibold text-gray-800 truncate max-w-[200px]">
                  {employeeToDelete.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Email:</span>
                <span className="font-semibold text-gray-800 truncate max-w-[180px]">
                  {employeeToDelete.email}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Employee ID:</span>
                <span className="font-semibold text-gray-800">
                  {employeeToDelete.employeeId}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer - Compact */}
          <div className="flex w-full gap-3 mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              className="flex-1 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-all"
              onClick={() => {
                setShowDeleteModal(false);
                setEmployeeToDelete(null);
                setDeleting(false);
              }}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all"
              onClick={async () => {
                setDeleting(true);

                try {
                  await handleDeleteEmployee(employeeToDelete.id);

                  // Show success status
                  setEmailStatus({
                    type: "success",
                    message: `Successfully deleted request for ${employeeToDelete.name}`,
                  });

                  // Close modal after delay
                  setTimeout(() => {
                    setShowDeleteModal(false);
                    setEmployeeToDelete(null);
                    setDeleting(false);

                    // Clear success message after 3 seconds
                    setTimeout(() => {
                      setEmailStatus({ type: "", message: "" });
                    }, 3000);
                  }, 1000);
                } catch (error) {
                  console.error("Error deleting request:", error);
                  setEmailStatus({
                    type: "error",
                    message:
                      "Failed to delete request. Please try again.",
                  });
                  setDeleting(false);
                }
              }}
            >
              {deleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Icon
                    icon="heroicons:trash"
                    className="w-4 h-4"
                  />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;
