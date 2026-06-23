import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import StatCard from '../../../shared/components/StatCard';
import ApprovalModal from '../modal/ApprovalModal';
import AuditTrailModal from '../modal/AuditTrailModal';
import ChecklistModal from '../modal/ChecklistModal';
import DeleteModal from '../modal/DeleteModal';
import TemplatesModal from '../modal/TemplatesModal';
import VersionHistoryModal from '../modal/VersionHistoryModal';
import DocumentModal from '../modal/DocumentModal';
import DocumentViewerModal from '../modal/DocumentViewerModal';

const EMPLOYEE_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern', 'Consultant'];
const DOCUMENT_TYPES = {};
const MANDATORY_DOCUMENTS = {};
const DOCUMENT_TEMPLATES = [];

const DocumentVault = () => {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [documentTypes, setDocumentTypes] = useState({});
  const [mandatoryDocuments, setMandatoryDocuments] = useState({});
  const [documentTemplates, setDocumentTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEmployeeType, setFilterEmployeeType] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [currentUser] = useState({ id: 1, name: "Current User", role: "HR Manager" });
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    expiring: 0,
    expired: 0
  });

  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [showAuditTrailModal, setShowAuditTrailModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

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
    action: 'approve',
    comments: ''
  });

  const categories = ['all', 'KYC', 'Educational', 'Employment', 'Statutory', 'Miscellaneous'];
  const statuses = ['all', 'approved', 'pending', 'expired', 'rejected'];
  const itemsPerPage = 6;

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadDocuments();
    }
  }, [filterCategory, filterStatus, filterEmployeeType, currentPage]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [typesData, mandatoryData, templatesData, employeesData, statsData] = await Promise.all([
        fetchDocumentTypes(),
        fetchMandatoryDocuments(),
        fetchDocumentTemplates(),
        fetchEmployees(),
        fetchStatistics()
      ]);

      setDocumentTypes(typesData);
      setMandatoryDocuments(mandatoryData);
      setDocumentTemplates(templatesData);
      setEmployees(employeesData);
      setStats(statsData);

      await loadDocuments();
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const params = {
        category: filterCategory !== 'all' ? filterCategory : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        employeeType: filterEmployeeType !== 'all' ? filterEmployeeType : undefined,
        search: searchTerm || undefined,
        page: currentPage,
        limit: itemsPerPage
      };
      const data = await fetchDocuments(params);
      setDocuments(data.documents || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
      toast.error('Failed to load documents');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      approved: { label: 'Approved', color: 'emerald' },
      pending: { label: 'Pending', color: 'amber' },
      expired: { label: 'Expired', color: 'rose' },
      rejected: { label: 'Rejected', color: 'gray' }
    };
    const { label, color } = config[status] || { label: status || 'Unknown', color: 'gray' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        <Icon icon={status === 'approved' ? 'heroicons:check-circle' : 'heroicons:clock'} className="w-3.5 h-3.5" />
        {label}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const config = {
      KYC: { label: 'KYC', color: 'blue' },
      Educational: { label: 'Educational', color: 'cyan' },
      Employment: { label: 'Employment', color: 'purple' },
      Statutory: { label: 'Statutory', color: 'amber' },
      Miscellaneous: { label: 'Misc', color: 'gray' }
    };
    const { label, color } = config[category] || { label: category || 'N/A', color: 'gray' };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
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
    return mandatoryDocuments[employeeType] || [];
  };

  const getEmployeeDocumentStatus = (employee) => {
    const mandatoryDocs = getMandatoryDocumentsForEmployee(employee);
    const employeeDocuments = documents.filter(d => d.employee?.id === employee.id);
    
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

  const handleCreateDocument = async (formData, file) => {
    try {
      const selectedEmp = employees.find(e => e.id === parseInt(formData.employee));
      const newDocument = await createDocument({
        ...formData,
        documentType: formData.documentType || formData.name,
        employee: selectedEmp || { id: parseInt(formData.employee), name: formData.employee },
        file: file,
        uploadedBy: currentUser
      });
      setDocuments([newDocument, ...documents]);
      setShowDocumentModal(false);
      toast.success('Document uploaded successfully');
      const statsData = await fetchStatistics();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to upload document:', err);
      toast.error(err.message || 'Failed to upload document');
    }
  };

  const handleUpdateDocument = async (formData) => {
    try {
      const selectedEmp = employees.find(e => e.id === parseInt(formData.employee));
      const updatedDocument = await updateDocument(selectedDocument.id, {
        ...selectedDocument,
        ...formData,
        employee: selectedEmp || { ...selectedDocument.employee, name: formData.employee }
      });
      setDocuments(documents.map(d => d.id === selectedDocument.id ? updatedDocument : d));
      setShowDocumentModal(false);
      setSelectedDocument(null);
      toast.success('Document updated successfully');
    } catch (err) {
      console.error('Failed to update document:', err);
      toast.error(err.message || 'Failed to update document');
    }
  };

  const handleDeleteDocument = async () => {
    try {
      await deleteDocument(selectedDocument.id);
      setDocuments(documents.filter(d => d.id !== selectedDocument.id));
      setShowDeleteModal(false);
      setSelectedDocument(null);
      toast.success('Document deleted successfully');
      const statsData = await fetchStatistics();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to delete document:', err);
      toast.error(err.message || 'Failed to delete document');
    }
  };

  const handleDownloadDocument = async (doc) => {
    if (doc.downloadRestricted && currentUser.role !== 'HR Manager' && currentUser.role !== 'HR Admin') {
      toast.error('You do not have permission to download this document');
      return;
    }

    try {
      await logDownload(doc.id, currentUser.id);
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = `${doc.name}.${doc.fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${doc.name}`);
    } catch (err) {
      console.error('Failed to download document:', err);
      toast.error(err.message || 'Failed to download document');
    }
  };

  const handleApproveReject = async (formData) => {
    try {
      if (formData.action === 'approve') {
        const result = await approveDocument(selectedDocument.id, {
          approvedBy: currentUser,
          approvedDate: new Date().toISOString().split('T')[0],
          approvalComments: formData.comments
        });
        const updatedDoc = {
          ...selectedDocument,
          status: 'approved',
          approvedBy: currentUser,
          approvedDate: new Date().toISOString().split('T')[0],
          approvalComments: formData.comments,
          auditTrail: [
            ...selectedDocument.auditTrail,
            { action: "approved", user: currentUser.name, timestamp: new Date().toISOString() }
          ]
        };
        setDocuments(documents.map(d => d.id === selectedDocument.id ? updatedDoc : d));
        toast.success('Document approved successfully');
      } else {
        const result = await rejectDocument(selectedDocument.id, {
          rejectedBy: currentUser,
          rejectedDate: new Date().toISOString().split('T')[0],
          rejectionComments: formData.comments
        });
        const updatedDoc = {
          ...selectedDocument,
          status: 'rejected',
          rejectedBy: currentUser,
          rejectedDate: new Date().toISOString().split('T')[0],
          rejectionComments: formData.comments,
          auditTrail: [
            ...selectedDocument.auditTrail,
            { action: "rejected", user: currentUser.name, timestamp: new Date().toISOString() }
          ]
        };
        setDocuments(documents.map(d => d.id === selectedDocument.id ? updatedDoc : d));
        toast.info('Document rejected');
      }
      setShowApprovalModal(false);
      setSelectedDocument(null);
      const statsData = await fetchStatistics();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to process approval:', err);
      toast.error(err.message || 'Failed to process approval');
    }
  };

  const handleUploadNewVersion = async (file) => {
    try {
      const currentVersion = parseFloat(selectedDocument.version);
      const newVersion = (currentVersion + 0.1).toFixed(1);
      
      const result = await uploadNewVersion(selectedDocument.id, {
        version: newVersion,
        file: file,
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
      toast.success(`New version ${newVersion} uploaded successfully`);
    } catch (err) {
      console.error('Failed to upload new version:', err);
      toast.error(err.message || 'Failed to upload new version');
    }
  };

  const handleBulkUpload = async (files) => {
    try {
      const fileArray = Array.from(files);
      const results = await Promise.all(
        fileArray.map(file => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('category', 'Miscellaneous');
          formData.append('uploadedBy', JSON.stringify(currentUser));
          return { success: true, file: file };
        })
      );
      
      toast.success(`${fileArray.length} document(s) uploaded successfully`);
      await loadDocuments();
      const statsData = await fetchStatistics();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to upload documents:', err);
      toast.error(err.message || 'Failed to upload documents');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select documents to approve');
      return;
    }

    try {
      await Promise.all(
        selectedDocuments.map(docId => 
          approveDocument(docId, {
            approvedBy: currentUser,
            approvedDate: new Date().toISOString().split('T')[0]
          })
        )
      );
      
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
      toast.success(`${selectedDocuments.length} document(s) approved`);
      setSelectedDocuments([]);
      const statsData = await fetchStatistics();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to bulk approve:', err);
      toast.error(err.message || 'Failed to approve documents');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select documents to delete');
      return;
    }

    try {
      await Promise.all(
        selectedDocuments.map(docId => deleteDocument(docId))
      );
      setDocuments(documents.filter(doc => !selectedDocuments.includes(doc.id)));
      setSelectedDocuments([]);
      toast.success(`${selectedDocuments.length} document(s) deleted`);
      const statsData = await fetchStatistics();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to bulk delete:', err);
      toast.error(err.message || 'Failed to delete documents');
    }
  };

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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.documentType && doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesEmployeeType = filterEmployeeType === 'all' || doc.employee?.employeeType === filterEmployeeType;
    return matchesSearch && matchesCategory && matchesStatus && matchesEmployeeType;
  });

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const uniqueEmployees = [...new Map(documents.map(d => [d.employee?.id, d.employee]).filter(([key]) => key)).values()];

  const openEditModal = (document) => {
    setSelectedDocument(document);
    setDocumentForm({
      name: document.name,
      documentType: document.documentType || document.name,
      category: document.category,
      employee: document.employee?.id?.toString() || '',
      employeeType: document.employee?.employeeType || '',
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

  const openViewerModal = (document) => {
    setSelectedDocument(document);
    setShowViewerModal(true);
  };

  const openChecklistModal = (employee) => {
    setSelectedEmployee(employee);
    setShowChecklistModal(true);
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        title="Total Documents"
        value={stats.total}
        subtitle="All documents"
        icon="heroicons:folder"
        color="blue"
      />
      <StatCard
        title="Approved"
        value={stats.approved}
        subtitle={`${((stats.approved / (stats.total || 1)) * 100).toFixed(1)}% of total`}
        icon="heroicons:check-circle"
        color="green"
      />
      <StatCard
        title="Pending Review"
        value={stats.pending}
        subtitle="Awaiting approval"
        icon="heroicons:clock"
        color="yellow"
      />
      <StatCard
        title="Expiring Soon"
        value={stats.expiring}
        subtitle={`${stats.expired} expired`}
        icon="heroicons:exclamation-triangle"
        color="red"
      />
    </div>
  );

  const renderFilters = () => (
    <div className="p-3">
      <button
        className="w-full sm:hidden flex items-center justify-between py-2 text-sm font-semibold text-slate-700"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        <span className="flex items-center gap-2">
          <Icon icon="heroicons:funnel" className="w-4 h-4" />
          Filters
        </span>
        <Icon icon={showMobileFilters ? "heroicons:chevron-up" : "heroicons:chevron-down"} className="w-4 h-4" />
      </button>

      <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
          <div className="relative flex-1 min-w-[120px]">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 sm:h-10 pl-8 sm:pl-10 pr-3 sm:pr-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            />
            <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
          </div>

          <div className="relative flex-1 min-w-[120px]">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 min-w-[120px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Status</option>
              {statuses.filter(s => s !== 'all').map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 min-w-[120px]">
            <select
              value={filterEmployeeType}
              onChange={(e) => setFilterEmployeeType(e.target.value)}
              className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Employee Types</option>
              {EMPLOYEE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
          </div>

          <button
            type="button"
            className="h-8 sm:h-10 px-3 sm:px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1 sm:gap-2"
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
              setFilterStatus('all');
              setFilterEmployeeType('all');
              setShowMobileFilters(false);
            }}
          >
            <Icon icon="heroicons:arrow-path" className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => {
          setSelectedDocument(null);
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
          setShowDocumentModal(true);
        }}
        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 sm:gap-2"
      >
        <Icon icon="heroicons:plus" className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">Upload</span> Document
      </button>
      <button
        onClick={() => setShowTemplatesModal(true)}
        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 sm:gap-2"
      >
        <Icon icon="heroicons:document-duplicate" className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">Templates</span>
      </button>
      <button
        onClick={() => setViewMode(viewMode === 'list' ? 'checklist' : 'list')}
        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 sm:gap-2"
      >
        <Icon icon={viewMode === 'list' ? 'heroicons:clipboard-document-check' : 'heroicons:list-bullet'} className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">{viewMode === 'list' ? 'Checklist' : 'List'}</span>
      </button>
      <label className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 sm:gap-2 cursor-pointer">
        <Icon icon="heroicons:arrow-up-tray" className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">Bulk</span> Upload
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleBulkUpload(e.target.files)}
        />
      </label>
    </div>
  );

  const renderBulkActions = () => {
    if (selectedDocuments.length === 0) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-blue-700">
          {selectedDocuments.length} document(s) selected
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleBulkApprove}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Approve
          </button>
          <button
            onClick={() => {
              selectedDocuments.forEach(docId => {
                const doc = documents.find(d => d.id === docId);
                if (doc) handleDownloadDocument(doc);
              });
            }}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Download
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const renderExpiringAlert = () => {
    if (stats.expiring === 0) return null;

    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
        <Icon icon="heroicons:exclamation-triangle" className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Renewal Alert</p>
          <p className="text-xs text-amber-700">
            {stats.expiring} document(s) are expiring within 30 days. Please review and renew them.
          </p>
        </div>
      </div>
    );
  };

  const renderChecklistView = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mandatory Document Checklist</h6>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
            <tr>
              <th className="p-3 text-left min-w-[150px]">Employee</th>
              <th className="p-3 text-left min-w-[120px]">Employee Type</th>
              <th className="p-3 text-left min-w-[200px]">Mandatory Documents</th>
              <th className="p-3 text-center min-w-[120px]">Status</th>
              <th className="p-3 text-center min-w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {uniqueEmployees.map((employee) => {
              const docStatus = getEmployeeDocumentStatus(employee);
              const mandatoryDocs = getMandatoryDocumentsForEmployee(employee);
              const uploadedCount = docStatus.filter(d => d.uploaded).length;
              const approvedCount = docStatus.filter(d => d.uploaded && d.status === 'approved').length;
              const completionPercentage = mandatoryDocs.length > 0 ? (uploadedCount / mandatoryDocs.length) * 100 : 0;
              
              return (
                <tr key={employee.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 font-semibold text-slate-800">{employee.name}</td>
                  <td className="p-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100">
                      {employee.employeeType || 'N/A'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">
                        {uploadedCount} of {mandatoryDocs.length} uploaded
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${completionPercentage === 100 ? 'bg-emerald-500' : completionPercentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${approvedCount === mandatoryDocs.length ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                        {approvedCount}/{mandatoryDocs.length} Approved
                      </span>
                      {completionPercentage < 100 && (
                        <div className="text-[10px] text-rose-500">
                          {mandatoryDocs.length - uploadedCount} Missing
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => openChecklistModal(employee)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition"
                    >
                      <Icon icon="heroicons:eye" className="w-3 h-3 inline mr-1" />
                      View                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDocumentTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading documents...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Icon icon="heroicons:exclamation-triangle" className="w-12 h-12 text-rose-500 mb-3" />
          <p className="text-sm font-medium text-slate-800">Failed to load documents</p>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
          <button
            onClick={loadDocuments}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-3 text-left min-w-[100px]">Document</th>
                  <th className="p-3 text-left min-w-[100px] hidden sm:table-cell">Category</th>
                  <th className="p-3 text-left min-w-[130px] hidden md:table-cell">Employee</th>
                  <th className="p-3 text-center min-w-[60px]">Version</th>
                  <th className="p-3 text-left min-w-[100px] hidden lg:table-cell">Upload Date</th>
                  <th className="p-3 text-left min-w-[100px] hidden xl:table-cell">Expiry Date</th>
                  <th className="p-3 text-center min-w-[100px]">Status</th>
                  <th className="p-3 text-center min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedDocuments.map((doc) => {
                  const expiring = isExpiringSoon(doc.expiryDate);
                  const expired = isExpired(doc.expiryDate);
                  const rowClass = expired ? 'bg-rose-50/30' : expiring ? 'bg-amber-50/30' : '';

                  return (
                    <tr key={doc.id} className={`hover:bg-slate-50/50 transition-colors ${rowClass}`}>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => handleSelectDocument(doc.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Icon icon={getFileIcon(doc.fileType)} className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-slate-800 text-xs sm:text-sm truncate flex items-center gap-1.5">
                              {doc.name}
                              {doc.mandatory && (
                                <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-100 flex-shrink-0">
                                  Mandatory
                                </span>
                              )}
                              {doc.downloadRestricted && (
                                <Icon icon="heroicons:lock-closed" className="w-3 h-3 text-amber-500 flex-shrink-0" title="Download Restricted" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {doc.fileType?.toUpperCase()} • {doc.size}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell">{getCategoryBadge(doc.category)}</td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="text-slate-700 text-xs sm:text-sm">{doc.employee?.name}</div>
                        <div className="text-[10px] text-slate-400">{doc.employee?.employeeType || 'N/A'}</div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            v{doc.version}
                          </span>
                          {doc.versionHistory && doc.versionHistory.length > 1 && (
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowVersionHistoryModal(true);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600 transition"
                              title="View Version History"
                            >
                              <Icon icon="heroicons:clock" className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Icon icon="heroicons:calendar" className="w-3 h-3 text-slate-400" />
                          <span className="text-xs">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-3 hidden xl:table-cell">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Icon icon="heroicons:calendar-days" className="w-3 h-3 text-slate-400" />
                          <span className={`text-xs ${expired ? 'text-rose-600 font-medium' : ''}`}>
                            {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'No Expiry'}
                          </span>
                          {expiring && !expired && (
                            <Icon icon="heroicons:exclamation-triangle" className="w-3 h-3 text-amber-500" />
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">{getStatusBadge(doc.status)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          <button
                            onClick={() => openViewerModal(doc)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                            title="View"
                          >
                            <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                          </button>
                          {doc.status === 'pending' && (
                            <button
                              onClick={() => openApprovalModal(doc)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                              title="Approve/Reject"
                            >
                              <Icon icon="heroicons:check-circle" className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(doc)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Icon icon="heroicons:pencil" className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                            title="Download"
                          >
                            <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowAuditTrailModal(true);
                            }}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                            title="Audit Trail"
                          >
                            <Icon icon="heroicons:document-text" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                            title="Delete"
                          >
                            <Icon icon="heroicons:trash" className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Icon icon="heroicons:folder-open" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium text-slate-600">No documents found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[10px] sm:text-xs text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDocuments.length)} of {filteredDocuments.length} documents
              </div>
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="heroicons:chevron-left" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                </button>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-semibold transition ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/15'
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="text-slate-400 text-xs">...</span>}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="heroicons:chevron-right" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 min-h-screen pb-8 sm:pb-10">
      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
              <Icon icon="heroicons:folder" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
                Document Vault & Management
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 flex flex-wrap items-center gap-1 sm:gap-2">
                <span>Centralized document repository</span>
                <span className="w-0.5 h-0.5 rounded-full bg-slate-300 hidden xs:inline"></span>
                <span className="hidden xs:inline">Version control & approval workflow</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {renderActions()}
          </div>
        </div>
      </div>

      {renderStats()}

      {renderFilters()}

      {renderExpiringAlert()}

      {renderBulkActions()}

      {viewMode === 'checklist' ? renderChecklistView() : renderDocumentTable()}

      <DocumentModal
        isOpen={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false);
          setSelectedDocument(null);
        }}
        onSubmit={selectedDocument ? handleUpdateDocument : handleCreateDocument}
        document={selectedDocument}
        employees={employees}
        documentTypes={documentTypes}
        categories={categories}
        statuses={statuses}
      />

      <DocumentViewerModal
        isOpen={showViewerModal}
        onClose={() => {
          setShowViewerModal(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onDownload={handleDownloadDocument}
        currentUser={currentUser}
      />

      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => {
          setShowApprovalModal(false);
          setSelectedDocument(null);
        }}
        onSubmit={handleApproveReject}
        document={selectedDocument}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDocument(null);
        }}
        onConfirm={handleDeleteDocument}
        document={selectedDocument}
      />

      <VersionHistoryModal
        isOpen={showVersionHistoryModal}
        onClose={() => {
          setShowVersionHistoryModal(false);
          setSelectedDocument(null);
          setUploadFile(null);
        }}
        document={selectedDocument}
        onUploadVersion={handleUploadNewVersion}
      />

      <AuditTrailModal
        isOpen={showAuditTrailModal}
        onClose={() => {
          setShowAuditTrailModal(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
      />

      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        templates={documentTemplates}
        onDownload={(template) => toast.info(`Downloading ${template.name}`)}
        getFileIcon={getFileIcon}
      />

      <ChecklistModal
        isOpen={showChecklistModal}
        onClose={() => {
          setShowChecklistModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        documents={documents}
        getMandatoryDocumentsForEmployee={getMandatoryDocumentsForEmployee}
        getEmployeeDocumentStatus={getEmployeeDocumentStatus}
        getStatusBadge={getStatusBadge}
        onViewDocument={openViewerModal}
        onEditDocument={openEditModal}
        onUploadDocument={(docName) => {
          setDocumentForm({
            ...documentForm,
            documentType: docName,
            name: docName,
            employee: selectedEmployee?.id?.toString() || '',
            employeeType: selectedEmployee?.employeeType || '',
            mandatory: true
          });
          setShowChecklistModal(false);
          setShowDocumentModal(true);
        }}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        className="text-xs sm:text-sm"
        toastClassName="rounded-xl shadow-lg"
      />
    </div>
  );
};

export default DocumentVault;