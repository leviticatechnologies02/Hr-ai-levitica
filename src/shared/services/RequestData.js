export const requestCategories = {
  personal: {
    title: 'Personal Information',
    icon: 'heroicons:user',
    color: 'bg-blue-50 text-blue-600',
    description: 'Update personal and contact information'
  },
  work: {
    title: 'Work-Related',
    icon: 'heroicons:briefcase',
    color: 'bg-purple-50 text-purple-600',
    description: 'Work arrangements and changes'
  },
  administrative: {
    title: 'Administrative',
    icon: 'heroicons:building-office',
    color: 'bg-emerald-50 text-emerald-600',
    description: 'Admin support and facilities'
  },
  financial: {
    title: 'Financial',
    icon: 'heroicons:currency-dollar',
    color: 'bg-red-50 text-red-600',
    description: 'Financial requests and claims'
  },
  travel: {
    title: 'Travel & Expense',
    icon: 'heroicons:paper-airplane',
    color: 'bg-orange-50 text-orange-600',
    description: 'Travel requests and expense claims'
  },
  it: {
    title: 'IT & Systems',
    icon: 'heroicons:computer-desktop',
    color: 'bg-teal-50 text-teal-600',
    description: 'IT equipment and system access'
  },
  feedback: {
    title: 'Feedback',
    icon: 'heroicons:chat-bubble-left-ellipsis',
    color: 'bg-slate-50 text-slate-600',
    description: 'Feedback and grievances'
  }
};

export const allRequests = [
  // Personal Information Updates
  { 
    id: 1, 
    name: 'Bank Account Change', 
    category: 'personal', 
    description: 'Update bank account details for salary deposits', 
    icon: 'heroicons:building-library', 
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
    icon: 'heroicons:map-pin', 
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
    icon: 'heroicons:phone', 
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
    icon: 'heroicons:device-phone-mobile', 
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
    icon: 'heroicons:users', 
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
    icon: 'heroicons:user-plus', 
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
    icon: 'heroicons:home', 
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
    icon: 'heroicons:globe-alt', 
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
    icon: 'heroicons:clock', 
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
    icon: 'heroicons:arrows-right-left', 
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
    icon: 'heroicons:user-group', 
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
    icon: 'heroicons:computer-desktop', 
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
    icon: 'heroicons:identification', 
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
    icon: 'heroicons:key', 
    priority: 'medium', 
    sla: '2-3 business days',
    autoDescription: (data) => {
      const accessType = data?.accessType || '[Type]';
      const accessAreas = Array.isArray(data?.accessAreas) && data.accessAreas.length > 0 ? data.accessAreas.join(', ') : '[Areas]';
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
    icon: 'heroicons:truck', 
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
    icon: 'heroicons:archive-box', 
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
    icon: 'heroicons:pencil-square', 
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
    icon: 'heroicons:document-text', 
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
    icon: 'heroicons:banknotes', 
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
    icon: 'heroicons:receipt-percent', 
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
    icon: 'heroicons:credit-card', 
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
    icon: 'heroicons:document-chart-bar', 
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
    icon: 'heroicons:document-check', 
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
    icon: 'heroicons:clipboard-document-list', 
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
    icon: 'heroicons:paper-airplane', 
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
    icon: 'heroicons:receipt-refund', 
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
    icon: 'heroicons:wallet', 
    priority: 'high', 
    sla: '3-5 business days',
    autoDescription: (data) => {
      const advanceAmount = data?.advanceAmount || '[Amount]';
      const destination = data?.destination || '[Destination]';
      const travelDates = data?.travelStartDate && data?.travelEndDate ? `from ${data.travelStartDate} to ${data.travelEndDate}` : '[Travel Dates]';
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
    icon: 'heroicons:map', 
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
    icon: 'heroicons:calendar-days', 
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
    icon: 'heroicons:computer-desktop', 
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
    icon: 'heroicons:lock-closed', 
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
    icon: 'heroicons:envelope', 
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
    icon: 'heroicons:squares-plus', 
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
    icon: 'heroicons:device-tablet', 
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
    icon: 'heroicons:chat-bubble-bottom-center-text', 
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
    icon: 'heroicons:exclamation-triangle', 
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
    icon: 'heroicons:light-bulb', 
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
    icon: 'heroicons:shield-exclamation', 
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
    icon: 'heroicons:megaphone', 
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
