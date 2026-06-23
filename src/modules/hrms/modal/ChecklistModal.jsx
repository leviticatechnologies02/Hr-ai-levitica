import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ChecklistModal = ({ 
  isOpen, 
  onClose, 
  employee, 
  documents,
  getMandatoryDocumentsForEmployee,
  getEmployeeDocumentStatus,
  getStatusBadge,
  onViewDocument,
  onEditDocument,
  onUploadDocument
}) => {
  if (!employee) return null;

  const docStatus = getEmployeeDocumentStatus(employee);
  const mandatoryDocs = getMandatoryDocumentsForEmployee(employee);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Mandatory Document Checklist - ${employee.name}`} size="lg">
      <div className="space-y-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Employee Type:</span> {employee.employeeType || 'N/A'}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Required Documents:</span> {mandatoryDocs.length}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold text-slate-600">Document Name</th>
                <th className="p-3 font-semibold text-slate-600">Status</th>
                <th className="p-3 font-semibold text-slate-600">Upload Date</th>
                <th className="p-3 font-semibold text-slate-600">Version</th>
                <th className="p-3 font-semibold text-slate-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docStatus.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {item.uploaded ? (
                        <Icon icon="heroicons:check-circle" className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Icon icon="heroicons:x-circle" className="w-4 h-4 text-rose-500" />
                      )}
                      <span className={item.uploaded ? 'text-slate-800' : 'text-slate-400'}>
                        {item.name}
                      </span>
                      {!item.uploaded && (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                          Missing
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    {item.uploaded ? getStatusBadge(item.status) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        Not Uploaded
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-600">
                    {item.document?.uploadDate ? new Date(item.document.uploadDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-3">
                    {item.document?.version ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        v{item.document.version}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-3 text-center">
                    {item.document ? (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewDocument(item.document)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                          title="View"
                        >
                          <Icon icon="heroicons:eye" className="w-3 h-3 text-slate-600" />
                        </button>
                        <button
                          onClick={() => onEditDocument(item.document)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Icon icon="heroicons:pencil" className="w-3 h-3 text-blue-600" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onUploadDocument(item.name)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition"
                      >
                        <Icon icon="heroicons:plus" className="w-3 h-3 inline mr-1" />
                        Upload
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChecklistModal;