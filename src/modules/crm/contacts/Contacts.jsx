import React, { useState, useEffect } from "react";
import { contactsAPI } from "../../../shared/utils/api";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { 
  FiUsers, 
  FiPlus, 
  FiDownload, 
  FiFileText, 
  FiFile,
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiSave,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiGlobe,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiLink,
  FiLock,
  FiShield,
  FiStar,
  FiCalendar,
  FiTag,
  FiDollarSign,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiUpload
} from 'react-icons/fi';
import { FaSkype } from 'react-icons/fa';
import { BASE_URL } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const predefinedCurrencies = ["Dollar", "Euro", "Rupee", "Pound"];
  const predefinedLanguages = ["English", "Spanish", "French", "German"];
  const predefinedSources = [
    "Social Media", "Website", "Referral", "LinkedIn", 
    "Email Campaign", "Conference", "GitHub"
  ];
  const predefinedOwners = ["Hendry Milner", "John Doe", "Sarah Wilson", "Mike Johnson"];
  const predefinedIndustries = [
    "Retail Industry", "Technology", "Design", "Human Resources", 
    "Marketing", "Consulting"
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactsAPI.list();
      setContacts(data);
    } catch (err) {
      console.error("Error loading contacts:", err);
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '', lastName: '', role: '', phone: '', phone2: '', fax: '',
    email: '', company: '', dateOfBirth: '', rating: '0',
    owner: "", customOwner: "", deals: '', industry: '', customIndustry: '',
    currency: 'Dollar', customCurrency: '', language: 'English', customLanguage: '',
    source: '', customSource: '', tags: [], img: '/assets/img/users/user-49.jpg',
    location: '', city: '', state: '', country: '', postalCode: '',
    facebook: '', twitter: '', linkedin: '', instagram: '', skype: '', website: '',
    accessLevel: '', department: '', allowEmailAccess: false, allowPhoneAccess: false, allowDataExport: false
  });

  const resetForm = () => {
    setFormData({
      name: '', lastName: '', role: '', phone: '', phone2: '', fax: '',
      email: '', company: '', dateOfBirth: '', rating: '0',
      owner: "", customOwner: "", deals: '', industry: '', customIndustry: '',
      currency: 'Dollar', customCurrency: '', language: 'English', customLanguage: '',
      source: '', customSource: '', tags: [], img: '/assets/images/users/user1.png',
      location: '', city: '', state: '', country: '', postalCode: '',
      facebook: '', twitter: '', linkedin: '', instagram: '', skype: '', website: '',
      accessLevel: '', department: '', allowEmailAccess: false, allowPhoneAccess: false, allowDataExport: false
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const CARD_WIDTH = 190;
    const CARD_HEIGHT = 75;
    const LEFT_COL_X = 14;
    const RIGHT_COL_X = 105;
    const LABEL_OFFSET = 25;
    const LINE_HEIGHT = 5;
    let y = 20;

    const addField = (label, value, x, y, maxLength = 30) => {
      doc.setFont("helvetica", "bold");
      doc.text(label + ":", x, y);
      doc.setFont("helvetica", "normal");
      const displayValue = value || "N/A";
      if (maxLength === null) {
        const lines = doc.splitTextToSize(displayValue, 65);
        doc.text(lines, x + LABEL_OFFSET, y);
        return lines.length;
      }
      if (maxLength && displayValue.length > maxLength) {
        doc.text(displayValue.substring(0, maxLength - 3) + "...", x + LABEL_OFFSET, y);
      } else {
        doc.text(displayValue, x + LABEL_OFFSET, y);
      }
      return 1;
    };

    const combineFields = (fields, separator = ", ") => {
      return fields.filter(Boolean).join(separator) || "N/A";
    };

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Contacts Report", 14, 10);

    contacts.forEach((contact) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.roundedRect(10, y, CARD_WIDTH, CARD_HEIGHT, 3, 3, 'FD');
      doc.setDrawColor(220, 220, 220);
      doc.line(10, y + 10, 200, y + 10);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      const fullName = combineFields([contact.name, contact.last_name], " ");
      doc.text(fullName, LEFT_COL_X, y + 7);
      
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      
      const fieldGroups = {
        left: [
          { label: "Job Title", value: contact.job_title },
          { label: "Company", value: contact.company_name },
          { label: "Email", value: contact.email },
          { label: "Phone", value: contact.phone_number },
          { label: "Phone 2", value: contact.phone_number_2 },
          { label: "Fax", value: contact.fax },
        ],
        right: [
          { label: "DOB", value: contact.date_of_birth },
          { label: "Rating", value: contact.ratings || "-" },
          { label: "Owner", value: contact.owner },
          { label: "Industry", value: contact.industry },
          { label: "Currency", value: contact.currency },
          { label: "Language", value: contact.language },
        ],
        bottomLeft: [
          { label: "Deals", value: contact.deals, maxLength: 20 },
          { label: "Source", value: contact.source },
          { label: "Postal", value: contact.postal_code },
          { label: "Social 2", value: combineFields([contact.linkedin, contact.instagram]) },
          { label: "Skype", value: contact.skype },
          { label: "Dept", value: contact.department }
        ],
        bottomRight: [
          { label: "Tags", value: Array.isArray(contact.tags) ? contact.tags.join(", ") : contact.tags, maxLength: 20 },
          { label: "Location", value: combineFields([contact.location, contact.city, contact.state, contact.country]), maxLength: null },
          { label: "Social", value: combineFields([contact.facebook, contact.twitter]) },
          { label: "Website", value: contact.website },
          { label: "Access", value: contact.access_level },
          { label: "Permissions", value: contact.permissions }
        ]
      };
      
      const renderColumn = (fields, startX, startY, maxLength = 30) => {
        let currentY = startY;
        fields.forEach(field => {
          const lines = addField(field.label, field.value, startX, currentY, field.maxLength !== undefined ? field.maxLength : maxLength);
          currentY += lines * LINE_HEIGHT;
        });
        return currentY;
      };
      
      renderColumn(fieldGroups.left, LEFT_COL_X, y + 17);
      renderColumn(fieldGroups.right, RIGHT_COL_X, y + 17);
      const secondRowY = y + 47;
      renderColumn(fieldGroups.bottomLeft, LEFT_COL_X, secondRowY, 25);
      renderColumn(fieldGroups.bottomRight, RIGHT_COL_X, secondRowY, 25);
      
      y += CARD_HEIGHT + 8;
    });
    
    doc.save("contacts_cards.pdf");
  };

  const exportExcel = () => {
    const excelData = contacts.map((c) => ({
      "Name": `${c.name || ""} ${c.last_name || "N/A"}`.trim() || "N/A",
      "Last Name": c.last_name || "N/A",
      "Job Title": c.job_title || "N/A",
      "Company Name": c.company_name || "N/A",
      "Email": c.email || "N/A",
      "Phone Number": c.phone_number || "N/A",
      "Phone Number 2": c.phone_number_2 || "N/A",
      "Fax": c.fax || "N/A",
      "Deals": c.deals || "N/A",
      "Date of Birth": c.date_of_birth || "N/A",
      "Ratings": c.ratings || "N/A",
      "Owner": c.owner || "N/A",
      "Industry": c.industry || "N/A",
      "Currency": c.currency || "N/A",
      "Language": c.language || "N/A",
      "Tags": c.tags || "N/A",
      "Source": c.source || "N/A",
      "Location": [c.location, c.city, c.state, c.country].filter(Boolean).join(", ") || "N/A",
      "City": c.city || "N/A",
      "State": c.state || "N/A",
      "Country": c.country || "N/A",
      "Postal Code": c.postal_code || "N/A",
      "Facebook": c.facebook || "N/A",
      "Twitter": c.twitter || "N/A",
      "LinkedIn": c.linkedin || "N/A",
      "Instagram": c.instagram || "N/A",
      "Skype": c.skype || "N/A",
      "Website": c.website || "N/A",
      "Access Level": c.access_level || "N/A",
      "Department": c.department || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    if (!worksheet['!cols']) worksheet['!cols'] = [];
    
    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxLength = 0;
      const headerCell = worksheet[XLSX.utils.encode_cell({ r: 0, c: col })];
      if (headerCell && headerCell.v) maxLength = Math.max(maxLength, String(headerCell.v).length);
      const maxRows = Math.min(range.e.r + 1, 100);
      for (let row = 1; row < maxRows; row++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell && cell.v) maxLength = Math.max(maxLength, String(cell.v).length);
      }
      worksheet['!cols'][col] = { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    saveAs(data, `contacts_${dateStr}.xlsx`);
  };

  const handleAddContact = () => {
    setModalType('add');
    resetForm();
    setSelectedContact(null);
    setSelectedFile(null);
    setImagePreview(null);
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleEditContact = (contact) => {
    setModalType('edit');
    setSelectedContact(contact);
    setSelectedFile(null);
    
    let profilePhotoUrl = '/assets/images/users/user1.png';
    if (contact.profile_photo) {
      if (contact.profile_photo.startsWith('http://') || contact.profile_photo.startsWith('https://')) {
        profilePhotoUrl = contact.profile_photo;
      } else if (contact.profile_photo.startsWith('/')) {
        profilePhotoUrl = `${BASE_URL}${contact.profile_photo}`;
      } else {
        profilePhotoUrl = `${BASE_URL}/${contact.profile_photo}`;
      }
    }
    setImagePreview(profilePhotoUrl);
    
    setFormData({
      name: contact.name || '',
      lastName: contact.last_name || '',
      role: contact.job_title || '',
      phone: contact.phone_number || '',
      phone2: contact.phone_number2 || '',
      fax: contact.fax || '',
      email: contact.email || '',
      company: contact.company_name || '',
      dateOfBirth: contact.dob ? (typeof contact.dob === 'string' ? contact.dob.split('T')[0] : contact.dob) : '',
      rating: contact.ratings?.toString() || '0',
      owner: predefinedOwners.includes(contact.owner) ? contact.owner : "Others",
      customOwner: predefinedOwners.includes(contact.owner) ? "" : contact.owner || "",
      deals: contact.deals || '',
      industry: predefinedIndustries.includes(contact.industry) ? contact.industry : "Others",
      customIndustry: predefinedIndustries.includes(contact.industry) ? "" : contact.industry || "",
      currency: predefinedCurrencies.includes(contact.currency) ? contact.currency : "Other",
      customCurrency: predefinedCurrencies.includes(contact.currency) ? "" : contact.currency || "",
      language: predefinedLanguages.includes(contact.language) ? contact.language : "Other",
      customLanguage: predefinedLanguages.includes(contact.language) ? "" : contact.language || "",
      source: predefinedSources.includes(contact.source) ? contact.source : "Others",
      customSource: predefinedSources.includes(contact.source) ? "" : contact.source || "",
      tags: Array.isArray(contact.tags) ? contact.tags : (contact.tags ? contact.tags.split(',') : []),
      img: contact.profile_photo || '/assets/images/users/user1.png',
      location: contact.location || '',
      city: contact.city || '',
      state: contact.state || '',
      country: contact.country || '',
      postalCode: contact.postal_code || '',
      facebook: contact.facebook || '',
      twitter: contact.twitter || '',
      linkedin: contact.linkedin || '',
      instagram: contact.instagram || '',
      skype: contact.skype || '',
      website: contact.website || '',
      accessLevel: contact.access_level || '',
      department: contact.department || '',
      allowEmailAccess: contact.allow_email_access || false,
      allowPhoneAccess: contact.allow_phone_access || false,
      allowDataExport: contact.allow_data_export || false
    });
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveTab('basic');
    resetForm();
    setSelectedContact(null);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleDeleteContact = (contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (contactToDelete) {
      try {
        setError(null);
        await contactsAPI.delete(contactToDelete.id);
        await loadContacts();
        setShowDeleteModal(false);
        setContactToDelete(null);
      } catch (err) {
        console.error("Error deleting contact:", err);
        setError("Failed to delete contact. Please try again.");
      }
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setError(null);
      
      let profilePhotoPath = null;
      if (modalType === 'edit' && selectedContact) {
        if (selectedFile) {
          try {
            const uploadResult = await contactsAPI.uploadProfilePhoto(selectedContact.id, selectedFile);
            profilePhotoPath = uploadResult.profile_photo;
          } catch (uploadErr) {
            console.error("Error uploading profile photo:", uploadErr);
            setError("Failed to upload profile photo. Please try again.");
            return;
          }
        } else {
          profilePhotoPath = selectedContact.profile_photo || null;
        }
      } else {
        profilePhotoPath = formData.img || null;
      }
      
      const contactData = {
        name: formData.name || '',
        last_name: formData.lastName || null,
        job_title: formData.role || '',
        phone_number: formData.phone || '',
        phone_number2: formData.phone2 || null,
        fax: formData.fax || null,
        email: formData.email || null,
        company_name: formData.company || '',
        dob: formData.dateOfBirth || null,
        ratings: formData.rating || null,
        owner: formData.owner === "Others" ? formData.customOwner || null : formData.owner || null,
        deals: formData.deals || null,
        industry: formData.industry === "Others" ? formData.customIndustry || null : formData.industry || null,
        currency: formData.currency === "Other" ? formData.customCurrency || null : formData.currency || null,
        language: formData.language === "Other" ? formData.customLanguage || null : formData.language || null,
        source: formData.source === "Others" ? formData.customSource || null : formData.source || null,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        profile_photo: profilePhotoPath,
        location: formData.location || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        postal_code: formData.postalCode || null,
        facebook: formData.facebook || null,
        twitter: formData.twitter || null,
        linkedin: formData.linkedin || null,
        instagram: formData.instagram || null,
        skype: formData.skype || null,
        website: formData.website || null,
        access_level: formData.accessLevel || null,
        department: formData.department || null,
        allow_email_access: formData.allowEmailAccess || false,
        allow_phone_access: formData.allowPhoneAccess || false,
        allow_data_export: formData.allowDataExport || false
      };

      let createdContactId = null;
      if (modalType === 'add') {
        const createdContact = await contactsAPI.create(contactData);
        createdContactId = createdContact.id;
        if (selectedFile && createdContactId) {
          try {
            await contactsAPI.uploadProfilePhoto(createdContactId, selectedFile);
          } catch (uploadErr) {
            console.error("Error uploading profile photo:", uploadErr);
          }
        }
      } else if (selectedContact) {
        await contactsAPI.update(selectedContact.id, contactData);
      }
      
      await loadContacts();
      setShowModal(false);
      resetForm();
      setSelectedContact(null);
      setSelectedFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Error saving contact:", err);
      setError("Failed to save contact. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setError('Image size should be below 4MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, img: '/assets/img/users/user-49.jpg' }));
  };

  const addTag = (tagName) => {
    if (tagName && !formData.tags.includes(tagName)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagName] }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const getRatingStars = (rating) => {
    const numRating = parseInt(rating) || 0;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} className={`h-3 w-3 ${i < numRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiUsers className="text-gray-600 text-xl sm:text-2xl" />
              Contacts
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage all contact information, profiles, and communication details in one place</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
              >
                <FiDownload className="h-4 w-4" />
                Export
                <FiChevronDown className="h-3 w-3" />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                  <button onClick={() => { exportPDF(); setShowExportDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg">
                    <FiFileText className="h-4 w-4" /> Export as PDF
                  </button>
                  <button onClick={() => { exportExcel(); setShowExportDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-b-lg">
                    <FiFile className="h-4 w-4" /> Export as Excel
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleAddContact}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiPlus className="h-4 w-4" />
              Add Contact
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700">
            <FiAlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
            <span className="text-sm flex-1">{error}</span>
          </div>
        )}

        {/* Contacts Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-gray-500 text-sm">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
            <FiUsers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-midnight_text mb-1">No contacts found</h3>
            <p className="text-sm text-gray-500 mb-4">Add your first contact to get started</p>
            <button
              onClick={handleAddContact}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiPlus className="h-4 w-4" />
              Add Contact
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow hover:shadow-property transition-all">
                <div className="p-4">
                  {/* Avatar */}
                  <div className="flex justify-start mb-3">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={(() => {
                          if (!contact.profile_photo) return "/assets/images/users/user1.png";
                          if (contact.profile_photo.startsWith("http://") || contact.profile_photo.startsWith("https://")) {
                            return contact.profile_photo;
                          }
                          if (contact.profile_photo.startsWith("/")) {
                            return `${BASE_URL}${contact.profile_photo}`;
                          }
                          return `${BASE_URL}/${contact.profile_photo}`;
                        })()}
                        alt={contact.name || "Contact"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/images/users/user1.png";
                        }}
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-midnight_text mb-2">
                    {[contact.name, contact.last_name].filter(Boolean).join(" ") || "Unnamed Contact"}
                  </h3>

                  {/* Details */}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <FiMail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 truncate">{contact.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">{contact.phone_number || contact.phone_number2 || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiBriefcase className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 truncate">{contact.company_name || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUser className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 truncate">{contact.job_title || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 truncate">
                        {[contact.location, contact.city, contact.state, contact.country].filter(Boolean).join(", ") || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiStar className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-600">Rating:</span>
                      </div>
                      {getRatingStars(contact.ratings)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-primary/50 text-gray-600 hover:text-primary rounded-lg text-xs font-medium transition-all"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-rose-500/50 text-gray-600 hover:text-rose-600 rounded-lg text-xs font-medium transition-all"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Contact Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={modalType === 'add' ? 'Add Contact' : 'Edit Contact'}
        size="xl"
      >
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700">
              <FiAlertCircle className="h-5 w-5 text-rose-500" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Profile Image Upload - Fixed Layout */}
          <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/images/users/user1.png";
                    }}
                  />
                ) : (
                  <FiUser className="h-10 w-10 text-gray-400" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-midnight_text mb-1">Upload Profile Image</p>
              <p className="text-xs text-gray-400 mb-3">Image should be below 4 MB</p>
              <div className="flex flex-wrap gap-2">
                <label className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium cursor-pointer transition-all inline-flex items-center gap-1">
                  <FiUpload className="h-3 w-3" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {(selectedFile || imagePreview) && (
                  <button
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1"
                  >
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
              <button
                onClick={() => setActiveTab('basic')}
                className={`pb-2 text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'basic' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Basic Information
              </button>
              <button
                onClick={() => setActiveTab('address')}
                className={`pb-2 text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'address' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Address
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`pb-2 text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'social' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Social Profiles
              </button>
              <button
                onClick={() => setActiveTab('access')}
                className={`pb-2 text-sm font-medium whitespace-nowrap transition-all ${activeTab === 'access' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Access
              </button>
            </div>
          </div>

          {/* Tab Content - No extra overflow-y-auto here */}
          {activeTab === 'basic' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 2</label>
                  <input
                    type="text"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                  <input
                    type="text"
                    name="fax"
                    value={formData.fax}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ratings</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                  >
                    <option value="0">No Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deals</label>
                  <select
                    name="deals"
                    value={formData.deals}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                  >
                    <option value="">Select Deal</option>
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Collins">Collins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                  {formData.owner === "Others" ? (
                    <input
                      type="text"
                      placeholder="Enter Owner Name"
                      value={formData.customOwner}
                      onChange={(e) => setFormData(prev => ({ ...prev, customOwner: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <select
                      name="owner"
                      value={formData.owner}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "Others") {
                          setFormData(prev => ({ ...prev, owner: "Others" }));
                        } else {
                          handleInputChange(e);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                    >
                      <option value="">Select Owner</option>
                      <option value="Hendry Milner">Hendry Milner</option>
                      <option value="John Doe">John Doe</option>
                      <option value="Sarah Wilson">Sarah Wilson</option>
                      <option value="Mike Johnson">Mike Johnson</option>
                      <option value="Others">Others</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  {formData.industry === "Others" ? (
                    <input
                      type="text"
                      placeholder="Enter Industry"
                      value={formData.customIndustry}
                      onChange={(e) => setFormData(prev => ({ ...prev, customIndustry: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "Others") {
                          setFormData(prev => ({ ...prev, industry: "Others" }));
                        } else {
                          handleInputChange(e);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                    >
                      <option value="">Select Industry</option>
                      <option value="Retail Industry">Retail Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Design">Design</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Others">Others</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  {formData.currency === "Other" ? (
                    <input
                      type="text"
                      placeholder="Enter Currency (e.g. INR, JPY, CNY)"
                      value={formData.customCurrency}
                      onChange={(e) => setFormData(prev => ({ ...prev, customCurrency: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <select
                      value={formData.currency}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "Other") {
                          setFormData(prev => ({ ...prev, currency: "Other", customCurrency: "" }));
                        } else {
                          setFormData(prev => ({ ...prev, currency: value, customCurrency: "" }));
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                    >
                      <option value="Dollar">Dollar</option>
                      <option value="Euro">Euro</option>
                      <option value="Rupee">Rupee</option>
                      <option value="Pound">Pound</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  {formData.language === "Other" ? (
                    <input
                      type="text"
                      placeholder="Enter Language"
                      value={formData.customLanguage}
                      onChange={(e) => setFormData(prev => ({ ...prev, customLanguage: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <select
                      value={formData.language}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "Other") {
                          setFormData(prev => ({ ...prev, language: "Other" }));
                        } else {
                          setFormData(prev => ({ ...prev, language: value, customLanguage: "" }));
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-rose-500"
                        >
                          <FiX className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add new tag and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTag(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  {formData.source === "Others" ? (
                    <input
                      type="text"
                      placeholder="Enter Source"
                      value={formData.customSource}
                      onChange={(e) => setFormData(prev => ({ ...prev, customSource: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <select
                      name="source"
                      value={formData.source}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "Others") {
                          setFormData(prev => ({ ...prev, source: "Others" }));
                        } else {
                          handleInputChange(e);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                    >
                      <option value="">Select Source</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Email Campaign">Email Campaign</option>
                      <option value="Conference">Conference</option>
                      <option value="GitHub">GitHub</option>
                      <option value="Others">Others</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <div className="relative">
                  <FiFacebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/username"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <div className="relative">
                  <FiTwitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/username"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <div className="relative">
                  <FiLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <div className="relative">
                  <FiInstagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/username"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skype</label>
                <div className="relative">
                  <FaSkype className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="skype"
                    value={formData.skype}
                    onChange={handleInputChange}
                    placeholder="skype:username"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <div className="relative">
                  <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://website.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                  <select
                    name="accessLevel"
                    value={formData.accessLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                  >
                    <option value="">Select Access Level</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Internal">Internal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowEmailAccess"
                      checked={formData.allowEmailAccess}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Allow Email Access</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowPhoneAccess"
                      checked={formData.allowPhoneAccess}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Allow Phone Access</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowDataExport"
                      checked={formData.allowDataExport}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Allow Data Export</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
          >
            <FiSave className="h-4 w-4" />
            Save
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="md"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="h-8 w-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-midnight_text mb-2">Are you sure?</h3>
          <p className="text-sm text-gray-500">Do you want to delete the contact "{contactToDelete?.name}"? This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
          <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all">Delete Contact</button>
        </div>
      </Modal>
    </div>
  );
};

export default Contacts;