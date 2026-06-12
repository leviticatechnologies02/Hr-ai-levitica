import React, { useState, useEffect, useCallback } from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { companiesAPI } from "../../../shared/utils/api";
import { BASE_URL } from "../../../shared/constants/api.config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiPlus,
  FiDownload,
  FiFileText,
  FiFile,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiMail,
  FiPhone,
  FiGlobe,
  FiStar,
  FiX,
  FiSave,
  FiUser,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiLink,
  FiLock,
  FiShield,
  FiAlertCircle,
  FiChevronDown,
  FiUpload,
  FiBriefcase,
  FiDollarSign,
  FiTag,
  FiCalendar
} from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import { FaBuilding } from 'react-icons/fa';

const sampleCompanies = [
  { name: 'Brightwave Innovations', email: 'clara@example.com', phone: '(563) 245 3156', location: 'Germany', rating: 4.5 },
  { name: 'Stellar Dynamics', email: 'sharon@example.com', phone: '(148) 126 6495', location: 'USA', rating: 4.5 },
  { name: 'Quantum Nexus', email: 'rayuhan@example.com', phone: '(248) 136 6495', location: 'India', rating: 4.5 },
  { name: 'EcoVision Enterprises', email: 'jessica@example.com', phone: '(563) 245 3156', location: 'Canada', rating: 4.5 },
  { name: 'Aurora Technologies', email: 'clara@example.com', phone: '(563) 245 3156', location: 'Germany', rating: 4.5 },
  { name: 'BluSky Ventures', email: 'diana@example.com', phone: '(563) 245 3156', location: 'Japan', rating: 4.5 },
  { name: 'TerraFusion Energy', email: 'rakesh@example.com', phone: '(563) 245 3156', location: 'Indonesia', rating: 4.5 },
  { name: 'UrbanPulse Design', email: 'jonella@example.com', phone: '(563) 245 3156', location: 'USA', rating: 4.5 },
];

