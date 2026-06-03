import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const EmployeeSelfServicePortal = () => {
  // ==================== STATE MANAGEMENT ====================
  const [activeCategory, setActiveCategory] = useState('personal');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [workflowFilter, setWorkflowFilter] = useState('All Workflows');
  const [statusFilter, setStatusFilter] = useState('All Status');
  
  // ==================== DEFAULT REQUEST HISTORY DATA ====================
  const [requestHistory, setRequestHistory] = useState([
    {
      id: 1,
      requestId: 'REQ-1001',
      type: 'Bank Account Change Request',
      category: 'personal',
      location: 'Hyderabad',
      workflow: 'Open',
      submittedDate: '2024-03-20 10:30 AM',
      status: 'Approved',
      priority: 'high',
      description: 'Changing bank account from HDFC to ICICI for salary deposit',
      sla: '2-3 business days',
      approvers: ['Finance Department'],
      attachments: ['cheque_copy.pdf']
    },
    {
      id: 2,
      requestId: 'REQ-1002',
      type: 'Work-from-Home Request',
      category: 'work',
      location: 'Bangalore',
      workflow: 'Pending',
      submittedDate: '2024-03-18 02:15 PM',
      status: 'In Progress',
      priority: 'medium',
      description: 'Requesting work from home for next 2 weeks due to family emergency',
      sla: '2-3 business days',
      approvers: ['Reporting Manager', 'HR Department'],
      attachments: []
    },
    {
      id: 3,
      requestId: 'REQ-1003',
      type: 'Reimbursement Claim',
      category: 'financial',
      location: 'Chennai',
      workflow: 'Completed',
      submittedDate: '2024-03-15 11:00 AM',
      status: 'Completed',
      priority: 'medium',
      description: 'Travel expense reimbursement for client meeting in Mumbai',
      sla: '5-7 business days',
      approvers: ['Finance Department'],
      attachments: ['receipts.zip']
    },
    {
      id: 4,
      requestId: 'REQ-1004',
      type: 'ID Card Reissue',
      category: 'administrative',
      location: 'Delhi',
      workflow: 'Processing',
      submittedDate: '2024-03-10 09:45 AM',
      status: 'Rejected',
      priority: 'medium',
      description: 'Lost ID card during office commute, need replacement',
      sla: '3-5 business days',
      approvers: ['Security Department'],
      attachments: ['police_complaint.pdf']
    },
    {
      id: 5,
      requestId: 'REQ-1005',
      type: 'VPN Access Request',
      category: 'it',
      location: 'Mumbai',
      workflow: 'Open',
      submittedDate: '2024-03-08 04:30 PM',
      status: 'Submitted',
      priority: 'medium',
      description: 'Need VPN access to work remotely from different location',
      sla: '2-3 business days',
      approvers: ['IT Security'],
      attachments: []
    },
    {
      id: 6,
      requestId: 'REQ-1006',
      type: 'Business Travel Request',
      category: 'travel',
      location: 'Hyderabad',
      workflow: 'Completed',
      submittedDate: '2024-03-05 03:20 PM',
      status: 'Approved',
      priority: 'high',
      description: 'Client visit to Mumbai office for project discussion',
      sla: '3-5 business days',
      approvers: ['Reporting Manager', 'Travel Desk'],
      attachments: ['client_invitation.pdf']
    },
    {
      id: 7,
      requestId: 'REQ-1007',
      type: 'General Feedback',
      category: 'feedback',
      location: 'Bangalore',
      workflow: 'Completed',
      submittedDate: '2024-03-01 01:10 PM',
      status: 'Completed',
      priority: 'low',
      description: 'Feedback about improving cafeteria food quality and variety',
      sla: 'Acknowledgement in 1 day',
      approvers: ['HR Department'],
      attachments: []
    }
  ]);
  
  // ==================== REQUEST DATA WITH BOOTSTRAP ICONS ====================
  const requestCategories = {
    personal: {
      title: 'Personal Information',
      icon: 'bi-person-fill',
      color: '#3498db',
      description: 'Update personal and contact information'
    },
    work: {
      title: 'Work-Related',
      icon: 'bi-briefcase-fill',
      color: '#9b59b6',
      description: 'Work arrangements and changes'
    },
    administrative: {
      title: 'Administrative',
      icon: 'bi-building-fill',
      color: '#2ecc71',
      description: 'Admin support and facilities'
    },
    financial: {
      title: 'Financial',
      icon: 'bi-cash-stack',
      color: '#e74c3c',
      description: 'Financial requests and claims'
    },
    travel: {
      title: 'Travel & Expense',
      icon: 'bi-airplane-fill',
      color: '#f39c12',
      description: 'Travel requests and expense claims'
    },
    it: {
      title: 'IT & Systems',
      icon: 'bi-laptop-fill',
      color: '#1abc9c',
      description: 'IT equipment and system access'
    },
    feedback: {
      title: 'Feedback',
      icon: 'bi-chat-left-text-fill',
      color: '#34495e',
      description: 'Feedback and grievances'
    }
  };

  const allRequests = [
    // Personal Information Updates
    { 
      id: 1, 
      name: 'Bank Account Change', 
      category: 'personal', 
      description: 'Update bank account details for salary deposits', 
      icon: 'bi-bank', 
      priority: 'high', 
      sla: '2-3 business days',
      autoDescription: (data) => {
        const currentBank = data?.currentBank || '[Current Bank]';
        const newBank = data?.newBank || '[New Bank]';
        const accountNum = data?.newAccountNumber || '[Account Number]';
        const ifsc = data?.ifscCode || '[IFSC Code]';
        const branch = data?.branchName ? `, Branch: ${data.branchName}` : '';
        
        return `Request to change bank account from ${currentBank} to ${newBank} (Account: ${accountNum}, IFSC: ${ifsc}${branch}) for salary deposits.`;
      },
      fields: [
        { name: 'currentBank', label: 'Current Bank', type: 'text', required: true, maxLength: 50 },
        { name: 'currentAccountNumber', label: 'Current Account Number', type: 'text', required: true, maxLength: 20 },
        { name: 'newBank', label: 'New Bank', type: 'text', required: true, maxLength: 50 },
        { name: 'newAccountNumber', label: 'New Account Number', type: 'text', required: true, maxLength: 20 },
        { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true, maxLength: 11 },
        { name: 'branchName', label: 'Branch Name', type: 'text', required: false, maxLength: 50 },
        { name: 'cancelledCheque', label: 'Cancelled Cheque Upload', type: 'file', required: true }
      ]
    },
    { 
      id: 2, 
      name: 'Address Change', 
      category: 'personal', 
      description: 'Update current/permanent address', 
      icon: 'bi-geo-alt-fill', 
      priority: 'medium', 
      sla: '1-2 business days',
      autoDescription: (data) => {
        const addressType = data?.addressType || '[Address Type]';
        const newAddress = data?.newAddress || '[New Address]';
        const city = data?.city || '[City]';
        const pincode = data?.pincode || '[Pincode]';
        
        return `Request to update ${addressType} address: ${newAddress}, ${city} - ${pincode}.`;
      },
      fields: [
        { name: 'addressType', label: 'Address Type', type: 'select', options: ['Current', 'Permanent', 'Both'], required: true },
        { name: 'newAddress', label: 'New Address', type: 'textarea', required: true, maxLength: 200 },
        { name: 'city', label: 'City', type: 'text', required: true, maxLength: 30 },
        { name: 'pincode', label: 'Pincode', type: 'text', required: true, maxLength: 6 },
        { name: 'proofOfAddress', label: 'Proof of Address', type: 'file', required: true }
      ]
    },
    { 
      id: 3, 
      name: 'Emergency Contact Update', 
      category: 'personal', 
      description: 'Update emergency contact information', 
      icon: 'bi-telephone-plus-fill', 
      priority: 'low', 
      sla: '1 business day',
      autoDescription: (data) => {
        const contactName = data?.contactName || '[Contact Name]';
        const relationship = data?.relationship || '[Relationship]';
        const phoneNumber = data?.phoneNumber || '[Phone]';
        const altPhone = data?.alternatePhone ? `, Alt: ${data.alternatePhone}` : '';
        
        return `Update emergency contact: ${contactName} (${relationship}), Phone: ${phoneNumber}${altPhone}.`;
      },
      fields: [
        { name: 'contactName', label: 'Contact Name', type: 'text', required: true, maxLength: 50 },
        { name: 'relationship', label: 'Relationship', type: 'text', required: true, maxLength: 20 },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true, maxLength: 15 },
        { name: 'alternatePhone', label: 'Alternate Phone', type: 'tel', required: false, maxLength: 15 }
      ]
    },
    { 
      id: 4, 
      name: 'Phone Number Update', 
      category: 'personal', 
      description: 'Update personal or work phone number', 
      icon: 'bi-phone-fill', 
      priority: 'low', 
      sla: '1 business day',
      autoDescription: (data) => {
        const phoneType = data?.phoneType || '[Phone Type]';
        const oldPhone = data?.oldPhoneNumber || '[Old Number]';
        const newPhone = data?.newPhoneNumber || '[New Number]';
        
        return `Update ${phoneType} phone number from ${oldPhone} to ${newPhone}.`;
      },
      fields: [
        { name: 'phoneType', label: 'Phone Type', type: 'select', options: ['Personal', 'Work', 'Both'], required: true },
        { name: 'oldPhoneNumber', label: 'Current Phone Number', type: 'tel', required: true, maxLength: 15 },
        { name: 'newPhoneNumber', label: 'New Phone Number', type: 'tel', required: true, maxLength: 15 },
        { name: 'reason', label: 'Reason for Change', type: 'textarea', required: false, maxLength: 200 }
      ]
    },
    { 
      id: 5, 
      name: 'Family Details Update', 
      category: 'personal', 
      description: 'Update family member information', 
      icon: 'bi-people-fill', 
      priority: 'low', 
      sla: '2-3 business days',
      autoDescription: (data) => {
        const updateType = data?.updateType || '[Update Type]';
        const familyMember = data?.familyMemberName || '[Member Name]';
        const relationship = data?.relationship || '[Relationship]';
        
        return `Update family details: ${updateType} for ${familyMember} (${relationship}).`;
      },
      fields: [
        { name: 'updateType', label: 'Update Type', type: 'select', options: ['Add Member', 'Update Details', 'Remove Member'], required: true },
        { name: 'familyMemberName', label: 'Family Member Name', type: 'text', required: true, maxLength: 50 },
        { name: 'relationship', label: 'Relationship', type: 'select', options: ['Spouse', 'Child', 'Father', 'Mother', 'Sibling', 'Other'], required: true },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: false },
        { name: 'aadharNumber', label: 'Aadhar Number', type: 'text', required: false, maxLength: 12 }
      ]
    },
    { 
      id: 6, 
      name: 'Nominee Change Request', 
      category: 'personal', 
      description: 'Update nominee details for benefits', 
      icon: 'bi-person-check-fill', 
      priority: 'medium', 
      sla: '3-5 business days',
      autoDescription: (data) => {
        const nomineeName = data?.nomineeName || '[Nominee Name]';
        const relationship = data?.relationship || '[Relationship]';
        const percentage = data?.nominationPercentage || '[Percentage]';
        
        return `Update nominee: ${nomineeName} (${relationship}) with ${percentage}% nomination.`;
      },
      fields: [
        { name: 'nomineeName', label: 'Nominee Name', type: 'text', required: true, maxLength: 50 },
        { name: 'relationship', label: 'Relationship', type: 'select', options: ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'], required: true },
        { name: 'nominationPercentage', label: 'Nomination Percentage', type: 'number', required: true, min: 1, max: 100 },
        { name: 'nomineeDateOfBirth', label: 'Nominee Date of Birth', type: 'date', required: true },
        { name: 'nomineeContact', label: 'Nominee Contact Number', type: 'tel', required: true, maxLength: 15 },
        { name: 'supportingDocuments', label: 'Supporting Documents', type: 'file', required: true }
      ]
    },
    
    // Work-Related Requests
    { 
      id: 7, 
      name: 'Work-from-Home Request', 
      category: 'work', 
      description: 'Request for work from home arrangement', 
      icon: 'bi-house-fill', 
      priority: 'medium', 
      sla: '2-3 business days',
      autoDescription: (data) => {
        const wfhStartDate = data?.wfhStartDate || '[Start Date]';
        const wfhEndDate = data?.wfhEndDate || '[End Date]';
        const reasonForWFH = data?.reasonForWFH || '[Reason]';
        const workLocation = data?.workLocation || '[Location]';
        
        return `Request for work from home from ${wfhStartDate} to ${wfhEndDate}. Reason: ${reasonForWFH}. Work location: ${workLocation}.`;
      },
      fields: [
        { name: 'wfhStartDate', label: 'WFH Start Date', type: 'date', required: true },
        { name: 'wfhEndDate', label: 'WFH End Date', type: 'date', required: true },
        { name: 'reasonForWFH', label: 'Reason for WFH', type: 'textarea', required: true, maxLength: 300 },
        { name: 'workLocation', label: 'Work Location', type: 'text', required: true, maxLength: 100 },
        { name: 'internetAvailability', label: 'Internet Availability', type: 'radio', options: ['Yes', 'No'], required: true }
      ]
    },
    { 
      id: 8, 
      name: 'Remote Work Approval', 
      category: 'work', 
      description: 'Request for permanent remote work', 
      icon: 'bi-globe', 
      priority: 'high', 
      sla: '5-7 business days',
      autoDescription: (data) => {
        const remoteLocation = data?.remoteLocation || '[Location]';
        const expectedStartDate = data?.expectedStartDate || '[Start Date]';
        const businessJustification = data?.businessJustification || '[Justification]';
        
        return `Request for permanent remote work from ${remoteLocation} starting ${expectedStartDate}. Justification: ${businessJustification}.`;
      },
      fields: [
        { name: 'remoteLocation', label: 'Remote Location', type: 'text', required: true, maxLength: 100 },
        { name: 'businessJustification', label: 'Business Justification', type: 'textarea', required: true, maxLength: 500 },
        { name: 'expectedStartDate', label: 'Expected Start Date', type: 'date', required: true },
        { name: 'internetSpeed', label: 'Internet Speed', type: 'text', required: true, maxLength: 20 }
      ]
    },
    { 
      id: 9, 
      name: 'Shift Change Request', 
      category: 'work', 
      description: 'Change work shift timing', 
      icon: 'bi-clock-fill', 
      priority: 'medium', 
      sla: '3-5 business days',
      autoDescription: (data) => {
        const currentShift = data?.currentShift || '[Current]';
        const requestedShift = data?.requestedShift || '[Requested]';
        const effectiveDate = data?.effectiveDate || '[Date]';
        const reason = data?.reason || '[Reason]';
        
        return `Request to change shift from ${currentShift} to ${requestedShift} shift effective ${effectiveDate}. Reason: ${reason}.`;
      },
      fields: [
        { name: 'currentShift', label: 'Current Shift', type: 'text', required: true, maxLength: 20 },
        { name: 'requestedShift', label: 'Requested Shift', type: 'select', options: ['Morning', 'General', 'Night'], required: true },
        { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
        { name: 'reason', label: 'Reason', type: 'textarea', required: true, maxLength: 200 }
      ]
    },
    { 
      id: 10, 
      name: 'Department Transfer Request', 
      category: 'work', 
      description: 'Request transfer to another department', 
      icon: 'bi-arrow-left-right', 
      priority: 'high', 
      sla: '7-10 business days',
      autoDescription: (data) => {
        const currentDepartment = data?.currentDepartment || '[Current Dept]';
        const targetDepartment = data?.targetDepartment || '[Target Dept]';
        const reason = data?.reason || '[Reason]';
        const effectiveDate = data?.effectiveDate || '[Date]';
        
        return `Department transfer request from ${currentDepartment} to ${targetDepartment} effective ${effectiveDate}. Reason: ${reason}.`;
      },
      fields: [
        { name: 'currentDepartment', label: 'Current Department', type: 'text', required: true, maxLength: 50 },
        { name: 'targetDepartment', label: 'Target Department', type: 'text', required: true, maxLength: 50 },
        { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
        { name: 'reason', label: 'Reason for Transfer', type: 'textarea', required: true, maxLength: 500 },
        { name: 'skillMatch', label: 'Skills Relevant to Target Department', type: 'textarea', required: true, maxLength: 300 }
      ]
    },
    { 
      id: 11, 
      name: 'Reporting Manager Change Request', 
      category: 'work', 
      description: 'Request change in reporting manager', 
      icon: 'bi-diagram-3-fill', 
      priority: 'high', 
      sla: '5-7 business days',
      autoDescription: (data) => {
        const currentManager = data?.currentManager || '[Current Manager]';
        const newManager = data?.newManager || '[New Manager]';
        const reason = data?.reason || '[Reason]';
        
        return `Reporting manager change request from ${currentManager} to ${newManager}. Reason: ${reason}.`;
      },
      fields: [
        { name: 'currentManager', label: 'Current Reporting Manager', type: 'text', required: true, maxLength: 50 },
        { name: 'newManager', label: 'New Reporting Manager', type: 'text', required: true, maxLength: 50 },
        { name: 'reason', label: 'Reason for Change', type: 'textarea', required: true, maxLength: 300 },
        { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true }
      ]
    },
    { 
      id: 12, 
      name: 'Desk/Seat Change Request', 
      category: 'work', 
      description: 'Request change in workstation location', 
      icon: 'bi-layout-text-window', 
      priority: 'low', 
      sla: '2-3 business days',
      autoDescription: (data) => {
        const currentLocation = data?.currentLocation || '[Current Location]';
        const preferredLocation = data?.preferredLocation || '[Preferred Location]';
        const reason = data?.reason || '[Reason]';
        
        return `Desk/seat change request from ${currentLocation} to ${preferredLocation}. Reason: ${reason}.`;
      },
      fields: [
        { name: 'currentLocation', label: 'Current Location', type: 'text', required: true, maxLength: 50 },
        { name: 'preferredLocation', label: 'Preferred Location', type: 'text', required: true, maxLength: 50 },
        { name: 'reason', label: 'Reason', type: 'textarea', required: true, maxLength: 200 },
        { name: 'preferredDate', label: 'Preferred Date', type: 'date', required: false }
      ]
    },
    
    // Administrative Requests
    { 
      id: 13, 
      name: 'ID Card Reissue', 
      category: 'administrative', 
      description: 'Request new ID card', 
      icon: 'bi-person-badge-fill', 
      priority: 'medium', 
      sla: '3-5 business days',
      autoDescription: (data) => {
        const reasonForReissue = data?.reasonForReissue || '[Reason]';
        const lastSeenDate = data?.lastSeenDate ? ` Last seen: ${data.lastSeenDate}` : '';
        const policeComplaint = data?.policeComplaint ? ` Police Complaint: ${data.policeComplaint}` : '';
        
        return `Request for ID card reissue (${reasonForReissue})${lastSeenDate}${policeComplaint}.`;
      },
      fields: [
        { name: 'reasonForReissue', label: 'Reason for Reissue', type: 'select', options: ['Lost', 'Damaged', 'Information Update'], required: true },
        { name: 'lastSeenDate', label: 'Last Seen Date', type: 'date', required: false },
        { name: 'policeComplaint', label: 'Police Complaint (if lost)', type: 'text', required: false, maxLength: 20 },
        { name: 'passportPhoto', label: 'Passport Photo', type: 'file', required: true }
      ]
    },
    { 
      id: 14, 
      name: 'Access Card Request', 
      category: 'administrative', 
      description: 'Request building access card', 
      icon: 'bi-key-fill', 
      priority: 'medium', 
      sla: '2-3 business days',
      autoDescription: (data) => {
        const accessType = data?.accessType || '[Type]';
        const accessAreas = Array.isArray(data?.accessAreas) && data.accessAreas.length > 0 
          ? data.accessAreas.join(', ') 
          : '[Areas]';
        const validity = data?.validity || '[Validity]';
        const endDate = data?.endDate ? ` until ${data.endDate}` : '';
        
        return `Request for ${accessType} access card for areas: ${accessAreas} (${validity}${endDate}).`;
      },
      fields: [
        { name: 'accessType', label: 'Access Type', type: 'select', options: ['New', 'Replacement', 'Additional'], required: true },
        { name: 'accessAreas', label: 'Access Areas', type: 'multiselect', options: ['Main Gate', 'Parking', 'Floor Access', 'Server Room', 'Lab'], required: true },
        { name: 'validity', label: 'Validity', type: 'select', options: ['Permanent', 'Temporary'], required: true },
        { name: 'endDate', label: 'End Date (if temporary)', type: 'date', required: false }
      ]
    },
    { 
      id: 15, 
      name: 'Parking Slot Request', 
      category: 'administrative', 
      description: 'Request parking slot assignment', 
      icon: 'bi-car-front-fill', 
      priority: 'medium', 
      sla: '3-5 business days',
      autoDescription: (data) => {
        const vehicleType = data?.vehicleType || '[Vehicle Type]';
        const vehicleNumber = data?.vehicleNumber || '[Vehicle Number]';
        const preferredLocation = data?.preferredLocation || '[Location]';
        
        return `Parking slot request for ${vehicleType} (${vehicleNumber}) at ${preferredLocation}.`;
      },
      fields: [
        { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Car', 'Motorcycle', 'Bicycle', 'Other'], required: true },
        { name: 'vehicleNumber', label: 'Vehicle Number', type: 'text', required: true, maxLength: 20 },
        { name: 'preferredLocation', label: 'Preferred Location', type: 'text', required: true, maxLength: 50 },
        { name: 'validity', label: 'Validity', type: 'select', options: ['Permanent', 'Temporary'], required: true },
        { name: 'endDate', label: 'End Date (if temporary)', type: 'date', required: false }
      ]
    },
    { 
      id: 16, 
      name: 'Locker Assignment Request', 
      category: 'administrative', 
      description: 'Request locker assignment', 
      icon: 'bi-box-seam-fill', 
      priority: 'low', 
      sla: '2-3 business days',
      autoDescription: (data) => {
        const lockerType = data?.lockerType || '[Locker Type]';
        const preferredFloor = data?.preferredFloor || '[Floor]';
        const reason = data?.reason || '[Reason]';
        
        return `Locker assignment request for ${lockerType} locker on ${preferredFloor} floor. Reason: ${reason}.`;
      },
      fields: [
        { name: 'lockerType', label: 'Locker Type', type: 'select', options: ['Small', 'Medium', 'Large'], required: true },
        { name: 'preferredFloor', label: 'Preferred Floor', type: 'text', required: true, maxLength: 20 },
        { name: 'reason', label: 'Reason', type: 'textarea', required: true, maxLength: 200 },
        { name: 'duration', label: 'Duration', type: 'select', options: ['Permanent', 'Temporary'], required: true },
        { name: 'endDate', label: 'End Date (if temporary)', type: 'date', required: false }
      ]
    },
    { 
      id: 17, 
      name: 'Stationery Requisition', 
      category: 'administrative', 
      description: 'Request office stationery items', 
      icon: 'bi-pencil-square', 
      priority: 'low', 
      sla: '1-2 business days',
      autoDescription: (data) => {
        const items = data?.items || '[Items]';
        const quantity = data?.quantity || '[Quantity]';
        const purpose = data?.purpose || '[Purpose]';
        
        return `Stationery requisition: ${items} (Quantity: ${quantity}). Purpose: ${purpose}.`;
      },
      fields: [
        { name: 'items', label: 'Stationery Items', type: 'textarea', required: true, maxLength: 300 },
        { name: 'quantity', label: 'Quantity', type: 'text', required: true, maxLength: 50 },
        { name: 'purpose', label: 'Purpose', type: 'textarea', required: true, maxLength: 200 },
        { name: 'urgency', label: 'Urgency', type: 'select', options: ['Normal', 'Urgent'], required: true }
      ]
    },
    { 
      id: 18, 
      name: 'Business Card Request', 
      category: 'administrative', 
      description: 'Request business cards', 
      icon: 'bi-card-heading', 
      priority: 'low', 
      sla: '5-7 business days',
      autoDescription: (data) => {
        const quantity = data?.quantity || '[Quantity]';
        const designType = data?.designType || '[Design]';
        const language = data?.language || '[Language]';
        
        return `Business card request: ${quantity} cards, ${designType} design, ${language} language.`;
      },
      fields: [
        { name: 'quantity', label: 'Quantity', type: 'number', required: true, min: 50, max: 1000 },
        { name: 'designType', label: 'Design Type', type: 'select', options: ['Standard', 'Premium', 'Custom'], required: true },
        { name: 'language', label: 'Language', type: 'select', options: ['English', 'Hindi', 'Bilingual'], required: true },
        { name: 'specialInstructions', label: 'Special Instructions', type: 'textarea', required: false, maxLength: 200 }
      ]
    },
    
    // Financial Requests
    { 
      id: 19, 
      name: 'Salary Advance', 
      category: 'financial', 
      description: 'Request salary advance payment', 
      icon: 'bi-cash', 
      priority: 'high', 
      sla: '3-5 business days',
      autoDescription: (data) => {
        const advanceAmount = data?.advanceAmount || '[Amount]';
        const numberOfInstallments = data?.numberOfInstallments || '[Installments]';
        const reasonForAdvance = data?.reasonForAdvance || '[Reason]';
        const emergencyContact = data?.emergencyContact || '[Contact]';
        
        return `Request for salary advance of ₹${advanceAmount} in ${numberOfInstallments} installments. Reason: ${reasonForAdvance}. Emergency contact: ${emergencyContact}.`;
      },
      fields: [
        { name: 'advanceAmount', label: 'Advance Amount (₹)', type: 'number', required: true, max: 100000 },
        { name: 'numberOfInstallments', label: 'Number of Installments', type: 'select', options: ['1', '2', '3', '4', '5', '6'], required: true },
        { name: 'reasonForAdvance', label: 'Reason for Advance', type: 'textarea', required: true, maxLength: 300 },
        { name: 'emergencyContact', label: 'Emergency Contact', type: 'text', required: true, maxLength: 50 },
        { name: 'supportingDocuments', label: 'Supporting Documents', type: 'file', required: false }
      ]
    },
    { 
      id: 21, 
      name: 'Reimbursement Claim', 
      category: 'financial', 
      description: 'Submit expenses for reimbursement', 
      icon: 'bi-receipt', 
      priority: 'medium', 
      sla: '5-7 business days',
      autoDescription: (data) => {
        const totalAmount = data?.totalAmount || '[Amount]';
        const expenseType = data?.expenseType || '[Expense Type]';
        const expensePeriod = data?.expensePeriod || '[Period]';
        const description = data?.description || '[Description]';
        
        return `Reimbursement claim of ₹${totalAmount} for ${expenseType} expenses (Period: ${expensePeriod}). Description: ${description}.`;
      },
      fields: [
        { name: 'expenseType', label: 'Expense Type', type: 'select', options: ['Travel', 'Medical', 'Books', 'Internet', 'Other'], required: true },
        { name: 'totalAmount', label: 'Total Amount (₹)', type: 'number', required: true, max: 50000 },
        { name: 'expensePeriod', label: 'Expense Period', type: 'month', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true, maxLength: 200 },
        { name: 'supportingBills', label: 'Supporting Bills', type: 'file', required: true }
      ]
    },
    { 
      id: 22, 
      name: 'Loan Application', 
      category: 'financial', 
      description: 'Apply for employee loan', 
      icon: 'bi-bank2', 
      priority: 'high', 
      sla: '7-10 business days',
      autoDescription: (data) => {
        const loanType = data?.loanType || '[Loan Type]';
        const loanAmount = data?.loanAmount || '[Amount]';
        const numberOfInstallments = data?.numberOfInstallments || '[Installments]';
        const purpose = data?.purpose || '[Purpose]';
        
        return `Loan application for ${loanType}: ₹${loanAmount} in ${numberOfInstallments} installments. Purpose: ${purpose}.`;
      },
      fields: [
        { name: 'loanType', label: 'Loan Type', type: 'select', options: ['Personal', 'Medical', 'Home', 'Education'], required: true },
        { name: 'loanAmount', label: 'Loan Amount (₹)', type: 'number', required: true, min: 10000, max: 500000 },
        { name: 'numberOfInstallments', label: 'Number of Installments', type: 'select', options: ['12', '24', '36', '48', '60'], required: true },
        { name: 'purpose', label: 'Purpose', type: 'textarea', required: true, maxLength: 300 },
        { name: 'supportingDocuments', label: 'Supporting Documents', type: 'file', required: true }
      ]
    },
    { 
      id: 23, 
      name: 'Investment Declaration (80C)', 
      category: 'financial', 
      description: 'Submit investment declaration for tax savings', 
      icon: 'bi-file-earmark-text-fill', 
      priority: 'medium', 
      sla: '5-7 business days',
      autoDescription: (data) => {
        const investmentType = data?.investmentType || '[Investment Type]';
        const amount = data?.amount || '[Amount]';
        const financialYear = data?.financialYear || '[FY]';
        
        return `Investment declaration under Section 80C: ${investmentType} of ₹${amount} for FY ${financialYear}.`;
      },
      fields: [
        { name: 'investmentType', label: 'Investment Type', type: 'select', options: ['PPF', 'ELSS', 'NSC', 'Life Insurance', 'Home Loan Principal', 'Other'], required: true },
        { name: 'amount', label: 'Investment Amount (₹)', type: 'number', required: true, max: 150000 },
        { name: 'financialYear', label: 'Financial Year', type: 'text', required: true, maxLength: 10 },
        { name: 'investmentDate', label: 'Investment Date', type: 'date', required: true },
        { name: 'proofOfInvestment', label: 'Proof of Investment', type: 'file', required: true }
      ]
    },
    { 
      id: 24, 
      name: 'Tax Regime Change Request', 
      category: 'financial', 
      description: 'Change income tax regime preference', 
      icon: 'bi-file-earmark-check-fill', 
      priority: 'medium', 
      sla: '3-5 business days',
      autoDescription: (data) => {
        const currentRegime = data?.currentRegime || '[Current]';
        const newRegime = data?.newRegime || '[New]';
        const effectiveFrom = data?.effectiveFrom || '[Date]';
        
        return `Tax regime change from ${currentRegime} to ${newRegime} effective from ${effectiveFrom}.`;
      },
      fields: [
        { name: 'currentRegime', label: 'Current Tax Regime', type: 'select', options: ['Old Regime', 'New Regime'], required: true },
        { name: 'newRegime', label: 'New Tax Regime', type: 'select', options: ['Old Regime', 'New Regime'], required: true },
        { name: 'effectiveFrom', label: 'Effective From (Financial Year)', type: 'text', required: true, maxLength: 10 },
        { name: 'reason', label: 'Reason for Change', type: 'textarea', required: true, maxLength: 200 }
      ]
    },
    { 
      id: 25, 
      name: 'Salary Certificate Request', 
      category: 'financial', 
      description: 'Request salary certificate/statement', 
      icon: 'bi-file-earmark-medical-fill', 
      priority: 'low', 
      sla: '2-3 business days',
      autoDescription: (data) => {
        const certificateType = data?.certificateType || '[Type]';
        const period = data?.period || '[Period]';
        const purpose = data?.purpose || '[Purpose]';
        
        return `Salary certificate request: ${certificateType} for period ${period}. Purpose: ${purpose}.`;
      },
      fields: [
        { name: 'certificateType', label: 'Certificate Type', type: 'select', options: ['Current Month', 'Last 3 Months', 'Last 6 Months', 'Current Financial Year', 'Last Financial Year'], required: true },
        { name: 'period', label: 'Period', type: 'text', required: true, maxLength: 50 },
        { name: 'purpose', label: 'Purpose', type: 'select', options: ['Bank Loan', 'Visa Application', 'Rental Agreement', 'Personal Use', 'Other'], required: true },
        { name: 'language', label: 'Language', type: 'select', options: ['English', 'Hindi', 'Bilingual'], required: true }
      ]
    },
    
    // Travel & Expense
    { 
      id: 26, 
      name: 'Business Travel Request', 
      category: 'travel', 
      description: 'Request approval for business travel', 
      icon: 'bi-airplane', 
      priority: 'high', 
      sla: '3-5 business days',
      autoDescription: (data) => {
        const destination = data?.destination || '[Destination]';
        const travelStartDate = data?.travelStartDate || '[Start]';
        const travelEndDate = data?.travelEndDate || '[End]';
        const purposeOfTravel = data?.purposeOfTravel || '[Purpose]';
        const estimatedCost = data?.estimatedCost || '[Cost]';
        
        return `Business travel to ${destination} from ${travelStartDate} to ${travelEndDate}. Purpose: ${purposeOfTravel}. Estimated cost: ₹${estimatedCost}.`;
      },
      fields: [
        { name: 'purposeOfTravel', label: 'Purpose of Travel', type: 'textarea', required: true, maxLength: 300 },
        { name: 'destination', label: 'Destination', type: 'text', required: true, maxLength: 50 },
        { name: 'travelStartDate', label: 'Travel Start Date', type: 'date', required: true },
        { name: 'travelEndDate', label: 'Travel End Date', type: 'date', required: true },
        { name: 'estimatedCost', label: 'Estimated Cost (₹)', type: 'number', required: true, max: 100000 },
        { name: 'travelMode', label: 'Travel Mode', type: 'multiselect', options: ['Flight', 'Train', 'Car', 'Bus'], required: true }
      ]
    },
    { 
      id: 27, 
      name: 'Expense Reimbursement', 
      category: 'travel', 
      description: 'Submit travel expenses', 
      icon: 'bi-receipt-cutoff', 
      priority: 'medium', 
      sla: '5-7 business days',
      autoDescription: (data) => {
        const totalClaimAmount = data?.totalClaimAmount || '[Amount]';
        const currency = data?.currency ? `(${data.currency})` : '';
        const travelReferenceId = data?.travelReferenceId || '[Reference]';
        const expenseDetails = data?.expenseDetails || '[Details]';
        
        return `Travel expense reimbursement of ₹${totalClaimAmount} ${currency} for travel reference ${travelReferenceId}. Details: ${expenseDetails}.`;
      },
      fields: [
        { name: 'travelReferenceId', label: 'Travel Reference ID', type: 'text', required: true, maxLength: 20 },
        { name: 'totalClaimAmount', label: 'Total Claim Amount', type: 'number', required: true, max: 100000 },
        { name: 'currency', label: 'Currency', type: 'select', options: ['INR', 'USD', 'EUR'], required: true },
        { name: 'expenseDetails', label: 'Expense Details', type: 'textarea', required: true, maxLength: 300 },
        { name: 'billsReceipts', label: 'Bills/Receipts', type: 'file', required: true }
      ]
    },
    { 
      id: 28, 
      name: 'Travel Advance Request', 
      category: 'travel', 
      description: 'Request advance payment for business travel', 
      icon: 'bi-wallet2', 
      priority: 'high', 
      sla: '3-5 business days',
      autoDescription: (data) => {
        const advanceAmount = data?.advanceAmount || '[Amount]';
        const destination = data?.destination || '[Destination]';
        const travelDates = data?.travelStartDate && data?.travelEndDate 
          ? `from ${data.travelStartDate} to ${data.travelEndDate}`
          : '[Travel Dates]';
        
        return `Travel advance request of ₹${advanceAmount} for travel to ${destination} ${travelDates}.`;
      },
      fields: [
        { name: 'destination', label: 'Destination', type: 'text', required: true, maxLength: 50 },
        { name: 'travelStartDate', label: 'Travel Start Date', type: 'date', required: true },
        { name: 'travelEndDate', label: 'Travel End Date', type: 'date', required: true },
        { name: 'advanceAmount', label: 'Advance Amount (₹)', type: 'number', required: true, max: 100000 },
        { name: 'purpose', label: 'Purpose of Travel', type: 'textarea', required: true, maxLength: 300 }
      ]
    },
    { 
      id: 29, 
      name: 'Mileage Claim', 
      category: 'travel', 
      description: 'Submit mileage reimbursement claim', 
      icon: 'bi-speedometer2', 
      priority: 'medium', 
      sla: '3-5 business days',
      autoDescription: (data) => {
        const totalDistance = data?.totalDistance || '[Distance]';
        const vehicleType = data?.vehicleType || '[Vehicle]';
        const totalAmount = data?.totalAmount || '[Amount]';
        const travelDates = data?.travelDates || '[Dates]';
        
        return `Mileage claim: ${totalDistance} km using ${vehicleType} for travel on ${travelDates}. Total: ₹${totalAmount}.`;
      },
      fields: [
        { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Car', 'Motorcycle', 'Bicycle'], required: true },
        { name: 'totalDistance', label: 'Total Distance (km)', type: 'number', required: true, max: 10000 },
        { name: 'travelDates', label: 'Travel Dates', type: 'text', required: true, maxLength: 50 },
        { name: 'totalAmount', label: 'Total Claim Amount (₹)', type: 'number', required: true, max: 50000 },
        { name: 'routeDetails', label: 'Route Details', type: 'textarea', required: true, maxLength: 300 }
      ]
    },
    { 
      id: 30, 
      name: 'Per Diem Claim', 
      category: 'travel', 
      description: 'Submit per diem allowance claim', 
      icon: 'bi-calendar-check', 
      priority: 'medium', 
      sla: '3-5 business days',
      autoDescription: (data) => {
        const numberOfDays = data?.numberOfDays || '[Days]';
        const location = data?.location || '[Location]';
        const totalAmount = data?.totalAmount || '[Amount]';
        const travelDates = data?.travelDates || '[Dates]';
        
        return `Per diem claim: ${numberOfDays} days at ${location} (${travelDates}). Total: ₹${totalAmount}.`;
      },
      fields: [
        { name: 'location', label: 'Location', type: 'text', required: true, maxLength: 50 },
        { name: 'travelDates', label: 'Travel Dates', type: 'text', required: true, maxLength: 50 },
        { name: 'numberOfDays', label: 'Number of Days', type: 'number', required: true, min: 1, max: 365 },
        { name: 'perDiemRate', label: 'Per Diem Rate (₹/day)', type: 'number', required: true, max: 10000 },
        { name: 'totalAmount', label: 'Total Claim Amount (₹)', type: 'number', required: true, max: 500000 }
      ]
    },
    
    // IT & Systems
    { 
      id: 31, 
      name: 'Software Access', 
      category: 'it', 
      description: 'Request access to software/tools', 
      icon: 'bi-display', 
      priority: 'medium', 
      sla: '1-2 business days',
      autoDescription: (data) => {
        const requiredAccessLevel = data?.requiredAccessLevel || '[Access Level]';
        const softwareName = data?.softwareName || '[Software]';
        const version = data?.version ? ` v${data.version}` : '';
        const projectTeam = data?.projectTeam || '[Project/Team]';
        const purposeOfAccess = data?.purposeOfAccess || '[Purpose]';
        
        return `Request for ${requiredAccessLevel} access to ${softwareName}${version} for ${projectTeam}. Purpose: ${purposeOfAccess}.`;
      },
      fields: [
        { name: 'softwareName', label: 'Software Name', type: 'text', required: true, maxLength: 50 },
        { name: 'version', label: 'Version', type: 'text', required: true, maxLength: 20 },
        { name: 'purposeOfAccess', label: 'Purpose of Access', type: 'textarea', required: true, maxLength: 200 },
        { name: 'requiredAccessLevel', label: 'Required Access Level', type: 'select', options: ['Read Only', 'Read-Write', 'Admin'], required: true },
        { name: 'projectTeam', label: 'Project/Team', type: 'text', required: true, maxLength: 50 }
      ]
    },
    { 
      id: 32, 
      name: 'VPN Access Request', 
      category: 'it', 
      description: 'Request for VPN access', 
      icon: 'bi-shield-lock-fill', 
      priority: 'medium', 
      sla: '2-3 business days',
      autoDescription: (data) => {
        const accessType = data?.accessType || '[Access Type]';
        const duration = data?.duration || '[Duration]';
        const requiredLocations = data?.requiredLocations || '[Locations]';
        const reasonForVPN = data?.reasonForVPN || '[Reason]';
        
        return `Request for ${accessType} VPN access for ${duration}. Locations: ${requiredLocations}. Reason: ${reasonForVPN}.`;
      },
      fields: [
        { name: 'accessType', label: 'Access Type', type: 'select', options: ['Full Time', 'On-demand', 'Temporary'], required: true },
        { name: 'reasonForVPN', label: 'Reason for VPN', type: 'textarea', required: true, maxLength: 300 },
        { name: 'requiredLocations', label: 'Required Locations', type: 'text', required: true, maxLength: 100 },
        { name: 'duration', label: 'Duration', type: 'text', required: true, maxLength: 20 },
        { name: 'deviceDetails', label: 'Device Details', type: 'textarea', required: true, maxLength: 200 }
      ]
    },
    { 
      id: 33, 
      name: 'Email Distribution List Request', 
      category: 'it', 
      description: 'Request email distribution list access', 
      icon: 'bi-envelope-at-fill', 
      priority: 'low', 
      sla: '1-2 business days',
      autoDescription: (data) => {
        const listName = data?.listName || '[List Name]';
        const accessType = data?.accessType || '[Access Type]';
        const purpose = data?.purpose || '[Purpose]';
        
        return `Email distribution list request: ${listName} (${accessType} access). Purpose: ${purpose}.`;
      },
      fields: [
        { name: 'listName', label: 'Distribution List Name', type: 'text', required: true, maxLength: 50 },
        { name: 'accessType', label: 'Access Type', type: 'select', options: ['Subscribe', 'Unsubscribe', 'Admin Access'], required: true },
        { name: 'purpose', label: 'Purpose', type: 'textarea', required: true, maxLength: 200 }
      ]
    },
    { 
      id: 34, 
      name: 'System/Application Access', 
      category: 'it', 
      description: 'Request access to system or application', 
      icon: 'bi-app-indicator', 
      priority: 'medium', 
      sla: '2-3 business days',
      autoDescription: (data) => {
        const systemName = data?.systemName || '[System]';
        const accessLevel = data?.accessLevel || '[Access Level]';
        const projectTeam = data?.projectTeam || '[Project/Team]';
        
        return `System access request for ${systemName} with ${accessLevel} access level for ${projectTeam}.`;
      },
      fields: [
        { name: 'systemName', label: 'System/Application Name', type: 'text', required: true, maxLength: 50 },
        { name: 'accessLevel', label: 'Access Level', type: 'select', options: ['View Only', 'Read-Write', 'Admin'], required: true },
        { name: 'projectTeam', label: 'Project/Team', type: 'text', required: true, maxLength: 50 },
        { name: 'purpose', label: 'Purpose of Access', type: 'textarea', required: true, maxLength: 300 },
        { name: 'justification', label: 'Business Justification', type: 'textarea', required: true, maxLength: 300 }
      ]
    },
    { 
      id: 35, 
      name: 'Hardware Request', 
      category: 'it', 
      description: 'Request IT hardware equipment', 
      icon: 'bi-pc-display-horizontal', 
      priority: 'medium', 
      sla: '5-7 business days',
      autoDescription: (data) => {
        const hardwareType = data?.hardwareType || '[Hardware Type]';
        const quantity = data?.quantity || '[Quantity]';
        const specifications = data?.specifications || '[Specifications]';
        const reason = data?.reason || '[Reason]';
        
        return `Hardware request: ${quantity} ${hardwareType} (${specifications}). Reason: ${reason}.`;
      },
      fields: [
        { name: 'hardwareType', label: 'Hardware Type', type: 'select', options: ['Laptop', 'Desktop', 'Monitor', 'Keyboard', 'Mouse', 'Headset', 'Webcam', 'Other'], required: true },
        { name: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1, max: 10 },
        { name: 'specifications', label: 'Specifications', type: 'textarea', required: true, maxLength: 300 },
        { name: 'reason', label: 'Reason for Request', type: 'textarea', required: true, maxLength: 300 },
        { name: 'urgency', label: 'Urgency', type: 'select', options: ['Normal', 'Urgent'], required: true }
      ]
    },
    
    // Feedback & Grievances
    { 
      id: 36, 
      name: 'General Feedback', 
      category: 'feedback', 
      description: 'Share workplace feedback', 
      icon: 'bi-chat-left-text', 
      priority: 'low', 
      sla: 'Acknowledgement in 1 day',
      autoDescription: (data) => {
        const feedbackType = data?.feedbackType || '[Type]';
        const category = data?.category || '[Category]';
        const anonymous = data?.anonymous === true || data?.anonymous === 'true' ? '(Submitted anonymously)' : '';
        
        return `${feedbackType} feedback about ${category}. ${anonymous}`;
      },
      fields: [
        { name: 'feedbackType', label: 'Feedback Type', type: 'select', options: ['Positive', 'Constructive', 'Concern'], required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Work Environment', 'Processes', 'Facilities', 'Team'], required: true },
        { name: 'feedbackDetails', label: 'Feedback Details', type: 'textarea', required: true, maxLength: 500 },
        { name: 'suggestions', label: 'Suggestions', type: 'textarea', required: false, maxLength: 300 },
        { name: 'anonymous', label: 'Submit Anonymously', type: 'checkbox', required: false }
      ]
    },
    { 
      id: 37, 
      name: 'HR Grievance', 
      category: 'feedback', 
      description: 'Raise HR concerns', 
      icon: 'bi-shield-exclamation', 
      priority: 'high', 
      sla: 'Initial response in 2 business days',
      autoDescription: (data) => {
        const grievanceType = data?.grievanceType || '[Type]';
        const dateOfIncident = data?.dateOfIncident ? ` (Date: ${data.dateOfIncident})` : '';
        const confidentiality = data?.confidentiality || '[Level]';
        
        return `HR grievance regarding ${grievanceType}${dateOfIncident}. Confidentiality: ${confidentiality}.`;
      },
      fields: [
        { name: 'grievanceType', label: 'Grievance Type', type: 'select', options: ['Workplace Issue', 'Policy Concern', 'Interpersonal'], required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true, maxLength: 1000 },
        { name: 'dateOfIncident', label: 'Date of Incident', type: 'date', required: false },
        { name: 'expectedOutcome', label: 'Expected Outcome', type: 'textarea', required: true, maxLength: 300 },
        { name: 'confidentiality', label: 'Confidentiality', type: 'select', options: ['Standard', 'Confidential'], required: true }
      ]
    },
    { 
      id: 38, 
      name: 'Suggestion Box', 
      category: 'feedback', 
      description: 'Submit suggestions for improvement', 
      icon: 'bi-lightbulb-fill', 
      priority: 'low', 
      sla: 'Review within 5 business days',
      autoDescription: (data) => {
        const category = data?.category || '[Category]';
        const suggestion = data?.suggestion || '[Suggestion]';
        const anonymous = data?.anonymous === true || data?.anonymous === 'true' ? '(Submitted anonymously)' : '';
        
        return `Suggestion for ${category}: ${suggestion.substring(0, 100)}... ${anonymous}`;
      },
      fields: [
        { name: 'category', label: 'Category', type: 'select', options: ['Process Improvement', 'Work Environment', 'Technology', 'Policies', 'Training', 'Other'], required: true },
        { name: 'suggestion', label: 'Suggestion', type: 'textarea', required: true, maxLength: 1000 },
        { name: 'expectedImpact', label: 'Expected Impact', type: 'textarea', required: false, maxLength: 300 },
        { name: 'anonymous', label: 'Submit Anonymously', type: 'checkbox', required: false }
      ]
    },
    { 
      id: 39, 
      name: 'POSH Complaint', 
      category: 'feedback', 
      description: 'Submit POSH (Prevention of Sexual Harassment) complaint', 
      icon: 'bi-shield-shaded', 
      priority: 'high', 
      sla: 'Immediate response within 24 hours',
      autoDescription: (data) => {
        const complaintType = data?.complaintType || '[Type]';
        const dateOfIncident = data?.dateOfIncident || '[Date]';
        const confidentiality = 'Highly Confidential';
        
        return `POSH complaint: ${complaintType} incident on ${dateOfIncident}. Status: ${confidentiality}.`;
      },
      fields: [
        { name: 'complaintType', label: 'Complaint Type', type: 'select', options: ['Sexual Harassment', 'Inappropriate Behavior', 'Discrimination', 'Other'], required: true },
        { name: 'dateOfIncident', label: 'Date of Incident', type: 'date', required: true },
        { name: 'timeOfIncident', label: 'Time of Incident', type: 'time', required: false },
        { name: 'location', label: 'Location of Incident', type: 'text', required: true, maxLength: 100 },
        { name: 'description', label: 'Detailed Description', type: 'textarea', required: true, maxLength: 2000 },
        { name: 'witnesses', label: 'Witnesses (if any)', type: 'textarea', required: false, maxLength: 300 },
        { name: 'supportingDocuments', label: 'Supporting Documents', type: 'file', required: false },
        { name: 'preferredContact', label: 'Preferred Contact Method', type: 'select', options: ['Email', 'Phone', 'In-person'], required: true }
      ]
    },
    { 
      id: 40, 
      name: 'Ethics Violation Reporting', 
      category: 'feedback', 
      description: 'Whistleblower - Report ethics violations', 
      icon: 'bi-megaphone-fill', 
      priority: 'high', 
      sla: 'Immediate investigation initiation',
      autoDescription: (data) => {
        const violationType = data?.violationType || '[Type]';
        const dateOfIncident = data?.dateOfIncident || '[Date]';
        const confidentiality = 'Whistleblower - Highly Confidential';
        
        return `Ethics violation report: ${violationType} on ${dateOfIncident}. Status: ${confidentiality}.`;
      },
      fields: [
        { name: 'violationType', label: 'Violation Type', type: 'select', options: ['Fraud', 'Corruption', 'Policy Violation', 'Unethical Behavior', 'Financial Misconduct', 'Data Breach', 'Other'], required: true },
        { name: 'dateOfIncident', label: 'Date of Incident', type: 'date', required: true },
        { name: 'involvedParties', label: 'Involved Parties', type: 'textarea', required: true, maxLength: 300 },
        { name: 'description', label: 'Detailed Description', type: 'textarea', required: true, maxLength: 2000 },
        { name: 'evidence', label: 'Evidence Available', type: 'textarea', required: false, maxLength: 500 },
        { name: 'supportingDocuments', label: 'Supporting Documents', type: 'file', required: false },
        { name: 'anonymous', label: 'Submit Anonymously (Whistleblower Protection)', type: 'checkbox', required: false },
        { name: 'preferredContact', label: 'Preferred Contact Method', type: 'select', options: ['Email', 'Phone', 'Secure Channel'], required: true }
      ]
    }
  ];

  // ==================== FORM STATE ====================
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [charCount, setCharCount] = useState({});

  // ==================== HELPER FUNCTIONS ====================
  const filteredRequests = allRequests.filter(req => req.category === activeCategory);

  const filteredHistory = requestHistory.filter(req => {
    const matchesSearch = searchTerm === '' || 
      req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    
    // Add date range filtering
    let matchesDate = true;
    if (fromDate || toDate) {
      const reqDateStr = req.submittedDate.split(' ')[0]; // Extract date part only (YYYY-MM-DD)
      const reqDate = new Date(reqDateStr);
      
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        matchesDate = reqDate >= from && reqDate <= to;
      } else if (fromDate) {
        const from = new Date(fromDate);
        matchesDate = reqDate >= from;
      } else if (toDate) {
        const to = new Date(toDate);
        matchesDate = reqDate <= to;
      }
    }

    // Add location filtering
    const matchesLocation = locationFilter === 'All Locations' || req.location === locationFilter;
    
    // Add workflow filtering
    const matchesWorkflow = workflowFilter === 'All Workflows' || req.workflow === workflowFilter;

    // Add status filter (second status filter)
    const matchesStatus2 = statusFilter === 'All Status' || req.status === statusFilter;
    
    return matchesSearch && matchesStatus && matchesDate && matchesLocation && matchesWorkflow && matchesStatus2;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Submitted': { bg: 'primary', text: 'Submitted' },
      'In Progress': { bg: 'warning', text: 'In Progress' },
      'Approved': { bg: 'success', text: 'Approved' },
      'Rejected': { bg: 'danger', text: 'Rejected' },
      'Completed': { bg: 'secondary', text: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig['Submitted'];
    
    return (
      <span className={`badge bg-${config.bg}`}>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'high': { bg: 'danger', text: 'High' },
      'medium': { bg: 'warning', text: 'Medium' },
      'low': { bg: 'success', text: 'Low' }
    };
    
    const config = priorityConfig[priority] || priorityConfig['medium'];
    
    return (
      <span className={`badge bg-${config.bg}`}>
        {config.text}
      </span>
    );
  };

  // FIXED: Each button opens specific form
  const handleQuickBankChange = () => {
    const bankRequest = allRequests.find(r => r.name === 'Bank Account Change');
    if (bankRequest) {
      setSelectedRequest(bankRequest);
      setShowRequestModal(true);
      // Auto-fill some sample data for demo
      setFormData({
        currentBank: 'HDFC Bank',
        currentAccountNumber: '123456789012',
        newBank: 'ICICI Bank',
        newAccountNumber: '987654321012',
        ifscCode: 'ICIC0001234',
        branchName: 'MG Road Branch'
      });
      setFormErrors({});
      setCharCount({});
    }
  };

  const handleQuickWFHRequest = () => {
    const wfhRequest = allRequests.find(r => r.name === 'Work-from-Home Request');
    if (wfhRequest) {
      setSelectedRequest(wfhRequest);
      setShowRequestModal(true);
      // Auto-fill dates
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      setFormData({
        wfhStartDate: today.toISOString().split('T')[0],
        wfhEndDate: nextWeek.toISOString().split('T')[0],
        workLocation: 'Home - Bangalore',
        internetAvailability: 'Yes'
      });
      setFormErrors({});
      setCharCount({});
    }
  };

  const handleQuickReimbursement = () => {
    const reimbursementRequest = allRequests.find(r => r.name === 'Reimbursement Claim');
    if (reimbursementRequest) {
      setSelectedRequest(reimbursementRequest);
      setShowRequestModal(true);
      // Auto-fill sample data
      setFormData({
        expenseType: 'Travel',
        totalAmount: 7500,
        expensePeriod: '2024-03',
        description: 'Travel expenses for client meeting in Mumbai'
      });
      setFormErrors({});
      setCharCount({});
    }
  };

  const handleQuickITRequest = () => {
    const itRequest = allRequests.find(r => r.name === 'Software Access');
    if (itRequest) {
      setSelectedRequest(itRequest);
      setShowRequestModal(true);
      // Auto-fill sample data
      setFormData({
        softwareName: 'Microsoft Project',
        version: '2021',
        requiredAccessLevel: 'Read-Write',
        projectTeam: 'Project Management Team',
        purposeOfAccess: 'To manage project timelines and resources'
      });
      setFormErrors({});
      setCharCount({});
    }
  };

  const handleQuickFeedback = () => {
    const feedbackRequest = allRequests.find(r => r.name === 'General Feedback');
    if (feedbackRequest) {
      setSelectedRequest(feedbackRequest);
      setShowRequestModal(true);
      // Auto-fill sample data
      setFormData({
        feedbackType: 'Constructive',
        category: 'Work Environment',
        feedbackDetails: 'The office environment is good, but we need more collaborative spaces.',
        suggestions: 'Add more meeting rooms with whiteboards'
      });
      setFormErrors({});
      setCharCount({});
    }
  };

  const handleFormChange = (fieldName, value, maxLength) => {
    // Count characters for textareas
    if (maxLength && typeof value === 'string') {
      setCharCount(prev => ({
        ...prev,
        [fieldName]: value.length
      }));
      
      // Truncate if exceeds max length
      if (value.length > maxLength) {
        value = value.substring(0, maxLength);
      }
    }
    
    setFormData({
      ...formData,
      [fieldName]: value
    });
    
    // Clear error for this field
    if (formErrors[fieldName]) {
      setFormErrors({
        ...formErrors,
        [fieldName]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedRequest) return errors;

    selectedRequest.fields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[field.name] = `${field.label} is required`;
        }
        
        // Validate max length for text fields
        if (field.maxLength && value && value.length > field.maxLength) {
          errors[field.name] = `Maximum ${field.maxLength} characters allowed`;
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill all required fields correctly');
      return;
    }

    // Generate description from form data
    const generatedDescription = selectedRequest.autoDescription 
      ? selectedRequest.autoDescription(formData)
      : selectedRequest.description;

    const newRequest = {
      id: requestHistory.length + 1,
      requestId: `REQ-${1000 + requestHistory.length + 1}`,
      type: selectedRequest.name,
      category: selectedRequest.category,
      location: 'Hyderabad',  // Default location
      workflow: 'Open',       // Default workflow
      submittedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Submitted',
      priority: selectedRequest.priority,
      description: generatedDescription,
      sla: selectedRequest.sla,
      approvers: getDefaultApprovers(selectedRequest.category),
      attachments: []
    };

    setRequestHistory([newRequest, ...requestHistory]);
    setShowRequestModal(false);
    setSelectedRequest(null);
    setFormData({});
    setFormErrors({});
    setCharCount({});
    
    alert(`✅ ${selectedRequest.name} submitted successfully!\nRequest ID: ${newRequest.requestId}\n\nGenerated Description:\n${generatedDescription}`);
  };

  const getDefaultApprovers = (category) => {
    const approverMap = {
      'personal': ['HR Department'],
      'work': ['Reporting Manager', 'HR Department'],
      'financial': ['Finance Department'],
      'administrative': ['Admin Department'],
      'travel': ['Reporting Manager', 'Travel Desk'],
      'it': ['IT Department'],
      'feedback': ['HR Department']
    };
    return approverMap[category] || ['HR Department'];
  };

  const getStats = () => {
    const total = requestHistory.length;
    const submitted = requestHistory.filter(req => req.status === 'Submitted').length;
    const inProgress = requestHistory.filter(req => req.status === 'In Progress').length;
    const approved = requestHistory.filter(req => req.status === 'Approved').length;
    const completed = requestHistory.filter(req => req.status === 'Completed').length;
    
    return { total, submitted, inProgress, approved, completed };
  };

  const stats = getStats();

  // ==================== MODAL COMPONENTS ====================

  // Request Form Modal with Category-Specific Fields
  const RequestFormModal = () => {
    if (!selectedRequest) return null;

    const category = requestCategories[selectedRequest.category];
    
    // Safely generate description
    const getGeneratedDescription = () => {
      if (!selectedRequest.autoDescription) {
        return selectedRequest.description;
      }
      
      try {
        // Create a safe copy of formData with defaults
        const safeData = { ...formData };
        
        // Ensure all fields have at least placeholder values
        selectedRequest.fields.forEach(field => {
          if (!safeData.hasOwnProperty(field.name) || 
              safeData[field.name] === '' || 
              safeData[field.name] === null || 
              safeData[field.name] === undefined) {
            safeData[field.name] = `[${field.label}]`;
          }
        });
        
        return selectedRequest.autoDescription(safeData);
      } catch (error) {
        console.error("Error generating description:", error);
        return selectedRequest.description;
      }
    };
    
    const generatedDescription = getGeneratedDescription();

    const renderFormField = (field) => {
      const fieldValue = formData[field.name] || '';
      
      switch (field.type) {
        case 'textarea':
          return (
            <div>
              <textarea
                className={`form-control ${formErrors[field.name] ? 'is-invalid' : ''}`}
                rows={field.maxLength > 200 ? 4 : 3}
                value={fieldValue}
                onChange={(e) => handleFormChange(field.name, e.target.value, field.maxLength)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                required={field.required}
                maxLength={field.maxLength}
              />
              {field.maxLength && (
                <div className="text-end mt-1">
                  <small className={`text-muted ${charCount[field.name] > field.maxLength * 0.9 ? 'text-warning' : ''}`}>
                    {charCount[field.name] || 0}/{field.maxLength} characters
                  </small>
                </div>
              )}
              {formErrors[field.name] && (
                <div className="invalid-feedback">{formErrors[field.name]}</div>
              )}
            </div>
          );
        
        case 'select':
          return (
            <select
              className={`form-select ${formErrors[field.name] ? 'is-invalid' : ''}`}
              value={fieldValue}
              onChange={(e) => handleFormChange(field.name, e.target.value)}
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          );
        
        case 'multiselect':
          const values = Array.isArray(fieldValue) ? fieldValue : [];
          return (
            <select
              className={`form-select ${formErrors[field.name] ? 'is-invalid' : ''}`}
              multiple
              value={values}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleFormChange(field.name, selected);
              }}
              required={field.required}
              style={{ height: '100px' }}
            >
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          );
        
        case 'radio':
          return (
            <div>
              {field.options.map(option => (
                <div className="form-check form-check-inline" key={option}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={field.name}
                    value={option}
                    checked={fieldValue === option}
                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                    required={field.required}
                  />
                  <label className="form-check-label">{option}</label>
                </div>
              ))}
              {formErrors[field.name] && (
                <div className="text-danger small">{formErrors[field.name]}</div>
              )}
            </div>
          );
        
        case 'checkbox':
          return (
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={fieldValue || false}
                onChange={(e) => handleFormChange(field.name, e.target.checked)}
                required={field.required}
              />
              <label className="form-check-label">
                {field.label}
              </label>
            </div>
          );
        
        case 'file':
          return (
            <div>
              <input
                type="file"
                className={`form-control ${formErrors[field.name] ? 'is-invalid' : ''}`}
                onChange={(e) => handleFormChange(field.name, e.target.files[0])}
                required={field.required}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <small className="text-muted">Max 10MB, PDF, JPG, PNG, DOC formats</small>
            </div>
          );
        
        default:
          return (
            <input
              type={field.type}
              className={`form-control ${formErrors[field.name] ? 'is-invalid' : ''}`}
              value={fieldValue}
              onChange={(e) => handleFormChange(field.name, e.target.value, field.maxLength)}
              required={field.required}
              maxLength={field.maxLength}
              max={field.max}
              min={field.min}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          );
      }
    };

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0 pb-0" style={{ backgroundColor: category.color, color: 'white' }}>
              <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                <i className={`${selectedRequest.icon} fs-4`}></i>
                <span>{selectedRequest.name}</span>
              </h5>
              <button 
                className="btn-close btn-close-white" 
                onClick={() => {
                  setShowRequestModal(false);
                  setSelectedRequest(null);
                  setFormErrors({});
                  setFormData({});
                }}
              ></button>
            </div>
            
            <div className="modal-body pt-0">
              <div className="alert alert-light mb-4">
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <small className="text-muted">Category</small>
                    <div className="fw-bold d-flex align-items-center gap-2">
                      <i className={category.icon}></i>
                      {category.title}
                    </div>
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <small className="text-muted">Priority</small>
                    <div>{getPriorityBadge(selectedRequest.priority)}</div>
                  </div>
                  <div className="col-12 col-md-3 mb-2">
                    <small className="text-muted">SLA</small>
                    <div className="fw-bold">{selectedRequest.sla}</div>
                  </div>
                </div>
                <p className="mb-0 text-muted mt-2">{selectedRequest.description}</p>
              </div>
              
              {/* Generated Description Preview */}
              <div className="alert alert-info mb-4">
                <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-card-text"></i>
                  Auto-Generated Description Preview:
                </h6>
                <p className="mb-0 small">
                  {generatedDescription}
                </p>
                <small className="text-muted mt-2 d-block">
                  <i className="bi bi-info-circle me-1"></i>
                  This description is automatically generated from your form inputs
                </small>
              </div>
              
              <form onSubmit={handleSubmitRequest}>
                <div className="row">
                  {selectedRequest.fields.map((field, index) => (
                    <div key={index} className={`col-12 ${field.type === 'textarea' ? 'mb-4' : 'mb-3'}`}>
                      <label className="form-label fw-medium">
                        {field.label} {field.required && <span className="text-danger">*</span>}
                      </label>
                      {renderFormField(field)}
                    </div>
                  ))}
                </div>
              </form>
            </div>
            
            <div className="modal-footer border-0">
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => {
                  setShowRequestModal(false);
                  setSelectedRequest(null);
                  setFormErrors({});
                  setFormData({});
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmitRequest}
                style={{ backgroundColor: category.color, borderColor: category.color }}
              >
                <i className="bi bi-check-circle me-2"></i>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Guide Modal
  const GuideModal = () => {
    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0 pb-0 bg-primary text-white">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-info-circle me-2"></i>
                Quick Guide
              </h5>
              <button className="btn-close btn-close-white" onClick={() => setShowGuideModal(false)}></button>
            </div>
            
            <div className="modal-body pt-0">
              <div className="alert alert-light mb-4">
                <h6 className="fw-bold">How Auto-Description Works</h6>
                <p className="mb-0">
                  When you fill the form, a description is automatically generated from your inputs. 
                  This saves time and ensures consistency in request descriptions.
                </p>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card border">
                    <div className="card-body">
                      <h6 className="card-title text-primary d-flex align-items-center gap-2">
                        <i className="bi bi-lightning"></i>
                        Quick Actions
                      </h6>
                      <ul className="mb-0 small">
                        <li><strong>Bank Change:</strong> Auto-fills with sample bank details</li>
                        <li><strong>WFH Request:</strong> Auto-fills with next week's dates</li>
                        <li><strong>Reimbursement:</strong> Auto-fills with sample expense data</li>
                        <li><strong>IT Request:</strong> Auto-fills with software details</li>
                        <li><strong>Feedback:</strong> Auto-fills with feedback categories</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="card border">
                    <div className="card-body">
                      <h6 className="card-title text-success d-flex align-items-center gap-2">
                        <i className="bi bi-card-text"></i>
                        Auto Description Examples
                      </h6>
                      <ul className="mb-0 small">
                        <li><strong>Bank:</strong> "Change from HDFC to ICICI (Account: XXXX, IFSC: XXXX)"</li>
                        <li><strong>WFH:</strong> "WFH from [date] to [date], Reason: [reason]"</li>
                        <li><strong>Travel:</strong> "Travel to [place] from [dates], Cost: ₹[amount]"</li>
                        <li><strong>IT:</strong> "Access to [software] for [project], Level: [access]"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer border-0">
              <button className="btn btn-primary" onClick={() => setShowGuideModal(false)}>
                <i className="bi bi-check me-2"></i>
                Got it!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== MAIN COMPONENT ====================
  return (
    <div className="container-fluid px-2 px-md-3 px-lg-4 py-3">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="mb-3 mb-md-0">
          <h5 className="fw-bold mb-1">
            <i className="bi bi-briefcase me-2"></i>
           Request Management
          </h5>
          <p className="text-muted mb-0 d-none d-md-block">Submit and track requests with auto-generated descriptions</p>
          <p className="text-muted mb-0 d-md-none">Auto-generated request descriptions</p>
        </div>

        <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
          <button 
            className="btn btn-outline-primary d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0"
            onClick={() => setShowGuideModal(true)}
          >
            <i className="bi bi-question-circle"></i>
            <span>Quick Guide</span>
          </button>
          
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0"
            onClick={() => {
              if (filteredRequests.length > 0) {
                setSelectedRequest(filteredRequests[0]);
                setShowRequestModal(true);
              }
            }}
          >
            <i className="bi bi-plus-circle"></i>
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards - REMOVED BACKGROUND COLOR FROM ICONS */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-1">Total Requests</h6>
                  <h4 className="fw-bold mb-0">{stats.total}</h4>
                </div>
                <div className="p-2">
                  <i className="bi bi-list-task text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card border h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-1">In Progress</h6>
                  <h4 className="fw-bold mb-0">{stats.inProgress}</h4>
                </div>
                <div className="p-2">
                  <i className="bi bi-clock-history text-warning fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card border h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-1">Approved</h6>
                  <h4 className="fw-bold mb-0">{stats.approved}</h4>
                </div>
                <div className="p-2">
                  <i className="bi bi-check-circle text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card border h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-muted mb-1">Completed</h6>
                  <h4 className="fw-bold mb-0">{stats.completed}</h4>
                </div>
                <div className="p-2">
                  <i className="bi bi-check2-all text-secondary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="card border mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            {Object.entries(requestCategories).map(([key, category]) => (
              <button
                key={key}
                className={`btn ${activeCategory === key ? 'btn-primary' : 'btn-outline-primary'} btn-sm d-flex align-items-center gap-2`}
                onClick={() => setActiveCategory(key)}
              >
                <i className={category.icon}></i>
                <span>{category.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Request Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="card border">
            <div className="card-header bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <h6 className="mb-2 mb-md-0 fw-bold d-flex align-items-center gap-2">
                <i className={requestCategories[activeCategory].icon}></i>
                <span>{requestCategories[activeCategory].title} Requests</span>
              </h6>
              <span className="badge bg-primary">{filteredRequests.length} requests available</span>
            </div>
            
            <div className="card-body">
              {filteredRequests.length > 0 ? (
                <div className="row g-3">
                  {filteredRequests.map(request => (
                    <div key={request.id} className="col-12 col-md-6 col-lg-4">
                      <div 
                        className="card border h-100 hover-shadow"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRequestModal(true);
                        }}
                      >
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <i className={`${request.icon} fs-4 text-primary`}></i>
                            {getPriorityBadge(request.priority)}
                          </div>
                          <h6 className="card-title fw-bold">{request.name}</h6>
                          <p className="card-text text-muted small">
                            <i className="bi bi-card-text me-1"></i>
                            {request.description}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted d-flex align-items-center gap-1">
                              <i className="bi bi-clock"></i>
                              {request.sla}
                            </small>
                            <small className="text-primary d-flex align-items-center gap-1">
                              <i className="bi bi-magic"></i>
                              Auto-description
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="text-muted mb-3">
                    <i className="bi bi-inbox fs-1"></i>
                  </div>
                  <h6 className="text-muted">No requests available in this category</h6>
                  <p className="text-muted small">Select a different category to view available requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request History */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border">
            <div className="card-header bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <h6 className="mb-2 mb-md-0 fw-bold">
                <i className="bi bi-clock-history me-2"></i>
                Request History
              </h6>
              <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
                <div className="input-group input-group-sm">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by ID or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Filter Row */}
            <div className="card-body border-bottom">
              <div className="row mb-3">
                {/* Location */}
                <div className="col-12 col-md-6 col-lg-2">
                  <label className="form-label fw-semibold">Location</label>
                  <select 
                    className="form-select"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option>All Locations</option>
                    <option>Hyderabad</option>
                    <option>Bangalore</option>
                    <option>Chennai</option>
                    <option>Delhi</option>
                    <option>Mumbai</option>
                  </select>
                </div>

                {/* Workflows */}
                <div className="col-12 col-md-6 col-lg-2">
                  <label className="form-label fw-semibold">Workflows</label>
                  <select 
                    className="form-select"
                    value={workflowFilter}
                    onChange={(e) => setWorkflowFilter(e.target.value)}
                  >
                    <option>All Workflows</option>
                    <option>Open</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Processing</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-12 col-md-6 col-lg-2">
                  <label className="form-label fw-semibold">Status</label>
                  <select 
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>All Status</option>
                    <option>Open</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Processing</option>
                  </select>
                </div>

                {/* Additional Status Filter */}
                <div className="col-12 col-md-6 col-lg-2">
                  <label className="form-label fw-semibold">Filter Status</label>
                  <select 
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Submitted">Submitted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label fw-semibold d-flex align-items-center gap-2">
                    Date Range
                    <i className="bi bi-info-circle text-primary" 
                       title="Select date range to filter requests"
                       style={{cursor: 'pointer'}}></i>
                  </label>
                  <div className="d-flex gap-2">
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Request ID</th>
                      <th className="d-none d-md-table-cell">Type</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Workflow</th>
                      <th>Status</th>
                      <th>Submitted Date</th>
                      <th>Priority</th>
                      <th>SLA</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map(request => (
                      <tr key={request.id}>
                        <td>
                          <div className="fw-bold text-primary">{request.requestId}</div>
                        </td>
                        <td className="d-none d-md-table-cell">
                          <div className="fw-medium">{request.type}</div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <i className={requestCategories[request.category]?.icon}></i>
                            <span className="d-none d-md-inline">{requestCategories[request.category]?.title}</span>
                            <span className="d-inline d-md-none">{requestCategories[request.category]?.title.substring(0, 3)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="small">{request.location}</div>
                        </td>
                        <td>
                          <div className="small">{request.workflow}</div>
                        </td>
                        <td>
                          {getStatusBadge(request.status)}
                        </td>
                        <td>
                          <div className="small">{request.submittedDate}</div>
                        </td>
                        <td>
                          {getPriorityBadge(request.priority)}
                        </td>
                        <td>
                          <small className="text-muted">{request.sla}</small>
                        </td>
                        <td>
                          <small className="text-muted" style={{ maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {request.description}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - FIXED with Specific Forms */}
      <div className="row mt-4 g-3">
        <div className="col-12">
          <div className="card border">
            <div className="card-header bg-light">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-lightning me-2"></i>
                Quick Actions (Auto-fill enabled)
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6 col-md-4 col-lg-2">
                  <button 
                    className="btn btn-outline-primary w-100 d-flex flex-column align-items-center py-3"
                    onClick={handleQuickBankChange}
                  >
                    <i className="bi bi-bank fs-4 mb-2"></i>
                    <span className="small">Bank Change</span>
                    <small className="text-muted">Auto-fill demo</small>
                  </button>
                </div>
                
                <div className="col-6 col-md-4 col-lg-2">
                  <button 
                    className="btn btn-outline-success w-100 d-flex flex-column align-items-center py-3"
                    onClick={handleQuickWFHRequest}
                  >
                    <i className="bi bi-house fs-4 mb-2"></i>
                    <span className="small">WFH Request</span>
                    <small className="text-muted">Auto-fill dates</small>
                  </button>
                </div>
                
                <div className="col-6 col-md-4 col-lg-2">
                  <button 
                    className="btn btn-outline-info w-100 d-flex flex-column align-items-center py-3"
                    onClick={handleQuickReimbursement}
                  >
                    <i className="bi bi-cash-stack fs-4 mb-2"></i>
                    <span className="small">Reimbursement</span>
                    <small className="text-muted">Auto-fill sample</small>
                  </button>
                </div>
                
                <div className="col-6 col-md-4 col-lg-2">
                  <button 
                    className="btn btn-outline-warning w-100 d-flex flex-column align-items-center py-3"
                    onClick={handleQuickITRequest}
                  >
                    <i className="bi bi-laptop fs-4 mb-2"></i>
                    <span className="small">IT Request</span>
                    <small className="text-muted">Auto-fill details</small>
                  </button>
                </div>
                
                <div className="col-6 col-md-4 col-lg-2">
                  <button 
                    className="btn btn-outline-danger w-100 d-flex flex-column align-items-center py-3"
                    onClick={handleQuickFeedback}
                  >
                    <i className="bi bi-chat-dots fs-4 mb-2"></i>
                    <span className="small">Feedback</span>
                    <small className="text-muted">Auto-fill categories</small>
                  </button>
                </div>
                
                <div className="col-6 col-md-4 col-lg-2">
                  <button 
                    className="btn btn-outline-secondary w-100 d-flex flex-column align-items-center py-3"
                    onClick={() => setShowGuideModal(true)}
                  >
                    <i className="bi bi-question-circle fs-4 mb-2"></i>
                    <span className="small">Help Guide</span>
                    <small className="text-muted">Learn more</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRequestModal && <RequestFormModal />}
      {showGuideModal && <GuideModal />}
    </div>
  );
};

export default EmployeeSelfServicePortal;