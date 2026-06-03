import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import RecruiterDashboardLayout from "../../../app/layouts/RecruiterDashboardLayout";

// Document Types Configuration
const DOCUMENT_TYPES = {
  Educational: [
    '10th Certificate',
    '12th Certificate',
    'Graduation Certificate',
    'Post-Graduation Certificate',
    'Diploma Certificate',
    'Professional Certifications'
  ],
  Employment: [
    'Offer Letter',
    'Appointment Letter',
    'Employment Contract',
    'Experience Letter',
    'Relieving Letter',
    'Resignation Letter'
  ],
  KYC: [
    'Aadhaar Card',
    'PAN Card',
    'Passport Copy',
    'Voter ID',
    'Driving License'
  ],
  Statutory: [
    'Bank Account Proof',
    'Cancelled Cheque',
    'Bank Passbook',
    'PF Nomination Form',
    'ESIC Card'
  ],
  Miscellaneous: [
    'Medical Fitness Certificate',
    'Police Verification',
    'NDA Agreement',
    'Confidentiality Agreement',
    'Code of Conduct Acknowledgment',
    'Policy Acknowledgment Forms',
    'Address Proof'
  ]
};

// Employee Types and Mandatory Documents
const EMPLOYEE_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern', 'Consultant'];
const MANDATORY_DOCUMENTS = {
  'Full-time': [
    'Aadhaar Card', 'PAN Card', 'Offer Letter', 'Appointment Letter',
    'Employment Contract', 'Bank Account Proof', 'Medical Fitness Certificate',
    'NDA Agreement', 'Code of Conduct Acknowledgment'
  ],
  'Part-time': [
    'Aadhaar Card', 'PAN Card', 'Offer Letter', 'Appointment Letter',
    'Bank Account Proof', 'NDA Agreement'
  ],
  'Contract': [
    'Aadhaar Card', 'PAN Card', 'Offer Letter', 'Employment Contract',
    'Bank Account Proof', 'NDA Agreement'
  ],
  'Intern': [
    'Aadhaar Card', 'Offer Letter', 'NDA Agreement'
  ],
  'Consultant': [
    'PAN Card', 'Employment Contract', 'NDA Agreement', 'Confidentiality Agreement'
  ]
};

// Document Templates
const DOCUMENT_TEMPLATES = [
  { id: 1, name: 'Offer Letter Template', category: 'Employment', fileType: 'docx', size: '45 KB' },
  { id: 2, name: 'Appointment Letter Template', category: 'Employment', fileType: 'docx', size: '52 KB' },
  { id: 3, name: 'Employment Contract Template', category: 'Employment', fileType: 'docx', size: '68 KB' },
  { id: 4, name: 'NDA Agreement Template', category: 'Miscellaneous', fileType: 'docx', size: '38 KB' },
  { id: 5, name: 'Confidentiality Agreement Template', category: 'Miscellaneous', fileType: 'docx', size: '42 KB' },
  { id: 6, name: 'Code of Conduct Template', category: 'Miscellaneous', fileType: 'docx', size: '35 KB' },
  { id: 7, name: 'Relieving Letter Template', category: 'Employment', fileType: 'docx', size: '28 KB' }
];

