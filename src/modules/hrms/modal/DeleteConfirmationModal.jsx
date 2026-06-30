import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const DeleteConfirmationModal = (props) => {
  // Detect which mode we're in
  const isLoansMode = props.loan !== undefined || props.onConfirm !== undefined;
  const isDocumentMode = props.employeeToDelete !== undefined || props.handleDeleteEmployee !== undefined;
  const isReportMode = props.reportToDelete !== undefined || props.onConfirmDelete !== undefined;
  const isSettlementMode = props.settlementToDelete !== undefined || props.onDeleteSettlement !== undefined;

  // Common props
  const {
    isOpen,
    onClose,
    title = "Confirm Delete",
    deleting = false,
    setDeleting = () => {},
    onConfirm,
    formatCurrency,
    getStatusBadge,
    loan,
  } = props;

  // Document mode props
  const {
    showDeleteModal,
    setShowDeleteModal,
    employeeToDelete,
    setEmployeeToDelete,
    handleDeleteEmployee,
    setEmailStatus,
  } = props;

  // Report mode props
  const {
    reportToDelete,
    onConfirmDelete,
    reportName = '',
  } = props;

  // Settlement mode props
  const {
    settlementToDelete,
    onDeleteSettlement,
  } = props;

  // Determine which modal is open
  const isModalOpen = isLoansMode ? isOpen : 
                      isReportMode ? isOpen :
                      isSettlementMode ? isOpen :
                      showDeleteModal;

  // Handle close based on mode
  const handleClose = () => {
    if (isLoansMode && onClose) {
      onClose();
    } else if (isReportMode && onClose) {
      onClose();
    } else if (isSettlementMode && onClose) {
      onClose();
    } else if (isDocumentMode && setShowDeleteModal) {
      setShowDeleteModal(false);
      if (setEmployeeToDelete) setEmployeeToDelete(null);
      if (setDeleting) setDeleting(false);
    }
  };

  // Handle delete based on mode
  const handleDelete = async () => {
    // Loans mode
    if (isLoansMode && onConfirm && loan) {
      setDeleting(true);
      try {
        await onConfirm(loan);
      } catch (error) {
        console.error('Error deleting loan:', error);
        setDeleting(false);
      }
    } 
    // Report mode
    else if (isReportMode && onConfirmDelete && reportToDelete) {
      setDeleting(true);
      try {
        await onConfirmDelete(reportToDelete);
        setDeleting(false);
      } catch (error) {
        console.error('Error deleting report:', error);
        setDeleting(false);
      }
    }
    // Settlement mode
    else if (isSettlementMode && onDeleteSettlement && settlementToDelete) {
      setDeleting(true);
      try {
        await onDeleteSettlement(settlementToDelete);
        setDeleting(false);
      } catch (error) {
        console.error('Error deleting settlement:', error);
        setDeleting(false);
      }
    }
    // Document mode
    else if (isDocumentMode && handleDeleteEmployee && employeeToDelete) {
      setDeleting(true);
      try {
        await handleDeleteEmployee(employeeToDelete.id);
        if (setEmailStatus) {
          setEmailStatus({
            type: "success",
            message: `Successfully deleted request for ${employeeToDelete.name}`,
          });
        }
        setTimeout(() => {
          if (setShowDeleteModal) setShowDeleteModal(false);
          if (setEmployeeToDelete) setEmployeeToDelete(null);
          if (setDeleting) setDeleting(false);
          if (setEmailStatus) {
            setTimeout(() => {
              setEmailStatus({ type: "", message: "" });
            }, 3000);
          }
        }, 1000);
      } catch (error) {
        console.error("Error deleting request:", error);
        if (setEmailStatus) {
          setEmailStatus({
            type: "error",
            message: "Failed to delete request. Please try again.",
          });
        }
        if (setDeleting) setDeleting(false);
      }
    }
  };

  // Get item details based on mode
  const getItemName = () => {
    if (isLoansMode && loan) return loan.employeeName || loan.name || 'N/A';
    if (isReportMode && reportToDelete) return reportToDelete.name || reportName || 'N/A';
    if (isSettlementMode && settlementToDelete) return settlementToDelete.employeeName || settlementToDelete.name || 'N/A';
    if (isDocumentMode && employeeToDelete) return employeeToDelete.name || 'N/A';
    return 'N/A';
  };

  const getItemId = () => {
    if (isLoansMode && loan) return loan.loanId || loan.id || 'N/A';
    if (isReportMode && reportToDelete) return reportToDelete.id || 'N/A';
    if (isSettlementMode && settlementToDelete) return settlementToDelete.id || 'N/A';
    if (isDocumentMode && employeeToDelete) return employeeToDelete.employeeId || employeeToDelete.id || 'N/A';
    return 'N/A';
  };

  const getItemEmail = () => {
    if (isLoansMode && loan) return loan.employeeId || loan.email || 'N/A';
    if (isDocumentMode && employeeToDelete) return employeeToDelete.email || 'N/A';
    return 'N/A';
  };

  const getItemStatus = () => {
    if (isLoansMode && loan && getStatusBadge) {
      return getStatusBadge(loan.status);
    }
    if (isSettlementMode && settlementToDelete && getStatusBadge) {
      return getStatusBadge(settlementToDelete.status);
    }
    return null;
  };

  const getItemAmount = () => {
    if (isLoansMode && loan && formatCurrency) {
      return formatCurrency(loan.amount);
    }
    if (isSettlementMode && settlementToDelete && formatCurrency) {
      return formatCurrency(settlementToDelete.amount || settlementToDelete.netAmount);
    }
    return null;
  };

  const getItemType = () => {
    if (isLoansMode && loan) return loan.loanType || 'N/A';
    if (isReportMode && reportToDelete) return reportToDelete.category || 'N/A';
    if (isSettlementMode && settlementToDelete) return settlementToDelete.type || 'N/A';
    return 'N/A';
  };

  const getItemDepartment = () => {
    if (isReportMode && reportToDelete) return reportToDelete.department || 'N/A';
    if (isSettlementMode && settlementToDelete) return settlementToDelete.department || 'N/A';
    if (isDocumentMode && employeeToDelete) return employeeToDelete.department || 'N/A';
    return 'N/A';
  };

  const getModalTitle = () => {
    if (isLoansMode && loan) return `Delete Loan - ${loan.loanId || 'N/A'}`;
    if (isReportMode && reportToDelete) return `Delete Report - ${reportToDelete.name || 'N/A'}`;
    if (isSettlementMode && settlementToDelete) return `Delete Settlement - ${settlementToDelete.id || 'N/A'}`;
    if (isDocumentMode) return title;
    return "Confirm Delete";
  };

  // If modal is not open, don't render
  if (!isModalOpen) return null;

  // If in loans mode but no loan data, don't render
  if (isLoansMode && !loan) return null;

  // If in report mode but no report data, don't render
  if (isReportMode && !reportToDelete) return null;

  // If in settlement mode but no settlement data, don't render
  if (isSettlementMode && !settlementToDelete) return null;

  // If in document mode but no employee to delete, don't render
  if (isDocumentMode && !employeeToDelete) return null;

  // Get the appropriate item for the current mode
  const item = isLoansMode ? loan : 
               isReportMode ? reportToDelete :
               isSettlementMode ? settlementToDelete :
               employeeToDelete;

  // Get the appropriate delete message
  const getDeleteMessage = () => {
    if (isLoansMode) {
      return <>Delete loan record for <strong className="font-semibold text-gray-900">{getItemName()}</strong>?</>;
    }
    if (isReportMode) {
      return <>Delete report <strong className="font-semibold text-gray-900">{getItemName()}</strong>?</>;
    }
    if (isSettlementMode) {
      return <>Delete settlement record for <strong className="font-semibold text-gray-900">{getItemName()}</strong>?</>;
    }
    return <>Delete document request for <strong className="font-semibold text-gray-900">{getItemName()}</strong>?</>;
  };

  // Get the warning message
  const getWarningMessage = () => {
    if (isLoansMode) {
      return "This action cannot be undone. All loan data including payment history will be permanently deleted.";
    }
    if (isReportMode) {
      return "This action cannot be undone. The report and all its data will be permanently deleted.";
    }
    if (isSettlementMode) {
      return "This action cannot be undone. All settlement data including payment history will be permanently deleted.";
    }
    return "This action cannot be undone.";
  };

  // Render details section based on mode
  const renderDetails = () => {
    if (isLoansMode) {
      return (
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
          <div className="text-left">
            <span className="text-slate-500">Loan ID:</span>
            <span className="font-semibold text-slate-800 block">{getItemId()}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500">Loan Type:</span>
            <span className="font-semibold text-slate-800 block">{getItemType()}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500">Amount:</span>
            <span className="font-semibold text-blue-600 block">{getItemAmount()}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500">Status:</span>
            <span className="block">{getItemStatus()}</span>
          </div>
          <div className="text-left col-span-2">
            <span className="text-slate-500">Employee:</span>
            <span className="font-semibold text-slate-800 block">{getItemName()}</span>
          </div>
        </div>
      );
    }

    if (isReportMode) {
      return (
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
          <div className="text-left col-span-2">
            <span className="text-slate-500">Report Name:</span>
            <span className="font-semibold text-slate-800 block">{getItemName()}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500">Category:</span>
            <span className="font-semibold text-slate-800 block">{getItemType()}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500">Department:</span>
            <span className="font-semibold text-slate-800 block">{getItemDepartment()}</span>
          </div>
        </div>
      );
    }

    if (isSettlementMode) {
      return (
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
          <div className="text-left">
            <span className="text-slate-500">Settlement ID:</span>
            <span className="font-semibold text-slate-800 block">{getItemId()}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500">Type:</span>
            <span className="font-semibold text-slate-800 block">{getItemType()}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500">Amount:</span>
            <span className="font-semibold text-blue-600 block">{getItemAmount()}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500">Status:</span>
            <span className="block">{getItemStatus()}</span>
          </div>
          <div className="text-left col-span-2">
            <span className="text-slate-500">Employee:</span>
            <span className="font-semibold text-slate-800 block">{getItemName()}</span>
          </div>
        </div>
      );
    }

    // Document mode
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4 text-sm space-y-2 text-left">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Employee:</span>
          <span className="font-semibold text-gray-800 truncate max-w-[200px]">
            {getItemName()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Email:</span>
          <span className="font-semibold text-gray-800 truncate max-w-[180px]">
            {getItemEmail()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Employee ID:</span>
          <span className="font-semibold text-gray-800">
            {getItemId()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Department:</span>
          <span className="font-semibold text-gray-800">
            {getItemDepartment()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Modal 
      isOpen={isModalOpen} 
      onClose={handleClose} 
      title={getModalTitle()} 
      size="md"
    >
      <div className="p-4">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mb-3">
            <div className="inline-flex items-center justify-center bg-rose-50 rounded-full p-3">
              <Icon
                icon="heroicons:trash"
                className="text-rose-600 w-8 h-8"
              />
            </div>
          </div>

          {/* Main Message */}
          <h6 className="text-lg font-bold text-gray-900 mb-2">Delete Permanently?</h6>
          <p className="text-gray-500 text-sm mb-4">
            {getDeleteMessage()}
          </p>

          {/* Warning Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left">
            <div className="flex items-start gap-2 text-amber-800 text-sm">
              <Icon
                icon="heroicons:exclamation-circle"
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <strong className="font-semibold block mb-0.5">Warning:</strong>
                <span className="text-xs text-amber-700">
                  {getWarningMessage()}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          {renderDetails()}
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-3 mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            className="flex-1 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-all"
            onClick={handleClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDelete}
            disabled={deleting}
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
                <Icon icon="heroicons:trash" className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;