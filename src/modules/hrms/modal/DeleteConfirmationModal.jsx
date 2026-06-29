import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const DeleteConfirmationModal = (props) => {
  const isLoansMode = props.loan !== undefined || props.onConfirm !== undefined;
  const isDocumentMode = props.employeeToDelete !== undefined || props.handleDeleteEmployee !== undefined;

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

  const {
    showDeleteModal,
    setShowDeleteModal,
    employeeToDelete,
    setEmployeeToDelete,
    handleDeleteEmployee,
    setEmailStatus,
  } = props;

  const isModalOpen = isLoansMode ? isOpen : showDeleteModal;

  const handleClose = () => {
    if (isLoansMode && onClose) {
      onClose();
    } else if (isDocumentMode && setShowDeleteModal) {
      setShowDeleteModal(false);
      if (setEmployeeToDelete) setEmployeeToDelete(null);
      if (setDeleting) setDeleting(false);
    }
  };

  const handleDelete = async () => {
    if (isLoansMode && onConfirm && loan) {
      setDeleting(true);
      try {
        await onConfirm(loan);
      } catch (error) {
        console.error('Error deleting loan:', error);
        setDeleting(false);
      }
    } else if (isDocumentMode && handleDeleteEmployee && employeeToDelete) {
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

  const getItemName = () => {
    if (isLoansMode && loan) return loan.employeeName || loan.name || 'N/A';
    if (isDocumentMode && employeeToDelete) return employeeToDelete.name || 'N/A';
    return 'N/A';
  };

  const getItemEmail = () => {
    if (isLoansMode && loan) return loan.employeeId || loan.email || 'N/A';
    if (isDocumentMode && employeeToDelete) return employeeToDelete.email || 'N/A';
    return 'N/A';
  };

  const getItemId = () => {
    if (isLoansMode && loan) return loan.loanId || loan.id || 'N/A';
    if (isDocumentMode && employeeToDelete) return employeeToDelete.employeeId || employeeToDelete.id || 'N/A';
    return 'N/A';
  };

  const getItemStatus = () => {
    if (isLoansMode && loan && getStatusBadge) {
      return getStatusBadge(loan.status);
    }
    return null;
  };

  const getItemAmount = () => {
    if (isLoansMode && loan && formatCurrency) {
      return formatCurrency(loan.amount);
    }
    return null;
  };

  const getItemType = () => {
    if (isLoansMode && loan) return loan.loanType || 'N/A';
    return 'N/A';
  };

  const getModalTitle = () => {
    if (isLoansMode && loan) return `Delete Loan - ${loan.loanId || 'N/A'}`;
    if (isDocumentMode) return title;
    return "Confirm Delete";
  };

  if (!isModalOpen) return null;

  if (isLoansMode && !loan) return null;

  if (isDocumentMode && !employeeToDelete) return null;

  const item = isLoansMode ? loan : employeeToDelete;

  return (
    <Modal 
      isOpen={isModalOpen} 
      onClose={handleClose} 
      title={getModalTitle()} 
      size="md"
    >
      <div className="p-4">
        <div className="text-center">
          <div className="mb-3">
            <div className="inline-flex items-center justify-center bg-rose-50 rounded-full p-3">
              <Icon
                icon="heroicons:trash"
                className="text-rose-600 w-8 h-8"
              />
            </div>
          </div>

          <h6 className="text-lg font-bold text-gray-900 mb-2">Delete Permanently?</h6>
          <p className="text-gray-500 text-sm mb-4">
            {isLoansMode ? (
              <>Delete loan record for <strong className="font-semibold text-gray-900">{getItemName()}</strong>?</>
            ) : (
              <>Delete document request for <strong className="font-semibold text-gray-900">{getItemName()}</strong>?</>
            )}
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left">
            <div className="flex items-start gap-2 text-amber-800 text-sm">
              <Icon
                icon="heroicons:exclamation-circle"
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <strong className="font-semibold block mb-0.5">Warning:</strong>
                <span className="text-xs text-amber-700">
                  {isLoansMode 
                    ? "This action cannot be undone. All loan data including payment history will be permanently deleted."
                    : "This action cannot be undone."
                  }
                </span>
              </div>
            </div>
          </div>

          {isLoansMode ? (
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
          ) : (
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
            </div>
          )}
        </div>

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