import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const DocumentModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  document, 
  employees, 
  documentTypes,
  categories,
  statuses 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    documentType: '',
    category: 'KYC',
    employee: '',
    employeeType: '',
    expiryDate: '',
    status: 'pending',
    mandatory: false,
    fileType: 'pdf',
    downloadRestricted: false
  });
  const [uploadFile, setUploadFile] = useState(null);
  const isEditing = !!document;

  useEffect(() => {
    if (isOpen) {
      if (document) {
        setFormData({
          name: document.name || '',
          documentType: document.documentType || document.name || '',
          category: document.category || 'KYC',
          employee: document.employee?.id?.toString() || '',
          employeeType: document.employee?.employeeType || '',
          expiryDate: document.expiryDate || '',
          status: document.status || 'pending',
          mandatory: document.mandatory || false,
          fileType: document.fileType || 'pdf',
          downloadRestricted: document.downloadRestricted || false
        });
      } else {
        setFormData({
          name: '',
          documentType: '',
          category: 'KYC',
          employee: '',
          employeeType: '',
          expiryDate: '',
          status: 'pending',
          mandatory: false,
          fileType: 'pdf',
          downloadRestricted: false
        });
        setUploadFile(null);
      }
    }
  }, [isOpen, document]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.employee) {
      alert('Please fill in all required fields');
      return;
    }
    if (!isEditing && !uploadFile) {
      alert('Please select a file to upload');
      return;
    }
    onSubmit(formData, uploadFile);
  };

  const handleDocumentTypeChange = (docType) => {
    const category = Object.keys(documentTypes).find(cat => 
      documentTypes[cat].includes(docType)
    );
    setFormData({ 
      ...formData, 
      documentType: docType,
      name: docType,
      category: category || formData.category
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Document' : 'Upload New Document'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">
              Document Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.documentType}
              onChange={(e) => handleDocumentTypeChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              required
            >
              <option value="">Select Document Type</option>
              {Object.entries(documentTypes).map(([category, types]) => (
                <optgroup key={category} label={category}>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">
              Document Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              placeholder="Enter document name"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              required
            >
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Employee <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.employee}
              onChange={(e) => {
                const emp = employees.find(emp => emp.id === parseInt(e.target.value));
                setFormData({ 
                  ...formData, 
                  employee: e.target.value,
                  employeeType: emp?.employeeType || ''
                });
              }}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id.toString()}>
                  {emp.name} ({emp.employeeType})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            >
              {statuses.filter(s => s !== 'all').map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.mandatory}
                onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Mandatory Document
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.downloadRestricted}
                onChange={(e) => setFormData({ ...formData, downloadRestricted: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Restrict Download
            </label>
          </div>
          {!isEditing && (
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Upload File <span className="text-rose-500">*</span>
              </label>
              <input
                type="file"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setUploadFile(e.target.files[0])}
                required={!isEditing}
              />
              {uploadFile && (
                <div className="mt-2 text-xs text-slate-500">
                  Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Icon icon={isEditing ? 'heroicons:pencil-square' : 'heroicons:arrow-up-tray'} className="w-4 h-4" />
            {isEditing ? 'Update Document' : 'Upload Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DocumentModal;