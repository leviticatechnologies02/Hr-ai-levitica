import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const DocumentViewerModal = ({ isOpen, onClose, document, onDownload, currentUser }) => {
  if (!document) return null;

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: 'heroicons:document-text',
      docx: 'heroicons:document',
      jpg: 'heroicons:photo',
      jpeg: 'heroicons:photo',
      png: 'heroicons:photo'
    };
    return icons[fileType] || 'heroicons:document';
  };

  const isRestricted = document.downloadRestricted && 
    currentUser?.role !== 'HR Manager' && 
    currentUser?.role !== 'HR Admin';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={document.name} size="xl">
      <div className="space-y-4">
        <div className="relative bg-slate-50 rounded-xl border border-slate-200 min-h-[400px] flex items-center justify-center overflow-hidden">
         
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10"
            style={{ transform: 'rotate(-45deg)' }}
          >
            <span className="text-6xl font-bold text-slate-900">CONFIDENTIAL</span>
          </div>
          
          <div className="relative z-10 w-full p-4">
            {document.fileType === 'pdf' ? (
              <iframe
                src={document.fileUrl}
                className="w-full rounded-lg"
                style={{ height: '500px', border: 'none' }}
                title={document.name}
              />
            ) : ['jpg', 'jpeg', 'png'].includes(document.fileType) ? (
              <img
                src={document.fileUrl}
                alt={document.name}
                className="max-h-[500px] w-auto mx-auto rounded-lg shadow-sm"
              />
            ) : (
              <div className="text-center py-12">
                <Icon icon={getFileIcon(document.fileType)} className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-sm">Preview not available for {document.fileType.toUpperCase()} files</p>
                <button
                  onClick={() => onDownload(document)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                  disabled={isRestricted}
                >
                  <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4 inline mr-2" />
                  Download to View
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-500">Version: <span className="font-semibold text-slate-700">{document.version}</span></p>
              <p className="text-slate-500">Uploaded: <span className="font-semibold text-slate-700">{new Date(document.uploadDate).toLocaleDateString()}</span></p>
              <p className="text-slate-500">Size: <span className="font-semibold text-slate-700">{document.size}</span></p>
            </div>
            <div className="sm:text-right">
              {document.approvedBy && (
                <>
                  <p className="text-slate-500">Approved by: <span className="font-semibold text-slate-700">{document.approvedBy.name}</span></p>
                  <p className="text-slate-500">Approved on: <span className="font-semibold text-slate-700">{new Date(document.approvedDate).toLocaleDateString()}</span></p>
                </>
              )}
              {document.category && (
                <p className="text-slate-500">Category: <span className="font-semibold text-slate-700">{document.category}</span></p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onDownload(document)}
            disabled={isRestricted}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              isRestricted 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentViewerModal;