import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const VersionHistoryModal = ({ isOpen, onClose, document, onUploadVersion }) => {
  const [uploadFile, setUploadFile] = useState(null);

  if (!document) return null;

  const handleUpload = () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }
    onUploadVersion(uploadFile);
    setUploadFile(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Version History - ${document.name}`} size="lg">
      <div className="space-y-4">
        {document.versionHistory && document.versionHistory.length > 0 ? (
          <div className="space-y-2">
            {document.versionHistory.map((version, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      Version {version.version}
                    </span>
                    {version.version === document.version && (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(version.uploadDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-2">
                  <span className="font-semibold">Uploaded by:</span> {version.uploadedBy}
                </p>
                {version.changes && (
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-semibold">Changes:</span> {version.changes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Icon icon="heroicons:clock" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No version history available</p>
          </div>
        )}

        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Upload New Version</h6>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
            <button
              onClick={handleUpload}
              disabled={!uploadFile}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon icon="heroicons:arrow-up-tray" className="w-4 h-4" />
              Upload Version
            </button>
          </div>
          {uploadFile && (
            <p className="text-xs text-slate-500 mt-2">
              Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
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

export default VersionHistoryModal;