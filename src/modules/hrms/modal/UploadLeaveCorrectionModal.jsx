import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const UploadLeaveCorrectionModal = ({
  isOpen,
  onClose,
  financialYear,
  onUpload
}) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      if (validTypes.includes(selectedFile.type) || 
          selectedFile.name.endsWith('.xlsx') || 
          selectedFile.name.endsWith('.xls') || 
          selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setUploadProgress(0);
      } else {
        alert('Please upload a valid Excel or CSV file');
        e.target.value = '';
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      if (validTypes.includes(droppedFile.type) || 
          droppedFile.name.endsWith('.xlsx') || 
          droppedFile.name.endsWith('.xls') || 
          droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setUploadProgress(0);
      } else {
        alert('Please upload a valid Excel or CSV file');
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        onUpload(file);
        onClose();
        setFile(null);
        setUploadProgress(0);
      }
    }, 300);
  };

  const formatFileSize = (size) => {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Leave Corrections"
      size="lg"
    >
      <div className="space-y-6 p-4">
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon icon="heroicons:calendar" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h6 className="text-sm font-bold text-slate-800">Period: {financialYear}</h6>
            <p className="text-xs text-slate-500 mt-0.5">Upload leave correction data for the selected period</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Upload File <span className="text-rose-500">*</span>
          </label>
          
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Icon icon="heroicons:arrow-up-tray" className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Drag & drop your file here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    or <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      browse files
                    </button>
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  Supported formats: .xlsx, .xls, .csv
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl p-5 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon="heroicons:document-text" className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      onClick={handleRemoveFile}
                      title="Remove file"
                    >
                      <Icon icon="heroicons:x-mark" className="w-5 h-5" />
                    </button>
                  </div>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border border-slate-200 rounded-2xl p-4">
          <h6 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
            <Icon icon="heroicons:information-circle" className="w-4 h-4 text-slate-500" />
            File Requirements
          </h6>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <Icon icon="heroicons:check-circle" className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>File must be in <strong>.xlsx</strong>, <strong>.xls</strong>, or <strong>.csv</strong> format</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon icon="heroicons:check-circle" className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>First row must contain column headers</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon icon="heroicons:check-circle" className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Required columns: <strong>Employee ID</strong>, <strong>Correction Value</strong>, <strong>Leave Type</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <Icon icon="heroicons:check-circle" className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Correction values must be positive numbers</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon icon="heroicons:check-circle" className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Maximum file size: <strong>5 MB</strong></span>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Icon icon="heroicons:document" className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Need a template?</p>
              <p className="text-xs text-slate-400">Download the sample template to get started</p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
            onClick={() => {
              alert('Downloading template...');
            }}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Download Template
          </button>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
              file
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            onClick={handleUpload}
            disabled={!file}
          >
            <Icon icon="heroicons:arrow-up-tray" className="w-4 h-4" />
            Upload File
          </button>
        </div> 
      </div>
    </Modal>
  );
};

export default UploadLeaveCorrectionModal;