// Mock API functions for documents
const mockAPI = {
  fetchDocuments: async (filters) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      documents: [
        {
          id: 1,
          name: "Aadhaar Card",
          documentType: "Aadhaar Card",
          category: "KYC",
          employee: { id: 1, name: "John Doe", employeeType: "Full-time" },
          uploadDate: "2025-10-10",
          expiryDate: "2030-10-10",
          status: "approved",
          version: "1.0",
          versionHistory: [
            { version: "1.0", uploadDate: "2025-10-10", uploadedBy: "John Doe", changes: "Initial upload" }
          ],
          mandatory: true,
          fileType: "pdf",
          size: "2.4 MB",
          fileUrl: "https://example.com/documents/aadhaar.pdf",
          uploadedBy: { id: 1, name: "John Doe" },
          approvedBy: { id: 2, name: "HR Manager" },
          approvedDate: "2025-10-11",
          approvalComments: "Document verified and approved",
          downloadRestricted: false,
          auditTrail: [
            { action: "uploaded", user: "John Doe", timestamp: "2025-10-10T10:00:00Z" },
            { action: "approved", user: "HR Manager", timestamp: "2025-10-11T14:30:00Z" }
          ]
        },
        {
          id: 2,
          name: "Graduation Certificate",
          documentType: "Graduation Certificate",
          category: "Educational",
          employee: { id: 2, name: "Jane Smith", employeeType: "Full-time" },
          uploadDate: "2025-10-05",
          expiryDate: null,
          status: "pending",
          version: "1.0",
          versionHistory: [
            { version: "1.0", uploadDate: "2025-10-05", uploadedBy: "Jane Smith", changes: "Initial upload" }
          ],
          mandatory: true,
          fileType: "pdf",
          size: "1.8 MB",
          fileUrl: "https://example.com/documents/graduation.pdf",
          uploadedBy: { id: 2, name: "Jane Smith" },
          approvedBy: null,
          approvedDate: null,
          approvalComments: null,
          downloadRestricted: true,
          auditTrail: [
            { action: "uploaded", user: "Jane Smith", timestamp: "2025-10-05T09:15:00Z" }
          ]
        },
        {
          id: 3,
          name: "Employment Contract",
          documentType: "Employment Contract",
          category: "Employment",
          employee: { id: 3, name: "Mike Johnson", employeeType: "Full-time" },
          uploadDate: "2025-10-01",
          expiryDate: "2026-10-01",
          status: "approved",
          version: "2.1",
          versionHistory: [
            { version: "1.0", uploadDate: "2025-09-15", uploadedBy: "HR Admin", changes: "Initial contract" },
            { version: "2.0", uploadDate: "2025-09-25", uploadedBy: "HR Admin", changes: "Updated terms" },
            { version: "2.1", uploadDate: "2025-10-01", uploadedBy: "HR Admin", changes: "Final revision" }
          ],
          mandatory: true,
          fileType: "docx",
          size: "3.2 MB",
          fileUrl: "https://example.com/documents/contract.docx",
          uploadedBy: { id: 3, name: "HR Admin" },
          approvedBy: { id: 2, name: "HR Manager" },
          approvedDate: "2025-10-02",
          approvalComments: "Contract terms verified",
          downloadRestricted: false,
          auditTrail: [
            { action: "uploaded", user: "HR Admin", timestamp: "2025-09-15T11:00:00Z" },
            { action: "version_updated", user: "HR Admin", timestamp: "2025-09-25T15:20:00Z" },
            { action: "version_updated", user: "HR Admin", timestamp: "2025-10-01T10:30:00Z" },
            { action: "approved", user: "HR Manager", timestamp: "2025-10-02T09:00:00Z" }
          ]
        }
      ],
      total: 3,
      page: 1,
      pageSize: 10
    };
  },
  fetchEmployees: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 1, name: "John Doe", employeeType: "Full-time" },
      { id: 2, name: "Jane Smith", employeeType: "Full-time" },
      { id: 3, name: "Mike Johnson", employeeType: "Contract" },
      { id: 4, name: "Sarah Williams", employeeType: "Full-time" }
    ];
  },
  createDocument: async (documentData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { 
      ...documentData, 
      id: Date.now(), 
      uploadDate: new Date().toISOString().split('T')[0],
      version: "1.0",
      versionHistory: [{
        version: "1.0",
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: documentData.uploadedBy?.name || "System",
        changes: "Initial upload"
      }],
      fileUrl: "https://example.com/documents/new-document.pdf",
      auditTrail: [{
        action: "uploaded",
        user: documentData.uploadedBy?.name || "System",
        timestamp: new Date().toISOString()
      }]
    };
  },
  updateDocument: async (id, documentData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...documentData, id };
  },
  deleteDocument: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  approveDocument: async (id, approvalData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, ...approvalData };
  },
  rejectDocument: async (id, rejectionData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, ...rejectionData };
  },
  uploadNewVersion: async (id, documentData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, ...documentData };
  },
  logDownload: async (documentId, userId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  }
};