function Companies() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Crmcompanies, setCrmcompanies] = useState([]);
  const [displayedCompanies, setDisplayedCompanies] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('basic-info');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [sortLocation, setSortLocation] = useState('');

  const predefinedCurrencies = ["Dollar", "Euro", "Rupee", "Pound"];
  const predefinedLanguages = ["English", "Spanish", "French", "German"];
  const predefinedOwners = ["Hendry Milner", "Guilory Berggren", "Jami Carlile"];
  const predefinedIndustries = ["Retail Industry", "Banking", "Hotels", "Financial Services", "Insurance"];
  const predefinedSources = ["Phone Calls", "Social Media", "Referral Sites", "Web Analytics", "Previous Purchase"];
  const predefinedContacts = ["Darlee Robertson", "Sharon Roy", "Vaughan", "Jessica", "Carol Thomas"];

  const [formData, setFormData] = useState({
    companyName: '', email: '', phoneNumber: '', phoneNumber2: '', fax: '', website: '', ratings: '',
    owner: "", customOwner: "", tags: '', deals: '', industry: '', customIndustry: '', source: '', customSource: '',
    currency: "", customCurrency: "", language: "", customLanguage: "", about: '', contact: '', customContact: '',
    address: '', country: '', state: '', city: '', zipcode: '', facebook: '', twitter: '', linkedin: '',
    skype: '', whatsapp: '', instagram: '', visibility: 'private', status: '', selectedUsers: []
  });

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companiesAPI.list();
      if (Array.isArray(data)) {
        const transformedCompanies = data.map(company => ({
          id: company.id,
          name: company.company_name || company.name || 'Untitled Company',
          email: company.email || '',
          phone: company.phone_number || company.phone || '',
          phone2: company.phone_number2 || company.phone2 || '',
          location: company.location || company.country || '',
          rating: company.rating || 0,
          logo: company.logo || null,
          logoPath: company.logo ? (company.logo.startsWith('http') ? company.logo : `${BASE_URL}${company.logo}`) : null,
          ...company
        }));
        setCrmcompanies(transformedCompanies);
        setDisplayedCompanies(transformedCompanies);
      } else {
        setCrmcompanies([]);
        setDisplayedCompanies([]);
      }
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Failed to load companies. Using sample data for preview.');
      setCrmcompanies(sampleCompanies);
      setDisplayedCompanies(sampleCompanies);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    if (sortLocation) {
      const filtered = Crmcompanies.filter(c =>
        (c.location && c.location.toLowerCase().includes(sortLocation.toLowerCase())) ||
        (c.country && c.country.toLowerCase().includes(sortLocation.toLowerCase()))
      );
      setDisplayedCompanies(filtered);
    } else {
      setDisplayedCompanies(Crmcompanies);
    }
  }, [sortLocation, Crmcompanies]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Image size should be below 4MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const resetForm = () => {
    setFormData({
      companyName: '', email: '', phoneNumber: '', phoneNumber2: '', fax: '', website: '', ratings: '',
      owner: "", customOwner: "", tags: '', deals: '', industry: '', customIndustry: '', source: '', customSource: '',
      currency: "", customCurrency: "", language: "", customLanguage: "", about: '', contact: '', customContact: '',
      address: '', country: '', state: '', city: '', zipcode: '', facebook: '', twitter: '', linkedin: '',
      skype: '', whatsapp: '', instagram: '', visibility: 'private', status: '', selectedUsers: []
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleAddCompany = () => {
    setModalType('add');
    resetForm();
    setSelectedCompany(null);
    setActiveTab('basic-info');
    setShowModal(true);
  };

  const handleEditCompany = (company) => {
    setModalType('edit');
    setSelectedCompany(company);
    const logoUrl = company.logoPath || null;
    setImagePreview(logoUrl);
    setFormData({
      companyName: company.company_name || company.name || '',
      email: company.email || '',
      phoneNumber: company.phone_number || company.phone || '',
      phoneNumber2: company.phone_number2 || company.phone2 || '',
      fax: company.fax || '',
      website: company.website || '',
      address: company.address || '',
      country: company.country || '',
      state: company.state || '',
      city: company.city || '',
      zipcode: company.zipcode || '',
      ratings: company.rating ? company.rating.toString() : '',
      industry: predefinedIndustries.includes(company.industry) ? company.industry : "Others",
      customIndustry: predefinedIndustries.includes(company.industry) ? "" : company.industry || "",
      source: predefinedSources.includes(company.source) ? company.source : "Others",
      customSource: predefinedSources.includes(company.source) ? "" : company.source || "",
      currency: predefinedCurrencies.includes(company.currency) ? company.currency : "Other",
      customCurrency: predefinedCurrencies.includes(company.currency) ? "" : company.currency || "",
      language: predefinedLanguages.includes(company.language) ? company.language : "Other",
      customLanguage: predefinedLanguages.includes(company.language) ? "" : company.language || "",
      owner: predefinedOwners.includes(company.owner) ? company.owner : "Others",
      customOwner: predefinedOwners.includes(company.owner) ? "" : company.owner || "",
      contact: predefinedContacts.includes(company.contact) ? company.contact : "Others",
      customContact: predefinedContacts.includes(company.contact) ? "" : company.contact || "",
      deals: company.deals || '',
      tags: company.tags || '',
      about: company.about || '',
      facebook: company.facebook || '',
      twitter: company.twitter || '',
      linkedin: company.linkedin || '',
      instagram: company.instagram || '',
      skype: company.skype || '',
      whatsapp: company.whatsapp || '',
      visibility: company.visibility || 'private',
      status: company.status || '',
      selectedUsers: company.selectedUsers || []
    });
    setActiveTab('basic-info');
    setShowModal(true);
  };

  const handleDeleteCompany = (company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      try {
        await companiesAPI.delete(companyToDelete.id);
        await loadCompanies();
        setShowDeleteModal(false);
        setCompanyToDelete(null);
        toast.success('Company deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete company');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const companyData = {
        company_name: formData.companyName || 'Untitled Company',
        email: formData.email || null,
        phone_number: formData.phoneNumber || null,
        phone_number2: formData.phoneNumber2 || null,
        fax: formData.fax || null,
        website: formData.website || null,
        location: formData.address || formData.country || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        zipcode: formData.zipcode || null,
        address: formData.address || null,
        rating: formData.ratings ? parseFloat(formData.ratings) : null,
        industry: formData.industry === "Others" ? formData.customIndustry || null : formData.industry || null,
        source: formData.source === "Others" ? formData.customSource || null : formData.source || null,
        currency: formData.currency === "Other" ? formData.customCurrency || null : formData.currency || null,
        language: formData.language === "Other" ? formData.customLanguage || null : formData.language || null,
        owner: formData.owner === "Others" ? formData.customOwner || null : formData.owner || null,
        contact: formData.contact === "Others" ? formData.customContact || null : formData.contact || null,
        deals: formData.deals || null,
        tags: formData.tags || null,
        about: formData.about || null,
        facebook: formData.facebook || null,
        twitter: formData.twitter || null,
        linkedin: formData.linkedin || null,
        instagram: formData.instagram || null,
        skype: formData.skype || null,
        whatsapp: formData.whatsapp || null,
        visibility: formData.visibility || 'private',
        status: formData.status || null,
        selectedUsers: formData.selectedUsers || []
      };

      Object.keys(companyData).forEach(key => {
        if (companyData[key] === '') companyData[key] = null;
      });

      if (modalType === 'add') {
        await companiesAPI.create(companyData, selectedFile);
        toast.success('Company created successfully!');
      } else if (selectedCompany) {
        await companiesAPI.update(selectedCompany.id, companyData, selectedFile);
        toast.success('Company updated successfully!');
      }

      await loadCompanies();
      setShowModal(false);
      resetForm();
      setSelectedCompany(null);
    } catch (err) {
      toast.error('Failed to save company');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveTab('basic-info');
    resetForm();
    setSelectedCompany(null);
  };

  const handleUserSelect = (e) => {
    const value = e.target.value;
    setFormData(prev => {
      const selected = prev.selectedUsers || [];
      if (selected.includes(value)) {
        return { ...prev, selectedUsers: selected.filter(id => id !== value) };
      } else {
        return { ...prev, selectedUsers: [...selected, value] };
      }
    });
  };

  const handleExportPDF = () => {
    const exportData = Crmcompanies.length > 0 ? Crmcompanies : sampleCompanies;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Companies List", 10, 10);
    let y = 20;
    exportData.forEach((c, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${c.name} - ${c.email || 'N/A'} - ${c.phone || 'N/A'} - ${c.location || 'N/A'}`, 10, y);
      y += 10;
      if (y > 280) { doc.addPage(); y = 20; }
    });
    doc.save(`companies_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF exported successfully!');
  };

  const handleExportEXCEL = () => {
    const exportData = Crmcompanies.length > 0 ? Crmcompanies : sampleCompanies;
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Rating'];
    const csvContent = [
      headers.join(','),
      ...exportData.map(company => [`"${company.name || ''}"`, `"${company.email || ''}"`, `"${company.phone || ''}"`, `"${company.location || ''}"`, `"${company.rating || 0}"`].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `companies_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Excel file downloaded successfully!');
  };

  const uniqueLocations = [...new Set(Crmcompanies.map(c => c.location?.trim() || c.country?.trim()).filter(Boolean))];


  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FaBuilding className="text-gray-600 text-xl sm:text-2xl" />
              Companies
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage contacts, associated companies, and communication details from a single platform</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
              >
                <FiDownload className="h-4 w-4" />
                Export
                <FiChevronDown className="h-3 w-3" />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                  <button onClick={() => { handleExportPDF(); setShowExportDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg">
                    <FiFileText className="h-4 w-4" /> Export as PDF
                  </button>
                  <button onClick={() => { handleExportEXCEL(); setShowExportDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-b-lg">
                    <FiFile className="h-4 w-4" /> Export as Excel
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleAddCompany}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiPlus className="h-4 w-4" />
              Add Company
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-700">
            <FiAlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <span className="text-sm flex-1">{error}</span>
          </div>
        )}

        {/* Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h6 className="font-semibold text-midnight_text">Companies Grid</h6>
          <select
            value={sortLocation}
            onChange={(e) => setSortLocation(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
          >
            <option value="">Sort by Location</option>
            {uniqueLocations.map((location, idx) => (
              <option key={idx} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Companies Grid */}
        {loading && Crmcompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-gray-500 text-sm">Loading companies...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {displayedCompanies.map((company, index) => (
              <div key={company.id || index} className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full">
                <div className="p-4 flex-1 flex flex-col">
                  {/* Header: Logo, Name */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center overflow-hidden border border-indigo-100 flex-shrink-0 mt-1">
                      {company.logoPath ? (
                        <img src={company.logoPath} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        <FaBuilding className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-base break-words leading-tight">{company.name}</h3>
                      <div className="flex items-center mt-1 gap-1">
                        <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium text-gray-500">{company.rating || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-3 mb-5 mt-auto">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <FiMail className="h-4 w-4" />
                      </div>
                      <span className="text-gray-700 truncate">{company.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <FiPhone className="h-4 w-4" />
                      </div>
                      <span className="text-gray-700 truncate">{company.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <FiMapPin className="h-4 w-4" />
                      </div>
                      <span className="text-gray-700 truncate">{company.location || "N/A"}</span>
                    </div>
                  </div>

                  {/* Actions (Bottom) */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleEditCompany(company)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-primary/10 text-gray-600 hover:text-primary rounded-lg text-xs font-medium transition-colors"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 rounded-lg text-xs font-medium transition-colors"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {displayedCompanies.length === 0 && !loading && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
            <FaBuilding className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-midnight_text mb-1">No companies found</h3>
            <p className="text-sm text-gray-500 mb-4">Add your first company to get started</p>
            <button
              onClick={handleAddCompany}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiPlus className="h-4 w-4" />
              Add Company
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Company Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={modalType === 'add' ? 'Add New Company' : 'Edit Company'}
        size="xl"
      >
        <div className="space-y-4">
          {/* Logo Upload */}
          <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Logo preview" className="w-full h-full object-cover" />
                ) : (
                  <FaBuilding className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-midnight_text mb-1">Upload Company Logo</p>
              <p className="text-xs text-gray-400 mb-3">Image should be below 4 MB</p>
              <div className="flex flex-wrap gap-2">
                <label className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium cursor-pointer transition-all inline-flex items-center gap-1">
                  <FiUpload className="h-3 w-3" />
                  Upload
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {(selectedFile || imagePreview) && (
                  <button onClick={handleRemoveImage} className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1">
                    <FiTrash2 className="h-3 w-3" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex gap-4 overflow-x-auto">
              <button onClick={() => setActiveTab('basic-info')} className={`pb-2 text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'basic-info' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Basic Information</button>
              <button onClick={() => setActiveTab('address')} className={`pb-2 text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'address' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Address</button>
              <button onClick={() => setActiveTab('social-profile')} className={`pb-2 text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'social-profile' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Social Profiles</button>
              <button onClick={() => setActiveTab('access')} className={`pb-2 text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'access' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Access</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'basic-info' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-rose-500">*</span></label><input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-rose-500">*</span></label><input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 2</label><input type="text" name="phoneNumber2" value={formData.phoneNumber2} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Fax</label><input type="text" name="fax" value={formData.fax} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Website</label><input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Ratings <span className="text-rose-500">*</span></label><input type="number" name="ratings" value={formData.ratings} onChange={handleInputChange} min="1" max="5" step="0.1" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                  {formData.owner === "Others" ? (
                    <input type="text" placeholder="Enter Owner" value={formData.customOwner} onChange={(e) => setFormData(prev => ({ ...prev, customOwner: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
                  ) : (
                    <select name="owner" value={formData.owner} onChange={(e) => { const value = e.target.value; if (value === "Others") setFormData(prev => ({ ...prev, owner: "Others" })); else handleInputChange(e); }} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white">
                      <option value="">Select</option><option value="Hendry Milner">Hendry Milner</option><option value="Guilory Berggren">Guilory Berggren</option><option value="Jami Carlile">Jami Carlile</option><option value="Others">Others</option>
                    </select>
                  )}
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags</label><input type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Add tags separated by commas" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Deals</label><select name="deals" value={formData.deals} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="">Select</option><option value="Collins">Collins</option><option value="Konopelski">Konopelski</option><option value="Adams">Adams</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  {formData.industry === "Others" ? (
                    <input type="text" placeholder="Enter Industry" value={formData.customIndustry} onChange={(e) => setFormData(prev => ({ ...prev, customIndustry: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
                  ) : (
                    <select name="industry" value={formData.industry} onChange={(e) => { const value = e.target.value; if (value === "Others") setFormData(prev => ({ ...prev, industry: "Others" })); else handleInputChange(e); }} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white">
                      <option value="">Select</option><option value="Retail Industry">Retail Industry</option><option value="Banking">Banking</option><option value="Hotels">Hotels</option><option value="Financial Services">Financial Services</option><option value="Insurance">Insurance</option><option value="Others">Others</option>
                    </select>
                  )}
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  {formData.source === "Others" ? (
                    <input type="text" placeholder="Enter Source" value={formData.customSource} onChange={(e) => setFormData(prev => ({ ...prev, customSource: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
                  ) : (
                    <select name="source" value={formData.source} onChange={(e) => { const value = e.target.value; if (value === "Others") setFormData(prev => ({ ...prev, source: "Others" })); else handleInputChange(e); }} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white">
                      <option value="">Select</option><option value="Phone Calls">Phone Calls</option><option value="Social Media">Social Media</option><option value="Referral Sites">Referral Sites</option><option value="Web Analytics">Web Analytics</option><option value="Previous Purchase">Previous Purchase</option><option value="Others">Others</option>
                    </select>
                  )}
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  {formData.currency === "Other" ? (
                    <input type="text" placeholder="Enter Currency (e.g. INR, JPY, CNY)" value={formData.customCurrency} onChange={(e) => setFormData(prev => ({ ...prev, customCurrency: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
                  ) : (
                    <select value={formData.currency} onChange={(e) => { const value = e.target.value; if (value === "Other") setFormData(prev => ({ ...prev, currency: "Other", customCurrency: "" })); else setFormData(prev => ({ ...prev, currency: value, customCurrency: "" })); }} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white">
                      <option value="Dollar">Dollar</option><option value="Euro">Euro</option><option value="Rupee">Rupee</option><option value="Pound">Pound</option><option value="Other">Other</option>
                    </select>
                  )}
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  {formData.language === "Other" ? (
                    <input type="text" placeholder="Enter Language" value={formData.customLanguage} onChange={(e) => setFormData(prev => ({ ...prev, customLanguage: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
                  ) : (
                    <select value={formData.language} onChange={(e) => { const value = e.target.value; if (value === "Other") setFormData(prev => ({ ...prev, language: "Other" })); else setFormData(prev => ({ ...prev, language: value, customLanguage: "" })); }} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white">
                      <option value="English">English</option><option value="Spanish">Spanish</option><option value="French">French</option><option value="German">German</option><option value="Other">Other</option>
                    </select>
                  )}
                </div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">About</label><textarea name="about" value={formData.about} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"></textarea></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  {formData.contact === "Others" ? (
                    <input type="text" placeholder="Enter Contact Name" value={formData.customContact} onChange={(e) => setFormData(prev => ({ ...prev, customContact: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
                  ) : (
                    <select name="contact" value={formData.contact} onChange={(e) => { const value = e.target.value; if (value === "Others") setFormData(prev => ({ ...prev, contact: "Others" })); else handleInputChange(e); }} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white">
                      <option value="">Select</option><option value="Darlee Robertson">Darlee Robertson</option><option value="Sharon Roy">Sharon Roy</option><option value="Vaughan">Vaughan</option><option value="Jessica">Jessica</option><option value="Carol Thomas">Carol Thomas</option><option value="Others">Others</option>
                    </select>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Country</label><input type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label><input type="text" name="zipcode" value={formData.zipcode} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
              </div>
            )}

            {activeTab === 'social-profile' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label><input type="url" name="facebook" value={formData.facebook} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label><input type="url" name="twitter" value={formData.twitter} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label><input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Skype</label><input type="text" name="skype" value={formData.skype} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label><input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label><input type="url" name="instagram" value={formData.instagram} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
              </div>
            )}

            {activeTab === 'access' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <div className="flex gap-4">
                    {["public", "private", "selectPeople"].map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="visibility" value={option} checked={formData.visibility === option} onChange={handleInputChange} className="text-primary focus:ring-primary" />
                        <span className="text-sm text-gray-700 capitalize">{option === 'selectPeople' ? 'Select People' : option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="">Select</option><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all disabled:opacity-50">
                <FiSave className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete" size="md">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="h-8 w-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-midnight_text mb-2">Are you sure?</h3>
          <p className="text-sm text-gray-500">Do you want to delete the company "{companyToDelete?.company_name || companyToDelete?.name}"? This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
          <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all">Delete Company</button>
        </div>
      </Modal>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </div>
  );
}

export default Companies;