const Documentvault = () => {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEmployeeType, setFilterEmployeeType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [showAuditTrailModal, setShowAuditTrailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadFile, setUploadFile] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'checklist'
  const [currentUser] = useState({ id: 1, name: "Current User", role: "HR Manager" });

  const [documentForm, setDocumentForm] = useState({
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

  const [approvalForm, setApprovalForm] = useState({
    action: 'approve', // 'approve' or 'reject'
    comments: ''
  });

  const categories = ['all', 'KYC', 'Educational', 'Employment', 'Statutory', 'Miscellaneous'];
  const statuses = ['all', 'approved', 'pending', 'expired', 'rejected'];
  const fileTypes = ['pdf', 'docx', 'jpg', 'jpeg', 'png'];

  useEffect(() => {
    loadDocuments();
    loadEmployees();
  }, [filterCategory, filterStatus, filterEmployeeType, currentPage]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await mockAPI.fetchDocuments({ 
        category: filterCategory, 
        status: filterStatus, 
        employeeType: filterEmployeeType,
        page: currentPage 
      });
      setDocuments(data.documents);
    } catch (error) {
      showNotification('Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await mockAPI.fetchEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateDocument = async () => {
    if (!documentForm.name || !documentForm.employee || !uploadFile) {
      showNotification('Please fill in all required fields and select a file', 'error');
      return;
    }

    try {
      const selectedEmp = employees.find(e => e.id === parseInt(documentForm.employee));
      const newDocument = await mockAPI.createDocument({
        ...documentForm,
        documentType: documentForm.documentType || documentForm.name,
        employee: selectedEmp || { id: parseInt(documentForm.employee), name: documentForm.employee },
        size: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: uploadFile.name.split('.').pop().toLowerCase(),
        uploadedBy: currentUser
      });
      setDocuments([newDocument, ...documents]);
      setShowDocumentModal(false);
      resetForm();
      setUploadFile(null);
      showNotification('Document uploaded successfully');
    } catch (error) {
      showNotification('Failed to upload document', 'error');
    }
  };

  const handleUpdateDocument = async () => {
    try {
      const selectedEmp = employees.find(e => e.id === parseInt(documentForm.employee));
      const updatedDocument = await mockAPI.updateDocument(selectedDocument.id, {
        ...selectedDocument,
        ...documentForm,
        employee: selectedEmp || { ...selectedDocument.employee, name: documentForm.employee }
      });
      setDocuments(documents.map(d => d.id === selectedDocument.id ? updatedDocument : d));
      setShowDocumentModal(false);
      setSelectedDocument(null);
      resetForm();
      setUploadFile(null);
      showNotification('Document updated successfully');
    } catch (error) {
      showNotification('Failed to update document', 'error');
    }
  };

  const handleDeleteDocument = async () => {
    try {
      await mockAPI.deleteDocument(selectedDocument.id);
      setDocuments(documents.filter(d => d.id !== selectedDocument.id));
      setShowDeleteModal(false);
      setSelectedDocument(null);
      showNotification('Document deleted successfully');
    } catch (error) {
      showNotification('Failed to delete document', 'error');
    }
  };

  const handleDownloadDocument = async (doc) => {
    if (doc.downloadRestricted && currentUser.role !== 'HR Manager' && currentUser.role !== 'HR Admin') {
      showNotification('You do not have permission to download this document', 'error');
      return;
    }

    try {
      await mockAPI.logDownload(doc.id, currentUser.id);
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = `${doc.name}.${doc.fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update audit trail
      const updatedDoc = {
        ...doc,
        auditTrail: [
          ...doc.auditTrail,
          { action: "downloaded", user: currentUser.name, timestamp: new Date().toISOString() }
        ]
      };
      setDocuments(documents.map(d => d.id === doc.id ? updatedDoc : d));
      
      showNotification(`Downloading ${doc.name}`);
    } catch (error) {
      showNotification('Failed to download document', 'error');
    }
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setShowViewerModal(true);
  };

  const handleApproveReject = async () => {
    if (!approvalForm.comments && approvalForm.action === 'reject') {
      showNotification('Please provide rejection comments', 'error');
      return;
    }

    try {
      if (approvalForm.action === 'approve') {
        await mockAPI.approveDocument(selectedDocument.id, {
          approvedBy: currentUser,
          approvedDate: new Date().toISOString().split('T')[0],
          approvalComments: approvalForm.comments
        });
        const updatedDoc = {
          ...selectedDocument,
          status: 'approved',
          approvedBy: currentUser,
          approvedDate: new Date().toISOString().split('T')[0],
          approvalComments: approvalForm.comments,
          auditTrail: [
            ...selectedDocument.auditTrail,
            { action: "approved", user: currentUser.name, timestamp: new Date().toISOString() }
          ]
        };
        setDocuments(documents.map(d => d.id === selectedDocument.id ? updatedDoc : d));
        showNotification('Document approved successfully');
      } else {
        await mockAPI.rejectDocument(selectedDocument.id, {
          rejectedBy: currentUser,
          rejectedDate: new Date().toISOString().split('T')[0],
          rejectionComments: approvalForm.comments
        });
        const updatedDoc = {
          ...selectedDocument,
          status: 'rejected',
          rejectedBy: currentUser,
          rejectedDate: new Date().toISOString().split('T')[0],
          rejectionComments: approvalForm.comments,
          auditTrail: [
            ...selectedDocument.auditTrail,
            { action: "rejected", user: currentUser.name, timestamp: new Date().toISOString() }
          ]
        };
        setDocuments(documents.map(d => d.id === selectedDocument.id ? updatedDoc : d));
        showNotification('Document rejected');
      }
      setShowApprovalModal(false);
      setSelectedDocument(null);
      setApprovalForm({ action: 'approve', comments: '' });
    } catch (error) {
      showNotification('Failed to process approval', 'error');
    }
  };

  const handleUploadNewVersion = async () => {
    if (!uploadFile) {
      showNotification('Please select a file to upload', 'error');
      return;
    }

    try {
      const currentVersion = parseFloat(selectedDocument.version);
      const newVersion = (currentVersion + 0.1).toFixed(1);
      
      const versionUpdate = await mockAPI.uploadNewVersion(selectedDocument.id, {
        version: newVersion,
        fileUrl: "https://example.com/documents/new-version.pdf",
        size: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: uploadFile.name.split('.').pop().toLowerCase(),
        uploadedBy: currentUser
      });

      const updatedDoc = {
        ...selectedDocument,
        version: newVersion,
        versionHistory: [
          ...selectedDocument.versionHistory,
          {
            version: newVersion,
            uploadDate: new Date().toISOString().split('T')[0],
            uploadedBy: currentUser.name,
            changes: "New version uploaded"
          }
        ],
        auditTrail: [
          ...selectedDocument.auditTrail,
          { action: "version_updated", user: currentUser.name, timestamp: new Date().toISOString() }
        ],
        status: 'pending',
        approvedBy: null,
        approvedDate: null
      };
      
      setDocuments(documents.map(d => d.id === selectedDocument.id ? updatedDoc : d));
      setShowVersionHistoryModal(false);
      setUploadFile(null);
      showNotification(`New version ${newVersion} uploaded successfully`);
    } catch (error) {
      showNotification('Failed to upload new version', 'error');
    }
  };

  const handleBulkUpload = async (files) => {
    try {
      const newDocuments = Array.from(files).map((file, index) => ({
        id: documents.length + index + 1,
        name: file.name,
        documentType: file.name,
        category: 'Miscellaneous',
        employee: { id: 999, name: 'Bulk Upload', employeeType: 'Full-time' },
        uploadDate: new Date().toISOString().split('T')[0],
        expiryDate: null,
        status: 'pending',
        version: '1.0',
        versionHistory: [{
          version: "1.0",
          uploadDate: new Date().toISOString().split('T')[0],
          uploadedBy: currentUser.name,
          changes: "Bulk upload"
        }],
        mandatory: false,
        fileType: file.name.split('.').pop(),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        fileUrl: 'https://example.com/documents/bulk-upload.pdf',
        uploadedBy: currentUser,
        downloadRestricted: false,
        auditTrail: [{
          action: "uploaded",
          user: currentUser.name,
          timestamp: new Date().toISOString()
        }]
      }));
      
      setDocuments([...newDocuments, ...documents]);
      showNotification(`${files.length} document(s) uploaded successfully`);
    } catch (error) {
      showNotification('Failed to upload documents', 'error');
    }
  };

  const handleBulkDownload = () => {
    if (selectedDocuments.length === 0) {
      showNotification('Please select documents to download', 'error');
      return;
    }

    selectedDocuments.forEach(docId => {
      const doc = documents.find(d => d.id === docId);
      if (doc) {
        handleDownloadDocument(doc);
      }
    });
    
    showNotification(`Downloading ${selectedDocuments.length} document(s)`);
  };

  const handleBulkApprove = () => {
    if (selectedDocuments.length === 0) {
      showNotification('Please select documents to approve', 'error');
      return;
    }

    const updatedDocuments = documents.map(doc => 
      selectedDocuments.includes(doc.id) 
        ? { 
            ...doc, 
            status: 'approved',
            approvedBy: currentUser,
            approvedDate: new Date().toISOString().split('T')[0],
            auditTrail: [
              ...doc.auditTrail,
              { action: "approved", user: currentUser.name, timestamp: new Date().toISOString() }
            ]
          }
        : doc
    );
    setDocuments(updatedDocuments);
    showNotification(`${selectedDocuments.length} document(s) approved`);
    setSelectedDocuments([]);
  };

  const handleBulkDelete = () => {
    if (selectedDocuments.length === 0) {
      showNotification('Please select documents to delete', 'error');
      return;
    }

    const updatedDocuments = documents.filter(doc => !selectedDocuments.includes(doc.id));
    setDocuments(updatedDocuments);
    setSelectedDocuments([]);
    showNotification(`${selectedDocuments.length} document(s) deleted`);
  };

  const openEditModal = (document) => {
    setSelectedDocument(document);
    setDocumentForm({
      name: document.name,
      documentType: document.documentType || document.name,
      category: document.category,
      employee: document.employee.id.toString(),
      employeeType: document.employee.employeeType || '',
      expiryDate: document.expiryDate || '',
      status: document.status,
      mandatory: document.mandatory,
      fileType: document.fileType,
      downloadRestricted: document.downloadRestricted || false
    });
    setShowDocumentModal(true);
  };

  const openApprovalModal = (document) => {
    setSelectedDocument(document);
    setApprovalForm({ action: 'approve', comments: '' });
    setShowApprovalModal(true);
  };

  const openChecklistModal = (employee) => {
    setSelectedEmployee(employee);
    setShowChecklistModal(true);
  };

  const resetForm = () => {
    setDocumentForm({
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
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-success-subtle text-success',
      pending: 'bg-warning-subtle text-warning',
      expired: 'bg-danger-subtle text-danger',
      rejected: 'bg-dark-subtle text-dark'
    };
    const icons = {
      approved: 'heroicons:check-circle',
      pending: 'heroicons:clock',
      expired: 'heroicons:exclamation-circle',
      rejected: 'heroicons:x-circle'
    };
    return (
      <span className={`badge d-flex align-items-center ${styles[status]}`}>
        <Icon icon={icons[status]} className="me-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const styles = {
      KYC: 'bg-primary-subtle text-primary',
      Educational: 'bg-info-subtle text-info',
      Employment: 'bg-purple-subtle text-primary',
      Statutory: 'bg-orange-subtle text-info',
      Miscellaneous: 'bg-secondary-subtle text-secondary'
    };
    return (
      <span className={`badge ${styles[category]}`}>
        {category}
      </span>
    );
  };

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

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getMandatoryDocumentsForEmployee = (employee) => {
    const employeeType = employee?.employeeType || 'Full-time';
    return MANDATORY_DOCUMENTS[employeeType] || [];
  };

  const getEmployeeDocumentStatus = (employee) => {
    const mandatoryDocs = getMandatoryDocumentsForEmployee(employee);
    const employeeDocuments = documents.filter(d => d.employee.id === employee.id);
    
    return mandatoryDocs.map(docName => {
      const doc = employeeDocuments.find(d => 
        d.name === docName || d.documentType === docName
      );
      return {
        name: docName,
        uploaded: !!doc,
        status: doc?.status || 'missing',
        document: doc
      };
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.documentType && doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesEmployeeType = filterEmployeeType === 'all' || doc.employee.employeeType === filterEmployeeType;
    return matchesSearch && matchesCategory && matchesStatus && matchesEmployeeType;
  });

  const handleSelectDocument = (docId) => {
    setSelectedDocuments(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(d => d.id));
    }
  };

  const stats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length,
    expiring: documents.filter(d => isExpiringSoon(d.expiryDate)).length,
    expired: documents.filter(d => isExpired(d.expiryDate)).length
  };

  // Get unique employees for checklist view
  const uniqueEmployees = [...new Map(documents.map(d => [d.employee.id, d.employee])).values()];

  return (
    <div className="container-fluid">
      {/* Notification */}
      {notification && (
        <div className={`position-fixed top-0 end-0 m-3 z-50 alert alert-${notification.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
              <Icon icon="heroicons:folder" />
              Document Vault & Management
            </h5>
            <p className="text-muted">Centralized document repository with version control, approval workflow, and audit trail</p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
            >
              <Icon icon="heroicons:document-duplicate" className="me-1" />
              Templates
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'checklist' : 'list')}
              className="btn btn-outline-info d-flex align-items-center gap-2"
            >
              <Icon icon={viewMode === 'list' ? 'heroicons:clipboard-document-check' : 'heroicons:list-bullet'} className="me-1" />
              {viewMode === 'list' ? 'Checklist View' : 'List View'}
            </button>
            <label className="btn btn-secondary d-flex align-items-center gap-2">
              <Icon icon="heroicons:arrow-up-tray" className="me-1" />
              Bulk Upload
              <input
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleBulkUpload(e.target.files)}
              />
            </label>
            <button
              onClick={() => {
                setSelectedDocument(null);
                resetForm();
                setShowDocumentModal(true);
              }}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <Icon icon="heroicons:plus" className="me-1" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="avatar-sm bg-primary-subtle rounded d-flex align-items-center justify-content-center">
                      <span className="avatar-title text-primary">
                        <Icon icon="heroicons:folder" width="24" height="24" />
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h4 className="mb-1">{stats.total}</h4>
                    <p className="text-muted mb-0">Total Documents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="avatar-sm bg-success-subtle rounded d-flex align-items-center justify-content-center">
                      <span className="avatar-title text-success">
                        <Icon icon="heroicons:check-circle" width="24" height="24" />
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h4 className="mb-1">{stats.approved}</h4>
                    <p className="text-muted mb-0">Approved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="avatar-sm bg-warning-subtle rounded d-flex align-items-center justify-content-center">
                      <span className="avatar-title text-warning">
                        <Icon icon="heroicons:clock" width="24" height="24" />
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h4 className="mb-1">{stats.pending}</h4>
                    <p className="text-muted mb-0">Pending Review</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="avatar-sm bg-danger-subtle rounded d-flex align-items-center justify-content-center">
                      <span className="avatar-title text-danger">
                        <Icon icon="heroicons:exclamation-triangle" width="24" height="24" />
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h4 className="mb-1">{stats.expiring}</h4>
                    <p className="text-muted mb-0">Expiring Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="d-flex flex-column flex-md-row gap-3 mb-4">
          <div className="position-relative flex-fill">
            <Icon icon="heroicons:magnifying-glass" className="position-absolute top-50 translate-middle-y text-muted ms-3" />
            <input
              type="text"
              placeholder="Search by document name, type, or employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control ps-5"
            />
          </div>
          <div className="d-flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-select"
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Status</option>
              {statuses.filter(s => s !== 'all').map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={filterEmployeeType}
              onChange={(e) => setFilterEmployeeType(e.target.value)}
              className="form-select"
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Employee Types</option>
              {EMPLOYEE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDocuments.length > 0 && (
          <div className="alert alert-info d-flex align-items-center justify-content-between mb-4">
            <span className="fw-medium">
              {selectedDocuments.length} document(s) selected
            </span>
            <div className="d-flex gap-2">
              <button 
                onClick={handleBulkApprove}
                className="btn btn-sm btn-outline-primary"
              >
                Approve
              </button>
              <button 
                onClick={handleBulkDownload}
                className="btn btn-sm btn-outline-primary"
              >
                Download
              </button>
              <button 
                onClick={handleBulkDelete}
                className="btn btn-sm btn-outline-danger"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Expiring Documents Alert */}
        {stats.expiring > 0 && (
          <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
            <div className="d-flex align-items-center">
              <Icon icon="heroicons:exclamation-triangle" className="me-2 fs-5" />
              <div>
                <strong>Renewal Alert:</strong> {stats.expiring} document(s) are expiring within 30 days. Please review and renew them.
              </div>
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}
      </div>

      {/* Checklist View */}
      {viewMode === 'checklist' && (
        <div className="card border shadow-none mb-4">
          <div className="card-header bg-light">
            <h6 className="mb-0 fw-bold">Mandatory Document Checklist</h6>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Employee</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Employee Type</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Mandatory Documents</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Status</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueEmployees.map((employee) => {
                    const docStatus = getEmployeeDocumentStatus(employee);
                    const mandatoryDocs = getMandatoryDocumentsForEmployee(employee);
                    const uploadedCount = docStatus.filter(d => d.uploaded).length;
                    const approvedCount = docStatus.filter(d => d.uploaded && d.status === 'approved').length;
                    const completionPercentage = mandatoryDocs.length > 0 ? (uploadedCount / mandatoryDocs.length) * 100 : 0;
                    
                    return (
                      <tr key={employee.id}>
                        <td className="px-4 py-3">
                          <div className="fw-medium text-dark">{employee.name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-info-subtle text-info">{employee.employeeType || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex flex-column gap-1">
                            <div className="small text-muted">
                              {uploadedCount} of {mandatoryDocs.length} uploaded
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className={`progress-bar ${completionPercentage === 100 ? 'bg-success' : completionPercentage >= 50 ? 'bg-warning' : 'bg-danger'}`}
                                style={{ width: `${completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex flex-column gap-1">
                            <span className={`badge ${approvedCount === mandatoryDocs.length ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                              {approvedCount}/{mandatoryDocs.length} Approved
                            </span>
                            {completionPercentage < 100 && (
                              <span className="badge bg-danger-subtle text-danger small">
                                {mandatoryDocs.length - uploadedCount} Missing
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openChecklistModal(employee)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <Icon icon="heroicons:eye" className="me-1" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Documents Table */}
      <div className="card border shadow-none">
        <div className="card-body p-0">
          {loading ? (
            <div className="d-flex align-items-center justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                        onChange={handleSelectAll}
                        className="form-check-input"
                      />
                    </th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Document</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Category</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Employee</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Version</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Upload Date</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Expiry Date</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Status</th>
                    <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className={`${isExpired(doc.expiryDate) ? 'bg-danger-subtle' : ''} ${isExpiringSoon(doc.expiryDate) ? 'bg-warning-subtle' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => handleSelectDocument(doc.id)}
                          className="form-check-input"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <Icon icon={getFileIcon(doc.fileType)} className="text-primary fs-5" />
                          <div>
                            <div className="fw-medium text-dark d-flex align-items-center gap-2">
                              {doc.name}
                              {doc.mandatory && (
                                <span className="badge bg-danger-subtle text-danger small">Mandatory</span>
                              )}
                              {doc.downloadRestricted && (
                                <Icon icon="heroicons:lock-closed" className="text-warning" title="Download Restricted" />
                              )}
                            </div>
                            <div className="text-muted small mt-1">
                              {doc.fileType.toUpperCase()} • {doc.size}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getCategoryBadge(doc.category)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-dark">{doc.employee.name}</div>
                        <div className="text-muted small">{doc.employee.employeeType || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-secondary-subtle text-secondary">v{doc.version}</span>
                          {doc.versionHistory && doc.versionHistory.length > 1 && (
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowVersionHistoryModal(true);
                              }}
                              className="btn btn-sm btn-link p-0"
                              title="View Version History"
                            >
                              <Icon icon="heroicons:clock" className="text-muted" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <Icon icon="heroicons:calendar" className="text-muted" />
                          <span className="text-dark">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <Icon icon="heroicons:calendar-days" className="text-muted" />
                          <span className={`${isExpired(doc.expiryDate) ? 'text-danger fw-medium' : 'text-dark'}`}>
                            {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'No Expiry'}
                            {isExpiringSoon(doc.expiryDate) && !isExpired(doc.expiryDate) && (
                              <Icon icon="heroicons:exclamation-triangle" className="ms-2 text-warning" />
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="btn btn-sm btn-outline-info"
                            title="View Document"
                          >
                            <Icon icon="heroicons:eye" />
                          </button>
                          {doc.status === 'pending' && (
                            <button
                              onClick={() => openApprovalModal(doc)}
                              className="btn btn-sm btn-outline-success"
                              title="Approve/Reject"
                            >
                              <Icon icon="heroicons:check-circle" />
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(doc)}
                            className="btn btn-sm btn-outline-primary"
                            title="Edit"
                          >
                            <Icon icon="heroicons:pencil" />
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className="btn btn-sm btn-outline-primary"
                            title="Download"
                          >
                            <Icon icon="heroicons:arrow-down-tray" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowAuditTrailModal(true);
                            }}
                            className="btn btn-sm btn-outline-secondary"
                            title="Audit Trail"
                          >
                            <Icon icon="heroicons:document-text" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDeleteModal(true);
                            }}
                            className="btn btn-sm btn-outline-danger"
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
          )}

          {filteredDocuments.length === 0 && !loading && (
            <div className="text-center py-5 text-muted">
              <Icon icon="heroicons:folder-open" className="fs-1 text-muted mb-3" />
              <p className="mb-0">No documents found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Document Modal */}
      {showDocumentModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedDocument ? 'Edit Document' : 'Upload New Document'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDocumentModal(false);
                    setSelectedDocument(null);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Document Type <span className="text-danger">*</span>
                    </label>
                    <select
                      value={documentForm.documentType}
                      onChange={(e) => {
                        const docType = e.target.value;
                        const category = Object.keys(DOCUMENT_TYPES).find(cat => 
                          DOCUMENT_TYPES[cat].includes(docType)
                        );
                        setDocumentForm({ 
                          ...documentForm, 
                          documentType: docType,
                          name: docType,
                          category: category || documentForm.category
                        });
                      }}
                      className="form-select"
                    >
                      <option value="">Select Document Type</option>
                      {Object.entries(DOCUMENT_TYPES).map(([category, types]) => (
                        <optgroup key={category} label={category}>
                          {types.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Document Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={documentForm.name}
                      onChange={(e) => setDocumentForm({ ...documentForm, name: e.target.value })}
                      className="form-control"
                      placeholder="Enter document name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      value={documentForm.category}
                      onChange={(e) => setDocumentForm({ ...documentForm, category: e.target.value })}
                      className="form-select"
                    >
                      {categories.filter(c => c !== 'all').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Employee <span className="text-danger">*</span>
                    </label>
                    <select
                      value={documentForm.employee}
                      onChange={(e) => {
                        const emp = employees.find(e => e.id === parseInt(e.target.value));
                        setDocumentForm({ 
                          ...documentForm, 
                          employee: e.target.value,
                          employeeType: emp?.employeeType || ''
                        });
                      }}
                      className="form-select"
                    >
                      <option value="">Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id.toString()}>
                          {emp.name} ({emp.employeeType})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={documentForm.expiryDate}
                      onChange={(e) => setDocumentForm({ ...documentForm, expiryDate: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      value={documentForm.status}
                      onChange={(e) => setDocumentForm({ ...documentForm, status: e.target.value })}
                      className="form-select"
                    >
                      {statuses.filter(s => s !== 'all').map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        checked={documentForm.mandatory}
                        onChange={(e) => setDocumentForm({ ...documentForm, mandatory: e.target.checked })}
                        className="form-check-input"
                      />
                      Mandatory Document
                    </label>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        checked={documentForm.downloadRestricted}
                        onChange={(e) => setDocumentForm({ ...documentForm, downloadRestricted: e.target.checked })}
                        className="form-check-input"
                      />
                      Restrict Download
                    </label>
                  </div>
                  {!selectedDocument && (
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Upload File <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                      />
                      {uploadFile && (
                        <div className="mt-2 text-muted small">
                          Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    setShowDocumentModal(false);
                    setSelectedDocument(null);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedDocument ? handleUpdateDocument : handleCreateDocument}
                  className="btn btn-primary"
                >
                  {selectedDocument ? 'Update Document' : 'Upload Document'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal with Watermark */}
      {showViewerModal && selectedDocument && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedDocument.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowViewerModal(false);
                    setSelectedDocument(null);
                  }}
                ></button>
              </div>
              <div className="modal-body position-relative" style={{ minHeight: '500px' }}>
                {/* Watermark */}
                <div 
                  className="position-absolute top-50 start-50 translate-middle"
                  style={{
                    opacity: 0.1,
                    zIndex: 1,
                    pointerEvents: 'none',
                    transform: 'rotate(-45deg)',
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    color: '#000'
                  }}
                >
                  CONFIDENTIAL
                </div>
                {/* Document Preview */}
                <div className="position-relative" style={{ zIndex: 2 }}>
                  {selectedDocument.fileType === 'pdf' ? (
                    <iframe
                      src={selectedDocument.fileUrl}
                      className="w-100"
                      style={{ height: '600px', border: 'none' }}
                      title={selectedDocument.name}
                    />
                  ) : selectedDocument.fileType === 'jpg' || selectedDocument.fileType === 'jpeg' || selectedDocument.fileType === 'png' ? (
                    <img
                      src={selectedDocument.fileUrl}
                      alt={selectedDocument.name}
                      className="img-fluid"
                      style={{ maxHeight: '600px', width: 'auto', margin: '0 auto', display: 'block' }}
                    />
                  ) : (
                    <div className="text-center py-5">
                      <Icon icon="heroicons:document" className="fs-1 text-muted mb-3" />
                      <p className="text-muted">Preview not available for {selectedDocument.fileType.toUpperCase()} files</p>
                      <button
                        onClick={() => handleDownloadDocument(selectedDocument)}
                        className="btn btn-primary"
                      >
                        Download to View
                      </button>
                    </div>
                  )}
                </div>
                {/* Document Info */}
                <div className="mt-3 p-3 bg-light rounded">
                  <div className="row">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Version: {selectedDocument.version}</small>
                      <small className="text-muted d-block">Uploaded: {new Date(selectedDocument.uploadDate).toLocaleDateString()}</small>
                      <small className="text-muted d-block">Size: {selectedDocument.size}</small>
                    </div>
                    <div className="col-md-6 text-end">
                      {selectedDocument.approvedBy && (
                        <>
                          <small className="text-muted d-block">Approved by: {selectedDocument.approvedBy.name}</small>
                          <small className="text-muted d-block">Approved on: {new Date(selectedDocument.approvedDate).toLocaleDateString()}</small>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  className="btn btn-primary"
                  disabled={selectedDocument.downloadRestricted && currentUser.role !== 'HR Manager' && currentUser.role !== 'HR Admin'}
                >
                  <Icon icon="heroicons:arrow-down-tray" className="me-1" />
                  Download
                </button>
                <button
                  onClick={() => {
                    setShowViewerModal(false);
                    setSelectedDocument(null);
                  }}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistoryModal && selectedDocument && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Version History - {selectedDocument.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowVersionHistoryModal(false);
                    setSelectedDocument(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="list-group">
                  {selectedDocument.versionHistory && selectedDocument.versionHistory.length > 0 ? (
                    selectedDocument.versionHistory.map((version, index) => (
                      <div key={index} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <span className="badge bg-primary">Version {version.version}</span>
                              {version.version === selectedDocument.version && (
                                <span className="badge bg-success">Current</span>
                              )}
                            </div>
                            <p className="mb-1"><strong>Uploaded by:</strong> {version.uploadedBy}</p>
                            <p className="mb-1"><strong>Date:</strong> {new Date(version.uploadDate).toLocaleDateString()}</p>
                            {version.changes && (
                              <p className="mb-0 text-muted"><strong>Changes:</strong> {version.changes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No version history available</p>
                  )}
                </div>
                {!selectedDocument.versionHistory || selectedDocument.versionHistory.length === 0 ? (
                  <div className="mt-3">
                    <label className="form-label fw-semibold">Upload New Version</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                    />
                    {uploadFile && (
                      <div className="mt-2">
                        <button
                          onClick={handleUploadNewVersion}
                          className="btn btn-primary btn-sm"
                        >
                          Upload Version
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-3">
                    <label className="form-label fw-semibold">Upload New Version</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                    />
                    {uploadFile && (
                      <div className="mt-2">
                        <button
                          onClick={handleUploadNewVersion}
                          className="btn btn-primary btn-sm"
                        >
                          Upload New Version
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    setShowVersionHistoryModal(false);
                    setSelectedDocument(null);
                    setUploadFile(null);
                  }}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Modal */}
      {showAuditTrailModal && selectedDocument && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Audit Trail - {selectedDocument.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAuditTrailModal(false);
                    setSelectedDocument(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="bg-light">
                      <tr>
                        <th>Action</th>
                        <th>User</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDocument.auditTrail && selectedDocument.auditTrail.length > 0 ? (
                        selectedDocument.auditTrail.map((entry, index) => (
                          <tr key={index}>
                            <td>
                              <span className={`badge ${
                                entry.action === 'approved' ? 'bg-success-subtle text-success' :
                                entry.action === 'rejected' ? 'bg-danger-subtle text-danger' :
                                entry.action === 'uploaded' ? 'bg-primary-subtle text-primary' :
                                entry.action === 'downloaded' ? 'bg-info-subtle text-info' :
                                'bg-secondary-subtle text-secondary'
                              }`}>
                                {entry.action.charAt(0).toUpperCase() + entry.action.slice(1).replace('_', ' ')}
                              </span>
                            </td>
                            <td>{entry.user}</td>
                            <td>{new Date(entry.timestamp).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center text-muted">No audit trail available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    setShowAuditTrailModal(false);
                    setSelectedDocument(null);
                  }}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedDocument && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Approve/Reject Document</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedDocument(null);
                    setApprovalForm({ action: 'approve', comments: '' });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p className="mb-2"><strong>Document:</strong> {selectedDocument.name}</p>
                  <p className="mb-2"><strong>Employee:</strong> {selectedDocument.employee.name}</p>
                  <p className="mb-0"><strong>Category:</strong> {selectedDocument.category}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Action</label>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="approvalAction"
                      id="approve"
                      checked={approvalForm.action === 'approve'}
                      onChange={() => setApprovalForm({ ...approvalForm, action: 'approve' })}
                    />
                    <label className="btn btn-outline-success" htmlFor="approve">
                      <Icon icon="heroicons:check-circle" className="me-1" />
                      Approve
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="approvalAction"
                      id="reject"
                      checked={approvalForm.action === 'reject'}
                      onChange={() => setApprovalForm({ ...approvalForm, action: 'reject' })}
                    />
                    <label className="btn btn-outline-danger" htmlFor="reject">
                      <Icon icon="heroicons:x-circle" className="me-1" />
                      Reject
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Comments {approvalForm.action === 'reject' && <span className="text-danger">*</span>}
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={approvalForm.comments}
                    onChange={(e) => setApprovalForm({ ...approvalForm, comments: e.target.value })}
                    placeholder={approvalForm.action === 'approve' ? 'Add approval comments (optional)' : 'Please provide rejection reason'}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedDocument(null);
                    setApprovalForm({ action: 'approve', comments: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveReject}
                  className={`btn ${approvalForm.action === 'approve' ? 'btn-success' : 'btn-danger'}`}
                >
                  {approvalForm.action === 'approve' ? 'Approve' : 'Reject'} Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Document Templates Library</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTemplatesModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="bg-light">
                      <tr>
                        <th>Template Name</th>
                        <th>Category</th>
                        <th>File Type</th>
                        <th>Size</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DOCUMENT_TEMPLATES.map(template => (
                        <tr key={template.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Icon icon={getFileIcon(template.fileType)} className="text-primary" />
                              {template.name}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">
                              {template.category}
                            </span>
                          </td>
                          <td>{template.fileType.toUpperCase()}</td>
                          <td>{template.size}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                showNotification(`Downloading ${template.name}`, 'info');
                              }}
                            >
                              <Icon icon="heroicons:arrow-down-tray" className="me-1" />
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setShowTemplatesModal(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Detail Modal */}
      {showChecklistModal && selectedEmployee && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Mandatory Document Checklist - {selectedEmployee.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowChecklistModal(false);
                    setSelectedEmployee(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p className="mb-1"><strong>Employee Type:</strong> {selectedEmployee.employeeType || 'N/A'}</p>
                  <p className="mb-0"><strong>Required Documents:</strong> {getMandatoryDocumentsForEmployee(selectedEmployee).length}</p>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="bg-light">
                      <tr>
                        <th>Document Name</th>
                        <th>Status</th>
                        <th>Upload Date</th>
                        <th>Version</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getEmployeeDocumentStatus(selectedEmployee).map((docStatus, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {docStatus.uploaded ? (
                                <Icon icon="heroicons:check-circle" className="text-success" />
                              ) : (
                                <Icon icon="heroicons:x-circle" className="text-danger" />
                              )}
                              <span className={docStatus.uploaded ? '' : 'text-muted'}>
                                {docStatus.name}
                              </span>
                              {!docStatus.uploaded && (
                                <span className="badge bg-danger-subtle text-danger small">Missing</span>
                              )}
                            </div>
                          </td>
                          <td>
                            {docStatus.uploaded ? (
                              getStatusBadge(docStatus.status)
                            ) : (
                              <span className="badge bg-danger-subtle text-danger">Not Uploaded</span>
                            )}
                          </td>
                          <td>
                            {docStatus.document?.uploadDate ? (
                              new Date(docStatus.document.uploadDate).toLocaleDateString()
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {docStatus.document?.version ? (
                              <span className="badge bg-secondary-subtle text-secondary">
                                v{docStatus.document.version}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {docStatus.document ? (
                              <div className="d-flex gap-1">
                                <button
                                  onClick={() => {
                                    handleViewDocument(docStatus.document);
                                    setShowChecklistModal(false);
                                  }}
                                  className="btn btn-sm btn-outline-info"
                                  title="View"
                                >
                                  <Icon icon="heroicons:eye" />
                                </button>
                                <button
                                  onClick={() => {
                                    openEditModal(docStatus.document);
                                    setShowChecklistModal(false);
                                  }}
                                  className="btn btn-sm btn-outline-primary"
                                  title="Edit"
                                >
                                  <Icon icon="heroicons:pencil" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setDocumentForm({
                                    ...documentForm,
                                    documentType: docStatus.name,
                                    name: docStatus.name,
                                    employee: selectedEmployee.id.toString(),
                                    employeeType: selectedEmployee.employeeType || '',
                                    mandatory: true
                                  });
                                  setShowChecklistModal(false);
                                  setShowDocumentModal(true);
                                }}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <Icon icon="heroicons:plus" className="me-1" />
                                Upload
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    setShowChecklistModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDocument && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Document</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDocument(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to delete "<strong>{selectedDocument.name}</strong>"? This action cannot be undone.
                </p>
                {selectedDocument.mandatory && (
                  <div className="alert alert-warning mt-3 mb-0">
                    <Icon icon="heroicons:exclamation-triangle" className="me-2" />
                    This is a mandatory document. Deleting it will affect the employee's document compliance status.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDocument(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDocument}
                  className="btn btn-danger"
                >
                  Delete Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentvault;