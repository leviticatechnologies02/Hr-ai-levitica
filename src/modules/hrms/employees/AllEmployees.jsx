import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';


const AllEmployees = () => {
  // Tab state for employee detail view
  const [activeDetailTab, setActiveDetailTab] = useState('personal');
  const [activeAddTab, setActiveAddTab] = useState('personal');

  // Helper function to create complete employee object with all modules
  const createEmployeeObject = (baseData) => {
    return {
      ...baseData,
      // Personal Information Module
      personalInfo: baseData.personalInfo || {
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        maritalStatus: '',
        nationality: '',
        languages: [],
        personalEmail: baseData.email || '',
        phonePrimary: baseData.phone || '',
        phoneSecondary: '',
        phoneEmergency: '',
        currentAddress: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          pincode: '',
          country: ''
        },
        permanentAddress: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          pincode: '',
          country: ''
        },
        emergencyContacts: [],
        familyMembers: [],
        nominees: [],
        profilePhoto: '',
        identification: {
          aadhaar: { number: '', verified: false },
          pan: { number: '', verified: false },
          passport: { number: '', expiryDate: '', verified: false },
          voterId: { number: '', verified: false }
        }
      },
      // Employment Information Module
      employmentInfo: baseData.employmentInfo || {
        employeeId: baseData.employeeId || '',
        dateOfJoining: baseData.joinDate || '',
        confirmationDate: '',
        probationPeriod: 6, // months
        employmentType: baseData.employmentType || 'Permanent',
        employmentStatus: baseData.status || 'Active',
        department: baseData.department || '',
        subDepartment: '',
        costCenter: '',
        designation: baseData.designation || '',
        grade: '',
        level: '',
        location: baseData.location || '',
        workplaceType: 'Office', // Office, Remote, Hybrid
        workEmail: baseData.email || '',
        extensionNumber: '',
        deskLocation: '',
        employeeCategory: 'Staff', // Staff, Management, Executive
        noticePeriod: 30, // days
        reportingManager: {
          direct: '',
          functional: ''
        },
        hrBusinessPartner: ''
      },
      // Job History
      jobHistory: baseData.jobHistory || [],
      // Salary & Compensation
      salaryInfo: baseData.salaryInfo || {
        currentCTC: baseData.salary || 0,
        ctcBreakdown: {
          basic: 0,
          hra: 0,
          specialAllowance: 0,
          transportAllowance: 0,
          medicalAllowance: 0,
          otherAllowances: 0,
          providentFund: 0,
          gratuity: 0,
          otherDeductions: 0
        },
        salaryStructure: '',
        bankAccounts: {
          primary: {
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: '',
            accountType: 'Savings'
          },
          secondary: {
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: '',
            accountType: 'Savings'
          }
        },
        paymentMode: 'Bank Transfer', // Bank Transfer, Cheque, Cash
        pfAccountNumber: '',
        uan: '',
        esiNumber: '',
        esiMedicalNominee: '',
        taxDeclaration: {
          regime: 'New', // Old, New
          declared: false
        },
        variablePay: {
          eligible: false,
          percentage: 0
        },
        bonusEligibility: {
          eligible: false,
          amount: 0
        },
        salaryRevisionHistory: []
      },
      // Statutory & Compliance
      statutoryInfo: baseData.statutoryInfo || {
        pan: {
          number: '',
          verified: false,
          verifiedDate: ''
        },
        aadhaar: {
          number: '',
          verified: false,
          verifiedDate: ''
        },
        pfMembership: {
          enrolled: false,
          accountNumber: '',
          uan: '',
          enrollmentDate: ''
        },
        esiRegistration: {
          enrolled: false,
          number: '',
          enrollmentDate: ''
        },
        professionalTax: {
          applicable: false,
          state: '',
          ptNumber: ''
        },
        labourWelfareFund: {
          enrolled: false,
          enrollmentDate: ''
        },
        gratuity: {
          eligible: false,
          eligibilityDate: ''
        },
        bonusAct: {
          applicable: false
        },
        shopsAndEstablishment: {
          registered: false,
          registrationNumber: '',
          registrationDate: ''
        }
      }
    };
  };

const [employees, setEmployees] = useState([
  createEmployeeObject({
    id: 1,
    employeeId: 'EMP001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    designation: 'Senior Developer',
    location: 'New York',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2020-05-15',
    salary: 75000,
    personalInfo: {
      dateOfBirth: '1990-05-20',
      gender: 'Female',
      bloodGroup: 'O+',
      maritalStatus: 'Married',
      nationality: 'US',
      languages: ['English', 'Spanish', 'French'],
      personalEmail: 'sarah.personal@email.com',
      phonePrimary: '+1 (555) 123-4567',
      phoneSecondary: '+1 (555) 123-4568',
      phoneEmergency: '+1 (555) 123-4569',
      currentAddress: {
        line1: '123 Main St',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        country: 'USA'
      },
      permanentAddress: {
        line1: '123 Main St',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        country: 'USA'
      },
      emergencyContacts: [
        { 
          name: 'John Johnson', 
          relation: 'Spouse', 
          phone: '+1 (555) 123-4569', 
          priority: 'Primary' 
        },
        { 
          name: 'Mary Johnson', 
          relation: 'Mother', 
          phone: '+1 (555) 987-6543', 
          priority: 'Secondary' 
        }
      ],
      familyMembers: [
        { 
          name: 'John Johnson', 
          relation: 'Spouse', 
          dob: '1988-03-15' 
        },
        { 
          name: 'Emma Johnson', 
          relation: 'Daughter', 
          dob: '2018-07-22' 
        }
      ],
      nominees: [
        { 
          name: 'John Johnson', 
          relation: 'Spouse', 
          phone: '+1 (555) 123-4569',
          percentage: 70 
        },
        { 
          name: 'Emma Johnson', 
          relation: 'Daughter', 
          phone: '+1 (555) 987-6543',
          percentage: 30 
        }
      ],
      profilePhoto: '',
      identification: {
        aadhaar: { 
          number: '1234 5678 9012', 
          verified: true,
          verifiedDate: '2020-05-20',
          document: ''
        },
        pan: { 
          number: 'ABCDE1234F', 
          verified: true,
          verifiedDate: '2020-05-20',
          document: ''
        },
        passport: { 
          number: 'P12345678', 
          expiryDate: '2030-05-20', 
          verified: true,
          verifiedDate: '2020-05-20',
          document: ''
        },
        voterId: { 
          number: 'VOT12345678', 
          verified: false,
          document: ''
        }
      }
    },
    employmentInfo: {
      employeeId: 'EMP001',
      dateOfJoining: '2020-05-15',
      confirmationDate: '2020-11-15',
      probationPeriod: 6,
      employmentType: 'Permanent',
      employmentStatus: 'Active',
      department: 'Engineering',
      subDepartment: 'Software Development',
      costCenter: 'ENG-001',
      designation: 'Senior Developer',
      grade: 'G5',
      level: 'L3',
      location: 'New York',
      workplaceType: 'Hybrid',
      workEmail: 'sarah.johnson@company.com',
      extensionNumber: '1234',
      deskLocation: 'Floor 5, Desk 12',
      employeeCategory: 'Staff',
      noticePeriod: 30,
      reportingManager: {
        direct: 'Michael Smith',
        functional: 'Michael Smith'
      },
      hrBusinessPartner: 'Lisa Anderson'
    },
    
    jobHistory: [
      {
        id: 1,
        type: 'Joining',
        date: '2020-05-15',
        organisation: 'TechCorp Inc.',
        department: 'Engineering',
        designation: 'Developer',
        location: 'New York',
        manager: 'Michael Smith',
        notes: 'Joined as Junior Developer at TechCorp',
        salaryChange: 60000,
        endDate: 'Present',
        reasonForLeaving: 'N/A',
        achievements: 'Built multiple scalable microservices'
      },
      {
        id: 2,
        type: 'Previous Experience',
        date: '2018-06-01',
        organisation: 'Digital Solutions Ltd.',
        department: 'Software Development',
        designation: 'Software Engineer',
        location: 'Boston',
        manager: 'Robert Chen',
        notes: 'Worked on enterprise applications',
        salaryChange: 55000,
        endDate: '2020-04-30',
        reasonForLeaving: 'Better career opportunity',
        achievements: 'Led migration from monolith to microservices'
      },
      {
        id: 3,
        type: 'Previous Experience',
        date: '2016-07-15',
        organisation: 'Innovate Tech',
        department: 'IT',
        designation: 'Junior Developer',
        location: 'Chicago',
        manager: 'Lisa Wang',
        notes: 'First professional role after graduation',
        salaryChange: 45000,
        endDate: '2018-05-31',
        reasonForLeaving: 'Career growth',
        achievements: 'Developed 3 client projects successfully'
      },
      {
        id: 4,
        type: 'Promotion',
        date: '2022-06-01',
        organisation: 'TechCorp Inc.',
        department: 'Engineering',
        designation: 'Senior Developer',
        location: 'New York',
        manager: 'Michael Smith',
        notes: 'Promoted to Senior Developer for outstanding performance',
        salaryChange: 75000,
        endDate: 'Present',
        reasonForLeaving: 'N/A',
        achievements: 'Mentored 3 junior developers, reduced system latency by 40%'
      }
    ],
    salaryInfo: {
      currentCTC: 75000,
      ctcBreakdown: {
        basic: 45000,
        hra: 22500,
        specialAllowance: 5000,
        transportAllowance: 1000,
        medicalAllowance: 1500,
        otherAllowances: 0,
        providentFund: 5400,
        gratuity: 1000,
        otherDeductions: 500
      },
      salaryStructure: 'Standard',
      bankAccounts: {
        primary: {
          accountNumber: '1234567890',
          ifscCode: 'BANK0001234',
          bankName: 'Chase Bank',
          branch: 'New York Downtown',
          accountType: 'Savings'
        },
        secondary: {
          accountNumber: '0987654321',
          ifscCode: 'BANK0005678',
          bankName: 'Bank of America',
          branch: 'New York Midtown',
          accountType: 'Savings'
        }
      },
      paymentMode: 'Bank Transfer',
      pfAccountNumber: 'PF123456',
      uan: 'UAN123456789',
      esiNumber: 'ESI123456',
      esiMedicalNominee: 'John Johnson',
      taxDeclaration: {
        regime: 'New',
        declared: true
      },
      variablePay: {
        eligible: true,
        percentage: 15
      },
      bonusEligibility: {
        eligible: true,
        amount: 5000
      },
      salaryRevisionHistory: [
        {
          effectiveDate: '2022-06-01',
          previousCTC: 60000,
          newCTC: 75000,
          percentageIncrease: 25,
          approvedBy: 'Michael Smith',
          status: 'Approved'
        }
      ]
    },
    statutoryInfo: {
      pan: {
        number: 'ABCDE1234F',
        verified: true,
        verifiedDate: '2020-05-15'
      },
      aadhaar: {
        number: '1234 5678 9012',
        verified: true,
        verifiedDate: '2020-05-15'
      },
      pfMembership: {
        enrolled: true,
        accountNumber: 'PF123456',
        uan: 'UAN123456789',
        enrollmentDate: '2020-05-15'
      },
      esiRegistration: {
        enrolled: true,
        number: 'ESI123456',
        enrollmentDate: '2020-05-15'
      },
      professionalTax: {
        applicable: true,
        state: 'New York',
        ptNumber: 'PTNY123456'
      },
      labourWelfareFund: {
        enrolled: true,
        enrollmentDate: '2020-05-15'
      },
      gratuity: {
        eligible: true,
        eligibilityDate: '2021-05-15'
      },
      bonusAct: {
        applicable: true
      },
      shopsAndEstablishment: {
        registered: true,
        registrationNumber: 'SE123456',
        registrationDate: '2020-05-15'
      }
    }
  }),
  createEmployeeObject({
    id: 2,
    employeeId: 'EMP002',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Marketing',
    designation: 'Marketing Manager',
    location: 'San Francisco',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2019-08-20',
    salary: 68000,
    personalInfo: {
      dateOfBirth: '1988-07-12',
      gender: 'Male',
      bloodGroup: 'A+',
      maritalStatus: 'Single',
      nationality: 'US',
      languages: ['English', 'Mandarin'],
      personalEmail: 'mike.chen.personal@email.com',
      phonePrimary: '+1 (555) 234-5678',
      phoneSecondary: '+1 (555) 234-5679',
      phoneEmergency: '+1 (555) 234-5680',
      currentAddress: {
        line1: '456 Market St',
        line2: 'Suite 1200',
        city: 'San Francisco',
        state: 'CA',
        pincode: '94105',
        country: 'USA'
      },
      permanentAddress: {
        line1: '123 Oak Ave',
        line2: '',
        city: 'Los Angeles',
        state: 'CA',
        pincode: '90001',
        country: 'USA'
      },
      emergencyContacts: [
        { 
          name: 'Susan Chen', 
          relation: 'Sister', 
          phone: '+1 (555) 234-5680', 
          priority: 'Primary' 
        }
      ],
      familyMembers: [
        { 
          name: 'Susan Chen', 
          relation: 'Sister', 
          dob: '1990-02-14' 
        }
      ],
      nominees: [
        { 
          name: 'Susan Chen', 
          relation: 'Sister', 
          phone: '+1 (555) 234-5680',
          percentage: 100 
        }
      ],
      profilePhoto: '',
      identification: {
        aadhaar: { 
          number: '2345 6789 0123', 
          verified: true,
          document: ''
        },
        pan: { 
          number: 'BCDEF2345G', 
          verified: true,
          document: ''
        },
        passport: { 
          number: 'P23456789', 
          expiryDate: '2028-12-31', 
          verified: true,
          document: ''
        },
        voterId: { 
          number: 'VOT23456789', 
          verified: true,
          document: ''
        }
      }
    },
    employmentInfo: {
      employeeId: 'EMP002',
      dateOfJoining: '2019-08-20',
      confirmationDate: '2020-02-20',
      probationPeriod: 6,
      employmentType: 'Permanent',
      employmentStatus: 'Active',
      department: 'Marketing',
      subDepartment: 'Digital Marketing',
      costCenter: 'MKT-001',
      designation: 'Marketing Manager',
      grade: 'G6',
      level: 'L4',
      location: 'San Francisco',
      workplaceType: 'Hybrid',
      workEmail: 'mike.chen@company.com',
      extensionNumber: '2345',
      deskLocation: 'Floor 3, Desk 8',
      employeeCategory: 'Management',
      noticePeriod: 60,
      reportingManager: {
        direct: 'Jennifer Lee',
        functional: 'Jennifer Lee'
      },
      hrBusinessPartner: 'Lisa Anderson'
    },
    jobHistory: [
      {
        id: 1,
        type: 'Previous Experience',
        date: '2017-01-15',
        organisation: 'BrandMakers Agency',
        department: 'Digital Marketing',
        designation: 'Marketing Analyst',
        location: 'Los Angeles',
        manager: 'David Miller',
        notes: 'Started as marketing intern, promoted to analyst',
        salaryChange: 45000,
        endDate: '2019-07-31',
        reasonForLeaving: 'Relocation to San Francisco',
        achievements: 'Increased client social media engagement by 300%'
      },
      {
        id: 2,
        type: 'Joining',
        date: '2019-08-20',
        organisation: 'TechCorp Inc.',
        department: 'Marketing',
        designation: 'Marketing Specialist',
        location: 'San Francisco',
        manager: 'Jennifer Lee',
        notes: 'Joined as Marketing Specialist focusing on B2B campaigns',
        salaryChange: 55000,
        endDate: '2021-06-14',
        reasonForLeaving: 'N/A',
        achievements: 'Generated $2M in qualified leads in first year'
      },
      {
        id: 3,
        type: 'Promotion',
        date: '2021-06-15',
        organisation: 'TechCorp Inc.',
        department: 'Marketing',
        designation: 'Marketing Manager',
        location: 'San Francisco',
        manager: 'Jennifer Lee',
        notes: 'Promoted to Marketing Manager leading 5-member team',
        salaryChange: 68000,
        endDate: 'Present',
        reasonForLeaving: 'N/A',
        achievements: 'Expanded market share by 15% in tech sector'
      }
    ],
    salaryInfo: {
      currentCTC: 68000,
      ctcBreakdown: {
        basic: 40800,
        hra: 20400,
        specialAllowance: 4500,
        transportAllowance: 800,
        medicalAllowance: 1200,
        otherAllowances: 300,
        providentFund: 4896,
        gratuity: 850,
        otherDeductions: 400
      },
      salaryStructure: 'Standard',
      bankAccounts: {
        primary: {
          accountNumber: '2345678901',
          ifscCode: 'BANK0002345',
          bankName: 'Wells Fargo',
          branch: 'San Francisco Downtown',
          accountType: 'Savings'
        }
      },
      paymentMode: 'Bank Transfer',
      pfAccountNumber: 'PF234567',
      uan: 'UAN234567890',
      esiNumber: 'ESI234567',
      esiMedicalNominee: 'Susan Chen',
      taxDeclaration: {
        regime: 'Old',
        declared: true
      },
      variablePay: {
        eligible: true,
        percentage: 12
      },
      bonusEligibility: {
        eligible: true,
        amount: 4000
      }
    },
    statutoryInfo: {
      pan: {
        number: 'BCDEF2345G',
        verified: true,
        verifiedDate: '2019-08-20'
      },
      aadhaar: {
        number: '2345 6789 0123',
        verified: true,
        verifiedDate: '2019-08-20'
      },
      pfMembership: {
        enrolled: true,
        accountNumber: 'PF234567',
        uan: 'UAN234567890',
        enrollmentDate: '2019-08-20'
      },
      esiRegistration: {
        enrolled: true,
        number: 'ESI234567',
        enrollmentDate: '2019-08-20'
      },
      professionalTax: {
        applicable: true,
        state: 'California',
        ptNumber: 'PTCA234567'
      }
    }
  }),
  createEmployeeObject({
    id: 3,
    employeeId: 'EMP003',
    name: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    phone: '+1 (555) 345-6789',
    department: 'HR',
    designation: 'HR Specialist',
    location: 'Chicago',
    employmentType: 'Full-time',
    status: 'On Leave',
    joinDate: '2021-01-10',
    salary: 58000,
    personalInfo: {
      dateOfBirth: '1992-11-05',
      gender: 'Male',
      bloodGroup: 'B+',
      maritalStatus: 'Married',
      nationality: 'US',
      languages: ['English', 'Spanish'],
      personalEmail: 'alex.rivera.personal@email.com',
      phonePrimary: '+1 (555) 345-6789',
      phoneSecondary: '+1 (555) 345-6790',
      phoneEmergency: '+1 (555) 345-6791',
      currentAddress: {
        line1: '789 Michigan Ave',
        line2: 'Apt 7C',
        city: 'Chicago',
        state: 'IL',
        pincode: '60611',
        country: 'USA'
      },
      permanentAddress: {
        line1: '456 Oak St',
        line2: '',
        city: 'Miami',
        state: 'FL',
        pincode: '33101',
        country: 'USA'
      },
      emergencyContacts: [
        { 
          name: 'Maria Rivera', 
          relation: 'Spouse', 
          phone: '+1 (555) 345-6791', 
          priority: 'Primary' 
        }
      ],
      familyMembers: [
        { 
          name: 'Maria Rivera', 
          relation: 'Spouse', 
          dob: '1993-03-22' 
        },
        { 
          name: 'Carlos Rivera', 
          relation: 'Son', 
          dob: '2020-08-15' 
        }
      ],
      nominees: [
        { 
          name: 'Maria Rivera',
          phone: '+1 (555) 345-6791',
          relation: 'Spouse', 
          percentage: 100 
        }
      ],
      profilePhoto: '',
      identification: {
        aadhaar: { 
          number: '3456 7890 1234', 
          verified: true,
          document: ''
        },
        pan: { 
          number: 'CDEFG3456H', 
          verified: true,
          document: ''
        },
        passport: { 
          number: 'P34567890', 
          expiryDate: '2029-06-30', 
          verified: true,
          document: ''
        },
        voterId: { 
          number: 'VOT34567890', 
          verified: false,
          document: ''
        }
      }
    },
    employmentInfo: {
      employeeId: 'EMP003',
      dateOfJoining: '2021-01-10',
      confirmationDate: '2021-07-10',
      probationPeriod: 6,
      employmentType: 'Permanent',
      employmentStatus: 'On Leave',
      department: 'HR',
      subDepartment: 'Recruitment',
      costCenter: 'HR-001',
      designation: 'HR Specialist',
      grade: 'G4',
      level: 'L2',
      location: 'Chicago',
      workplaceType: 'Office',
      workEmail: 'alex.rivera@company.com',
      extensionNumber: '3456',
      deskLocation: 'Floor 2, Desk 15',
      employeeCategory: 'Staff',
      noticePeriod: 30,
      reportingManager: {
        direct: 'David Wilson',
        functional: 'David Wilson'
      },
      hrBusinessPartner: 'Lisa Anderson'
    },

    jobHistory: [
      {
        id: 1,
        type: 'Previous Experience',
        date: '2018-03-01',
        organisation: 'PeopleFirst Consultancy',
        department: 'HR Operations',
        designation: 'HR Coordinator',
        location: 'Miami',
        manager: 'Susan Baker',
        notes: 'Managed recruitment for entry-level positions',
        salaryChange: 40000,
        endDate: '2020-12-31',
        reasonForLeaving: 'Moved to Chicago for family reasons',
        achievements: 'Reduced hiring time by 25%'
      },
      {
        id: 2,
        type: 'Joining',
        date: '2021-01-10',
        organisation: 'TechCorp Inc.',
        department: 'HR',
        designation: 'HR Specialist',
        location: 'Chicago',
        manager: 'David Wilson',
        notes: 'Joined as HR Specialist focusing on tech recruitment',
        salaryChange: 58000,
        endDate: 'Present',
        reasonForLeaving: 'N/A',
        achievements: 'Hired 50+ engineers in first year'
      }
    ],
    salaryInfo: {
      currentCTC: 58000,
      ctcBreakdown: {
        basic: 34800,
        hra: 17400,
        specialAllowance: 3800,
        transportAllowance: 700,
        medicalAllowance: 1000,
        otherAllowances: 300,
        providentFund: 4176,
        gratuity: 725,
        otherDeductions: 350
      },
      salaryStructure: 'Standard',
      bankAccounts: {
        primary: {
          accountNumber: '3456789012',
          ifscCode: 'BANK0003456',
          bankName: 'Bank of America',
          branch: 'Chicago Loop',
          accountType: 'Savings'
        }
      },
      paymentMode: 'Bank Transfer',
      pfAccountNumber: 'PF345678',
      uan: 'UAN345678901',
      esiNumber: 'ESI345678',
      esiMedicalNominee: 'Maria Rivera',
      taxDeclaration: {
        regime: 'New',
        declared: true
      },
      variablePay: {
        eligible: false,
        percentage: 0
      },
      bonusEligibility: {
        eligible: true,
        amount: 3000
      }
    },

    statutoryInfo: {
      pan: {
        number: 'CDEFG3456H',
        verified: true,
        verifiedDate: '2021-01-10'
      },
      aadhaar: {
        number: '3456 7890 1234',
        verified: true,
        verifiedDate: '2021-01-10'
      },
      pfMembership: {
        enrolled: true,
        accountNumber: 'PF345678',
        uan: 'UAN345678901',
        enrollmentDate: '2021-01-10'
      },
      esiRegistration: {
        enrolled: true,
        number: 'ESI345678',
        enrollmentDate: '2021-01-10'
      }
    }
  }),
  
 
]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editEmployeeData, setEditEmployeeData] = useState(null);
  const [activeEditTab, setActiveEditTab] = useState('personal');
    const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    location: 'New York',
    employmentType: 'Full-time',
    salary: '',
    // Personal Info
    personalInfo: {
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      maritalStatus: '',
      nationality: '',
      languages: [],
      personalEmail: '',
      phonePrimary: '',
      phoneSecondary: '',
      phoneEmergency: '',
      profilePhoto: '',
      currentAddress: { line1: '', line2: '', city: '', state: '', pincode: '', country: '' },
      permanentAddress: { line1: '', line2: '', city: '', state: '', pincode: '', country: '' },
      emergencyContacts: [],
      familyMembers: [],
      nominees: [],
      identification: { 
        aadhaar: { number: '', document: '' }, 
        pan: { number: '', document: '' }, 
        passport: { number: '', expiryDate: '' }, 
        voterId: { number: '' } 
      }
    },
    // Employment Info
    employmentInfo: {
      dateOfJoining: new Date().toISOString().split('T')[0],
      confirmationDate: '',
      probationPeriod: 6,
      employmentType: 'Permanent',
      employmentStatus: 'Active',
      department: 'Engineering',
      subDepartment: '',
      costCenter: '',
      designation: '',
      grade: '',
      level: '',
      location: 'New York',
      workplaceType: 'Office',
      workEmail: '',
      extensionNumber: '',
      deskLocation: '',
      employeeCategory: 'Staff',
      noticePeriod: 30,
      reportingManager: { direct: '', functional: '' },
      hrBusinessPartner: ''
    },
    // Salary Info
    salaryInfo: {
      currentCTC: '',
      ctcBreakdown: { basic: '', hra: '', specialAllowance: '', transportAllowance: '', medicalAllowance: '', otherAllowances: '', providentFund: '', gratuity: '', otherDeductions: '' },
      salaryStructure: '',
      bankAccounts: { primary: { accountNumber: '', ifscCode: '', bankName: '', branch: '', accountType: 'Savings' } },
      paymentMode: 'Bank Transfer',
      pfAccountNumber: '',
      uan: '',
      esiNumber: '',
      taxDeclaration: { regime: 'New', declared: false },
      variablePay: { eligible: false, percentage: 0 }
    },
    // Statutory Info
    statutoryInfo: {
      pan: { number: '', verified: false },
      aadhaar: { number: '', verified: false },
      pfMembership: { enrolled: false, accountNumber: '', uan: '', enrollmentDate: '' },
      esiRegistration: { enrolled: false, number: '', enrollmentDate: '' },
      professionalTax: { applicable: false, state: '', ptNumber: '' },
      labourWelfareFund: { enrolled: false },
      gratuity: { eligible: false },
      bonusAct: { applicable: false },
      shopsAndEstablishment: { registered: false, registrationNumber: '', registrationDate: '' }
    }
  });
  const itemsPerPage = 6;

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => {
      const status = (emp.employmentInfo || {}).employmentStatus || emp.status;
      return status === 'Active';
    }).length;
    const departments = [...new Set(employees.map(emp => {
      return (emp.employmentInfo || {}).department || emp.department || '';
    }).filter(d => d))];
    const avgSalary = employees.reduce((sum, emp) => {
      const salary = (emp.salaryInfo || {}).currentCTC || emp.salary || 0;
      return sum + salary;
    }, 0) / totalEmployees;
    const recentJoin = employees
      .sort((a, b) => {
        const dateA = (a.employmentInfo || {}).dateOfJoining || a.joinDate || '';
        const dateB = (b.employmentInfo || {}).dateOfJoining || b.joinDate || '';
        return new Date(dateB) - new Date(dateA);
      })[0]?.employmentInfo?.dateOfJoining || employees[0]?.joinDate || 'N/A';

    return {
      totalEmployees: totalEmployees,
      activeEmployees: activeEmployees,
      departments: departments.length,
      avgSalary: avgSalary,
      recentJoin: recentJoin
    };
  }, [employees]);

  // Filter and search
const filteredData = useMemo(() => {
  return employees.filter(emp => {
    const empInfo = emp.employmentInfo || {};
    const personalInfo = emp.personalInfo || {};
    
    // Search in multiple fields including personal email
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (empInfo.workEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (personalInfo.personalEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (empInfo.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'All' || (empInfo.department || emp.department || '') === departmentFilter;
    const matchesStatus = statusFilter === 'All' || (empInfo.employmentStatus || emp.status || '') === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });
}, [employees, searchTerm, departmentFilter, statusFilter]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aVal, bVal;

      // Handle different field mappings for new structure
      if (sortConfig.key === 'salary') {
        aVal = (a.salaryInfo || {}).currentCTC || a.salary || 0;
        bVal = (b.salaryInfo || {}).currentCTC || b.salary || 0;
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (sortConfig.key === 'joinDate') {
        aVal = (a.employmentInfo || {}).dateOfJoining || a.joinDate || '';
        bVal = (b.employmentInfo || {}).dateOfJoining || b.joinDate || '';
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (sortConfig.key === 'department') {
        aVal = (a.employmentInfo || {}).department || a.department || '';
        bVal = (b.employmentInfo || {}).department || b.department || '';
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      } else if (sortConfig.key === 'status') {
        aVal = (a.employmentInfo || {}).employmentStatus || a.status || '';
        bVal = (b.employmentInfo || {}).employmentStatus || b.status || '';
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      } else {
        aVal = a[sortConfig.key] || '';
        bVal = b[sortConfig.key] || '';
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique departments for filter
  const departments = ['All', ...new Set(employees.map(emp => {
    const empInfo = emp.employmentInfo || {};
    return empInfo.department || emp.department || '';
  }).filter(d => d))];
  const statuses = ['All', 'Active', 'On Leave', 'Inactive', 'Resigned', 'Terminated', 'On-Hold'];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-success-subtle text-success ',
      'On Leave': 'bg-warning-subtle text-warning',
      'Inactive': 'bg-danger-subtle text-danger',
      'Resigned': 'bg-secondary-subtle text-secondary',
      'Terminated': 'bg-danger-subtle text-danger',
      'On-Hold': 'bg-info-subtle text-info'
    };

    const icons = {
      'Active': 'heroicons:check-circle',
      'On Leave': 'heroicons:clock',
      'Inactive': 'heroicons:x-circle',
      'Resigned': 'heroicons:arrow-right-on-rectangle',
      'Terminated': 'heroicons:x-mark',
      'On-Hold': 'heroicons:pause-circle'
    };

    return (
      <span className={`badge d-flex align-items-center ${styles[status] || 'bg-secondary-subtle text-secondary'}`}>
        <Icon icon={icons[status] || 'heroicons:question-mark-circle'} className="me-1" />
        {status}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type) => {
    const styles = {
      'Full-time': 'bg-primary-subtle text-primary',
      'Contract': 'bg-info-subtle text-info',
      'Part-time': 'bg-secondary-subtle text-secondary',
      'Intern': 'bg-light text-dark'
    };

    return (
      <span className={`badge ${styles[type]}`}>
        {type}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedEmployee(null);
    setActiveDetailTab('personal');
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
      if (selectedEmployee?.id === id) {
        handleBackToList();
      }
    }
  };

const handleAddEmployee = () => {
  // Validate required fields
  if (!newEmployee.name || !newEmployee.email || !newEmployee.employmentInfo.designation) {
    alert('Please fill in all required fields (Name, Email, and Designation)');
    return;
  }

  const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
  const employeeId = `EMP${String(newId).padStart(3, '0')}`;
  const joinDate = newEmployee.employmentInfo.dateOfJoining || new Date().toISOString().split('T')[0];
  
  // Process job history data from form
  const processedJobHistory = Array.isArray(newEmployee.jobHistory) 
    ? newEmployee.jobHistory
        .filter(history => history.date && history.type) // Filter out incomplete entries
        .map(history => ({
          id: history.id || Date.now(),
          date: history.date,
          type: history.type,
          organisation: history.organisation || '',
          department: history.department || '',
          designation: history.designation || '',
          location: history.location || '',
          manager: history.manager || '',
          salaryChange: parseInt(history.salaryChange) || 0,
          notes: history.notes || '',
          achievements: history.achievements || '',
          reasonForLeaving: history.reasonForLeaving || '',
          endDate: history.endDate || ''
        }))
    : [];
  
  // Process salary revision history
  const processedSalaryRevisionHistory = Array.isArray(newEmployee.salaryInfo?.salaryRevisionHistory) 
    ? newEmployee.salaryInfo.salaryRevisionHistory
        .filter(revision => revision.effectiveDate)
        .map(revision => ({
          id: revision.id || Date.now(),
          effectiveDate: revision.effectiveDate,
          previousCTC: parseInt(revision.previousCTC) || 0,
          newCTC: parseInt(revision.newCTC) || 0,
          percentageIncrease: parseInt(revision.percentageIncrease) || 0,
          approvedBy: revision.approvedBy || '',
          status: revision.status || 'Pending'
        }))
    : [];

  // Process emergency contacts
  const processedEmergencyContacts = Array.isArray(newEmployee.personalInfo?.emergencyContacts)
    ? newEmployee.personalInfo.emergencyContacts
        .filter(contact => contact.name && contact.phone)
        .map(contact => ({
          name: contact.name,
          relation: contact.relation || '',
          phone: contact.phone,
          priority: contact.priority || 'Primary'
        }))
    : [];

  // Process family members
  const processedFamilyMembers = Array.isArray(newEmployee.personalInfo?.familyMembers)
    ? newEmployee.personalInfo.familyMembers
        .filter(member => member.name)
        .map(member => ({
          name: member.name,
          relation: member.relation || '',
          dob: member.dateOfBirth || '',
          contactNo: member.contactNo || ''
        }))
    : [];

  // Process nominees
  const processedNominees = Array.isArray(newEmployee.personalInfo?.nominees)
    ? newEmployee.personalInfo.nominees
        .filter(nominee => nominee.name)
        .map(nominee => ({
          name: nominee.name,
          relation: nominee.relation || '',
           phone: nominee.phone || nominee.contactNo || '', // Ensure 'phone' field
          percentage: parseInt(nominee.percentage) || 0,
          isNomineeAccepted: nominee.isNomineeAccepted || false,
          
        }))
    : [];

  // Calculate total nominee percentage
  const totalNomineePercentage = processedNominees.reduce((sum, nominee) => sum + nominee.percentage, 0);
  if (processedNominees.length > 0 && totalNomineePercentage !== 100) {
    alert(`Total nominee percentage is ${totalNomineePercentage}%. It should be exactly 100%.`);
    return;
  }

  const newEmp = createEmployeeObject({
    id: newId,
    employeeId: employeeId,
    name: newEmployee.name.trim(),
    email: newEmployee.email.trim() || newEmployee.employmentInfo.workEmail?.trim(),
    phone: newEmployee.phone?.trim() || newEmployee.personalInfo?.phonePrimary?.trim() || '',
    salary: parseInt(newEmployee.salaryInfo?.currentCTC || newEmployee.salary || 0) || 0,
    status: newEmployee.employmentInfo?.employmentStatus || 'Active',
    joinDate: joinDate,
    department: newEmployee.employmentInfo?.department || newEmployee.department || 'Engineering',
    designation: newEmployee.employmentInfo?.designation || newEmployee.designation || '',
    location: newEmployee.employmentInfo?.location || newEmployee.location || '',
    employmentType: newEmployee.employmentInfo?.employmentType || newEmployee.employmentType || 'Permanent',
    
    // Personal Info
    personalInfo: {
      dateOfBirth: newEmployee.personalInfo?.dateOfBirth || '',
      gender: newEmployee.personalInfo?.gender || '',
      bloodGroup: newEmployee.personalInfo?.bloodGroup || '',
      maritalStatus: newEmployee.personalInfo?.maritalStatus || '',
      nationality: newEmployee.personalInfo?.nationality || '',
      languages: Array.isArray(newEmployee.personalInfo?.languages) ? newEmployee.personalInfo.languages : [],
      personalEmail: newEmployee.personalInfo?.personalEmail?.trim() || newEmployee.email?.trim() || '',
      phonePrimary: newEmployee.personalInfo?.phonePrimary?.trim() || newEmployee.phone?.trim() || '',
      phoneSecondary: newEmployee.personalInfo?.phoneSecondary?.trim() || '',
      phoneEmergency: newEmployee.personalInfo?.phoneEmergency?.trim() || '',
      currentAddress: {
        line1: newEmployee.personalInfo?.currentAddress?.line1?.trim() || '',
        line2: newEmployee.personalInfo?.currentAddress?.line2?.trim() || '',
        city: newEmployee.personalInfo?.currentAddress?.city?.trim() || '',
        state: newEmployee.personalInfo?.currentAddress?.state?.trim() || '',
        pincode: newEmployee.personalInfo?.currentAddress?.pincode?.trim() || '',
        country: newEmployee.personalInfo?.currentAddress?.country?.trim() || ''
      },
      permanentAddress: {
        line1: newEmployee.personalInfo?.permanentAddress?.line1?.trim() || '',
        line2: newEmployee.personalInfo?.permanentAddress?.line2?.trim() || '',
        city: newEmployee.personalInfo?.permanentAddress?.city?.trim() || '',
        state: newEmployee.personalInfo?.permanentAddress?.state?.trim() || '',
        pincode: newEmployee.personalInfo?.permanentAddress?.pincode?.trim() || '',
        country: newEmployee.personalInfo?.permanentAddress?.country?.trim() || ''
      },
      emergencyContacts: processedEmergencyContacts,
      familyMembers: processedFamilyMembers,
      nominees: processedNominees,
      profilePhoto: newEmployee.personalInfo?.profilePhoto || '',
      identification: {
        aadhaar: {
          number: newEmployee.personalInfo?.identification?.aadhaar?.number?.trim() || '',
          verified: newEmployee.statutoryInfo?.aadhaar?.verified || false,
          document: newEmployee.personalInfo?.identification?.aadhaar?.document || ''
        },
        pan: {
          number: newEmployee.personalInfo?.identification?.pan?.number?.trim() || '',
          verified: newEmployee.statutoryInfo?.pan?.verified || false,
          document: newEmployee.personalInfo?.identification?.pan?.document || ''
        },
        passport: {
          number: newEmployee.personalInfo?.identification?.passport?.number?.trim() || '',
          expiryDate: newEmployee.personalInfo?.identification?.passport?.expiryDate || '',
          verified: newEmployee.personalInfo?.identification?.passport?.verified || false,
          document: newEmployee.personalInfo?.identification?.passport?.document || ''
        },
        voterId: {
          number: newEmployee.personalInfo?.identification?.voterId?.number?.trim() || '',
          verified: newEmployee.personalInfo?.identification?.voterId?.verified || false,
          document: newEmployee.personalInfo?.identification?.voterId?.document || ''
        }
      }
    },
    
    // Employment Info
    employmentInfo: {
      employeeId: employeeId,
      dateOfJoining: joinDate,
      confirmationDate: newEmployee.employmentInfo?.confirmationDate || '',
      probationPeriod: parseInt(newEmployee.employmentInfo?.probationPeriod) || 6,
      employmentType: newEmployee.employmentInfo?.employmentType || 'Permanent',
      employmentStatus: newEmployee.employmentInfo?.employmentStatus || 'Active',
      department: newEmployee.employmentInfo?.department || newEmployee.department || 'Engineering',
      subDepartment: newEmployee.employmentInfo?.subDepartment?.trim() || '',
      costCenter: newEmployee.employmentInfo?.costCenter?.trim() || '',
      designation: newEmployee.employmentInfo?.designation || newEmployee.designation || '',
      grade: newEmployee.employmentInfo?.grade?.trim() || '',
      level: newEmployee.employmentInfo?.level?.trim() || '',
      location: newEmployee.employmentInfo?.location || newEmployee.location || '',
      workplaceType: newEmployee.employmentInfo?.workplaceType || 'Office',
      workEmail: newEmployee.employmentInfo?.workEmail?.trim() || newEmployee.email?.trim() || '',
      extensionNumber: newEmployee.employmentInfo?.extensionNumber?.trim() || '',
      deskLocation: newEmployee.employmentInfo?.deskLocation?.trim() || '',
      employeeCategory: newEmployee.employmentInfo?.employeeCategory || 'Staff',
      noticePeriod: parseInt(newEmployee.employmentInfo?.noticePeriod) || 30,
      reportingManager: {
        direct: newEmployee.employmentInfo?.reportingManager?.direct?.trim() || '',
        functional: newEmployee.employmentInfo?.reportingManager?.functional?.trim() || ''
      },
      hrBusinessPartner: newEmployee.employmentInfo?.hrBusinessPartner?.trim() || ''
    },
    
    // Job History
    jobHistory: processedJobHistory,
    
    // Salary Info
    salaryInfo: {
      currentCTC: parseInt(newEmployee.salaryInfo?.currentCTC || newEmployee.salary || 0) || 0,
      ctcBreakdown: {
        basic: parseInt(newEmployee.salaryInfo?.ctcBreakdown?.basic || 0) || 0,
        hra: parseInt(newEmployee.salaryInfo?.ctcBreakdown?.hra || 0) || 0,
        specialAllowance: parseInt(newEmployee.salaryInfo?.ctcBreakdown?.specialAllowance || 0) || 0,
        transportAllowance: parseInt(newEmployee.salaryInfo?.ctcBreakdown?.transportAllowance || 0) || 0,
        medicalAllowance: parseInt(newEmployee.salaryInfo?.ctcBreakdown?.medicalAllowance || 0) || 0,
        otherAllowances: parseInt(newEmployee.salaryInfo?.ctcBreakdown?.otherAllowances || 0) || 0,
        providentFund: parseInt(newEmployee.salaryInfo?.ctcBreakdown?.providentFund || 0) || 0,
        gratuity: parseInt(newEmployee.salaryInfo?.ctcBreakdown?.gratuity || 0) || 0,
        otherDeductions: parseInt(newEmployee.salaryInfo?.ctcBreakdown?.otherDeductions || 0) || 0
      },
      salaryStructure: newEmployee.salaryInfo?.salaryStructure?.trim() || '',
      bankAccounts: {
        primary: {
          accountNumber: newEmployee.salaryInfo?.bankAccounts?.primary?.accountNumber?.trim() || '',
          ifscCode: newEmployee.salaryInfo?.bankAccounts?.primary?.ifscCode?.trim() || '',
          bankName: newEmployee.salaryInfo?.bankAccounts?.primary?.bankName?.trim() || '',
          branch: newEmployee.salaryInfo?.bankAccounts?.primary?.branch?.trim() || '',
          accountType: newEmployee.salaryInfo?.bankAccounts?.primary?.accountType || 'Savings'
        },
        secondary: newEmployee.salaryInfo?.bankAccounts?.secondary ? {
          accountNumber: newEmployee.salaryInfo.bankAccounts.secondary.accountNumber?.trim() || '',
          ifscCode: newEmployee.salaryInfo.bankAccounts.secondary.ifscCode?.trim() || '',
          bankName: newEmployee.salaryInfo.bankAccounts.secondary.bankName?.trim() || '',
          branch: newEmployee.salaryInfo.bankAccounts.secondary.branch?.trim() || '',
          accountType: newEmployee.salaryInfo.bankAccounts.secondary.accountType || 'Savings'
        } : undefined
      },
      paymentMode: newEmployee.salaryInfo?.paymentMode || 'Bank Transfer',
      pfAccountNumber: newEmployee.salaryInfo?.pfAccountNumber?.trim() || '',
      uan: newEmployee.salaryInfo?.uan?.trim() || '',
      esiNumber: newEmployee.salaryInfo?.esiNumber?.trim() || '',
      esiMedicalNominee: newEmployee.salaryInfo?.esiMedicalNominee?.trim() || '',
      taxDeclaration: {
        regime: newEmployee.salaryInfo?.taxDeclaration?.regime || 'New',
        declared: newEmployee.salaryInfo?.taxDeclaration?.declared || false
      },
      variablePay: {
        eligible: newEmployee.salaryInfo?.variablePay?.eligible || false,
        percentage: parseInt(newEmployee.salaryInfo?.variablePay?.percentage || 0) || 0
      },
      bonusEligibility: {
        eligible: newEmployee.salaryInfo?.bonusEligibility?.eligible || false,
        amount: parseInt(newEmployee.salaryInfo?.bonusEligibility?.amount || 0) || 0
      },
      salaryRevisionHistory: processedSalaryRevisionHistory
    },
    
    // Statutory Info
    statutoryInfo: {
      pan: {
        number: newEmployee.personalInfo?.identification?.pan?.number?.trim() || '',
        verified: newEmployee.statutoryInfo?.pan?.verified || false,
        verifiedDate: newEmployee.statutoryInfo?.pan?.verifiedDate || ''
      },
      aadhaar: {
        number: newEmployee.personalInfo?.identification?.aadhaar?.number?.trim() || '',
        verified: newEmployee.statutoryInfo?.aadhaar?.verified || false,
        verifiedDate: newEmployee.statutoryInfo?.aadhaar?.verifiedDate || ''
      },
      pfMembership: {
        enrolled: newEmployee.statutoryInfo?.pfMembership?.enrolled || false,
        accountNumber: newEmployee.statutoryInfo?.pfMembership?.accountNumber?.trim() || '',
        uan: newEmployee.statutoryInfo?.pfMembership?.uan?.trim() || '',
        enrollmentDate: newEmployee.statutoryInfo?.pfMembership?.enrollmentDate || '',
        accountType: newEmployee.statutoryInfo?.pfMembership?.accountType?.trim() || ''
      },
      esiRegistration: {
        enrolled: newEmployee.statutoryInfo?.esiRegistration?.enrolled || false,
        number: newEmployee.statutoryInfo?.esiRegistration?.number?.trim() || '',
        enrollmentDate: newEmployee.statutoryInfo?.esiRegistration?.enrollmentDate || ''
      },
      professionalTax: {
        applicable: newEmployee.statutoryInfo?.professionalTax?.applicable || false,
        state: newEmployee.statutoryInfo?.professionalTax?.state?.trim() || '',
        ptNumber: newEmployee.statutoryInfo?.professionalTax?.ptNumber?.trim() || ''
      },
      labourWelfareFund: {
        enrolled: newEmployee.statutoryInfo?.labourWelfareFund?.enrolled || false,
        enrollmentDate: newEmployee.statutoryInfo?.labourWelfareFund?.enrollmentDate || ''
      },
      gratuity: {
        eligible: newEmployee.statutoryInfo?.gratuity?.eligible || false,
        eligibilityDate: newEmployee.statutoryInfo?.gratuity?.eligibilityDate || ''
      },
      bonusAct: {
        applicable: newEmployee.statutoryInfo?.bonusAct?.applicable || false
      },
      shopsAndEstablishment: {
        registered: newEmployee.statutoryInfo?.shopsAndEstablishment?.registered || false,
        registrationNumber: newEmployee.statutoryInfo?.shopsAndEstablishment?.registrationNumber?.trim() || '',
        registrationDate: newEmployee.statutoryInfo?.shopsAndEstablishment?.registrationDate || ''
      }
    }
  });
  
  // Add the new employee
  setEmployees([...employees, newEmp]);
  
  // Close modal and reset
  setShowAddModal(false);
  setActiveAddTab('personal');
  
  // Show success message
  alert(`Employee ${newEmp.name} added successfully! Employee ID: ${newEmp.employeeId}`);
  
  // Reset form with proper defaults
  resetNewEmployeeForm();
};

// Helper function to reset the form
const resetNewEmployeeForm = () => {
  setNewEmployee({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    location: '',
    employmentType: 'Full-time',
    salary: '',
    jobHistory: [],
    personalInfo: {
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      maritalStatus: '',
      nationality: '',
      languages: [],
      personalEmail: '',
      phonePrimary: '',
      phoneSecondary: '',
      phoneEmergency: '',
      profilePhoto: '',
      currentAddress: { 
        line1: '', line2: '', city: '', state: '', pincode: '', country: '' 
      },
      permanentAddress: { 
        line1: '', line2: '', city: '', state: '', pincode: '', country: '' 
      },
      emergencyContacts: [],
      familyMembers: [],
      nominees: [],
      identification: { 
        aadhaar: { number: '', document: '', verified: false }, 
        pan: { number: '', document: '', verified: false }, 
        passport: { number: '', expiryDate: '', verified: false, document: '' }, 
        voterId: { number: '', verified: false, document: '' } 
      }
    },
    employmentInfo: {
      employeeId: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
      confirmationDate: '',
      probationPeriod: 6,
      employmentType: 'Permanent',
      employmentStatus: 'Active',
      department: 'Engineering',
      subDepartment: '',
      costCenter: '',
      designation: '',
      grade: '',
      level: '',
      location: '',
      workplaceType: 'Office',
      workEmail: '',
      extensionNumber: '',
      deskLocation: '',
      employeeCategory: 'Staff',
      noticePeriod: 30,
      reportingManager: { direct: '', functional: '' },
      hrBusinessPartner: ''
    },
    salaryInfo: {
      currentCTC: '',
      ctcBreakdown: { 
        basic: '', hra: '', specialAllowance: '', transportAllowance: '', 
        medicalAllowance: '', otherAllowances: '', providentFund: '', 
        gratuity: '', otherDeductions: '' 
      },
      salaryStructure: '',
      bankAccounts: { 
        primary: { 
          accountNumber: '', ifscCode: '', bankName: '', branch: '', accountType: 'Savings' 
        } 
      },
      paymentMode: 'Bank Transfer',
      pfAccountNumber: '',
      uan: '',
      esiNumber: '',
      esiMedicalNominee: '',
      taxDeclaration: { regime: 'New', declared: false },
      variablePay: { eligible: false, percentage: 0 },
      bonusEligibility: { eligible: false, amount: 0 },
      salaryRevisionHistory: []
    },
    statutoryInfo: {
      pan: { number: '', verified: false, verifiedDate: '' },
      aadhaar: { number: '', verified: false, verifiedDate: '' },
      pfMembership: { enrolled: false, accountNumber: '', uan: '', enrollmentDate: '', accountType: '' },
      esiRegistration: { enrolled: false, number: '', enrollmentDate: '' },
      professionalTax: { applicable: false, state: '', ptNumber: '' },
      labourWelfareFund: { enrolled: false, enrollmentDate: '' },
      gratuity: { eligible: false, eligibilityDate: '' },
      bonusAct: { applicable: false },
      shopsAndEstablishment: { registered: false, registrationNumber: '', registrationDate: '' }
    }
  });
};

  const exportToCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Location', 'Employment Type', 'Status', 'Salary', 'Join Date'];
    const csvData = [headers];

    sortedData.forEach(record => {
      const empInfo = record.employmentInfo || {};
      const salaryInfo = record.salaryInfo || {};
      csvData.push([
        empInfo.employeeId || record.employeeId,
        record.name,
        empInfo.workEmail || record.email,
        record.personalInfo?.phonePrimary || record.phone,
        empInfo.department || record.department,
        empInfo.designation || record.designation,
        empInfo.location || record.location,
        empInfo.employmentType || record.employmentType,
        empInfo.employmentStatus || record.status,
        formatCurrency(salaryInfo.currentCTC || record.salary || 0),
        formatDate(empInfo.dateOfJoining || record.joinDate)
      ]);
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee_master_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setDepartmentFilter('All');
    setStatusFilter('All');
    setSortConfig({ key: 'name', direction: 'asc' });
    alert('Employee data refreshed successfully!');
  };

  // Handle save edited employee
const handleSaveEditedEmployee = () => {
  if (!editEmployeeData || !editingEmployee) return;

  // Create a properly formatted employee object using createEmployeeObject
  const updatedEmployee = createEmployeeObject({
    id: editingEmployee.id,
    name: editEmployeeData.name,
    email: editEmployeeData.email,
    phone: editEmployeeData.phone,
    salary: editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary,
    status: editEmployeeData.employmentInfo?.employmentStatus || editEmployeeData.status,
    joinDate: editEmployeeData.employmentInfo?.dateOfJoining || editEmployeeData.joinDate,
    department: editEmployeeData.employmentInfo?.department || editEmployeeData.department,
    designation: editEmployeeData.employmentInfo?.designation || editEmployeeData.designation,
    location: editEmployeeData.employmentInfo?.location || editEmployeeData.location,
    employmentType: editEmployeeData.employmentInfo?.employmentType || editEmployeeData.employmentType,
    employeeId: editEmployeeData.employmentInfo?.employeeId || editEmployeeData.employeeId,
    
    // Pass all the nested data
    personalInfo: editEmployeeData.personalInfo,
    employmentInfo: editEmployeeData.employmentInfo,
    jobHistory: editEmployeeData.jobHistory,
    nominees: editEmployeeData.personalInfo?.nominees || [],
    salaryInfo: editEmployeeData.salaryInfo,
    statutoryInfo: editEmployeeData.statutoryInfo
  });

  // Update the employees array
  setEmployees(prevEmployees => 
    prevEmployees.map(emp => 
      emp.id === editingEmployee.id ? updatedEmployee : emp
    )
  );

  // Update selected employee if it's the same one
  if (selectedEmployee?.id === editingEmployee.id) {
    setSelectedEmployee(updatedEmployee);
  }

  // Reset all edit states
  setShowEditModal(false);
  setEditingEmployee(null);
  setEditEmployeeData(null);
  setActiveEditTab('personal');
  
  alert('Employee updated successfully!');
};

// Handle input change in edit form (reuse existing setNewEmployee logic)
const handleEditInputChange = (field, value, nestedPath = null) => {
  setEditEmployeeData(prev => {
    const newData = { ...prev };
    
    if (nestedPath) {
      // Handle nested paths like 'personalInfo.dateOfBirth'
      const pathParts = nestedPath.split('.');
      let current = newData;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      // Handle boolean values from select inputs
      const lastKey = pathParts[pathParts.length - 1];
      if (value === 'true' || value === 'false') {
        current[lastKey] = value === 'true';
      } else {
        current[lastKey] = value;
      }
    } else {
      // Handle top-level fields
      newData[field] = value;
    }
    
    return newData;
  });
};

// Handle array field updates in edit form
const handleEditArrayUpdate = (arrayPath, index, field, value) => {
  setEditEmployeeData(prev => {
    const newData = { ...prev };
    const pathParts = arrayPath.split('.');
    let current = newData;
    
    // Navigate to the array
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    const arrayField = pathParts[pathParts.length - 1];
    if (!current[arrayField]) {
      current[arrayField] = [];
    }
    
    // Update the specific item in the array
    if (Array.isArray(current[arrayField]) && current[arrayField][index]) {
      const updatedArray = [...current[arrayField]];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      current[arrayField] = updatedArray;
    }
    
    return newData;
  });
};

// Handle add new item to array in edit form
const handleEditAddToArray = (path, newItem) => {
  setEditEmployeeData(prev => {
    // Deep clone the previous state
    const newData = JSON.parse(JSON.stringify(prev));
    
    // Navigate to the path and add the new item
    const keys = path.split('.');
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    if (!Array.isArray(current[lastKey])) {
      current[lastKey] = [];
    }
    
    current[lastKey] = [...current[lastKey], newItem];
    
    return newData;
  });
};
// Handle remove item from array in edit form
const handleEditRemoveFromArray = (arrayPath, index) => {
  setEditEmployeeData(prev => {
    const newData = { ...prev };
    const pathParts = arrayPath.split('.');
    let current = newData;
    
    // Navigate to the array
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    const arrayField = pathParts[pathParts.length - 1];
    if (Array.isArray(current[arrayField])) {
      const updatedArray = current[arrayField].filter((_, i) => i !== index);
      current[arrayField] = updatedArray;
    }
    
    return newData;
  });
};


// Cancel edit
const handleCancelEdit = () => {
  setShowEditModal(false);
  setEditingEmployee(null);
  setEditEmployeeData(null);
  setActiveEditTab('personal');
};
  // Handle edit button click
const handleEditEmployee = (employee) => {
  setEditingEmployee(employee);
  
  // Create a deep copy of the employee data for editing
  const employeeData = JSON.parse(JSON.stringify(employee));
  
  // Ensure all nested structures exist with proper defaults
  const processedData = {
    id: employeeData.id,
    name: employeeData.name || '',
    email: employeeData.email || employeeData.employmentInfo?.workEmail || '',
    phone: employeeData.phone || employeeData.personalInfo?.phonePrimary || '',
    salary: employeeData.salary || employeeData.salaryInfo?.currentCTC || 0,
    department: employeeData.department || employeeData.employmentInfo?.department || '',
    designation: employeeData.designation || employeeData.employmentInfo?.designation || '',
    location: employeeData.location || employeeData.employmentInfo?.location || '',
    employmentType: employeeData.employmentType || employeeData.employmentInfo?.employmentType || 'Permanent',
    status: employeeData.status || employeeData.employmentInfo?.employmentStatus || 'Active',
    joinDate: employeeData.joinDate || employeeData.employmentInfo?.dateOfJoining || '',
    employeeId: employeeData.employeeId || employeeData.employmentInfo?.employeeId || '',
    
    // Ensure all nested objects exist
    personalInfo: {
      dateOfBirth: employeeData.personalInfo?.dateOfBirth || '',
      gender: employeeData.personalInfo?.gender || '',
      bloodGroup: employeeData.personalInfo?.bloodGroup || '',
      maritalStatus: employeeData.personalInfo?.maritalStatus || '',
      nationality: employeeData.personalInfo?.nationality || '',
      languages: employeeData.personalInfo?.languages || [],
      personalEmail: employeeData.personalInfo?.personalEmail || employeeData.email || '',
      phonePrimary: employeeData.personalInfo?.phonePrimary || employeeData.phone || '',
      phoneSecondary: employeeData.personalInfo?.phoneSecondary || '',
      phoneEmergency: employeeData.personalInfo?.phoneEmergency || '',
      profilePhoto: employeeData.personalInfo?.profilePhoto || '',
      currentAddress: employeeData.personalInfo?.currentAddress || { 
        line1: '', line2: '', city: '', state: '', pincode: '', country: '' 
      },
      permanentAddress: employeeData.personalInfo?.permanentAddress || { 
        line1: '', line2: '', city: '', state: '', pincode: '', country: '' 
      },
      emergencyContacts: employeeData.personalInfo?.emergencyContacts || [],
      familyMembers: employeeData.personalInfo?.familyMembers || [],
      nominees: employeeData.personalInfo?.nominees || [],
      identification: {
        aadhaar: { 
          number: employeeData.personalInfo?.identification?.aadhaar?.number || '',
          verified: employeeData.personalInfo?.identification?.aadhaar?.verified || false,
          document: employeeData.personalInfo?.identification?.aadhaar?.document || ''
        },
        pan: { 
          number: employeeData.personalInfo?.identification?.pan?.number || '',
          verified: employeeData.personalInfo?.identification?.pan?.verified || false,
          document: employeeData.personalInfo?.identification?.pan?.document || ''
        },
        passport: { 
          number: employeeData.personalInfo?.identification?.passport?.number || '',
          expiryDate: employeeData.personalInfo?.identification?.passport?.expiryDate || '',
          verified: employeeData.personalInfo?.identification?.passport?.verified || false,
          document: employeeData.personalInfo?.identification?.passport?.document || ''
        },
        voterId: { 
          number: employeeData.personalInfo?.identification?.voterId?.number || '',
          verified: employeeData.personalInfo?.identification?.voterId?.verified || false,
          document: employeeData.personalInfo?.identification?.voterId?.document || ''
        }
      }
    },
    
    employmentInfo: {
      employeeId: employeeData.employmentInfo?.employeeId || employeeData.employeeId || '',
      dateOfJoining: employeeData.employmentInfo?.dateOfJoining || employeeData.joinDate || '',
      confirmationDate: employeeData.employmentInfo?.confirmationDate || '',
      probationPeriod: employeeData.employmentInfo?.probationPeriod || 6,
      employmentType: employeeData.employmentInfo?.employmentType || employeeData.employmentType || 'Permanent',
      employmentStatus: employeeData.employmentInfo?.employmentStatus || employeeData.status || 'Active',
      department: employeeData.employmentInfo?.department || employeeData.department || '',
      subDepartment: employeeData.employmentInfo?.subDepartment || '',
      costCenter: employeeData.employmentInfo?.costCenter || '',
      designation: employeeData.employmentInfo?.designation || employeeData.designation || '',
      grade: employeeData.employmentInfo?.grade || '',
      level: employeeData.employmentInfo?.level || '',
      location: employeeData.employmentInfo?.location || employeeData.location || '',
      workplaceType: employeeData.employmentInfo?.workplaceType || 'Office',
      workEmail: employeeData.employmentInfo?.workEmail || employeeData.email || '',
      extensionNumber: employeeData.employmentInfo?.extensionNumber || '',
      deskLocation: employeeData.employmentInfo?.deskLocation || '',
      employeeCategory: employeeData.employmentInfo?.employeeCategory || 'Staff',
      noticePeriod: employeeData.employmentInfo?.noticePeriod || 30,
      reportingManager: employeeData.employmentInfo?.reportingManager || { direct: '', functional: '' },
      hrBusinessPartner: employeeData.employmentInfo?.hrBusinessPartner || ''
    },
    
    jobHistory: employeeData.jobHistory || [],
    
    salaryInfo: {
      currentCTC: employeeData.salaryInfo?.currentCTC || employeeData.salary || 0,
      ctcBreakdown: employeeData.salaryInfo?.ctcBreakdown || {
        basic: 0, hra: 0, specialAllowance: 0, transportAllowance: 0, 
        medicalAllowance: 0, otherAllowances: 0, providentFund: 0, 
        gratuity: 0, otherDeductions: 0
      },
      salaryStructure: employeeData.salaryInfo?.salaryStructure || '',
      bankAccounts: employeeData.salaryInfo?.bankAccounts || {
        primary: { accountNumber: '', ifscCode: '', bankName: '', branch: '', accountType: 'Savings' }
      },
      paymentMode: employeeData.salaryInfo?.paymentMode || 'Bank Transfer',
      pfAccountNumber: employeeData.salaryInfo?.pfAccountNumber || '',
      uan: employeeData.salaryInfo?.uan || '',
      esiNumber: employeeData.salaryInfo?.esiNumber || '',
      esiMedicalNominee: employeeData.salaryInfo?.esiMedicalNominee || '',
      taxDeclaration: employeeData.salaryInfo?.taxDeclaration || { regime: 'New', declared: false },
      variablePay: employeeData.salaryInfo?.variablePay || { eligible: false, percentage: 0 },
      bonusEligibility: employeeData.salaryInfo?.bonusEligibility || { eligible: false, amount: 0 },
      salaryRevisionHistory: employeeData.salaryInfo?.salaryRevisionHistory || []
    },
    
    statutoryInfo: {
      pan: {
        number: employeeData.statutoryInfo?.pan?.number || employeeData.personalInfo?.identification?.pan?.number || '',
        verified: employeeData.statutoryInfo?.pan?.verified || false,
        verifiedDate: employeeData.statutoryInfo?.pan?.verifiedDate || ''
      },
      aadhaar: {
        number: employeeData.statutoryInfo?.aadhaar?.number || employeeData.personalInfo?.identification?.aadhaar?.number || '',
        verified: employeeData.statutoryInfo?.aadhaar?.verified || false,
        verifiedDate: employeeData.statutoryInfo?.aadhaar?.verifiedDate || ''
      },
      pfMembership: {
        enrolled: employeeData.statutoryInfo?.pfMembership?.enrolled || false,
        accountNumber: employeeData.statutoryInfo?.pfMembership?.accountNumber || '',
        uan: employeeData.statutoryInfo?.pfMembership?.uan || '',
        enrollmentDate: employeeData.statutoryInfo?.pfMembership?.enrollmentDate || '',
        accountType: employeeData.statutoryInfo?.pfMembership?.accountType || ''
      },
      esiRegistration: {
        enrolled: employeeData.statutoryInfo?.esiRegistration?.enrolled || false,
        number: employeeData.statutoryInfo?.esiRegistration?.number || '',
        enrollmentDate: employeeData.statutoryInfo?.esiRegistration?.enrollmentDate || ''
      },
      professionalTax: {
        applicable: employeeData.statutoryInfo?.professionalTax?.applicable || false,
        state: employeeData.statutoryInfo?.professionalTax?.state || '',
        ptNumber: employeeData.statutoryInfo?.professionalTax?.ptNumber || ''
      },
      labourWelfareFund: {
        enrolled: employeeData.statutoryInfo?.labourWelfareFund?.enrolled || false,
        enrollmentDate: employeeData.statutoryInfo?.labourWelfareFund?.enrollmentDate || ''
      },
      gratuity: {
        eligible: employeeData.statutoryInfo?.gratuity?.eligible || false,
        eligibilityDate: employeeData.statutoryInfo?.gratuity?.eligibilityDate || ''
      },
      bonusAct: {
        applicable: employeeData.statutoryInfo?.bonusAct?.applicable || false
      },
      shopsAndEstablishment: {
        registered: employeeData.statutoryInfo?.shopsAndEstablishment?.registered || false,
        registrationNumber: employeeData.statutoryInfo?.shopsAndEstablishment?.registrationNumber || '',
        registrationDate: employeeData.statutoryInfo?.shopsAndEstablishment?.registrationDate || ''
      }
    }
  };
  
  setEditEmployeeData(processedData);
  setShowEditModal(true);
  setActiveEditTab('personal');
};



  return (

    <div className="container-fluid">
      {/* Header */}
      <div className="mb-4">
         <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2"> 
            <Icon icon="heroicons:user-group" />
          Employee Master Data
        </h5>
        <p className="text-muted">
          Manage all employee information, profiles, and employment details in one place.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-row">
  {[
    {
      title: "Total Employees",
      value: kpis.totalEmployees,
      icon: "heroicons:users",
      bg: "kpi-primary",
      color: "kpi-primary-text",
    },
    {
      title: "Active Employees",
      value: kpis.activeEmployees,
      icon: "heroicons:check-circle",
      bg: "kpi-success",
      color: "kpi-success-text",
    },
    {
      title: "Departments",
      value: kpis.departments,
      icon: "heroicons:building-office",
      bg: "kpi-info",
      color: "kpi-info-text",
    },
    {
      title: "Avg. Salary",
      value: formatCurrency(kpis.avgSalary),
      icon: "heroicons:currency-dollar",
      bg: "kpi-warning",
      color: "kpi-warning-text",
    },
  ].map((item, index) => (
    <div className="kpi-col" key={index}>
      <div className="kpi-card">
        <div className="kpi-card-body">

          {/* Icon */}
          <div className={`kpi-icon ${item.bg}`}>
            <Icon icon={item.icon} className={`kpi-icon-style ${item.color}`} />
          </div>

          {/* Content */}
          <div className="kpi-content">
            <div className="kpi-title">
              {item.title}
            </div>

            <div className="kpi-value">
              {item.value}
            </div>
          </div>

        </div>
      </div>
    </div>
  ))}
</div>


      {/* Filters and Search */}
      <div className="card border shadow-none mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            {/* Search */}
<div className="position-relative flex-fill" style={{ minWidth: '300px' }}>
  <Icon
    icon="heroicons:magnifying-glass"
    className="position-absolute top-50 translate-middle-y text-muted ms-3"
    style={{ pointerEvents: 'none' }}
  />

  <input
    type="search"
    className="form-control ps-5"
    placeholder="Search by name, email, or employee ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    autoComplete="off"
    name="employee_search"
  />
</div>


            {/* Department Filter */}
            <div style={{ minWidth: '150px' }}>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="form-select"
              >
                <option value="All">All Departments</option>
                {departments.slice(1).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ minWidth: '150px' }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
   <div className="d-flex gap-2">
   <button
  onClick={() => {
    // Reset form to empty state
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      location: '',
      employmentType: 'Full-time',
      salary: '',
      jobHistory: [],
      personalInfo: {
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        maritalStatus: '',
        nationality: '',
        languages: [],
        personalEmail: '',
        phonePrimary: '',
        phoneSecondary: '',
        phoneEmergency: '',
        profilePhoto: '',
        currentAddress: { line1: '', line2: '', city: '', state: '', pincode: '', country: '' },
        permanentAddress: { line1: '', line2: '', city: '', state: '', pincode: '', country: '' },
        emergencyContacts: [],
        familyMembers: [],
        nominees: [],
        identification: { 
          aadhaar: { number: '', document: '' }, 
          pan: { number: '', document: '' }, 
          passport: { number: '', expiryDate: '', verified: false, document: '' }, 
          voterId: { number: '', verified: false, document: '' } 
        }
      },
      employmentInfo: {
        employeeId: '',
        dateOfJoining: new Date().toISOString().split('T')[0],
        confirmationDate: '',
        probationPeriod: 6,
        employmentType: '',
        employmentStatus: 'Active',
        department: '',
        subDepartment: '',
        costCenter: '',
        designation: '',
        grade: '',
        level: '',
        location: '',
        workplaceType: '',
        workEmail: '',
        extensionNumber: '',
        deskLocation: '',
        employeeCategory: '',
        noticePeriod: 30,
        reportingManager: { direct: '', functional: '' },
        hrBusinessPartner: ''
      },
      salaryInfo: {
        currentCTC: '',
        ctcBreakdown: { 
          basic: '', hra: '', specialAllowance: '', transportAllowance: '', 
          medicalAllowance: '', otherAllowances: '', providentFund: '', 
          gratuity: '', otherDeductions: '' 
        },
        salaryStructure: '',
        bankAccounts: { 
          primary: { accountNumber: '', ifscCode: '', bankName: '', branch: '', accountType: 'Savings' } 
        },
        paymentMode: 'Bank Transfer',
        pfAccountNumber: '',
        uan: '',
        esiNumber: '',
        esiMedicalNominee: '',
        taxDeclaration: { regime: 'New', declared: false },
        variablePay: { eligible: false, percentage: 0 },
        bonusEligibility: { eligible: false, amount: 0 },
        salaryRevisionHistory: []
      },
      statutoryInfo: {
        pan: { number: '', verified: false, verifiedDate: '' },
        aadhaar: { number: '', verified: false, verifiedDate: '' },
        pfMembership: { enrolled: false, accountNumber: '', uan: '', enrollmentDate: '', accountType: '' },
        esiRegistration: { enrolled: false, number: '', enrollmentDate: '' },
        professionalTax: { applicable: false, state: '', ptNumber: '' },
        labourWelfareFund: { enrolled: false, enrollmentDate: '' },
        gratuity: { eligible: false, eligibilityDate: '' },
        bonusAct: { applicable: false },
        shopsAndEstablishment: { registered: false, registrationNumber: '', registrationDate: '' }
      }
    });
    
    // Reset active tab to personal
    setActiveAddTab('personal');
    
    // Open modal
    setShowAddModal(true);
  }}
  className="btn btn-success d-flex align-items-center"
>
  <Icon icon="heroicons:user-plus" className="me-2" />
  Add Employee
</button>
                <button
                  onClick={exportToCSV}
                  className="btn btn-primary d-flex align-items-center"
                >
                  <Icon icon="heroicons:document-arrow-down" className="me-2" />
                  Export CSV
                </button>
              </div>
          </div>
        </div>
      </div>

      {/* Employees Table - Only show when not viewing details */}
{!showDetailView && (
  <div className="card border shadow-none">
    <div className="card-header bg-transparent border-0">
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="mb-2 mb-md-0 fw-bold fs-4">Employee Records</h6>
        <div className="d-flex gap-2">
          <button 
            onClick={refreshData}
            className="btn btn-outline-primary d-flex align-items-center gap-2"
          >
            <Icon icon="heroicons:arrow-path" />
            Refresh
          </button>
        </div>
      </div>
    </div>
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th 
                className="border-0  px-5 py-7 text-uppercase fw-bold text-black cursor-pointer"
                onClick={() => handleSort('name')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-2">
                  Employee
                  <Icon 
                    icon={`heroicons:chevron-${sortConfig.key === 'name' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} 
                    className="small" 
                  />
                </div>
              </th>
              <th 
                className="border-0 px-3 py-3 text-uppercase fw-bold text-black cursor-pointer text-center"
                onClick={() => handleSort('department')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center justify-content-center gap-2">
                  Department
                  <Icon 
                    icon={`heroicons:chevron-${sortConfig.key === 'department' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} 
                    className="small" 
                  />
                </div>
              </th>
              <th className="border-0 px-3 py-3 text-uppercase fw-bold text-black text-center">Contact</th>

              <th className="border-0 px-3 py-3 text-uppercase fw-bold text-black text-center">Status</th>
              <th className="border-0 px-3 py-3 text-uppercase fw-bold text-black text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((employee) => (
              <tr key={employee.id} className="border-bottom">
                <td className="px-4 py-3">
                  <div className="d-flex align-items-center">
                    {/* Profile Photo Display */}
                    {employee.personalInfo?.profilePhoto ? (
                      <div className="position-relative me-3">
                        <img 
                          src={employee.personalInfo.profilePhoto} 
                          alt={employee.name}
                          className="rounded-circle border"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover',
                            backgroundColor: '#f8f9fa'
                          }}
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-40-px h-40-px bg-light rounded-circle d-flex align-items-center justify-content-center">
                                <span class="text-muted">${employee.name.charAt(0)}</span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-40-px h-40-px bg-light rounded-circle d-flex align-items-center justify-content-center me-3">
                        {/* Initials as fallback */}
                        <span className="text-muted fw-medium">
                          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="fw-medium text-dark">{employee.name}</div>
                      <div className="small text-muted">
                        {(employee.employmentInfo || {}).employeeId || employee.employeeId} • {(employee.employmentInfo || {}).designation || employee.designation}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div>{(employee.employmentInfo || {}).department || employee.department}</div>
                  <div className="small text-muted">{(employee.employmentInfo || {}).location || employee.location}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div>{employee.email || (employee.employmentInfo || {}).workEmail}</div>
                  <div className="small text-muted">{employee.phone || (employee.personalInfo || {}).phonePrimary}</div>
                </td>
                <td className="px-4 py-3 align-middle text-center" style={{width:"120px"}}>
                  <div className="d-flex justify-content-center">
                    {getStatusBadge((employee.employmentInfo || {}).employmentStatus || employee.status)}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      onClick={() => handleViewDetails(employee)}
                      className="job-listings-btn"
                      title="View Details"
                    >
                      <Icon icon="heroicons:eye" />
                    </button>
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
                      title="Edit Employee"
                    >
                      <Icon icon="heroicons:pencil-square" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                      title="Delete Employee"
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

      {paginatedData.length === 0 && (
        <div className="text-center py-5 text-muted">
          <div className="d-flex justify-content-center mb-2">
            <Icon icon="heroicons:user-group" className="text-4xl" />
          </div>
          <h5>No employees found</h5>
          <p>No records found matching your search criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between">
          <div className="small text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} employees
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-sm btn-outline-secondary"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`btn btn-sm ${
                  currentPage === i + 1
                    ? 'btn-primary'
                    : 'btn-outline-secondary'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-outline-secondary"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}

      {/* Employee Details Inline View */}
      {showDetailView && selectedEmployee && (
        <div className="card border shadow-none mt-4">
          <div className="card-header text-dark">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                {selectedEmployee.personalInfo?.profilePhoto ? (
                  <img
                    src={selectedEmployee.personalInfo.profilePhoto}
                    alt={selectedEmployee.name}
                    className="rounded-circle"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <Icon icon="heroicons:user" className="fs-3" />
                  </div>
                )}
                <div>
                  <h5 className="mb-0 text-dark fw-bold">
                    {selectedEmployee.name}
                  </h5>
                  <small className="text-muted">
                    {(selectedEmployee.employmentInfo || {}).employeeId || selectedEmployee.employeeId} • {(selectedEmployee.employmentInfo || {}).designation || selectedEmployee.designation}
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-light btn-sm d-flex align-items-center gap-2"
                onClick={handleBackToList}
              >
                <Icon icon="heroicons:arrow-left" />
                Back to List
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            {/* Tab Navigation */}
            <ul className="nav nav-tabs border-bottom px-3 pt-3" style={{ flexShrink: 0 }}>
              <li className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center gap-2 ${activeDetailTab === 'personal' ? 'active' : ''
                    }`}
                  onClick={() => setActiveDetailTab('personal')}
                >
                  <Icon icon="heroicons:user-circle" />
                  <span>Personal Info</span>
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center gap-2 ${activeDetailTab === 'employment' ? 'active' : ''
                    }`}
                  onClick={() => setActiveDetailTab('employment')}
                >
                  <Icon icon="heroicons:briefcase" />
                  <span>Employment</span>
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center gap-2 ${activeDetailTab === 'jobHistory' ? 'active' : ''}`}
                  onClick={() => setActiveDetailTab('jobHistory')}
                >
                  <Icon icon="heroicons:clock" className="me-2" />
                  Service History
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center gap-2 ${activeDetailTab === 'salary' ? 'active' : ''}`}
                  onClick={() => setActiveDetailTab('salary')}
                >
                  <Icon icon="heroicons:currency-dollar" className="me-2" />
                  Salary & Compensation
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center gap-2 ${activeDetailTab === 'statutory' ? 'active' : ''}`}
                  onClick={() => setActiveDetailTab('statutory')}
                >
                  <Icon icon="heroicons:document-check" className="me-2" />
                  Statutory & Compliance
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="p-4" style={{ overflowY: 'auto', minHeight: 0 }}>
              {/* Personal Information Tab */}
              {activeDetailTab === 'personal' && (
                <PersonalInfoTab employee={selectedEmployee} formatDate={formatDate} />
              )}

              {/* Employment Information Tab */}
              {activeDetailTab === 'employment' && (
                <EmploymentInfoTab
                  employee={selectedEmployee}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  getEmploymentTypeBadge={getEmploymentTypeBadge}
                />
              )}
              

              {/* Job History Tab */}
              {activeDetailTab === 'jobHistory' && (
                <JobHistoryTab employee={selectedEmployee} formatDate={formatDate} formatCurrency={formatCurrency} />
              )}

              {/* Salary & Compensation Tab */}
              {activeDetailTab === 'salary' && (
                <SalaryInfoTab employee={selectedEmployee} formatCurrency={formatCurrency}
                 formatDate={formatDate} />
              )}

              {/* Statutory & Compliance Tab */}
              {activeDetailTab === 'statutory' && (
                <StatutoryInfoTab employee={selectedEmployee} formatDate={formatDate} />
              )}
            </div>
          </div>
          <div className="card-footer bg-transparent border-top d-flex justify-content-end gap-2">
            <button
              type="button"
              className="back-to-list"
              onClick={handleBackToList}
            >
              <Icon icon="heroicons:arrow-left" />
              Back to List
            </button>

      <button
        type="button"
        className="btn btn-primary d-flex align-items-center gap-2"
        onClick={() => {
          // Call the existing handleEditEmployee function
          handleEditEmployee(selectedEmployee);
        }}
      >
        <Icon icon="heroicons:pencil-square" />
        Edit Employee
      </button>


            <button
              type="button"
              className="delete-btn"
              onClick={() => {
                handleDeleteEmployee(selectedEmployee.id);
                handleBackToList();
              }}
            >
              <Icon icon="heroicons:trash" />
              Delete
            </button>
          </div>

        </div>
      )}


   {showEditModal && editEmployeeData && (
  <div className="hrms-modal-overlay">
    <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

              {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
          <Icon icon="heroicons:pencil-square" />
          Edit Employee: {editEmployeeData.name}
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={handleCancelEdit}
        ></button>
      </div>
      {/* BODY */}
      <div className="hrms-modal-body hrms-modal-body-scroll">
        {/* Tab Navigation */}
        <ul className="nav nav-tabs border-bottom px-3 pt-3" style={{ flexShrink: 0 }}>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeEditTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveEditTab('personal')}
            >
              <Icon icon="heroicons:user-circle" />
              Personal Info
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeEditTab === 'employment' ? 'active' : ''}`}
              onClick={() => setActiveEditTab('employment')}
            >
              <Icon icon="heroicons:briefcase" />
              Employment
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeEditTab === 'jobHistory' ? 'active' : ''}`}
              onClick={() => setActiveEditTab('jobHistory')}
            >
              <Icon icon="heroicons:clock" />
              Service History
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeEditTab === 'salary' ? 'active' : ''}`}
              onClick={() => setActiveEditTab('salary')}
            >
              <Icon icon="heroicons:currency-dollar" />
              Salary & Compensation
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeEditTab === 'statutory' ? 'active' : ''}`}
              onClick={() => setActiveEditTab('statutory')}
            >
              <Icon icon="heroicons:document-check" />
             Statutory & Compliance
            </button>
          </li>
        </ul>

        {/* Tab Content - REUSING YOUR EXISTING FORM STRUCTURE */}
        <div className="p-4" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          
          {/* Personal Information Tab - Modified for Edit */}
{activeEditTab === 'personal' && (
  <div className="row g-3">
    {/* Profile Photo Upload - Added from add field */}
    <div className="col-12 mb-3">
      <label className="form-label fw-bold">Profile Photo</label>
      <div className="d-flex align-items-center gap-3">
        <div className="position-relative">
          {editEmployeeData.personalInfo?.profilePhoto ? (
            <img 
              src={editEmployeeData.personalInfo.profilePhoto} 
              alt="Profile" 
              className="rounded-circle border"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          ) : (
            <div className="rounded-circle border d-flex align-items-center justify-content-center bg-light" style={{ width: '100px', height: '100px' }}>
              <Icon icon="heroicons:user" className="fs-1 text-muted" />
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  alert("File size must be less than 5MB");
                  return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                  handleEditInputChange('profilePhoto', reader.result, 'personalInfo.profilePhoto');
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <small className="text-muted">Upload employee profile photo (JPG, PNG, max 5MB)</small>
        </div>
      </div>
    </div>

    {/* === Basic Information === */}
    <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:identification" /> 
        </span>
        Basic Information
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Full Name <span className="text-danger">*</span></label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.name || ''}
        onChange={(e) => handleEditInputChange('name', e.target.value)}
        placeholder="Enter full name"
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Date of Birth</label>
      <input
        type="date"
        className="form-control"
        value={editEmployeeData.personalInfo?.dateOfBirth || ''}
        onChange={(e) => handleEditInputChange('dateOfBirth', e.target.value, 'personalInfo.dateOfBirth')}
      />
    </div>

    <div className="col-md-4">
      <label className="form-label fw-bold">Gender</label>
      <select
        className="form-select"
        value={editEmployeeData.personalInfo?.gender || ''}
        onChange={(e) => handleEditInputChange('gender', e.target.value, 'personalInfo.gender')}
      >
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>
    </div>

    <div className="col-md-4">
      <label className="form-label fw-bold">Blood Group</label>
      <select
        className="form-select"
        value={editEmployeeData.personalInfo?.bloodGroup || ''}
        onChange={(e) => handleEditInputChange('bloodGroup', e.target.value, 'personalInfo.bloodGroup')}
      >
        <option value="">Select</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>
    </div>

    <div className="col-md-4">
      <label className="form-label fw-bold">Marital Status</label>
      <select
        className="form-select"
        value={editEmployeeData.personalInfo?.maritalStatus || ''}
        onChange={(e) => handleEditInputChange('maritalStatus', e.target.value, 'personalInfo.maritalStatus')}
      >
        <option value="">Select</option>
        <option value="Single">Single</option>
        <option value="Married">Married</option>
        <option value="Divorced">Divorced</option>
        <option value="Widowed">Widowed</option>
        <option value="Separated">Separated</option>
      </select>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Nationality</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.nationality || ''}
        onChange={(e) => handleEditInputChange('nationality', e.target.value, 'personalInfo.nationality')}
        placeholder="Enter nationality"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Languages</label>
      <div className="d-flex gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a language"
          id="editLanguageInput"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              e.preventDefault();
              const newLanguage = e.target.value.trim();
              const currentLanguages = editEmployeeData.personalInfo?.languages || [];
              if (!currentLanguages.includes(newLanguage)) {
                handleEditInputChange('languages', [...currentLanguages, newLanguage], 'personalInfo.languages');
              }
              e.target.value = '';
            }
          }}
        />
        <button
          type="button"
          className="job-listings-btn"
          onClick={() => {
            const input = document.getElementById('editLanguageInput');
            const newLanguage = input.value.trim();
            const currentLanguages = editEmployeeData.personalInfo?.languages || [];
            if (newLanguage && !currentLanguages.includes(newLanguage)) {
              handleEditInputChange('languages', [...currentLanguages, newLanguage], 'personalInfo.languages');
              input.value = '';
            }
          }}
        >
          Add
        </button>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {(editEmployeeData.personalInfo?.languages || []).map((language, index) => (
          <div key={index} className="badge bg-primary d-flex align-items-center gap-1">
            {language}
            <button
              type="button"
              className="btn-close btn-close-white btn-sm"
              onClick={() => {
                const currentLanguages = editEmployeeData.personalInfo?.languages || [];
                const updatedLanguages = currentLanguages.filter((_, i) => i !== index);
                handleEditInputChange('languages', updatedLanguages, 'personalInfo.languages');
              }}
            ></button>
          </div>
        ))}
      </div>
      {(!editEmployeeData.personalInfo?.languages || editEmployeeData.personalInfo.languages.length === 0) && (
        <small className="text-muted">No languages added yet. Type a language and press Enter or click Add.</small>
      )}
    </div>

    {/* === Contact Information === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 

    <Icon icon="heroicons:phone" /> 

  </span> 

  Contact Information 

</h6> 
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Email <span className="text-danger">*</span></label>
      <input
        type="email"
        className="form-control"
        value={editEmployeeData.employmentInfo?.workEmail || editEmployeeData.email || ''}
        onChange={(e) => {
          handleEditInputChange('workEmail', e.target.value, 'employmentInfo.workEmail');
          handleEditInputChange('email', e.target.value);
        }}
        placeholder="employee@company.com"
        required
      />
    </div>




    <div className="col-md-6">
      <label className="form-label fw-bold">Primary Phone <span className="text-danger">*</span></label>
      <input
        type="tel"
        className="form-control"
        value={editEmployeeData.phone || editEmployeeData.personalInfo?.phonePrimary || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length <= 10) {
            handleEditInputChange('phone', value);
            handleEditInputChange('phonePrimary', value, 'personalInfo.phonePrimary');
          }
        }}
        placeholder="Enter 10-digit phone number"
        maxLength="10"
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Secondary Phone</label>
      <input
        type="tel"
        className="form-control"
        value={editEmployeeData.personalInfo?.phoneSecondary || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length <= 10) {
            handleEditInputChange('phoneSecondary', value, 'personalInfo.phoneSecondary');
          }
        }}
        placeholder="Enter 10-digit phone number"
        maxLength="10"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Emergency Phone</label>
      <input
        type="tel"
        className="form-control"
        value={editEmployeeData.personalInfo?.phoneEmergency || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length <= 10) {
            handleEditInputChange('phoneEmergency', value, 'personalInfo.phoneEmergency');
          }
        }}
        placeholder="Enter 10-digit emergency phone"
        maxLength="10"
      />
    </div>

    {/* === Current Address === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:map-pin" />
        </span>
        Current Address
      </h6>
    </div>

    <div className="col-12">
      <label className="form-label fw-bold">Address Line 1</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.currentAddress?.line1 || ''}
        onChange={(e) => handleEditInputChange('line1', e.target.value, 'personalInfo.currentAddress.line1')}
        placeholder="Enter address line 1"
      />
    </div>

    <div className="col-12">
      <label className="form-label fw-bold">Address Line 2</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.currentAddress?.line2 || ''}
        onChange={(e) => handleEditInputChange('line2', e.target.value, 'personalInfo.currentAddress.line2')}
        placeholder="Enter address line 2"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">City</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.currentAddress?.city || ''}
        onChange={(e) => handleEditInputChange('city', e.target.value, 'personalInfo.currentAddress.city')}
        placeholder="Enter city"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">State</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.currentAddress?.state || ''}
        onChange={(e) => handleEditInputChange('state', e.target.value, 'personalInfo.currentAddress.state')}
        placeholder="Enter state"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Pincode</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.currentAddress?.pincode || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length <= 6) {
            handleEditInputChange('pincode', value, 'personalInfo.currentAddress.pincode');
          }
        }}
        placeholder="Enter pincode"
        maxLength="6"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Country</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.currentAddress?.country || ''}
        onChange={(e) => handleEditInputChange('country', e.target.value, 'personalInfo.currentAddress.country')}
        placeholder="Enter country"
      />
    </div>

    {/* Permanent Address Section */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:home" />
        </span>
        Permanent Address
      </h6>
    </div>

    <div className="col-12 mb-3">
      <label
        htmlFor="editSameAsCurrent"
        className="d-flex align-items-center form-check"
        style={{ cursor: "pointer" }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            border: `2px solid ${
              JSON.stringify(editEmployeeData.personalInfo?.currentAddress || {}) ===
                JSON.stringify(editEmployeeData.personalInfo?.permanentAddress || {}) &&
              Object.values(editEmployeeData.personalInfo?.currentAddress || {}).some(
                (val) => val !== ""
              )
                ? "#3B82F6"
                : "#9CA3AF"
            }`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "10px",
            transition: "all 0.3s ease",
            background:
              JSON.stringify(editEmployeeData.personalInfo?.currentAddress || {}) ===
                JSON.stringify(editEmployeeData.personalInfo?.permanentAddress || {}) &&
              Object.values(editEmployeeData.personalInfo?.currentAddress || {}).some(
                (val) => val !== ""
              )
                ? "#3B82F6"
                : "transparent",
          }}
        >
          {(JSON.stringify(editEmployeeData.personalInfo?.currentAddress || {}) ===
            JSON.stringify(editEmployeeData.personalInfo?.permanentAddress || {}) &&
            Object.values(editEmployeeData.personalInfo?.currentAddress || {}).some(
              (val) => val !== ""
            )) && (
            <span
              style={{
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                lineHeight: 1,
              }}
            >
              ✓
            </span>
          )}
        </div>

        <input
          type="checkbox"
          id="editSameAsCurrent"
          className="form-check-input"
          style={{ display: "none" }}
          checked={
            JSON.stringify(editEmployeeData.personalInfo?.currentAddress || {}) ===
              JSON.stringify(editEmployeeData.personalInfo?.permanentAddress || {}) &&
            Object.values(editEmployeeData.personalInfo?.currentAddress || {}).some(
              (val) => val !== ""
            )
          }
          onChange={(e) => {
            if (e.target.checked) {
              // Copy current address to permanent address
              const currentAddress = editEmployeeData.personalInfo?.currentAddress || {
                line1: "", line2: "", city: "", state: "", pincode: "", country: ""
              };
              handleEditInputChange('permanentAddress', {...currentAddress}, 'personalInfo.permanentAddress');
            } else {
              // Clear permanent address
              handleEditInputChange('permanentAddress', {
                line1: "",
                line2: "",
                city: "",
                state: "",
                pincode: "",
                country: ""
              }, 'personalInfo.permanentAddress');
            }
          }}
        />

        <span className="fw-semibold">Same as Current Address</span>
      </label>
    </div>

    <div className="col-12">
      <label className="form-label fw-bold">Address Line 1</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.permanentAddress?.line1 || ''}
        onChange={(e) => handleEditInputChange('line1', e.target.value, 'personalInfo.permanentAddress.line1')}
        placeholder="Enter address line 1"
        disabled={
          JSON.stringify(editEmployeeData.personalInfo?.currentAddress || {}) ===
          JSON.stringify(editEmployeeData.personalInfo?.permanentAddress || {}) &&
          Object.values(editEmployeeData.personalInfo?.currentAddress || {}).some(val => val !== "")
        }
      />
    </div>

    <div className="col-12">
      <label className="form-label fw-bold">Address Line 2</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.permanentAddress?.line2 || ''}
        onChange={(e) => handleEditInputChange('line2', e.target.value, 'personalInfo.permanentAddress.line2')}
        placeholder="Enter address line 2"
        disabled={
          JSON.stringify(editEmployeeData.personalInfo?.currentAddress || {}) ===
          JSON.stringify(editEmployeeData.personalInfo?.permanentAddress || {}) &&
          Object.values(editEmployeeData.personalInfo?.currentAddress || {}).some(val => val !== "")
        }
      />
    </div>

    <div className="col-md-4">
      <label className="form-label fw-bold">City</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.permanentAddress?.city || ''}
        onChange={(e) => handleEditInputChange('city', e.target.value, 'personalInfo.permanentAddress.city')}
        placeholder="Enter city"
        disabled={
          JSON.stringify(editEmployeeData.personalInfo?.currentAddress || {}) ===
          JSON.stringify(editEmployeeData.personalInfo?.permanentAddress || {}) &&
          Object.values(editEmployeeData.personalInfo?.currentAddress || {}).some(val => val !== "")
        }
      />
    </div>

    <div className="col-md-4">
      <label className="form-label fw-bold">State</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.permanentAddress?.state || ''}
        onChange={(e) => handleEditInputChange('state', e.target.value, 'personalInfo.permanentAddress.state')}
        placeholder="Enter state"
        disabled={
          JSON.stringify(editEmployeeData.personalInfo?.currentAddress || {}) ===
          JSON.stringify(editEmployeeData.personalInfo?.permanentAddress || {}) &&
          Object.values(editEmployeeData.personalInfo?.currentAddress || {}).some(val => val !== "")
        }
      />
    </div>

    <div className="col-md-4">
      <label className="form-label fw-bold">Pincode</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.permanentAddress?.pincode || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length <= 6) {
            handleEditInputChange('pincode', value, 'personalInfo.permanentAddress.pincode');
          }
        }}
        placeholder="Enter pincode"
        maxLength="6"
        disabled={
          JSON.stringify(editEmployeeData.personalInfo?.currentAddress || {}) ===
          JSON.stringify(editEmployeeData.personalInfo?.permanentAddress || {}) &&
          Object.values(editEmployeeData.personalInfo?.currentAddress || {}).some(val => val !== "")
        }
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Country</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.permanentAddress?.country || ''}
        onChange={(e) => handleEditInputChange('country', e.target.value, 'personalInfo.permanentAddress.country')}
        placeholder="Enter country"
        disabled={
          JSON.stringify(editEmployeeData.personalInfo?.currentAddress || {}) ===
          JSON.stringify(editEmployeeData.personalInfo?.permanentAddress || {}) &&
          Object.values(editEmployeeData.personalInfo?.currentAddress || {}).some(val => val !== "")
        }
      />
    </div>

    {/* === Emergency Contacts === */}
    <div className="col-12 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:user-group" />
          </span>
          Emergency Contacts
        </h6>

        <button
          type="button"
          className="job-listings-btn"
          onClick={() => {
            const currentContacts = editEmployeeData.personalInfo?.emergencyContacts || [];
            if (currentContacts.length >= 5) {
              alert("Maximum 5 emergency contacts allowed");
              return;
            }
            const newContact = {
              id: Date.now(),
              name: "",
              relation: "",
              phone: "",
              priority: "Primary",
            };
            handleEditAddToArray('personalInfo.emergencyContacts', newContact);
          }}
        >
          <Icon icon="heroicons:plus" />
          <span>Add Contact</span>
        </button>
      </div>
      
      {(editEmployeeData.personalInfo?.emergencyContacts || []).length > 0 ? (
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="bg-light">
              <tr>
                <th className="text-muted">Name</th>
                <th className="text-muted">Relation</th>
                <th className="text-muted">Phone No</th>
                <th className="text-muted">Priority</th>
                <th className="text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(editEmployeeData.personalInfo?.emergencyContacts || []).map((contact, index) => (
                <tr key={contact.id || index}>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={contact.name || ''}
                      onChange={(e) => handleEditArrayUpdate('personalInfo.emergencyContacts', index, 'name', e.target.value)}
                      placeholder="Enter name"
                    />
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={contact.relation || ''}
                      onChange={(e) => handleEditArrayUpdate('personalInfo.emergencyContacts', index, 'relation', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      value={contact.phone || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          handleEditArrayUpdate('personalInfo.emergencyContacts', index, 'phone', value);
                        }
                      }}
                      placeholder="10 digits"
                      maxLength="10"
                    />
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={contact.priority || 'Primary'}
                      onChange={(e) => handleEditArrayUpdate('personalInfo.emergencyContacts', index, 'priority', e.target.value)}
                    >
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Tertiary">Tertiary</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleEditRemoveFromArray('personalInfo.emergencyContacts', index)}
                    >
                      <Icon icon="heroicons:trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-light border d-flex align-items-center gap-2">
          <Icon icon="heroicons:information-circle" className="me-2 text-muted" />
          No emergency contacts added. Click "Add Contact" to add one (Max 5 contacts allowed).
        </div>
      )}
    </div>

    {/* === Family Members (Optional) === */}
    <div className="col-12 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:home" />
          </span>
          Family Members (Optional)
        </h6>

        <button
          type="button"
          className="job-listings-btn"
          onClick={() => {
            const currentMembers = editEmployeeData.personalInfo?.familyMembers || [];
            if (currentMembers.length >= 5) {
              alert("Maximum 5 family members allowed");
              return;
            }
            const newMember = {
              id: Date.now(),
              name: "",
              relation: "",
              contactNo: "",
              dateOfBirth: "",
            };
            handleEditAddToArray('personalInfo.familyMembers', newMember);
          }}
        >
          <Icon icon="heroicons:plus" />
          <span>Add Member</span>
        </button>
      </div>
      
      {(editEmployeeData.personalInfo?.familyMembers || []).length > 0 ? (
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="bg-light">
              <tr>
                <th className="text-muted">Name</th>
                <th className="text-muted">Relation</th>
                <th className="text-muted">Date of Birth</th>
                <th className="text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(editEmployeeData.personalInfo?.familyMembers || []).map((member, index) => (
                <tr key={member.id || index}>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={member.name || ''}
                      onChange={(e) => handleEditArrayUpdate('personalInfo.familyMembers', index, 'name', e.target.value)}
                      placeholder="Enter name"
                    />
                  </td>

                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={member.relation || ''}
                      onChange={(e) => handleEditArrayUpdate('personalInfo.familyMembers', index, 'relation', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Other">Other</option>
                    </select>
                  </td>
                  
    <td>
      <input
        type="date"
        className="form-control form-control-sm"
        // Use dob instead of dateOfBirth for consistency
        value={member.dob || ''}
        onChange={(e) => handleEditArrayUpdate('personalInfo.familyMembers', index, 'dob', e.target.value)}
        max={new Date().toISOString().split('T')[0]}
      />
    </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleEditRemoveFromArray('personalInfo.familyMembers', index)}
                    >
                      <Icon icon="heroicons:trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-light border d-flex align-items-center gap-2">
          <Icon icon="heroicons:information-circle" className="me-2 text-muted" />
          No family members added. Optional section (Max 5 members).
        </div>
      )}
    </div>

    {/* === Nominee Information === */}
    <div className="col-12 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:gift" />
          </span>
          Nominee Information
        </h6>

        <button
          type="button"
          className="job-listings-btn"
          onClick={() => {
            const currentNominees = editEmployeeData.personalInfo?.nominees || [];
            if (currentNominees.length >= 3) {
              alert("Maximum 3 nominees allowed");
              return;
            }
            const newNominee = {
              id: Date.now(),
              name: "",
              relation: "",
              phone: "",
              isNomineeAccepted: false,
              percentage: "",
            };
            handleEditAddToArray('personalInfo.nominees', newNominee);
          }}
        >
          <Icon icon="heroicons:plus" />
          <span>Add Nominee</span>
        </button>
      </div>
      
      {(editEmployeeData.personalInfo?.nominees || []).length > 0 ? (
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="bg-light">
              <tr>
                <th className="text-muted">Name</th>
                <th className="text-muted">Relation</th>
                <th className="text-muted">Phone No</th>
                <th className="text-muted">Nominee Accepted</th>
                <th className="text-muted">Percentage %</th>
                <th className="text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(editEmployeeData.personalInfo?.nominees || []).map((nominee, index) => (
                <tr key={nominee.id || index}>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={nominee.name || ''}
                      onChange={(e) => handleEditArrayUpdate('personalInfo.nominees', index, 'name', e.target.value)}
                      placeholder="Enter name"
                    />
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={nominee.relation || ''}
                      onChange={(e) => handleEditArrayUpdate('personalInfo.nominees', index, 'relation', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Other">Other</option>
                    </select>
                  </td>

              <td>
                <input
                  type="tel"
                  className="form-control form-control-sm"
                  value={nominee.phone || nominee.phoneNo || ''} // Check both fields
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      // Update both fields for backward compatibility
                      const updatedNominee = {
                        ...nominee,
                        phone: value,
                        phoneNo: value // Also update phoneNo for data consistency
                      };
                      const currentNominees = editEmployeeData.personalInfo?.nominees || [];
                      const updatedNominees = [...currentNominees];
                      updatedNominees[index] = updatedNominee;
                      handleEditInputChange('nominees', updatedNominees, 'personalInfo.nominees');
                    }
                  }}
                  placeholder="10 digits"
                  maxLength="10"
                />
              </td>
                  
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={nominee.isNomineeAccepted ? 'Yes' : 'No'}
                      onChange={(e) => handleEditArrayUpdate('personalInfo.nominees', index, 'isNomineeAccepted', e.target.value === 'Yes')}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={nominee.percentage || ''}
                      onChange={(e) => {
                        const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                        handleEditArrayUpdate('personalInfo.nominees', index, 'percentage', value);
                      }}
                      placeholder="0-100"
                      min="0"
                      max="100"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleEditRemoveFromArray('personalInfo.nominees', index)}
                    >
                      <Icon icon="heroicons:trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(() => {
            const totalPercentage = (editEmployeeData.personalInfo?.nominees || []).reduce(
              (sum, nominee) => sum + (parseInt(nominee.percentage) || 0), 
              0
            );
            if (totalPercentage !== 100) {
              return (
                <div className={`alert ${totalPercentage > 100 ? 'alert-danger' : 'alert-warning'} mt-2`}>
                  <Icon icon="heroicons:exclamation-triangle" className="me-2" />
                  Total percentage: {totalPercentage}% (Should be exactly 100%)
                </div>
              );
            }
          })()}
        </div>
      ) : (
        <div className="alert alert-light border d-flex align-items-center gap-2">
          <Icon icon="heroicons:information-circle" className="me-2 text-muted" />
          No nominees added. Click "Add Nominee" to add one (Max 3 nominees).
        </div>
      )}
    </div>

    {/* === Identification Documents === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:document-text" />
          </span>
        Identification Documents
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">PAN Number <span className="text-danger">*</span></label>
      <input
        type="text"
        className="form-control text-uppercase"
        value={editEmployeeData.personalInfo?.identification?.pan?.number || ''}
        onChange={(e) => {
          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (value.length <= 10) {
            handleEditInputChange('number', value, 'personalInfo.identification.pan.number');
          }
        }}
        placeholder="ABCDE1234F"
        maxLength="10"
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Aadhaar Number <span className="text-danger">*</span></label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.identification?.aadhaar?.number || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length <= 12) {
            handleEditInputChange('number', value, 'personalInfo.identification.aadhaar.number');
          }
        }}
        placeholder="123456789012"
        maxLength="12"
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Passport Number (Optional)</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.identification?.passport?.number || ''}
        onChange={(e) => handleEditInputChange('number', e.target.value, 'personalInfo.identification.passport.number')}
        placeholder="Enter passport number"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Passport Expiry Date (Optional)</label>
      <input
        type="date"
        className="form-control"
        value={editEmployeeData.personalInfo?.identification?.passport?.expiryDate || ''}
        onChange={(e) => handleEditInputChange('expiryDate', e.target.value, 'personalInfo.identification.passport.expiryDate')}
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Voter ID Number (Optional)</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.identification?.voterId?.number || ''}
        onChange={(e) => handleEditInputChange('number', e.target.value, 'personalInfo.identification.voterId.number')}
        placeholder="Enter voter ID number"
      />
    </div>

  </div>
)}

{/* Employment Information Tab - Modified for Edit */}
{activeEditTab === 'employment' && (
  <div className="row g-3">
     <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:briefcase" />
          </span>
            <span>Employment Details</span>
              </h6>
            </div>
    {/* Row 1: Employee ID and Date of Joining */}

    <div className="col-md-6">
      <label className="form-label fw-bold">Employee ID <span className="text-danger">*</span></label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.employeeId || editEmployeeData.employeeId || ''}
        onChange={(e) => {
          handleEditInputChange('employeeId', e.target.value, 'employmentInfo.employeeId');
        }}
        placeholder="EMP001"
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Date of Joining <span className="text-danger">*</span></label>
      <input
        type="date"
        className="form-control"
        value={editEmployeeData.employmentInfo?.dateOfJoining || editEmployeeData.joinDate || ''}
        onChange={(e) => {
          handleEditInputChange('dateOfJoining', e.target.value, 'employmentInfo.dateOfJoining');
          handleEditInputChange('joinDate', e.target.value);
        }}
        required
      />
    </div>

    {/* Row 2: Confirmation Date and Probation Period */}
    <div className="col-md-6">
      <label className="form-label fw-bold">Confirmation Date</label>
      <input
        type="date"
        className="form-control"
        value={editEmployeeData.employmentInfo?.confirmationDate || ''}
        onChange={(e) => handleEditInputChange('confirmationDate', e.target.value, 'employmentInfo.confirmationDate')}
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Probation Period (months)</label>
      <input
        type="number"
        className="form-control"
        value={editEmployeeData.employmentInfo?.probationPeriod || 0}
        onChange={(e) => handleEditInputChange('probationPeriod', parseInt(e.target.value) || 0, 'employmentInfo.probationPeriod')}
        min="0"
        max="12"
      />
    </div>

    {/* Row 3: Employment Type and Status */}
    <div className="col-md-6">
      <label className="form-label fw-bold">Employment Type <span className="text-danger">*</span></label>
      <select
        className="form-select"
        value={editEmployeeData.employmentInfo?.employmentType || editEmployeeData.employmentType || ''}
        onChange={(e) => {
          handleEditInputChange('employmentType', e.target.value, 'employmentInfo.employmentType');
          handleEditInputChange('employmentType', e.target.value);
        }}
        required
      >
        <option value="">Select</option>
        <option value="Permanent">Permanent</option>
        <option value="Contract">Contract</option>
        <option value="Intern">Intern</option>
        <option value="Consultant">Consultant</option>
        <option value="Temporary">Temporary</option>
      </select>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Employment Status</label>
      <select
        className="form-select"
        value={editEmployeeData.employmentInfo?.employmentStatus || editEmployeeData.status || 'Active'}
        onChange={(e) => {
          handleEditInputChange('employmentStatus', e.target.value, 'employmentInfo.employmentStatus');
          handleEditInputChange('status', e.target.value);
        }}
      >
        <option value="Active">Active</option>
        <option value="Probation">Probation</option>
        <option value="On-Hold">On-Hold</option>
        <option value="On Leave">On Leave</option>
        <option value="Inactive">Inactive</option>
        <option value="Terminated">Terminated</option>
      </select>
    </div>

    {/* Row 4: Department and Sub-Department */}
    <div className="col-md-6">
      <label className="form-label fw-bold">Department <span className="text-danger">*</span></label>
      <select
        className="form-select"
        value={editEmployeeData.employmentInfo?.department || editEmployeeData.department || ''}
        onChange={(e) => {
          handleEditInputChange('department', e.target.value, 'employmentInfo.department');
          handleEditInputChange('department', e.target.value);
        }}
        required
      >
        <option value="">Select</option>
        <option value="Engineering">Engineering</option>
        <option value="Marketing">Marketing</option>
        <option value="HR">HR</option>
        <option value="Finance">Finance</option>
        <option value="Sales">Sales</option>
        <option value="Operations">Operations</option>
        <option value="IT">IT</option>
        <option value="Customer Support">Customer Support</option>
        <option value="Product">Product</option>
        <option value="Legal">Legal</option>
      </select>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Sub-Department</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.subDepartment || ''}
        onChange={(e) => handleEditInputChange('subDepartment', e.target.value, 'employmentInfo.subDepartment')}
        placeholder="Enter sub-department"
      />
    </div>

    {/* Row 5: Cost Center and Designation */}
    <div className="col-md-6">
      <label className="form-label fw-bold">Cost Center</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.costCenter || ''}
        onChange={(e) => handleEditInputChange('costCenter', e.target.value, 'employmentInfo.costCenter')}
        placeholder="Enter cost center code"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Designation <span className="text-danger">*</span></label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.designation || editEmployeeData.designation || ''}
        onChange={(e) => {
          handleEditInputChange('designation', e.target.value, 'employmentInfo.designation');
          handleEditInputChange('designation', e.target.value);
        }}
        placeholder="Enter designation"
        required
      />
    </div>

    {/* Row 6: Grade and Level */}
    <div className="col-md-6">
      <label className="form-label fw-bold">Grade</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.grade || ''}
        onChange={(e) => handleEditInputChange('grade', e.target.value, 'employmentInfo.grade')}
        placeholder="e.g., P1, M2, E3"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Level</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.level || ''}
        onChange={(e) => handleEditInputChange('level', e.target.value, 'employmentInfo.level')}
        placeholder="e.g., Junior, Mid, Senior"
      />
    </div>

    {/* Row 7: Location and Workplace Type */}
    <div className="col-md-6">
      <label className="form-label fw-bold">Location <span className="text-danger">*</span></label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.location || editEmployeeData.location || ''}
        onChange={(e) => {
          handleEditInputChange('location', e.target.value, 'employmentInfo.location');
          handleEditInputChange('location', e.target.value);
        }}
        placeholder="Enter location"
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Workplace Type</label>
      <select
        className="form-select"
        value={editEmployeeData.employmentInfo?.workplaceType || 'Office'}
        onChange={(e) => handleEditInputChange('workplaceType', e.target.value, 'employmentInfo.workplaceType')}
      >
        <option value="Office">Office</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
        <option value="Field">Field</option>
      </select>
    </div>

    {/* Row 8: Email and Extension Number */}
    <div className="col-md-6">
      <label className="form-label fw-bold">Email <span className="text-danger">*</span></label>
      <input
        type="email"
        className="form-control"
        value={editEmployeeData.employmentInfo?.workEmail || editEmployeeData.email || ''}
        onChange={(e) => {
          handleEditInputChange('workEmail', e.target.value, 'employmentInfo.workEmail');
          handleEditInputChange('email', e.target.value);
        }}
        placeholder="employee@company.com"
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Extension Number</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.extensionNumber || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length <= 6) {
            handleEditInputChange('extensionNumber', value, 'employmentInfo.extensionNumber');
          }
        }}
        placeholder="Enter extension number"
        maxLength="6"
      />
    </div>

    {/* Row 9: Desk Location and Employee Category */}
    <div className="col-md-6">
      <label className="form-label fw-bold">Desk Location</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.deskLocation || ''}
        onChange={(e) => handleEditInputChange('deskLocation', e.target.value, 'employmentInfo.deskLocation')}
        placeholder="e.g., Floor 3, Desk 12A"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Employee Category</label>
      <select
        className="form-select"
        value={editEmployeeData.employmentInfo?.employeeCategory || 'Staff'}
        onChange={(e) => handleEditInputChange('employeeCategory', e.target.value, 'employmentInfo.employeeCategory')}
      >
        <option value="">Select</option>
        <option value="Regular">Regular</option>
        <option value="Trainee">Trainee</option>
        <option value="Executive">Executive</option>
        <option value="Manager">Manager</option>
        <option value="Director">Director</option>
        <option value="Contractor">Contractor</option>
        <option value="Apprentice">Apprentice</option>
      </select>
    </div>

    {/* Row 10: Notice Period and Direct Reporting Manager */}
    <div className="col-md-6">
      <label className="form-label fw-bold">Notice Period (days)</label>
      <input
        type="number"
        className="form-control"
        value={editEmployeeData.employmentInfo?.noticePeriod || 30}
        onChange={(e) => handleEditInputChange('noticePeriod', parseInt(e.target.value) || 0, 'employmentInfo.noticePeriod')}
        min="0"
        max="180"
      />
      <small className="text-muted">Typically 30, 60, or 90 days</small>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Direct Reporting Manager</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.reportingManager?.direct || ''}
        onChange={(e) => {
          const currentReportingManager = editEmployeeData.employmentInfo?.reportingManager || { direct: '', functional: '' };
          handleEditInputChange('reportingManager', {
            ...currentReportingManager,
            direct: e.target.value
          }, 'employmentInfo.reportingManager');
        }}
        placeholder="Enter direct manager name"
      />
    </div>

    {/* Row 11: Functional Reporting Manager and HR Business Partner */}
    <div className="col-md-6">
      <label className="form-label fw-bold">Functional Reporting Manager</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.reportingManager?.functional || ''}
        onChange={(e) => {
          const currentReportingManager = editEmployeeData.employmentInfo?.reportingManager || { direct: '', functional: '' };
          handleEditInputChange('reportingManager', {
            ...currentReportingManager,
            functional: e.target.value
          }, 'employmentInfo.reportingManager');
        }}
        placeholder="Enter functional manager name"
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">HR Business Partner</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.employmentInfo?.hrBusinessPartner || ''}
        onChange={(e) => handleEditInputChange('hrBusinessPartner', e.target.value, 'employmentInfo.hrBusinessPartner')}
        placeholder="Enter HR business partner name"
      />
    </div>
  </div>
)}

{/* Job History Tab - Modified for Edit */}
{activeEditTab === 'jobHistory' && (
  <div className="row g-3">
    <div className="col-12 d-flex justify-content-between align-items-center">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
        <Icon icon="heroicons:clock" />
        </span>
        Complete Job History
      </h6>

      <button
        type="button"
        className="create-job-btn"
        onClick={() => {
          const currentHistory = editEmployeeData.jobHistory || [];
          const newHistory = {
            id: Date.now(),
            date: new Date().toISOString().split("T")[0],
            endDate: '',
            type: "Joining",
            organisation: '',
            department: editEmployeeData.employmentInfo?.department || editEmployeeData.department || "",
            designation: editEmployeeData.employmentInfo?.designation || editEmployeeData.designation || "",
            location: editEmployeeData.employmentInfo?.location || editEmployeeData.location || "",
            manager: editEmployeeData.employmentInfo?.reportingManager?.direct || "",
            salaryChange: editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || "",
            notes: "",
            achievements: "",
            reasonForLeaving: "",
            isEditing: true
          };
          handleEditInputChange('jobHistory', [...currentHistory, newHistory]);
        }}
      >
        <Icon icon="heroicons:plus" />
        Add Job History
      </button>
    </div>

    {/* Current Job History Entries */}
    <div className="col-12">
      {(editEmployeeData.jobHistory || []).length > 0 ? (
        (editEmployeeData.jobHistory || []).map((history, idx) => {
          // Calculate duration for display
          const calculateDuration = () => {
            if (!history.date) return '-';
            
            const startDate = new Date(history.date);
            const endDate = history.endDate === 'Present' || !history.endDate 
              ? new Date() 
              : new Date(history.endDate);
              
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '-';
            
            const durationInMonths = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
            const years = Math.floor(durationInMonths / 12);
            const months = durationInMonths % 12;
            
            if (years > 0) {
              return `${years} yr ${months > 0 ? `${months} mo` : ''}`.trim();
            } else {
              return `${months} mo`;
            }
          };

          return (
            <div key={history.id || idx} className="card border mb-3">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${
                    history.type === 'Promotion' ? 'bg-success' :
                    history.type === 'Transfer' ? 'bg-info' :
                    history.type === 'Joining' ? 'bg-primary' :
                    history.type === 'Salary Revision' ? 'bg-warning' :
                    history.type === 'Department Change' ? 'bg-secondary' :
                    history.type === 'Location Transfer' ? 'bg-secondary' :
                    history.type === 'Designation Change' ? 'bg-secondary' :
                    history.type === 'Resignation' ? 'bg-danger' :
                    'bg-secondary'
                  }`}>
                    {history.type || 'Unknown'}
                  </span>
                  <span className="text-muted">
                    {history.date ? formatDate(history.date) : 'No date'}
                  </span>
                  {history.endDate && (
                    <span className="text-muted">
                      to {history.endDate === 'Present' ? 'Present' : formatDate(history.endDate)}
                    </span>
                  )}
                </div>
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this job history entry?')) {
                        const currentHistory = editEmployeeData.jobHistory || [];
                        const updatedHistory = currentHistory.filter((_, i) => i !== idx);
                        handleEditInputChange('jobHistory', updatedHistory);
                      }
                    }}
                    title="Delete"
                  >
                    <Icon icon="heroicons:trash" />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {/* Row 1: Start Date, End Date and Type */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold small">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={history.date || ''}
                      onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'date', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label fw-bold small">End Date</label>
                    <div className="d-flex gap-2">
                      <select
                        className="form-select"
                        value={history.endDate === 'Present' ? 'present' : (history.endDate ? 'date' : 'empty')}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === 'present') {
                            handleEditArrayUpdate('jobHistory', idx, 'endDate', 'Present');
                          } else if (value === 'empty') {
                            handleEditArrayUpdate('jobHistory', idx, 'endDate', '');
                          } else {
                            handleEditArrayUpdate('jobHistory', idx, 'endDate', '');
                          }
                        }}
                      >
                        <option value="empty">Select End Date</option>
                        <option value="present">Present</option>
                        <option value="date">Specific Date</option>
                      </select>
                      {history.endDate && history.endDate !== 'Present' && (
                        <input
                          type="date"
                          className="form-control"
                          value={history.endDate || ''}
                          onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'endDate', e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold small">
                      Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={history.type || 'Joining'}
                      onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'type', e.target.value)}
                      required
                    >
                      <option value="Joining">Joining</option>
                      <option value="Promotion">Promotion</option>
                      <option value="Transfer">Transfer</option>
                      <option value="Salary Revision">Salary Revision</option>
                      <option value="Department Change">Department Change</option>
                      <option value="Location Transfer">Location Transfer</option>
                      <option value="Designation Change">Designation Change</option>
                      <option value="Resignation">Resignation</option>
                      <option value="Previous Experience">Previous Experience</option>
                    </select>
                  </div>

                  {/* Row 2: Organisation, Department, and Designation */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Organisation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={history.organisation || ''}
                      onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'organisation', e.target.value)}
                      placeholder="Enter organisation name"
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={history.department || ''}
                      onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'department', e.target.value)}
                      placeholder="Enter department"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={history.designation || ''}
                      onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'designation', e.target.value)}
                      placeholder="Enter designation"
                    />
                  </div>

                  {/* Row 3: Location, Manager, and Salary */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={history.location || ''}
                      onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'location', e.target.value)}
                      placeholder="Enter location"
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Manager</label>
                    <input
                      type="text"
                      className="form-control"
                      value={history.manager || ''}
                      onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'manager', e.target.value)}
                      placeholder="Enter manager name"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Salary</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        value={history.salaryChange || ''}
                        onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'salaryChange', e.target.value)}
                        placeholder="Enter amount"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Row 4: Duration (Read-only), Notes, and Achievements */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Duration</label>
                    <div className="form-control bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{calculateDuration()}</span>
                        {(history.endDate === 'Present' || !history.endDate) && (
                          <small className="text-muted">Ongoing</small>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      value={history.notes || ''}
                      onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'notes', e.target.value)}
                      placeholder="Enter notes"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold small">Achievements</label>
                    <input
                      type="text"
                      className="form-control"
                      value={history.achievements || ''}
                      onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'achievements', e.target.value)}
                      placeholder="Enter achievements"
                    />
                  </div>

                  {/* Row 5: Reason for Leaving (Conditional) */}
                  {history.type === 'Resignation' || history.reasonForLeaving ? (
                    <div className="col-md-12">
                      <label className="form-label fw-bold small">Reason for Leaving</label>
                      <input
                        type="text"
                        className="form-control"
                        value={history.reasonForLeaving || ''}
                        onChange={(e) => handleEditArrayUpdate('jobHistory', idx, 'reasonForLeaving', e.target.value)}
                        placeholder="Enter reason for leaving"
                      />
                      <small className="text-muted">Only applicable for resignations or job changes</small>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="alert alert-light border d-flex align-items-center gap-2">
          <Icon icon="heroicons:information-circle" className="text-muted" />
          <div>
            <strong>No job history entries added yet.</strong>
            <p className="mb-0">Click "Add Job History" button to add job history records.</p>
          </div>
        </div>
      )}
    </div>

    {/* Summary Table View */}
    {(editEmployeeData.jobHistory || []).length > 0 && (
      <div className="col-12 mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
       <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:table-cells" className="me-2" />
            </span>
            Job History Summary Table
          </h6>
          <small className="text-muted">
            Showing {(editEmployeeData.jobHistory || []).length} entries
          </small>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="bg-light">
              <tr>
                <th className="text-muted">Start Date</th>
                <th className="text-muted">End Date</th>
                <th className="text-muted">Type</th>
                <th className="text-muted">Organisation</th>
                <th className="text-muted">Department</th>
                <th className="text-muted">Designation</th>
                <th className="text-muted">Location</th>
                <th className="text-muted">Manager</th>
                <th className="text-muted">Salary</th>
                <th className="text-muted">Duration</th>
                <th className="text-muted">Notes</th>
                <th className="text-muted">Achievements</th>
              </tr>
            </thead>
            <tbody>
              {(editEmployeeData.jobHistory || []).map((history, idx) => {
                // Calculate duration for each row
                const calculateDuration = () => {
                  if (!history.date) return '-';
                  
                  const startDate = new Date(history.date);
                  const endDate = history.endDate === 'Present' || !history.endDate 
                    ? new Date() 
                    : new Date(history.endDate);
                    
                  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '-';
                  
                  const durationInMonths = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
                  const years = Math.floor(durationInMonths / 12);
                  const months = durationInMonths % 12;
                  
                  if (years > 0) {
                    return `${years} yr ${months > 0 ? `${months} mo` : ''}`.trim();
                  } else {
                    return `${months} mo`;
                  }
                };

                return (
                  <tr key={history.id || idx}>
                    <td>{history.date ? formatDate(history.date) : '-'}</td>
                    <td>
                      {history.endDate === 'Present' ? (
                        <span className="badge bg-success">Present</span>
                      ) : history.endDate ? (
                        formatDate(history.endDate)
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        history.type === 'Promotion' ? 'bg-success' :
                        history.type === 'Transfer' ? 'bg-info' :
                        history.type === 'Joining' ? 'bg-primary' :
                        history.type === 'Salary Revision' ? 'bg-warning' :
                        history.type === 'Department Change' ? 'bg-secondary' :
                        history.type === 'Location Transfer' ? 'bg-secondary' :
                        history.type === 'Designation Change' ? 'bg-secondary' :
                        history.type === 'Resignation' ? 'bg-danger' :
                        'bg-secondary'
                      }`}>
                        {history.type || '-'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span>{history.organisation || '-'}</span>
                        {history.organisation === editEmployeeData.employmentInfo?.department && (
                          <span className="badge bg-primary-subtle text-primary border border-primary">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{history.department || '-'}</td>
                    <td><strong>{history.designation || '-'}</strong></td>
                    <td>{history.location || '-'}</td>
                    <td>{history.manager || '-'}</td>
                    <td>
                      {history.salaryChange ? (
                        <div className="d-flex flex-column">
                          <span className="text-primary fw-semibold">
                            {formatCurrency(history.salaryChange)}
                          </span>
                          {history.type === 'Promotion' && (
                            <small className="text-success">
                              <Icon icon="heroicons:arrow-trending-up" className="me-1" />
                              Increased
                            </small>
                          )}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <div className="d-flex flex-column align-items-center">
                        <span className="fw-medium">{calculateDuration()}</span>
                        {(history.endDate === 'Present' || !history.endDate) && (
                          <small className="text-muted">Ongoing</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {history.notes || '-'}
                        {history.reasonForLeaving && history.reasonForLeaving !== 'N/A' && (
                          <div className="mt-1">
                            <small className="text-danger">
                              <Icon icon="heroicons:arrow-right-on-rectangle" className="me-1" />
                              Reason: {history.reasonForLeaving}
                            </small>
                          </div>
                        )}
                      </small>
                    </td>
                    <td>
                      {history.achievements ? (
                        <div className="text-truncate" style={{ maxWidth: '150px' }} title={history.achievements}>
                          <small>{history.achievements}</small>
                        </div>
                      ) : (
                        <small className="text-muted">-</small>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
)} 
          {/* Salary & Compensation Tab - Modified for Edit */}
          
{activeEditTab === 'salary' && (
  <div className="row g-3">
    {/* === Current Compensation === */}
    <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
        <Icon icon="heroicons:currency-dollar" />
        </span>
        Current Compensation
      </h6>
    </div>
    
<div className="col-md-6">
  <label className="form-label fw-bold">Current CTC (Annual) <span className="text-danger">*</span></label>
  <div className="input-group">
    <span className="input-group-text">₹</span>
    <input
      type="number"
      className="form-control"
      value={editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0}
      onChange={(e) => {
        const value = parseInt(e.target.value) || 0;
        
        // Auto-populate CTC breakdown based on percentage distribution
        const breakdown = {
          basic: Math.round(value * 0.5),        // 50% of CTC
          hra: Math.round(value * 0.2),          // 20% of CTC
          specialAllowance: Math.round(value * 0.15),  // 15% of CTC
          transportAllowance: Math.round(value * 0.05), // 5% of CTC
          medicalAllowance: Math.round(value * 0.05),  // 5% of CTC
          otherAllowances: Math.round(value * 0.05),   // 5% of CTC
          providentFund: Math.round(value * 0.12),     // 12% of CTC
          gratuity: Math.round(value * 0.048),         // 4.8% of CTC
          otherDeductions: Math.round(value * 0.002)   // 0.2% of CTC
        };
        
        // Calculate total to ensure it matches CTC
        const totalBreakdown = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
        
        // Adjust if there's a rounding difference
        if (totalBreakdown !== value) {
          breakdown.otherAllowances += (value - totalBreakdown);
        }
        
        // Update all related fields
        handleEditInputChange('currentCTC', value, 'salaryInfo.currentCTC');
        handleEditInputChange('salary', value);
        handleEditInputChange('ctcBreakdown', breakdown, 'salaryInfo.ctcBreakdown');
      }}
      placeholder="Enter annual CTC"
      required
    />
  </div>
</div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">Salary Structure</label>
      <select
        className="form-select"
        value={editEmployeeData.salaryInfo?.salaryStructure || ''}
        onChange={(e) => handleEditInputChange('salaryStructure', e.target.value, 'salaryInfo.salaryStructure')}
      >
        <option value="">Select Structure</option>
        <option value="Fixed">Fixed</option>
        <option value="Fixed + Variable">Fixed + Variable</option>
        <option value="Performance Based">Performance Based</option>
        <option value="Commission Based">Commission Based</option>
      </select>
    </div>

    {/* === CTC Breakdown === */}
<div className="col-12 mt-4">
  <h6 className="fw-bold fs-5 mb-3 text-muted border-bottom pb-2 d-flex align-items-center gap-2">
    <span className="text-primary">
      <Icon icon="heroicons:chart-bar" />
    </span>
    CTC Breakdown
  </h6>
  

  
  <div className="table-responsive">
    <table className="table table-sm table-bordered">
      <thead className="bg-light">
        <tr>
          <th className="text-muted">Component</th>
          <th className="text-end text-muted">Amount (Annual)</th>
          <th className="text-end text-muted">% of CTC</th>
        </tr>
      </thead>
      <tbody>
        {/* Basic Salary */}
        <tr>
          <td className="fw-semibold">Basic</td>
          <td>
            <div className="input-group input-group-sm">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control text-end"
                value={editEmployeeData.salaryInfo?.ctcBreakdown?.basic || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const currentBreakdown = editEmployeeData.salaryInfo?.ctcBreakdown || {};
                  handleEditInputChange('ctcBreakdown', {
                    ...currentBreakdown,
                    basic: value
                  }, 'salaryInfo.ctcBreakdown');
                }}
                placeholder="0"
              />
            </div>
          </td>
          <td className="text-end">
            {(() => {
              const ctc = editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0;
              const basic = editEmployeeData.salaryInfo?.ctcBreakdown?.basic || 0;
              return ctc > 0 ? `${((basic / ctc) * 100).toFixed(1)}%` : '0%';
            })()}
          </td>
        </tr>
        
        {/* HRA */}
        <tr>
          <td className="fw-semibold">HRA</td>
          <td>
            <div className="input-group input-group-sm">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control text-end"
                value={editEmployeeData.salaryInfo?.ctcBreakdown?.hra || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const currentBreakdown = editEmployeeData.salaryInfo?.ctcBreakdown || {};
                  handleEditInputChange('ctcBreakdown', {
                    ...currentBreakdown,
                    hra: value
                  }, 'salaryInfo.ctcBreakdown');
                }}
                placeholder="0"
              />
            </div>
          </td>
          <td className="text-end">
            {(() => {
              const ctc = editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0;
              const hra = editEmployeeData.salaryInfo?.ctcBreakdown?.hra || 0;
              return ctc > 0 ? `${((hra / ctc) * 100).toFixed(1)}%` : '0%';
            })()}
          </td>
        </tr>
        
        {/* Special Allowance */}
        <tr>
          <td className="fw-semibold">Special Allowance</td>
          <td>
            <div className="input-group input-group-sm">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control text-end"
                value={editEmployeeData.salaryInfo?.ctcBreakdown?.specialAllowance || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const currentBreakdown = editEmployeeData.salaryInfo?.ctcBreakdown || {};
                  handleEditInputChange('ctcBreakdown', {
                    ...currentBreakdown,
                    specialAllowance: value
                  }, 'salaryInfo.ctcBreakdown');
                }}
                placeholder="0"
              />
            </div>
          </td>
          <td className="text-end">
            {(() => {
              const ctc = editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0;
              const special = editEmployeeData.salaryInfo?.ctcBreakdown?.specialAllowance || 0;
              return ctc > 0 ? `${((special / ctc) * 100).toFixed(1)}%` : '0%';
            })()}
          </td>
        </tr>
        
        {/* Transport Allowance */}
        <tr>
          <td className="fw-semibold">Transport Allowance</td>
          <td>
            <div className="input-group input-group-sm">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control text-end"
                value={editEmployeeData.salaryInfo?.ctcBreakdown?.transportAllowance || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const currentBreakdown = editEmployeeData.salaryInfo?.ctcBreakdown || {};
                  handleEditInputChange('ctcBreakdown', {
                    ...currentBreakdown,
                    transportAllowance: value
                  }, 'salaryInfo.ctcBreakdown');
                }}
                placeholder="0"
              />
            </div>
          </td>
          <td className="text-end">
            {(() => {
              const ctc = editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0;
              const transport = editEmployeeData.salaryInfo?.ctcBreakdown?.transportAllowance || 0;
              return ctc > 0 ? `${((transport / ctc) * 100).toFixed(1)}%` : '0%';
            })()}
          </td>
        </tr>
        
        {/* Medical Allowance */}
        <tr>
          <td className="fw-semibold">Medical Allowance</td>
          <td>
            <div className="input-group input-group-sm">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control text-end"
                value={editEmployeeData.salaryInfo?.ctcBreakdown?.medicalAllowance || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const currentBreakdown = editEmployeeData.salaryInfo?.ctcBreakdown || {};
                  handleEditInputChange('ctcBreakdown', {
                    ...currentBreakdown,
                    medicalAllowance: value
                  }, 'salaryInfo.ctcBreakdown');
                }}
                placeholder="0"
              />
            </div>
          </td>
          <td className="text-end">
            {(() => {
              const ctc = editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0;
              const medical = editEmployeeData.salaryInfo?.ctcBreakdown?.medicalAllowance || 0;
              return ctc > 0 ? `${((medical / ctc) * 100).toFixed(1)}%` : '0%';
            })()}
          </td>
        </tr>
        
        {/* Other Allowances */}
        <tr>
          <td className="fw-semibold">Other Allowances</td>
          <td>
            <div className="input-group input-group-sm">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control text-end"
                value={editEmployeeData.salaryInfo?.ctcBreakdown?.otherAllowances || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const currentBreakdown = editEmployeeData.salaryInfo?.ctcBreakdown || {};
                  handleEditInputChange('ctcBreakdown', {
                    ...currentBreakdown,
                    otherAllowances: value
                  }, 'salaryInfo.ctcBreakdown');
                }}
                placeholder="0"
              />
            </div>
          </td>
          <td className="text-end">
            {(() => {
              const ctc = editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0;
              const other = editEmployeeData.salaryInfo?.ctcBreakdown?.otherAllowances || 0;
              return ctc > 0 ? `${((other / ctc) * 100).toFixed(1)}%` : '0%';
            })()}
          </td>
        </tr>
        
        {/* Gross Salary Summary */}
        <tr className="table-secondary fw-bold">
          <td>Gross Salary</td>
          <td className="text-end">
            ₹{(
              (editEmployeeData.salaryInfo?.ctcBreakdown?.basic || 0) +
              (editEmployeeData.salaryInfo?.ctcBreakdown?.hra || 0) +
              (editEmployeeData.salaryInfo?.ctcBreakdown?.specialAllowance || 0) +
              (editEmployeeData.salaryInfo?.ctcBreakdown?.transportAllowance || 0) +
              (editEmployeeData.salaryInfo?.ctcBreakdown?.medicalAllowance || 0) +
              (editEmployeeData.salaryInfo?.ctcBreakdown?.otherAllowances || 0)
            ).toLocaleString('en-IN')}
          </td>
          <td className="text-end">
            {(() => {
              const ctc = editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0;
              const gross = (
                (editEmployeeData.salaryInfo?.ctcBreakdown?.basic || 0) +
                (editEmployeeData.salaryInfo?.ctcBreakdown?.hra || 0) +
                (editEmployeeData.salaryInfo?.ctcBreakdown?.specialAllowance || 0) +
                (editEmployeeData.salaryInfo?.ctcBreakdown?.transportAllowance || 0) +
                (editEmployeeData.salaryInfo?.ctcBreakdown?.medicalAllowance || 0) +
                (editEmployeeData.salaryInfo?.ctcBreakdown?.otherAllowances || 0)
              );
              return ctc > 0 ? `${((gross / ctc) * 100).toFixed(1)}%` : '0%';
            })()}
          </td>
        </tr>
        
        {/* Provident Fund */}
        <tr>
          <td className="fw-semibold">Provident Fund</td>
          <td>
            <div className="input-group input-group-sm">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control text-end"
                value={editEmployeeData.salaryInfo?.ctcBreakdown?.providentFund || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const currentBreakdown = editEmployeeData.salaryInfo?.ctcBreakdown || {};
                  handleEditInputChange('ctcBreakdown', {
                    ...currentBreakdown,
                    providentFund: value
                  }, 'salaryInfo.ctcBreakdown');
                }}
                placeholder="0"
              />
            </div>
          </td>
          <td className="text-end">
            {(() => {
              const ctc = editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0;
              const pf = editEmployeeData.salaryInfo?.ctcBreakdown?.providentFund || 0;
              return ctc > 0 ? `${((pf / ctc) * 100).toFixed(1)}%` : '0%';
            })()}
          </td>
        </tr>
        
        {/* Gratuity */}
        <tr>
          <td className="fw-semibold">Gratuity</td>
          <td>
            <div className="input-group input-group-sm">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control text-end"
                value={editEmployeeData.salaryInfo?.ctcBreakdown?.gratuity || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const currentBreakdown = editEmployeeData.salaryInfo?.ctcBreakdown || {};
                  handleEditInputChange('ctcBreakdown', {
                    ...currentBreakdown,
                    gratuity: value
                  }, 'salaryInfo.ctcBreakdown');
                }}
                placeholder="0"
              />
            </div>
          </td>
          <td className="text-end">
            {(() => {
              const ctc = editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0;
              const gratuity = editEmployeeData.salaryInfo?.ctcBreakdown?.gratuity || 0;
              return ctc > 0 ? `${((gratuity / ctc) * 100).toFixed(1)}%` : '0%';
            })()}
          </td>
        </tr>
        
        {/* Other Deductions */}
        <tr>
          <td className="fw-semibold">Other Deductions</td>
          <td>
            <div className="input-group input-group-sm">
              <span className="input-group-text">₹</span>
              <input
                type="number"
                className="form-control text-end"
                value={editEmployeeData.salaryInfo?.ctcBreakdown?.otherDeductions || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  const currentBreakdown = editEmployeeData.salaryInfo?.ctcBreakdown || {};
                  handleEditInputChange('ctcBreakdown', {
                    ...currentBreakdown,
                    otherDeductions: value
                  }, 'salaryInfo.ctcBreakdown');
                }}
                placeholder="0"
              />
            </div>
          </td>
          <td className="text-end">
            {(() => {
              const ctc = editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0;
              const deductions = editEmployeeData.salaryInfo?.ctcBreakdown?.otherDeductions || 0;
              return ctc > 0 ? `${((deductions / ctc) * 100).toFixed(1)}%` : '0%';
            })()}
          </td>
        </tr>
        

      </tbody>
    </table>
  </div>
</div>

    {/* === Bank Account Details === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 text-muted border-bottom pb-2 d-flex align-items-center gap-2">
        
        <span className="text-primary">
          <Icon icon="heroicons:building-library" />
        </span>
        Bank Account Details
      </h6>
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">Payment Mode</label>
      <select
        className="form-select"
        value={editEmployeeData.salaryInfo?.paymentMode || 'Bank Transfer'}
        onChange={(e) => handleEditInputChange('paymentMode', e.target.value, 'salaryInfo.paymentMode')}
      >
        <option value="Bank Transfer">Bank Transfer</option>
        <option value="Cheque">Cheque</option>
        <option value="Cash">Cash</option>
      </select>
    </div>

    {/* Primary Bank Account */}
    <div className="col-12 mt-3">
      <h6 className="fw-bold fs-5 mb-3 text-muted d-flex align-items-center gap-2">
        <span className="text-primary">
          <Icon icon="heroicons:banknotes" />
        </span>
        Primary Bank Account
      </h6>
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">Account Number</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.salaryInfo?.bankAccounts?.primary?.accountNumber || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
          if (value.length <= 18) {
            const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
            handleEditInputChange('bankAccounts', {
              ...currentAccounts,
              primary: {
                ...(currentAccounts.primary || {}),
                accountNumber: value
              }
            }, 'salaryInfo.bankAccounts');
          }
        }}
        placeholder="1234567890"
        maxLength="18"
      />
      {/* Validation message */}
      {editEmployeeData.salaryInfo?.bankAccounts?.primary?.accountNumber && 
       (editEmployeeData.salaryInfo.bankAccounts.primary.accountNumber.length < 9 || 
        editEmployeeData.salaryInfo.bankAccounts.primary.accountNumber.length > 18) && (
        <div className="text-danger small mt-1">
          Account number must be 9 to 18 digits
        </div>
      )}
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">IFSC Code</label>
      <input
        type="text"
        className="form-control text-uppercase"
        value={editEmployeeData.salaryInfo?.bankAccounts?.primary?.ifscCode || ''}
        onChange={(e) => {
          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (value.length <= 11) {
            const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
            handleEditInputChange('bankAccounts', {
              ...currentAccounts,
              primary: {
                ...(currentAccounts.primary || {}),
                ifscCode: value
              }
            }, 'salaryInfo.bankAccounts');
          }
        }}
        placeholder="BANK0001234"
        maxLength="11"
      />
      {/* Validation message */}
      {editEmployeeData.salaryInfo?.bankAccounts?.primary?.ifscCode && 
       editEmployeeData.salaryInfo.bankAccounts.primary.ifscCode.length !== 11 && (
        <div className="text-danger small mt-1">
          IFSC code must be exactly 11 alphanumeric characters
        </div>
      )}
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">Bank Name</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.salaryInfo?.bankAccounts?.primary?.bankName || ''}
        onChange={(e) => {
          const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
          handleEditInputChange('bankAccounts', {
            ...currentAccounts,
            primary: {
              ...(currentAccounts.primary || {}),
              bankName: e.target.value
            }
          }, 'salaryInfo.bankAccounts');
        }}
        placeholder="State Bank of India"
      />
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">Branch</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.salaryInfo?.bankAccounts?.primary?.branch || ''}
        onChange={(e) => {
          const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
          handleEditInputChange('bankAccounts', {
            ...currentAccounts,
            primary: {
              ...(currentAccounts.primary || {}),
              branch: e.target.value
            }
          }, 'salaryInfo.bankAccounts');
        }}
        placeholder="Main Branch, Mumbai"
      />
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">Account Type</label>
      <select
        className="form-select"
        value={editEmployeeData.salaryInfo?.bankAccounts?.primary?.accountType || 'Savings'}
        onChange={(e) => {
          const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
          handleEditInputChange('bankAccounts', {
            ...currentAccounts,
            primary: {
              ...(currentAccounts.primary || {}),
              accountType: e.target.value
            }
          }, 'salaryInfo.bankAccounts');
        }}
      >
        <option value="Savings">Savings</option>
        <option value="Current">Current</option>
        <option value="Salary">Salary</option>
      </select>
    </div>

    {/* Secondary Bank Account (Optional) */}
    <div className="col-12 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:plus-circle" />
          </span>
          Secondary Bank Account 
        </h6>
        <button
          type="button"
          className="job-listings-btn"
          onClick={() => {
            const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
            if (currentAccounts.secondary) {
              // Remove secondary account
              const { secondary, ...rest } = currentAccounts;
              handleEditInputChange('bankAccounts', rest, 'salaryInfo.bankAccounts');
            } else {
              // Add secondary account
              handleEditInputChange('bankAccounts', {
                ...currentAccounts,
                secondary: {
                  accountNumber: '',
                  ifscCode: '',
                  bankName: '',
                  branch: '',
                  accountType: 'Savings'
                }
              }, 'salaryInfo.bankAccounts');
            }
          }}
        >
          <Icon
            icon={
              editEmployeeData.salaryInfo?.bankAccounts?.secondary
                ? "heroicons:minus"
                : "heroicons:plus"
            }
          />
          {editEmployeeData.salaryInfo?.bankAccounts?.secondary
            ? "Remove Account"
            : "Add Account"}
        </button>
      </div>
    </div>
    
    {editEmployeeData.salaryInfo?.bankAccounts?.secondary && (
      <>
        <div className="col-md-6">
          <label className="form-label fw-bold">Account Number</label>
          <input
            type="text"
            className="form-control"
            value={editEmployeeData.salaryInfo?.bankAccounts?.secondary?.accountNumber || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
              if (value.length <= 18) {
                const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
                handleEditInputChange('bankAccounts', {
                  ...currentAccounts,
                  secondary: {
                    ...(currentAccounts.secondary || {}),
                    accountNumber: value
                  }
                }, 'salaryInfo.bankAccounts');
              }
            }}
            placeholder="1234567890"
            maxLength="18"
          />
          {/* Validation message */}
          {editEmployeeData.salaryInfo?.bankAccounts?.secondary?.accountNumber && 
           (editEmployeeData.salaryInfo.bankAccounts.secondary.accountNumber.length < 9 || 
            editEmployeeData.salaryInfo.bankAccounts.secondary.accountNumber.length > 18) && (
            <div className="text-danger small mt-1">
              Account number must be 9 to 18 digits
            </div>
          )}
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">IFSC Code</label>
          <input
            type="text"
            className="form-control text-uppercase"
            value={editEmployeeData.salaryInfo?.bankAccounts?.secondary?.ifscCode || ''}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (value.length <= 11) {
                const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
                handleEditInputChange('bankAccounts', {
                  ...currentAccounts,
                  secondary: {
                    ...(currentAccounts.secondary || {}),
                    ifscCode: value
                  }
                }, 'salaryInfo.bankAccounts');
              }
            }}
            placeholder="BANK0001234"
            maxLength="11"
          />
          {/* Validation message */}
          {editEmployeeData.salaryInfo?.bankAccounts?.secondary?.ifscCode && 
           editEmployeeData.salaryInfo.bankAccounts.secondary.ifscCode.length !== 11 && (
            <div className="text-danger small mt-1">
              IFSC code must be exactly 11 alphanumeric characters
            </div>
          )}
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Bank Name</label>
          <input
            type="text"
            className="form-control"
            value={editEmployeeData.salaryInfo?.bankAccounts?.secondary?.bankName || ''}
            onChange={(e) => {
              const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
              handleEditInputChange('bankAccounts', {
                ...currentAccounts,
                secondary: {
                  ...(currentAccounts.secondary || {}),
                  bankName: e.target.value
                }
              }, 'salaryInfo.bankAccounts');
            }}
            placeholder="Bank Name"
          />
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Branch</label>
          <input
            type="text"
            className="form-control"
            value={editEmployeeData.salaryInfo?.bankAccounts?.secondary?.branch || ''}
            onChange={(e) => {
              const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
              handleEditInputChange('bankAccounts', {
                ...currentAccounts,
                secondary: {
                  ...(currentAccounts.secondary || {}),
                  branch: e.target.value
                }
              }, 'salaryInfo.bankAccounts');
            }}
            placeholder="Branch Name"
          />
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Account Type</label>
          <select
            className="form-select"
            value={editEmployeeData.salaryInfo?.bankAccounts?.secondary?.accountType || 'Savings'}
            onChange={(e) => {
              const currentAccounts = editEmployeeData.salaryInfo?.bankAccounts || {};
              handleEditInputChange('bankAccounts', {
                ...currentAccounts,
                secondary: {
                  ...(currentAccounts.secondary || {}),
                  accountType: e.target.value
                }
              }, 'salaryInfo.bankAccounts');
            }}
          >
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
            <option value="Salary">Salary</option>
          </select>
        </div>
      </>
    )}

    {/* === Provident Fund & ESI === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:shield-check" />
        </span>
        Provident Fund & ESI
      </h6>
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">PF Account Number</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.salaryInfo?.pfAccountNumber || ''}
        onChange={(e) => {
          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (value.length <= 22) {
            handleEditInputChange('pfAccountNumber', value, 'salaryInfo.pfAccountNumber');
          }
        }}
        placeholder="PF123456789"
        maxLength="22"
      />

    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">UAN (Universal Account Number)</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.salaryInfo?.uan || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
          if (value.length <= 14) {
            handleEditInputChange('uan', value, 'salaryInfo.uan');
          }
        }}
        placeholder="123456789012"
        maxLength="14"
      />

    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">ESI Number</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.salaryInfo?.esiNumber || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
          if (value.length <= 10) {
            handleEditInputChange('esiNumber', value, 'salaryInfo.esiNumber');
          }
        }}
        placeholder="ESI123456789"
        maxLength="10"
      />
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">ESI Medical Nominee</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.salaryInfo?.esiMedicalNominee || ''}
        onChange={(e) => handleEditInputChange('esiMedicalNominee', e.target.value, 'salaryInfo.esiMedicalNominee')}
        placeholder="Nominee Name"
      />
    </div>

    {/* === Tax & Benefits === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:document-check" />
        </span>
        Tax & Benefits
      </h6>
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">Tax Regime</label>
      <select
        className="form-select"
        value={editEmployeeData.salaryInfo?.taxDeclaration?.regime || 'New'}
        onChange={(e) => {
          const currentTax = editEmployeeData.salaryInfo?.taxDeclaration || {};
          handleEditInputChange('taxDeclaration', {
            ...currentTax,
            regime: e.target.value
          }, 'salaryInfo.taxDeclaration');
        }}
      >
        <option value="Old Regime">Old Regime</option>
        <option value="New Regime">New Regime</option>
      </select>
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">Tax Declaration</label>
      <select
        className="form-select"
        value={editEmployeeData.salaryInfo?.taxDeclaration?.declared ? 'Yes' : 'No'}
        onChange={(e) => {
          const currentTax = editEmployeeData.salaryInfo?.taxDeclaration || {};
          handleEditInputChange('taxDeclaration', {
            ...currentTax,
            declared: e.target.value === 'Yes'
          }, 'salaryInfo.taxDeclaration');
        }}
      >
        <option value="No">Not Declared</option>
        <option value="Yes">Declared</option>
      </select>
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">Variable Pay Percentage</label>
      <div className="input-group">
        <input
          type="number"
          className="form-control"
          value={editEmployeeData.salaryInfo?.variablePay?.percentage || 0}
          onChange={(e) => {
            const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
            const currentVariablePay = editEmployeeData.salaryInfo?.variablePay || {};
            handleEditInputChange('variablePay', {
              ...currentVariablePay,
              eligible: value > 0,
              percentage: value
            }, 'salaryInfo.variablePay');
          }}
          placeholder="Enter percentage (0-100)"
          min="0"
          max="100"
          step="0.5"
        />
        <span className="input-group-text">%</span>
      </div>
      <small className="text-muted">
        {editEmployeeData.salaryInfo?.variablePay?.percentage > 0 ? (
          <span className="text-success">
            Eligible ({(editEmployeeData.salaryInfo.variablePay.percentage || 0)}%)
          </span>
        ) : (
          <span className="text-secondary">Not eligible (0%)</span>
        )}
      </small>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Bonus Amount</label>
      <div className="input-group">
        <span className="input-group-text">₹</span>
        <input
          type="number"
          className="form-control"
          value={editEmployeeData.salaryInfo?.bonusEligibility?.amount || 0}
          onChange={(e) => {
            const value = Math.max(0, parseInt(e.target.value) || 0);
            const currentBonus = editEmployeeData.salaryInfo?.bonusEligibility || {};
            handleEditInputChange('bonusEligibility', {
              ...currentBonus,
              eligible: value > 0,
              amount: value
            }, 'salaryInfo.bonusEligibility');
          }}
          placeholder="Enter bonus amount"
          min="0"
          step="1000"
        />
      </div>
      <small className="text-muted">
        {editEmployeeData.salaryInfo?.bonusEligibility?.amount > 0 ? (
          <span className="text-success">
            Eligible ({formatCurrency(editEmployeeData.salaryInfo.bonusEligibility.amount || 0)})
          </span>
        ) : (
          <span className="text-secondary">Not eligible (₹0)</span>
        )}
      </small>
    </div>

    {/* === Salary Revision History === */}
    <div className="col-12 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:chart-bar" />
          </span>
          Salary Revision History
        </h6>
        <button
          type="button"
          className="create-job-btn"
          onClick={() => {
            const currentRevisions = editEmployeeData.salaryInfo?.salaryRevisionHistory || [];
            const newRevision = {
              id: Date.now(),
              effectiveDate: new Date().toISOString().split("T")[0],
              previousCTC: editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0,
              newCTC: editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary || 0,
              percentageIncrease: 0,
              approvedBy: "",
              status: "Pending"
            };
            handleEditInputChange('salaryRevisionHistory', [...currentRevisions, newRevision], 'salaryInfo.salaryRevisionHistory');
          }}
        >
          <Icon icon="heroicons:plus" className="me-1" />
          Add Salary Revision
        </button>
      </div>

      {/* Salary Revision Cards */}
      <div className="col-12">
        {(editEmployeeData.salaryInfo?.salaryRevisionHistory || []).length > 0 ? (
          (editEmployeeData.salaryInfo.salaryRevisionHistory || []).map((revision, idx) => (
            <div key={revision.id} className="card border mb-3">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted">{formatDate(revision.effectiveDate)}</span>
                  <span className={`badge ${
                    revision.status === 'Approved' ? 'bg-success' :
                    revision.status === 'Rejected' ? 'bg-danger' :
                    'bg-warning'
                  }`}>
                    {revision.status}
                  </span>
                </div>
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this salary revision entry?')) {
                        const currentRevisions = editEmployeeData.salaryInfo?.salaryRevisionHistory || [];
                        const updatedRevisions = currentRevisions.filter((_, i) => i !== idx);
                        handleEditInputChange('salaryRevisionHistory', updatedRevisions, 'salaryInfo.salaryRevisionHistory');
                      }
                    }}
                    title="Delete"
                  >
                    <Icon icon="heroicons:trash" />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {/* Effective Date */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Effective Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={revision.effectiveDate}
                      onChange={(e) => handleEditArrayUpdate('salaryInfo.salaryRevisionHistory', idx, 'effectiveDate', e.target.value)}
                    />
                  </div>
                  
                  {/* Status */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Status</label>
                    <select
                      className="form-select"
                      value={revision.status}
                      onChange={(e) => handleEditArrayUpdate('salaryInfo.salaryRevisionHistory', idx, 'status', e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Previous CTC */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Previous CTC</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        value={revision.previousCTC}
                        onChange={(e) => {
                          const prevCTC = parseInt(e.target.value) || 0;
                          const newCTC = revision.newCTC || prevCTC;
                          const percentageIncrease = prevCTC > 0 
                            ? Math.round(((newCTC - prevCTC) / prevCTC) * 100) 
                            : 0;
                          
                          handleEditArrayUpdate('salaryInfo.salaryRevisionHistory', idx, 'previousCTC', prevCTC);
                          handleEditArrayUpdate('salaryInfo.salaryRevisionHistory', idx, 'percentageIncrease', percentageIncrease);
                        }}
                        placeholder="Previous salary"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  {/* New CTC */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">New CTC</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        value={revision.newCTC}
                        onChange={(e) => {
                          const newCTC = parseInt(e.target.value) || 0;
                          const prevCTC = revision.previousCTC || newCTC;
                          const percentageIncrease = prevCTC > 0 
                            ? Math.round(((newCTC - prevCTC) / prevCTC) * 100) 
                            : 0;
                          
                          handleEditArrayUpdate('salaryInfo.salaryRevisionHistory', idx, 'newCTC', newCTC);
                          handleEditArrayUpdate('salaryInfo.salaryRevisionHistory', idx, 'percentageIncrease', percentageIncrease);
                        }}
                        placeholder="New salary"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Percentage Increase */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Percentage Increase</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        value={revision.percentageIncrease}
                        onChange={(e) => {
                          const percentage = parseInt(e.target.value) || 0;
                          const prevCTC = revision.previousCTC || 0;
                          const newCTC = prevCTC + (prevCTC * percentage / 100);
                          
                          handleEditArrayUpdate('salaryInfo.salaryRevisionHistory', idx, 'percentageIncrease', percentage);
                          handleEditArrayUpdate('salaryInfo.salaryRevisionHistory', idx, 'newCTC', Math.round(newCTC));
                        }}
                        placeholder="Percentage"
                        min="0"
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                  
                  {/* Approved By */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Approved By</label>
                    <input
                      type="text"
                      className="form-control"
                      value={revision.approvedBy || ''}
                      onChange={(e) => handleEditArrayUpdate('salaryInfo.salaryRevisionHistory', idx, 'approvedBy', e.target.value)}
                      placeholder="Approver name"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-light border d-flex align-items-center gap-2">
            <Icon icon="heroicons:information-circle" className="me-2 text-muted" />
            No salary revision history added. Click "Add Salary Revision" to add one.
          </div>
        )}
      </div>
    </div>
  </div>
)}
          {/* Statutory & Compliance Tab - Modified for Edit */}
{activeEditTab === 'statutory' && (
  <div className="row g-3">
    {/* Note Section */}
    <div className="col-12 mb-3">
       <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:shield-check" />
        </span>
            Statutory & Compliance Information
        </h6>
    </div>

    {/* === PAN Card Details === */}
    <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:credit-card" />
        </span>
        PAN Card Details
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">PAN Number <span className="text-danger">*</span></label>
      <input
        type="text"
        className="form-control text-uppercase"
        value={editEmployeeData.personalInfo?.identification?.pan?.number || ''}
        onChange={(e) => {
          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (value.length <= 10) {
            handleEditInputChange('number', value, 'personalInfo.identification.pan.number');
          }
        }}
        placeholder="ABCDE1234F"
        maxLength="10"
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">PAN Verified</label>
      <select
        className="form-select"
        value={editEmployeeData.statutoryInfo?.pan?.verified || false}
        onChange={(e) => handleEditInputChange('verified', e.target.value === 'true', 'statutoryInfo.pan.verified')}
      >
        <option value="false">Not Verified</option>
        <option value="true">Verified</option>
      </select>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">PAN Verification Date</label>
      <input
        type="date"
        className="form-control"
        value={editEmployeeData.statutoryInfo?.pan?.verifiedDate || ''}
        onChange={(e) => handleEditInputChange('verifiedDate', e.target.value, 'statutoryInfo.pan.verifiedDate')}
      />
    </div>

    {/* === Aadhaar Card Details === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:identification" />
        </span>
        Aadhaar Card Details
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Aadhaar Number <span className="text-danger">*</span></label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.personalInfo?.identification?.aadhaar?.number || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length <= 12) {
            handleEditInputChange('number', value, 'personalInfo.identification.aadhaar.number');
          }
        }}
        placeholder="123456789012"
        maxLength="12"
        required
      />
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Aadhaar Verified</label>
      <select
        className="form-select"
        value={editEmployeeData.statutoryInfo?.aadhaar?.verified || false}
        onChange={(e) => handleEditInputChange('verified', e.target.value === 'true', 'statutoryInfo.aadhaar.verified')}
      >
        <option value="false">Not Verified</option>
        <option value="true">Verified</option>
      </select>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Aadhaar Verification Date</label>
      <input
        type="date"
        className="form-control"
        value={editEmployeeData.statutoryInfo?.aadhaar?.verifiedDate || ''}
        onChange={(e) => handleEditInputChange('verifiedDate', e.target.value, 'statutoryInfo.aadhaar.verifiedDate')}
      />
    </div>

    {/* === Provident Fund Membership === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:banknotes" />
        </span>
        Provident Fund Membership
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">PF Enrolled</label>
      <select
        className="form-select"
        value={editEmployeeData.statutoryInfo?.pfMembership?.enrolled || false}
        onChange={(e) => {
          const isEnrolled = e.target.value === 'true';
          handleEditInputChange('enrolled', isEnrolled, 'statutoryInfo.pfMembership.enrolled');
          
          // Clear fields if not enrolled
          if (!isEnrolled) {
            handleEditInputChange('accountNumber', '', 'statutoryInfo.pfMembership.accountNumber');
            handleEditInputChange('uan', '', 'statutoryInfo.pfMembership.uan');
            handleEditInputChange('enrollmentDate', '', 'statutoryInfo.pfMembership.enrollmentDate');
            handleEditInputChange('accountType', '', 'statutoryInfo.pfMembership.accountType');
          }
        }}
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </div>

    {editEmployeeData.statutoryInfo?.pfMembership?.enrolled && (
      <>
    <div className="col-md-6">
      <label className="form-label fw-bold">PF Account Number</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.salaryInfo?.pfAccountNumber || ''}
        onChange={(e) => {
          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (value.length <= 22) {
            handleEditInputChange('pfAccountNumber', value, 'salaryInfo.pfAccountNumber');
          }
        }}
        placeholder="PF123456789"
        maxLength="22"
      />

    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">UAN (Universal Account Number)</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.salaryInfo?.uan || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
          if (value.length <= 14) {
            handleEditInputChange('uan', value, 'salaryInfo.uan');
          }
        }}
        placeholder="123456789012"
        maxLength="14"
      />

    </div>
    

        <div className="col-md-6">
          <label className="form-label fw-bold">PF Enrollment Date</label>
          <input
            type="date"
            className="form-control"
            value={editEmployeeData.statutoryInfo?.pfMembership?.enrollmentDate || ''}
            onChange={(e) => handleEditInputChange('enrollmentDate', e.target.value, 'statutoryInfo.pfMembership.enrollmentDate')}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">PF Account Type</label>
          <select
            className="form-select"
            value={editEmployeeData.statutoryInfo?.pfMembership?.accountType || 'Regular'}
            onChange={(e) => handleEditInputChange('accountType', e.target.value, 'statutoryInfo.pfMembership.accountType')}
          >
            <option value="Regular">Regular</option>
            <option value="Exempted">Exempted</option>
            <option value="Voluntary">Voluntary</option>
            <option value="International Worker">International Worker</option>
          </select>
        </div>
      </>
    )}

    {/* === ESI Registration === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:heart" />
        </span>
        ESI Registration
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">ESI Enrolled</label>
      <select
        className="form-select"
        value={editEmployeeData.statutoryInfo?.esiRegistration?.enrolled || false}
        onChange={(e) => {
          const isEnrolled = e.target.value === 'true';
          handleEditInputChange('enrolled', isEnrolled, 'statutoryInfo.esiRegistration.enrolled');
          
          // Clear fields if not enrolled
          if (!isEnrolled) {
            handleEditInputChange('number', '', 'statutoryInfo.esiRegistration.number');
            handleEditInputChange('enrollmentDate', '', 'statutoryInfo.esiRegistration.enrollmentDate');
          }
        }}
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </div>

    {editEmployeeData.statutoryInfo?.esiRegistration?.enrolled && (
      <>
    <div className="col-md-6">
      <label className="form-label fw-bold">ESI Number</label>
      <input
        type="text"
        className="form-control"
        value={editEmployeeData.salaryInfo?.esiNumber || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
          if (value.length <= 10) {
            handleEditInputChange('esiNumber', value, 'salaryInfo.esiNumber');
          }
        }}
        placeholder="ESI123456789"
        maxLength="10"
      />

    </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">ESI Enrollment Date</label>
          <input
            type="date"
            className="form-control"
            value={editEmployeeData.statutoryInfo?.esiRegistration?.enrollmentDate || ''}
            onChange={(e) => handleEditInputChange('enrollmentDate', e.target.value, 'statutoryInfo.esiRegistration.enrollmentDate')}
          />
        </div>
      </>
    )}

    {/* === Professional Tax === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:document-text" />
        </span>
        Professional Tax
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Professional Tax Applicable</label>
      <select
        className="form-select"
        value={editEmployeeData.statutoryInfo?.professionalTax?.applicable || false}
        onChange={(e) => {
          const isApplicable = e.target.value === 'true';
          handleEditInputChange('applicable', isApplicable, 'statutoryInfo.professionalTax.applicable');
          
          // Clear fields if not applicable
          if (!isApplicable) {
            handleEditInputChange('state', '', 'statutoryInfo.professionalTax.state');
            handleEditInputChange('ptNumber', '', 'statutoryInfo.professionalTax.ptNumber');
          }
        }}
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </div>

    {editEmployeeData.statutoryInfo?.professionalTax?.applicable && (
      <>
        <div className="col-md-6">
          <label className="form-label fw-bold">State</label>
          <select
            className="form-select"
            value={editEmployeeData.statutoryInfo?.professionalTax?.state || ''}
            onChange={(e) => handleEditInputChange('state', e.target.value, 'statutoryInfo.professionalTax.state')}
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Telangana">Telangana</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Delhi">Delhi</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
        </div>

<div className="col-md-6">
  <label className="form-label fw-bold">PT Number</label>
  <input
    type="text"
    className="form-control"
    value={editEmployeeData.statutoryInfo?.professionalTax?.ptNumber || ''}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
      if (value.length <= 11) {
        handleEditInputChange('ptNumber', value, 'statutoryInfo.professionalTax.ptNumber');
      }
    }}
    placeholder="12345678901"
    maxLength="11"
  />

</div>
      </>
    )}

    {/* === Labour Welfare Fund === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:users" />
        </span>
        Labour Welfare Fund
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Labour Welfare Fund Enrolled</label>
      <select
        className="form-select"
        value={editEmployeeData.statutoryInfo?.labourWelfareFund?.enrolled || false}
        onChange={(e) => {
          const isEnrolled = e.target.value === 'true';
          handleEditInputChange('enrolled', isEnrolled, 'statutoryInfo.labourWelfareFund.enrolled');
          
          // Clear enrollment date if not enrolled
          if (!isEnrolled) {
            handleEditInputChange('enrollmentDate', '', 'statutoryInfo.labourWelfareFund.enrollmentDate');
          }
        }}
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </div>

    {editEmployeeData.statutoryInfo?.labourWelfareFund?.enrolled && (
      <div className="col-md-6">
        <label className="form-label fw-bold">Enrollment Date</label>
        <input
          type="date"
          className="form-control"
          value={editEmployeeData.statutoryInfo?.labourWelfareFund?.enrollmentDate || ''}
          onChange={(e) => handleEditInputChange('enrollmentDate', e.target.value, 'statutoryInfo.labourWelfareFund.enrollmentDate')}
        />
      </div>
    )}

    {/* === Gratuity === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:gift" />
        </span>
        Gratuity
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Gratuity Eligible</label>
      <select
        className="form-select"
        value={editEmployeeData.statutoryInfo?.gratuity?.eligible || false}
        onChange={(e) => {
          const isEligible = e.target.value === 'true';
          handleEditInputChange('eligible', isEligible, 'statutoryInfo.gratuity.eligible');
          
          // Clear eligibility date if not eligible
          if (!isEligible) {
            handleEditInputChange('eligibilityDate', '', 'statutoryInfo.gratuity.eligibilityDate');
          }
        }}
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </div>

    {editEmployeeData.statutoryInfo?.gratuity?.eligible && (
      <div className="col-md-6">
        <label className="form-label fw-bold">Eligibility Date</label>
        <input
          type="date"
          className="form-control"
          value={editEmployeeData.statutoryInfo?.gratuity?.eligibilityDate || ''}
          onChange={(e) => handleEditInputChange('eligibilityDate', e.target.value, 'statutoryInfo.gratuity.eligibilityDate')}
        />
      </div>
    )}

    {/* === Bonus Act === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:currency-rupee" />
        </span>
        Bonus Act
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Bonus Act Applicable</label>
      <select
        className="form-select"
        value={editEmployeeData.statutoryInfo?.bonusAct?.applicable || false}
        onChange={(e) => handleEditInputChange('applicable', e.target.value === 'true', 'statutoryInfo.bonusAct.applicable')}
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </div>

    {/* === Shops and Establishment Act === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:building-office" />
        </span>
        Shops and Establishment Act
      </h6>
    </div>

    <div className="col-md-6">
      <label className="form-label fw-bold">Registered</label>
      <select
        className="form-select"
        value={editEmployeeData.statutoryInfo?.shopsAndEstablishment?.registered || false}
        onChange={(e) => {
          const isRegistered = e.target.value === 'true';
          handleEditInputChange('registered', isRegistered, 'statutoryInfo.shopsAndEstablishment.registered');
          
          // Clear fields if not registered
          if (!isRegistered) {
            handleEditInputChange('registrationNumber', '', 'statutoryInfo.shopsAndEstablishment.registrationNumber');
            handleEditInputChange('registrationDate', '', 'statutoryInfo.shopsAndEstablishment.registrationDate');
          }
        }}
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </div>

    {editEmployeeData.statutoryInfo?.shopsAndEstablishment?.registered && (
      <>
<div className="col-md-6">
  <label className="form-label fw-bold">Registration Number</label>

  <input
    type="text"
    className="form-control"
    value={
      editEmployeeData.statutoryInfo?.shopsAndEstablishment?.registrationNumber || ''
    }
    onChange={(e) => {
      const value = e.target.value.toUpperCase();

      // Allow only A–Z, 0–9, and hyphen, max 15 chars
      if (value.length <= 15 && /^[A-Z0-9-]*$/.test(value)) {
        handleEditInputChange(
          'registrationNumber',
          value,
          'statutoryInfo.shopsAndEstablishment.registrationNumber'
        );
      }
    }}
    placeholder="Registration number"
    maxLength={15}
  />

</div>


        <div className="col-md-6">
          <label className="form-label fw-bold">Registration Date</label>
          <input
            type="date"
            className="form-control"
            value={editEmployeeData.statutoryInfo?.shopsAndEstablishment?.registrationDate || ''}
            onChange={(e) => handleEditInputChange('registrationDate', e.target.value, 'statutoryInfo.shopsAndEstablishment.registrationDate')}
          />
        </div>
      </>
    )}
  </div>
)}

        </div>
      </div>
      
      <div className="modal-footer d-flex justify-content-end gap-2" style={{ flexShrink: 0 }}>
        <button
          type="button"
          className="cancel-btn"
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
<button 
  type="button" 
  className="take-quiz-btn d-flex align-items-center justify-content-center"
  onClick={handleSaveEditedEmployee}
  disabled={
    !editEmployeeData.name ||
    !editEmployeeData.email ||
    !editEmployeeData.employmentInfo?.designation ||
    !editEmployeeData.salary
  }
>
  <Icon icon="heroicons:check-circle" className="me-2" />
  <span>Save Changes</span>
</button>
      </div>
    </div>
  </div>
)}  

       {showAddModal && (
      <div
        className="hrms-modal-overlay"

      >
        <div
              className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
        >
              {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                        <Icon icon="heroicons:user-plus" />
                        Add New Employee
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setShowAddModal(false);
                          setActiveAddTab('personal');
                        }}
                      ></button>
                    </div>
              <div className="hrms-modal-body hrms-modal-body-scroll">
                      {/* Tab Navigation */}
    <ul className="nav nav-tabs border-bottom px-3 pt-3" style={{ flexShrink: 0 }}>
      <li className="nav-item">
        <button
          className={`nav-link d-flex align-items-center gap-2 ${activeAddTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveAddTab('personal')}
        >
          <Icon icon="heroicons:user-circle" />
          Personal Info
        </button>
      </li>
    
      <li className="nav-item">
        <button
          className={`nav-link d-flex align-items-center gap-2 ${activeAddTab === 'employment' ? 'active' : ''}`}
          onClick={() => setActiveAddTab('employment')}
        >
          <Icon icon="heroicons:briefcase" />
          Employment
        </button>
      </li>
    <li className="nav-item">
        <button
          className={`nav-link d-flex align-items-center gap-2 ${activeAddTab === 'jobHistory' ? 'active' : ''}`}
          onClick={() => setActiveAddTab('jobHistory')}
        >
          <Icon icon="heroicons:clock" />
          Service History
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link d-flex align-items-center gap-2 ${activeAddTab === 'salary' ? 'active' : ''}`}
          onClick={() => setActiveAddTab('salary')}
        >
          <Icon icon="heroicons:currency-dollar" />
          Salary & Compensation
        </button>
      </li>
    
      <li className="nav-item">
        <button
          className={`nav-link d-flex align-items-center gap-2 ${activeAddTab === 'statutory' ? 'active' : ''}`}
          onClick={() => setActiveAddTab('statutory')}
        >
          <Icon icon="heroicons:document-check" />
          Statutory & Compliance
        </button>
      </li>
    </ul>
    
    
                      {/* Tab Content */}
                      <div className="p-4" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
     
                        {/* Personal Information Tab */}
    
    {activeAddTab === 'personal' && (
      <div className="row g-3">
        
                        {/* Profile Photo Upload */}
                    <div className="col-12 mb-3">
                      <label className="form-label fw-bold">Profile Photo</label>
                      <div className="d-flex align-items-center gap-3">
                        <div className="position-relative">
                          {newEmployee.personalInfo.profilePhoto ? (
                            <img 
                              src={newEmployee.personalInfo.profilePhoto} 
                              alt="Profile" 
                              className="rounded-circle border"
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="rounded-circle border d-flex align-items-center justify-content-center bg-light" style={{ width: '100px', height: '100px' }}>
                              <Icon icon="heroicons:user" className="fs-1 text-muted" />
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setNewEmployee({
                                    ...newEmployee,
                                    personalInfo: {
                                      ...newEmployee.personalInfo,
                                      profilePhoto: reader.result
                                    }
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <small className="text-muted">Upload employee profile photo (JPG, PNG, max 5MB)</small>
                        </div>
                      </div>
                    </div>

        {/* === Basic Information === */}
        <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:identification" />
            </span>
            Basic Information
          </h6>
        </div>
    
 <div className="col-md-6">
  <label className="form-label fw-bold">
    Full Name <span className="text-danger">*</span>
  </label>

  <input
    type="text"
    className="form-control"
    value={newEmployee.name}
    onChange={(e) =>
      setNewEmployee((prev) => ({
        ...prev,
        name: e.target.value
      }))
    }
    placeholder="Enter full name"
    autoComplete="new-name"
    name="employee_full_name"
  />

</div>

    
        <div className="col-md-6">
          <label className="form-label fw-bold">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={newEmployee.personalInfo.dateOfBirth}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {...newEmployee.personalInfo, dateOfBirth: e.target.value}
            })}
          />
        </div>
    
        <div className="col-md-4">
          <label className="form-label fw-bold">Gender</label>
          <select
            className="form-select"
            value={newEmployee.personalInfo.gender}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {...newEmployee.personalInfo, gender: e.target.value}
            })}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
    
        <div className="col-md-4">
          <label className="form-label fw-bold">Blood Group</label>
          <select
            className="form-select"
            value={newEmployee.personalInfo.bloodGroup}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {...newEmployee.personalInfo, bloodGroup: e.target.value}
            })}
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
    
        <div className="col-md-4">
          <label className="form-label fw-bold">Marital Status</label>
          <select
            className="form-select"
            value={newEmployee.personalInfo.maritalStatus}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {...newEmployee.personalInfo, maritalStatus: e.target.value}
            })}
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
          </select>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Nationality</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.nationality}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {...newEmployee.personalInfo, nationality: e.target.value}
            })}
            placeholder="Enter nationality"
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Languages</label>
          <div className="d-flex gap-2 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Enter a language"
              id="languageInput"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  e.preventDefault();
                  const newLanguage = e.target.value.trim();
                  if (!newEmployee.personalInfo.languages.includes(newLanguage)) {
                    setNewEmployee({
                      ...newEmployee,
                      personalInfo: {
                        ...newEmployee.personalInfo,
                        languages: [...newEmployee.personalInfo.languages, newLanguage]
                      }
                    });
                  }
                  e.target.value = '';
                }
              }}
            />
            <button
              type="button"
              className="job-listings-btn"
              onClick={(e) => {
                const input = document.getElementById('languageInput');
                const newLanguage = input.value.trim();
                if (newLanguage && !newEmployee.personalInfo.languages.includes(newLanguage)) {
                  setNewEmployee({
                    ...newEmployee,
                    personalInfo: {
                      ...newEmployee.personalInfo,
                      languages: [...newEmployee.personalInfo.languages, newLanguage]
                    }
                  });
                  input.value = '';
                }
              }}
            >
              Add
            </button>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {newEmployee.personalInfo.languages.map((language, index) => (
              <div key={index} className="badge bg-primary d-flex align-items-center gap-1">
                {language}
                <button
                  type="button"
                  className="btn-close btn-close-white btn-sm"
                  onClick={() => {
                    setNewEmployee({
                      ...newEmployee,
                      personalInfo: {
                        ...newEmployee.personalInfo,
                        languages: newEmployee.personalInfo.languages.filter((_, i) => i !== index)
                      }
                    });
                  }}
                ></button>
              </div>
            ))}
          </div>
          {newEmployee.personalInfo.languages.length === 0 && (
            <small className="text-muted">No languages added yet. Type a language and press Enter or click Add.</small>
          )}
        </div>
    
        {/* === Contact Information === */}
        <div className="col-12 mt-4">
        <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:phone" />
            </span>
            Contact Information
          </h6>
        </div>
    
    
        <div className="col-md-6">
          <label className="form-label fw-bold"> Email <span className="text-danger">*</span></label>
          <input
            type="email"
            className="form-control"
            value={newEmployee.employmentInfo.workEmail || newEmployee.email}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              email: e.target.value,
              employmentInfo: {...newEmployee.employmentInfo, workEmail: e.target.value}
            })}
            placeholder="employee@company.com"
            required
          />
          {
            newEmployee.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmployee.email) && (
              <div className="text-danger small mt-1">
                Please enter a valid email address.
              </div>
            )
          }
        </div>



    
        <div className="col-md-6">
          <label className="form-label fw-bold">Primary Phone <span className="text-danger">*</span></label>
          <input
            type="tel"
            className="form-control"
            value={newEmployee.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                setNewEmployee({
                  ...newEmployee,
                  phone: value,
                  personalInfo: {...newEmployee.personalInfo, phonePrimary: value}
                });
              }
            }}
            placeholder="Enter 10-digit phone number"
            maxLength="10"
            required
          />
          {            
          newEmployee.phone && newEmployee.phone.length !== 10 && (
              <div className="text-danger small mt-1">
                Primary phone number must be exactly 10 digits.
              </div>
            )}
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Secondary Phone</label>
          <input
            type="tel"
            className="form-control"
            value={newEmployee.personalInfo.phoneSecondary}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                setNewEmployee({
                  ...newEmployee,
                  personalInfo: {...newEmployee.personalInfo, phoneSecondary: value}
                });
              }
            }}
            placeholder="Enter 10-digit phone number"
            maxLength="10"
          />
          {
          newEmployee.personalInfo.phoneSecondary && newEmployee.personalInfo.phoneSecondary.length !== 10 && (
              <div className="text-danger small mt-1">
                Secondary phone number must be exactly 10 digits.
              </div>
            )
          }
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Emergency Phone</label>
          <input
            type="tel"
            className="form-control"
            value={newEmployee.personalInfo.phoneEmergency}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                setNewEmployee({
                  ...newEmployee,
                  personalInfo: {...newEmployee.personalInfo, phoneEmergency: value}
                });
              }
            }}
            placeholder="Enter 10-digit emergency phone"
            maxLength="10"
          />
          {
          newEmployee.personalInfo.phoneEmergency && newEmployee.personalInfo.phoneEmergency.length !== 10 &&(
            <div className="text-danger small mt-1">
              Emergency phone number must be exactly 10 digits.
              </div>
              )}
        </div>
    
        {/* === Current Address === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:map-pin" />
            </span>
            Current Address
          </h6>
        </div>
    
        <div className="col-12">
          <label className="form-label fw-bold">Address Line 1</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.currentAddress.line1}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                currentAddress: {...newEmployee.personalInfo.currentAddress, line1: e.target.value}
              }
            })}
            placeholder="Enter address line 1"
          />

        </div>
    
        <div className="col-12">
          <label className="form-label fw-bold">Address Line 2</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.currentAddress.line2}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                currentAddress: {...newEmployee.personalInfo.currentAddress, line2: e.target.value}
              }
            })}
            placeholder="Enter address line 2"
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">City</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.currentAddress.city}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                currentAddress: {...newEmployee.personalInfo.currentAddress, city: e.target.value}
              }
            })}
            placeholder="Enter city"
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">State</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.currentAddress.state}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                currentAddress: {...newEmployee.personalInfo.currentAddress, state: e.target.value}
              }
            })}
            placeholder="Enter state"
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Pincode</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.currentAddress.pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 6) {
                setNewEmployee({
                  ...newEmployee,
                  personalInfo: {
                    ...newEmployee.personalInfo,
                    currentAddress: {...newEmployee.personalInfo.currentAddress, pincode: value}
                  }
                });
              }
            }}
            placeholder="Enter pincode"
            maxLength="6"
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Country</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.currentAddress.country}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                currentAddress: {...newEmployee.personalInfo.currentAddress, country: e.target.value}
              }
            })}
            placeholder="Enter country"
          />
        </div>
    
        {/* Permanent Address Section */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:home" />
            </span>
            Permanent Address
          </h6>
        </div>
    
    <div className="col-12 mb-3">
      <label
        htmlFor="sameAsCurrent"
        className="d-flex align-items-center form-check"
        style={{ cursor: "pointer" }}
      >
        {/* Custom Checkbox Box */}
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            border: `2px solid ${
              JSON.stringify(newEmployee.personalInfo.currentAddress) ===
                JSON.stringify(newEmployee.personalInfo.permanentAddress) &&
              Object.values(newEmployee.personalInfo.currentAddress).some(
                (val) => val !== ""
              )
                ? "#3B82F6"
                : "#9CA3AF"
            }`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "10px",
            transition: "all 0.3s ease",
            background:
              JSON.stringify(newEmployee.personalInfo.currentAddress) ===
                JSON.stringify(newEmployee.personalInfo.permanentAddress) &&
              Object.values(newEmployee.personalInfo.currentAddress).some(
                (val) => val !== ""
              )
                ? "#3B82F6"
                : "transparent",
          }}
        >
          {(JSON.stringify(newEmployee.personalInfo.currentAddress) ===
            JSON.stringify(newEmployee.personalInfo.permanentAddress) &&
            Object.values(newEmployee.personalInfo.currentAddress).some(
              (val) => val !== ""
            )) && (
            <span
              style={{
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                lineHeight: 1,
              }}
            >
              ✓
            </span>
          )}
        </div>
    
        {/* Hidden Native Checkbox */}
        <input
          type="checkbox"
          id="sameAsCurrent"
          className="form-check-input"
          style={{ display: "none" }}
          checked={
            JSON.stringify(newEmployee.personalInfo.currentAddress) ===
              JSON.stringify(newEmployee.personalInfo.permanentAddress) &&
            Object.values(newEmployee.personalInfo.currentAddress).some(
              (val) => val !== ""
            )
          }
          onChange={(e) => {
            if (e.target.checked) {
              setNewEmployee({
                ...newEmployee,
                personalInfo: {
                  ...newEmployee.personalInfo,
                  permanentAddress: {
                    ...newEmployee.personalInfo.currentAddress,
                  },
                },
              });
            } else {
              setNewEmployee({
                ...newEmployee,
                personalInfo: {
                  ...newEmployee.personalInfo,
                  permanentAddress: {
                    line1: "",
                    line2: "",
                    city: "",
                    state: "",
                    pincode: "",
                    country: "",
                  },
                },
              });
            }
          }}
        />
    
        {/* Label Text */}
        <span className="fw-semibold">Same as Current Address</span>
      </label>
    </div>
    
    
        <div className="col-12">
          <label className="form-label fw-bold">Address Line 1</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.permanentAddress.line1}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                permanentAddress: {...newEmployee.personalInfo.permanentAddress, line1: e.target.value}
              }
            })}
            placeholder="Enter address line 1"
            disabled={
              JSON.stringify(newEmployee.personalInfo.currentAddress) ===
              JSON.stringify(newEmployee.personalInfo.permanentAddress) &&
              Object.values(newEmployee.personalInfo.currentAddress).some(val => val !== "")
            }
          />
        </div>
    
        <div className="col-12">
          <label className="form-label fw-bold">Address Line 2</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.permanentAddress.line2}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                permanentAddress: {...newEmployee.personalInfo.permanentAddress, line2: e.target.value}
              }
            })}
            placeholder="Enter address line 2"
            disabled={
              JSON.stringify(newEmployee.personalInfo.currentAddress) ===
              JSON.stringify(newEmployee.personalInfo.permanentAddress) &&
              Object.values(newEmployee.personalInfo.currentAddress).some(val => val !== "")
            }
          />
        </div>
    
        <div className="col-md-4">
          <label className="form-label fw-bold">City</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.permanentAddress.city}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                permanentAddress: {...newEmployee.personalInfo.permanentAddress, city: e.target.value}
              }
            })}
            placeholder="Enter city"
            disabled={
              JSON.stringify(newEmployee.personalInfo.currentAddress) ===
              JSON.stringify(newEmployee.personalInfo.permanentAddress) &&
              Object.values(newEmployee.personalInfo.currentAddress).some(val => val !== "")
            }
          />
        </div>
    
        <div className="col-md-4">
          <label className="form-label fw-bold">State</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.permanentAddress.state}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                permanentAddress: {...newEmployee.personalInfo.permanentAddress, state: e.target.value}
              }
            })}
            placeholder="Enter state"
            disabled={
              JSON.stringify(newEmployee.personalInfo.currentAddress) ===
              JSON.stringify(newEmployee.personalInfo.permanentAddress) &&
              Object.values(newEmployee.personalInfo.currentAddress).some(val => val !== "")
            }
          />
        </div>
    
        <div className="col-md-4">
          <label className="form-label fw-bold">Pincode</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.permanentAddress.pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 6) {
                setNewEmployee({
                  ...newEmployee,
                  personalInfo: {
                    ...newEmployee.personalInfo,
                    permanentAddress: {...newEmployee.personalInfo.permanentAddress, pincode: value}
                  }
                });
              }
            }}
            placeholder="Enter pincode"
            maxLength="6"
            disabled={
              JSON.stringify(newEmployee.personalInfo.currentAddress) ===
              JSON.stringify(newEmployee.personalInfo.permanentAddress) &&
              Object.values(newEmployee.personalInfo.currentAddress).some(val => val !== "")
            }
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Country</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.permanentAddress.country}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                permanentAddress: {...newEmployee.personalInfo.permanentAddress, country: e.target.value}
              }
            })}
            placeholder="Enter country"
            disabled={
              JSON.stringify(newEmployee.personalInfo.currentAddress) ===
              JSON.stringify(newEmployee.personalInfo.permanentAddress) &&
              Object.values(newEmployee.personalInfo.currentAddress).some(val => val !== "")
            }
          />
        </div>
    
        {/* === Emergency Contacts === */}
        <div className="col-12 mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:user-group" />
              </span>
              Emergency Contacts
            </h6>
    
    <button
      type="button"
      className="job-listings-btn"
      onClick={() => {
        if (newEmployee.personalInfo.emergencyContacts.length >= 5) {
          alert("Maximum 5 emergency contacts allowed");
          return;
        }
        const newContact = {
          id: Date.now(),
          name: "",
          relation: "",
          phone: "",
          priority: "Primary",
        };
        setNewEmployee({
          ...newEmployee,
          personalInfo: {
            ...newEmployee.personalInfo,
            emergencyContacts: [
              ...newEmployee.personalInfo.emergencyContacts,
              newContact,
            ],
          },
        });
      }}
    >
      <Icon icon="heroicons:plus" />
      <span>Add Contact</span>
    </button>
    
    
          </div>
          
          {newEmployee.personalInfo.emergencyContacts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th className="text-muted">Name</th>
                    <th className="text-muted">Relation</th>
                    <th className="text-muted">Phone No </th>
                    <th className="text-muted">Priority</th>
                    <th className="text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newEmployee.personalInfo.emergencyContacts.map((contact, index) => (
                    <tr key={contact.id}>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={contact.name}
                          onChange={(e) => {
                            const updatedContacts = [...newEmployee.personalInfo.emergencyContacts];
                            updatedContacts[index] = { ...contact, name: e.target.value };
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                emergencyContacts: updatedContacts
                              }
                            });
                          }}
                          placeholder="Enter name"
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={contact.relation}
                          onChange={(e) => {
                            const updatedContacts = [...newEmployee.personalInfo.emergencyContacts];
                            updatedContacts[index] = { ...contact, relation: e.target.value };
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                emergencyContacts: updatedContacts
                              }
                            });
                          }}
                        >
                          <option value="">Select</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Parent">Parent</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Child">Child</option>
                          <option value="Friend">Friend</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          value={contact.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                              const updatedContacts = [...newEmployee.personalInfo.emergencyContacts];
                              updatedContacts[index] = { ...contact, phone: value };
                              setNewEmployee({
                                ...newEmployee,
                                personalInfo: {
                                  ...newEmployee.personalInfo,
                                  emergencyContacts: updatedContacts
                                }
                              });
                            }
                          }}
                          placeholder="10 digits"
                          maxLength="10"
                        />
                        {
                          contact.phone && contact.phone.length !== 10 && (
                            <div className="text-danger small mt-1">
                              Phone number must be exactly 10 digits.
                            </div>
                          )
                        }
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={contact.priority}
                          onChange={(e) => {
                            const updatedContacts = [...newEmployee.personalInfo.emergencyContacts];
                            updatedContacts[index] = { ...contact, priority: e.target.value };
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                emergencyContacts: updatedContacts
                              }
                            });
                          }}
                        >
                          <option value="Primary">Primary</option>
                          <option value="Secondary">Secondary</option>
                          <option value="Tertiary">Tertiary</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            const updatedContacts = newEmployee.personalInfo.emergencyContacts.filter((_, i) => i !== index);
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                emergencyContacts: updatedContacts
                              }
                            });
                          }}
                        >
                          <Icon icon="heroicons:trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-light border d-flex align-items-center gap-2">
              <Icon icon="heroicons:information-circle" className="me-2 text-muted" />
              No emergency contacts added. Click "Add Contact" to add one (Max 5 contacts allowed).
            </div>
          )}
        </div>
    
        {/* === Family Members (Optional) === */}
        <div className="col-12 mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:home" />
              </span>
              Family Members (Optional) 
            </h6>
    
    <button
      type="button"
      className="job-listings-btn"
      onClick={() => {
        if (newEmployee.personalInfo.familyMembers.length >= 5) {
          alert("Maximum 5 family members allowed");
          return;
        }
        const newMember = {
          id: Date.now(),
          name: "",
          relation: "",
          dateOfBirth: "",
        };
        setNewEmployee({
          ...newEmployee,
          personalInfo: {
            ...newEmployee.personalInfo,
            familyMembers: [
              ...newEmployee.personalInfo.familyMembers,
              newMember,
            ],
          },
        });
      }}
    >
      <Icon icon="heroicons:plus" />
      <span>Add Member</span>
    </button>
    
    
          </div>
          
          {newEmployee.personalInfo.familyMembers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th className="text-muted">Name</th>
                    <th className="text-muted">Relation</th>
                    <th className="text-muted">Date of Birth</th>
                    <th className="text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newEmployee.personalInfo.familyMembers.map((member, index) => (
                    <tr key={member.id}>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={member.name}
                          onChange={(e) => {
                            const updatedMembers = [...newEmployee.personalInfo.familyMembers];
                            updatedMembers[index] = { ...member, name: e.target.value };
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                familyMembers: updatedMembers
                              }
                            });
                          }}
                          placeholder="Enter name"
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={member.relation}
                          onChange={(e) => {
                            const updatedMembers = [...newEmployee.personalInfo.familyMembers];
                            updatedMembers[index] = { ...member, relation: e.target.value };
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                familyMembers: updatedMembers
                              }
                            });
                          }}
                        >
                          <option value="">Select</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>

                      <td>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={member.dateOfBirth}
                          onChange={(e) => {
                            const updatedMembers = [...newEmployee.personalInfo.familyMembers];
                            updatedMembers[index] = { ...member, dateOfBirth: e.target.value };
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                familyMembers: updatedMembers
                              }
                            });
                          }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            const updatedMembers = newEmployee.personalInfo.familyMembers.filter((_, i) => i !== index);
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                familyMembers: updatedMembers
                              }
                            });
                          }}
                        >
                          <Icon icon="heroicons:trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-light border d-flex align-items-center gap-2">
              <Icon icon="heroicons:information-circle" className="me-2 text-muted" />
              No family members added. Optional section (Max 5 members).
            </div>
          )}
        </div>
    
        {/* === Nominee Information === */}
        <div className="col-12 mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold fs-5 text-muted d-flex align-items-center gap-2 mb-0">
              <span className="text-primary">
              <Icon icon="heroicons:gift" />
              </span>
              Nominee Information
            </h6>
    
    <button
      type="button"
      className="job-listings-btn"
      onClick={() => {
        if (newEmployee.personalInfo.nominees.length >= 3) {
          alert("Maximum 3 nominees allowed");
          return;
        }
        const newNominee = {
          id: Date.now(),
          name: "",
          relation: "",
          phone: "",
          isNomineeAccepted: false,
          percentage: "",
        };
        setNewEmployee({
          ...newEmployee,
          personalInfo: {
            ...newEmployee.personalInfo,
            nominees: [
              ...newEmployee.personalInfo.nominees,
              newNominee,
            ],
          },
        });
      }}
    >
      <Icon icon="heroicons:plus" />
      <span>Add Nominee</span>
    </button>
    
    
          </div>
          
          {newEmployee.personalInfo.nominees.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th className="text-muted">Name</th>
                    <th className="text-muted">Relation</th>
                    <th className="text-muted">Phone No</th>
                    <th className="text-muted">Nominee Accepted</th>
                    <th className="text-muted">Percentage %</th>
                    <th className="text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newEmployee.personalInfo.nominees.map((nominee, index) => (
                    <tr key={nominee.id}>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={nominee.name}
                          onChange={(e) => {
                            const updatedNominees = [...newEmployee.personalInfo.nominees];
                            updatedNominees[index] = { ...nominee, name: e.target.value };
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                nominees: updatedNominees
                              }
                            });
                          }}
                          placeholder="Enter name"
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={nominee.relation}
                          onChange={(e) => {
                            const updatedNominees = [...newEmployee.personalInfo.nominees];
                            updatedNominees[index] = { ...nominee, relation: e.target.value };
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                nominees: updatedNominees
                              }
                            });
                          }}
                        >
                          <option value="">Select</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          value={nominee.contactNo}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                              const updatedNominees = [...newEmployee.personalInfo.nominees];
                              updatedNominees[index] = { ...nominee, contactNo: value };
                              setNewEmployee({
                                ...newEmployee,
                                personalInfo: {
                                  ...newEmployee.personalInfo,
                                  nominees: updatedNominees
                                }
                              });
                            }
                          }}
                          placeholder="10 digits"
                          maxLength="10"
                        />
                        {
                          nominee.contactNo && nominee.contactNo.length !== 10 && (
                            <div className="text-danger small mt-1">
                              Phone number must be exactly 10 digits.
                            </div>
                          )
                        }
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={nominee.isNomineeAccepted ? 'Yes' : 'No'}
                          onChange={(e) => {
                            const updatedNominees = [...newEmployee.personalInfo.nominees];
                            updatedNominees[index] = { 
                              ...nominee, 
                              isNomineeAccepted: e.target.value === 'Yes' 
                            };
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                nominees: updatedNominees
                              }
                            });
                          }}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={nominee.percentage}
                          onChange={(e) => {
                            const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                            const updatedNominees = [...newEmployee.personalInfo.nominees];
                            updatedNominees[index] = { ...nominee, percentage: value };
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                nominees: updatedNominees
                              }
                            });
                          }}
                          placeholder="0-100"
                          min="0"
                          max="100"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            const updatedNominees = newEmployee.personalInfo.nominees.filter((_, i) => i !== index);
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                nominees: updatedNominees
                              }
                            });
                          }}
                        >
                          <Icon icon="heroicons:trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(() => {
                const totalPercentage = newEmployee.personalInfo.nominees.reduce(
                  (sum, nominee) => sum + (parseInt(nominee.percentage) || 0), 
                  0
                );
                if (totalPercentage !== 100) {
                  return (
                    <div className={`alert ${totalPercentage > 100 ? 'alert-danger' : 'alert-warning'} mt-2`}>
                      <Icon icon="heroicons:exclamation-triangle" className="me-2" />
                      Total percentage: {totalPercentage}% (Should be exactly 100%)
                    </div>
                  );
                }
              })()}
            </div>
          ) : (
            <div className="alert alert-light border d-flex align-items-center gap-2">
              <Icon icon="heroicons:information-circle" className="me-2 text-muted" />
              No nominees added. Click "Add Nominee" to add one (Max 3 nominees).
            </div>
          )}
        </div>
    
        {/* === Identification Documents === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
                <Icon icon="heroicons:document-text" />
                </span>
            Identification Documents
          </h6>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">PAN Number <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control text-uppercase"
            value={newEmployee.personalInfo.identification.pan.number}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (value.length <= 10) {
                setNewEmployee({
                  ...newEmployee,
                  personalInfo: {
                    ...newEmployee.personalInfo,
                    identification: {
                      ...newEmployee.personalInfo.identification,
                      pan: {...newEmployee.personalInfo.identification.pan, number: value}
                    }
                  }
                });
              }
            }}
            placeholder="ABCDE1234F"
            maxLength="10"
            required
          />
          {
            newEmployee.personalInfo.identification.pan.number && newEmployee.personalInfo.identification.pan.number.length !== 10 && (
              <div className="text-danger small mt-1">PAN number must be exactly 10 characters</div>
            ) 
          }
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Aadhaar Number <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.identification.aadhaar.number}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 12) {
                setNewEmployee({
                  ...newEmployee,
                  personalInfo: {
                    ...newEmployee.personalInfo,
                    identification: {
                      ...newEmployee.personalInfo.identification,
                      aadhaar: {...newEmployee.personalInfo.identification.aadhaar, number: value}
                    }
                  }
                });
              }
            }}
            placeholder="123456789012"
            maxLength="12"
            required
          />
          {
            newEmployee.personalInfo.identification.aadhaar.number && newEmployee.personalInfo.identification.aadhaar.number.length !== 12 && (
              <div className="text-danger small mt-1">Aadhaar number must be exactly 12 digits</div>
            )
          }
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Passport Number (Optional)</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.identification.passport.number}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                identification: {
                  ...newEmployee.personalInfo.identification,
                  passport: {...newEmployee.personalInfo.identification.passport, number: e.target.value}
                }
              }
            })}
            placeholder="Enter passport number"
          />
          {
            newEmployee.personalInfo.identification.passport.number && newEmployee.personalInfo.identification.passport.number.length < 6 && (
              <div className="text-danger small mt-1">Passport number must be at least 6 characters</div>
            )
          }
        </div>
    
          <div className="col-md-6">
          <label className="form-label fw-bold">Passport Expiry Date (Optional)</label>
          <input
            type="date"
            className="form-control"
            value={newEmployee.personalInfo.identification.passport.expiryDate}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                identification: {
                  ...newEmployee.personalInfo.identification,
                  passport: {...newEmployee.personalInfo.identification.passport, expiryDate: e.target.value}
                }
              }
            })}
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Voter ID Number (Optional)</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.identification.voterId.number}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              personalInfo: {
                ...newEmployee.personalInfo,
                identification: {
                  ...newEmployee.personalInfo.identification,
                  voterId: {...newEmployee.personalInfo.identification.voterId, number: e.target.value}
                }
              }
            })}
            placeholder="Enter voter ID number"
          />
          {
            newEmployee.personalInfo.identification.voterId.number && newEmployee.personalInfo.identification.voterId.number.length < 6 && (
              <div className="text-danger small mt-1">Voter ID number must be at least 6 characters</div>
            )
          }
        </div>
    
    
    
      </div>
    )}
    
                        {/* Employment Information Tab */}
    
    {activeAddTab === 'employment' && (

      <div className="row g-3">
        <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
                  <Icon icon="heroicons:briefcase" />
                   </span>
                      <span>Employment Details</span>
              </h6>
            </div>
        {/* Row 1 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Employee ID <span className="text-danger">*</span></label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={newEmployee.employmentInfo.employeeId}
              onChange={(e) => setNewEmployee({
                ...newEmployee,
                employmentInfo: {...newEmployee.employmentInfo, employeeId: e.target.value}
              })}
              placeholder="EMP001"
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                const prefix = 'EMP';
                const nextNum = employees.length + 1;
                const employeeId = `${prefix}${String(nextNum).padStart(4, '0')}`;
                setNewEmployee({
                  ...newEmployee,
                  employmentInfo: {
                    ...newEmployee.employmentInfo,
                    employeeId
                  }
                });
              }}
            >
              <Icon icon="heroicons:arrow-path" className="me-1" />
              Generate
            </button>
          </div>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Date of Joining <span className="text-danger">*</span></label>
          <input
            type="date"
            className="form-control"
            value={newEmployee.employmentInfo.dateOfJoining}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, dateOfJoining: e.target.value}
            })}
            required
          />
        </div>
    
        {/* Row 2 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Confirmation Date</label>
          <input
            type="date"
            className="form-control"
            value={newEmployee.employmentInfo.confirmationDate}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, confirmationDate: e.target.value}
            })}
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Probation Period (months)</label>
          <input
            type="number"
            className="form-control"
            value={newEmployee.employmentInfo.probationPeriod}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, probationPeriod: parseInt(e.target.value) || 0}
            })}
            min="0"
            max="12"
          />
        </div>
    
        {/* Row 3 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Employment Type <span className="text-danger">*</span></label>
          <select
            className="form-select"
            value={newEmployee.employmentInfo.employmentType}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, employmentType: e.target.value},
              employmentType: e.target.value
            })}
            required
          >
            <option value="">Select</option>
            <option value="Permanent">Permanent</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
            <option value="Consultant">Consultant</option>
            <option value="Temporary">Temporary</option>
          </select>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Employment Status</label>
          <select
            className="form-select"
            value={newEmployee.employmentInfo.employmentStatus}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, employmentStatus: e.target.value},
              status: e.target.value
            })}
          >
            <option value="Active">Active</option>
            <option value="Probation">Probation</option>
            <option value="On-Hold">On-Hold</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
    
        {/* Row 4 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Department <span className="text-danger">*</span></label>
          <select
            className="form-select"
            value={newEmployee.employmentInfo.department || newEmployee.department}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              department: e.target.value,
              employmentInfo: {...newEmployee.employmentInfo, department: e.target.value}
            })}
            required
          >
            <option value="">Select</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
            <option value="IT">IT</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Product">Product</option>
            <option value="Legal">Legal</option>
          </select>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Sub-Department</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.subDepartment}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, subDepartment: e.target.value}
            })}
            placeholder="Enter sub-department"
          />
        </div>
    
        {/* Row 5 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Cost Center</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.costCenter}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, costCenter: e.target.value}
            })}
            placeholder="Enter cost center code"
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Designation <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.designation || newEmployee.designation}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              designation: e.target.value,
              employmentInfo: {...newEmployee.employmentInfo, designation: e.target.value}
            })}
            placeholder="Enter designation"
            required
          />
        </div>
    
        {/* Row 6 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Grade</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.grade}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, grade: e.target.value}
            })}
            placeholder="e.g., P1, M2, E3"
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Level</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.level}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, level: e.target.value}
            })}
            placeholder="e.g., Junior, Mid, Senior"
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Location <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.location || newEmployee.location}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              location: e.target.value,
              employmentInfo: {...newEmployee.employmentInfo, location: e.target.value}
            })}
            placeholder="Enter location"
            required
          />
        </div>
    
        {/* Row 7 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Workplace Type</label>
          <select
            className="form-select"
            value={newEmployee.employmentInfo.workplaceType}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, workplaceType: e.target.value}
            })}
          >
            <option value="">Select</option>
            <option value="Office">Office</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Field">Field</option>
          </select>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Email <span className="text-danger">*</span></label>
          <input
            type="email"
            className="form-control"
            value={newEmployee.employmentInfo.workEmail || newEmployee.email}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              email: e.target.value,
              employmentInfo: {...newEmployee.employmentInfo, workEmail: e.target.value}
            })}
            placeholder="employee@company.com"
            required
          />
          {
            newEmployee.employmentInfo.workEmail && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmployee.employmentInfo.workEmail) && (
              <div className="text-danger small mt-1">Please enter a valid email address.</div>
            )
          }
        </div>
    
        {/* Row 8 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Extension Number</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.extensionNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 6) {
                setNewEmployee({
                  ...newEmployee,
                  employmentInfo: {...newEmployee.employmentInfo, extensionNumber: value}
                });
              }
            }}
            placeholder="Enter extension number"
            maxLength="6"
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Desk Location</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.deskLocation}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, deskLocation: e.target.value}
            })}
            placeholder="e.g., Floor 3, Desk 12A"
          />
        </div>
    
        {/* Row 9 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Employee Category</label>
          <select
            className="form-select"
            value={newEmployee.employmentInfo.employeeCategory}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, employeeCategory: e.target.value}
            })}
          >
            <option value="">Select</option>
            <option value="Regular">Regular</option>
            <option value="Trainee">Trainee</option>
            <option value="Executive">Executive</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="Contractor">Contractor</option>
            <option value="Apprentice">Apprentice</option>
          </select>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Notice Period (days)</label>
          <input
            type="number"
            className="form-control"
            value={newEmployee.employmentInfo.noticePeriod}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, noticePeriod: parseInt(e.target.value) || 0}
            })}
            min="0"
            max="180"
          />
          <small className="text-muted">Typically 30, 60, or 90 days</small>
        </div>
    
        {/* Row 10 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Direct Reporting Manager</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.reportingManager.direct}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {
                ...newEmployee.employmentInfo,
                reportingManager: {
                  ...newEmployee.employmentInfo.reportingManager,
                  direct: e.target.value
                }
              }
            })}
            placeholder="Enter direct manager name"
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Functional Reporting Manager</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.reportingManager.functional}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {
                ...newEmployee.employmentInfo,
                reportingManager: {
                  ...newEmployee.employmentInfo.reportingManager,
                  functional: e.target.value
                }
              }
            })}
            placeholder="Enter functional manager name"
          />
        </div>
    
        {/* Row 11 */}
        <div className="col-md-6">
          <label className="form-label fw-bold">HR Business Partner</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.employmentInfo.hrBusinessPartner}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              employmentInfo: {...newEmployee.employmentInfo, hrBusinessPartner: e.target.value}
            })}
            placeholder="Enter HR business partner name"
          />
        </div>
      </div> 
    )}
    
                        {/* Job History Tab */}
    
{activeAddTab === 'jobHistory' && (
  <div className="row g-3">
    <div className="col-12 d-flex justify-content-between align-items-center">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
        <Icon icon="heroicons:clock" />
        </span>
        Complete Job History
      </h6>

      <button
        type="button"
        className="create-job-btn"
        onClick={() => {
          // Ensure jobHistory exists as array
          const currentHistory = Array.isArray(newEmployee.jobHistory) 
            ? newEmployee.jobHistory 
            : [];
          
          setNewEmployee(prev => ({
            ...prev,
            jobHistory: [
              ...currentHistory,
              {
                id: Date.now(),
                date: new Date().toISOString().split("T")[0],
                endDate: '',
                type: "Joining",
                organisation: '',
                department: "",
                designation: "",
                location: "",
                manager: "",
                salaryChange: "",
                notes: "",
                achievements: "",
                reasonForLeaving: "",
                isEditing: true
              }
            ]
          }));
        }}
      >
        <Icon icon="heroicons:plus" />
        Add Job History
      </button>
    </div>

    {/* Current Job History Entries */}
    <div className="col-12">
      {Array.isArray(newEmployee.jobHistory) && newEmployee.jobHistory.length > 0 ? (
        newEmployee.jobHistory.map((history, idx) => {
          // Calculate duration for display
          const calculateDuration = () => {
            if (!history.date) return '-';
            
            const startDate = new Date(history.date);
            const endDate = history.endDate === 'Present' || !history.endDate 
              ? new Date() 
              : new Date(history.endDate);
              
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '-';
            
            const durationInMonths = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
            const years = Math.floor(durationInMonths / 12);
            const months = durationInMonths % 12;
            
            if (years > 0) {
              return `${years} yr ${months > 0 ? `${months} mo` : ''}`.trim();
            } else {
              return `${months} mo`;
            }
          };

          return (
            <div key={history.id || idx} className="card border mb-3">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${
                    history.type === 'Promotion' ? 'bg-success' :
                    history.type === 'Transfer' ? 'bg-info' :
                    history.type === 'Joining' ? 'bg-primary' :
                    history.type === 'Salary Revision' ? 'bg-warning' :
                    'bg-secondary'
                  }`}>
                    {history.type || 'Unknown'}
                  </span>
                  <span className="text-muted">
                    {history.date ? formatDate(history.date) : 'No date'}
                  </span>
                  {history.endDate && (
                    <span className="text-muted">
                      to {history.endDate === 'Present' ? 'Present' : formatDate(history.endDate)}
                    </span>
                  )}
                </div>
                <div className="d-flex gap-1">
                  {history.isEditing ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, isEditing: false };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        title="Save"
                      >
                        <Icon icon="heroicons:check" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          // If this is a new entry with empty required fields, remove it
                          if (!history.date || !history.type) {
                            const updatedHistory = newEmployee.jobHistory.filter((_, i) => i !== idx);
                            setNewEmployee(prev => ({
                              ...prev,
                              jobHistory: updatedHistory
                            }));
                          } else {
                            const updatedHistory = [...newEmployee.jobHistory];
                            updatedHistory[idx] = { ...history, isEditing: false };
                            setNewEmployee(prev => ({
                              ...prev,
                              jobHistory: updatedHistory
                            }));
                          }
                        }}
                        title="Cancel"
                      >
                        <Icon icon="heroicons:x-mark" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, isEditing: true };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        title="Edit"
                      >
                        <Icon icon="heroicons:pencil" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this job history entry?')) {
                            const updatedHistory = newEmployee.jobHistory.filter((_, i) => i !== idx);
                            setNewEmployee(prev => ({
                              ...prev,
                              jobHistory: updatedHistory
                            }));
                          }
                        }}
                        title="Delete"
                      >
                        <Icon icon="heroicons:trash" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-body">
                {history.isEditing ? (
                  <div className="row g-3">
                    {/* Row 1: Start Date, End Date and Type */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={history.date || ''}
                        onChange={(e) => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, date: e.target.value };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        required
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">End Date</label>
                      <div className="d-flex gap-2">
                        <select
                          className="form-select"
                          value={history.endDate === 'Present' ? 'present' : (history.endDate ? 'date' : 'empty')}
                          onChange={(e) => {
                            const value = e.target.value;
                            const updatedHistory = [...newEmployee.jobHistory];
                            let newEndDate = '';
                            
                            if (value === 'present') {
                              newEndDate = 'Present';
                            } else if (value === 'date') {
                              newEndDate = new Date().toISOString().split('T')[0];
                            } else {
                              newEndDate = '';
                            }
                            
                            updatedHistory[idx] = { ...history, endDate: newEndDate };
                            setNewEmployee(prev => ({
                              ...prev,
                              jobHistory: updatedHistory
                            }));
                          }}
                        >
                          <option value="empty">Select End Date</option>
                          <option value="present">Present</option>
                          <option value="date">Specific Date</option>
                        </select>
                        {history.endDate && history.endDate !== 'Present' && history.endDate !== '' && (
                          <input
                            type="date"
                            className="form-control"
                            value={history.endDate}
                            onChange={(e) => {
                              const updatedHistory = [...newEmployee.jobHistory];
                              updatedHistory[idx] = { ...history, endDate: e.target.value };
                              setNewEmployee(prev => ({
                                ...prev,
                                jobHistory: updatedHistory
                              }));
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold small">
                        Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={history.type || 'Joining'}
                        onChange={(e) => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, type: e.target.value };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        required
                      >
                        <option value="Joining">Joining</option>
                        <option value="Promotion">Promotion</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Salary Revision">Salary Revision</option>
                        <option value="Department Change">Department Change</option>
                        <option value="Location Transfer">Location Transfer</option>
                        <option value="Designation Change">Designation Change</option>
                        <option value="Resignation">Resignation</option>
                        <option value="Previous Experience">Previous Experience</option>
                      </select>
                    </div>

                    {/* Row 2: Organisation, Department, and Designation */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">Organisation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={history.organisation || ''}
                        onChange={(e) => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, organisation: e.target.value };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        placeholder="Enter organisation name"
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        value={history.department || ''}
                        onChange={(e) => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, department: e.target.value };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        placeholder="Enter department"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold small">Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={history.designation || ''}
                        onChange={(e) => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, designation: e.target.value };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        placeholder="Enter designation"
                      />
                    </div>

                    {/* Row 3: Location, Manager, and Salary */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={history.location || ''}
                        onChange={(e) => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, location: e.target.value };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        placeholder="Enter location"
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">Manager</label>
                      <input
                        type="text"
                        className="form-control"
                        value={history.manager || ''}
                        onChange={(e) => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, manager: e.target.value };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        placeholder="Enter manager name"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold small">Salary</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          value={history.salaryChange || ''}
                          onChange={(e) => {
                            const updatedHistory = [...newEmployee.jobHistory];
                            updatedHistory[idx] = { ...history, salaryChange: e.target.value };
                            setNewEmployee(prev => ({
                              ...prev,
                              jobHistory: updatedHistory
                            }));
                          }}
                          placeholder="Enter amount"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Row 4: Duration (Read-only), Notes, and Achievements */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold small">Duration</label>
                      <div className="form-control bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{calculateDuration()}</span>
                          {(history.endDate === 'Present' || !history.endDate) && (
                            <small className="text-muted">Ongoing</small>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold small">Notes</label>
                      <input
                        type="text"
                        className="form-control"
                        value={history.notes || ''}
                        onChange={(e) => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, notes: e.target.value };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        placeholder="Enter notes"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold small">Achievements</label>
                      <input
                        type="text"
                        className="form-control"
                        value={history.achievements || ''}
                        onChange={(e) => {
                          const updatedHistory = [...newEmployee.jobHistory];
                          updatedHistory[idx] = { ...history, achievements: e.target.value };
                          setNewEmployee(prev => ({
                            ...prev,
                            jobHistory: updatedHistory
                          }));
                        }}
                        placeholder="Enter achievements"
                      />
                    </div>

                    {/* Row 5: Reason for Leaving (Conditional) */}
                    {(history.type === 'Resignation' || history.reasonForLeaving) && (
                      <div className="col-md-12">
                        <label className="form-label fw-bold small">Reason for Leaving</label>
                        <input
                          type="text"
                          className="form-control"
                          value={history.reasonForLeaving || ''}
                          onChange={(e) => {
                            const updatedHistory = [...newEmployee.jobHistory];
                            updatedHistory[idx] = { ...history, reasonForLeaving: e.target.value };
                            setNewEmployee(prev => ({
                              ...prev,
                              jobHistory: updatedHistory
                            }));
                          }}
                          placeholder="Enter reason for leaving"
                        />
                        <small className="text-muted">Only applicable for resignations or job changes</small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="row">
                    {/* Read-only display */}
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Start Date:</strong>
                        <span>{history.date ? formatDate(history.date) : '-'}</span>
                      </div>
                    </div>
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>End Date:</strong>
                        <span>
                          {history.endDate === 'Present' ? (
                            <span className="badge bg-success">Present</span>
                          ) : history.endDate ? (
                            formatDate(history.endDate)
                          ) : (
                            '-'
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Type:</strong>
                        <span className={`badge ${
                          history.type === 'Promotion' ? 'bg-success' :
                          history.type === 'Transfer' ? 'bg-info' :
                          history.type === 'Joining' ? 'bg-primary' :
                          history.type === 'Salary Revision' ? 'bg-warning' :
                          'bg-secondary'
                        }`}>
                          {history.type || '-'}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Organisation:</strong>
                        <span>{history.organisation || '-'}</span>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Department:</strong>
                        <span>{history.department || '-'}</span>
                      </div>
                    </div>
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Designation:</strong>
                        <span><strong>{history.designation || '-'}</strong></span>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Location:</strong>
                        <span>{history.location || '-'}</span>
                      </div>
                    </div>
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Manager:</strong>
                        <span>{history.manager || '-'}</span>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Salary:</strong>
                        <span>{history.salaryChange ? formatCurrency(history.salaryChange) : '-'}</span>
                      </div>
                    </div>
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Duration:</strong>
                        <span>
                          <div className="d-flex flex-column">
                            <span className="fw-medium">{calculateDuration()}</span>
                            {(history.endDate === 'Present' || !history.endDate) && (
                              <small className="text-muted">Ongoing</small>
                            )}
                          </div>
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Notes:</strong>
                        <span>
                          <small className="text-muted">
                            {history.notes || '-'}
                            {history.reasonForLeaving && history.reasonForLeaving !== 'N/A' && (
                              <div className="mt-1">
                                <small className="text-danger">
                                  <Icon icon="heroicons:arrow-right-on-rectangle" className="me-1" />
                                  Reason: {history.reasonForLeaving}
                                </small>
                              </div>
                            )}
                          </small>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 mb-2">
                      <div className="d-flex">
                        <strong className="text-muted me-2" style={{ minWidth: '100px' }}>Achievements:</strong>
                        <span>
                          {history.achievements ? (
                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={history.achievements}>
                              <small>{history.achievements}</small>
                            </div>
                          ) : (
                            <small className="text-muted">-</small>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="alert alert-light border d-flex align-items-center gap-2">
          <Icon icon="heroicons:information-circle" className="text-muted" />
          <div>
            <strong>No job history entries added yet.</strong>
            <p className="mb-0">Click "Add Job History" button to add job history records.</p>
          </div>
        </div>
      )}
    </div>

    {/* Summary Table View */}
    {Array.isArray(newEmployee.jobHistory) && newEmployee.jobHistory.length > 0 && (
      <div className="col-12 mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
       <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:table-cells" className="me-2" />
            </span>
            Job History Summary Table
          </h6>
          <small className="text-muted">
            Showing {newEmployee.jobHistory.length} entries
          </small>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="bg-light">
              <tr>
                <th className="text-muted">Start Date</th>
                <th className="text-muted">End Date</th>
                <th className="text-muted">Type</th>
                <th className="text-muted">Organisation</th>
                <th className="text-muted">Department</th>
                <th className="text-muted">Designation</th>
                <th className="text-muted">Location</th>
                <th className="text-muted">Manager</th>
                <th className="text-muted">Salary</th>
                <th className="text-muted">Duration</th>
                <th className="text-muted">Notes</th>
                <th className="text-muted">Achievements</th>
              </tr>
            </thead>
            <tbody>
              {newEmployee.jobHistory.map((history, idx) => {
                // Calculate duration for each row
                const calculateDuration = () => {
                  if (!history.date) return '-';
                  
                  const startDate = new Date(history.date);
                  const endDate = history.endDate === 'Present' || !history.endDate 
                    ? new Date() 
                    : new Date(history.endDate);
                    
                  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '-';
                  
                  const durationInMonths = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
                  const years = Math.floor(durationInMonths / 12);
                  const months = durationInMonths % 12;
                  
                  if (years > 0) {
                    return `${years} yr ${months > 0 ? `${months} mo` : ''}`.trim();
                  } else {
                    return `${months} mo`;
                  }
                };

                return (
                  <tr key={history.id || idx}>
                    <td>{history.date ? formatDate(history.date) : '-'}</td>
                    <td>
                      {history.endDate === 'Present' ? (
                        <span className="badge bg-success">Present</span>
                      ) : history.endDate ? (
                        formatDate(history.endDate)
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        history.type === 'Promotion' ? 'bg-success' :
                        history.type === 'Transfer' ? 'bg-info' :
                        history.type === 'Joining' ? 'bg-primary' :
                        history.type === 'Salary Revision' ? 'bg-warning' :
                        'bg-secondary'
                      }`}>
                        {history.type || '-'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span>{history.organisation || '-'}</span>
                        {history.organisation === newEmployee.employmentInfo?.department && (
                          <span className="badge bg-primary-subtle text-primary border border-primary">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{history.department || '-'}</td>
                    <td><strong>{history.designation || '-'}</strong></td>
                    <td>{history.location || '-'}</td>
                    <td>{history.manager || '-'}</td>
                    <td>
                      {history.salaryChange ? (
                        <div className="d-flex flex-column">
                          <span className="text-primary fw-semibold">
                            {formatCurrency(history.salaryChange)}
                          </span>
                          {history.type === 'Promotion' && (
                            <small className="text-success">
                              <Icon icon="heroicons:arrow-trending-up" className="me-1" />
                              Increased
                            </small>
                          )}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <div className="d-flex flex-column align-items-center">
                        <span className="fw-medium">{calculateDuration()}</span>
                        {(history.endDate === 'Present' || !history.endDate) && (
                          <small className="text-muted">Ongoing</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {history.notes || '-'}
                        {history.reasonForLeaving && history.reasonForLeaving !== 'N/A' && (
                          <div className="mt-1">
                            <small className="text-danger">
                              <Icon icon="heroicons:arrow-right-on-rectangle" className="me-1" />
                              Reason: {history.reasonForLeaving}
                            </small>
                          </div>
                        )}
                      </small>
                    </td>
                    <td>
                      {history.achievements ? (
                        <div className="text-truncate" style={{ maxWidth: '150px' }} title={history.achievements}>
                          <small>{history.achievements}</small>
                        </div>
                      ) : (
                        <small className="text-muted">-</small>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
)}
    
                        {/* Salary & Compensation Tab */}
    
    {activeAddTab === 'salary' && (
      <div className="row g-3">
        {/* === Current Compensation === */}
        <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:currency-dollar" />
            </span>
            Current Compensation
          </h6>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Current CTC (Annual) <span className="text-danger">*</span></label>
          <div className="input-group">
            <span className="input-group-text">₹</span>
            <input
              type="number"
              className="form-control"
              value={newEmployee.salaryInfo.currentCTC || newEmployee.salary || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setNewEmployee({
                  ...newEmployee,
                  salary: value,
                  salaryInfo: {
                    ...newEmployee.salaryInfo,
                    currentCTC: value,
                    // Auto-populate basic salary as 50% of CTC
                    ctcBreakdown: {
                      ...newEmployee.salaryInfo.ctcBreakdown,
                      basic: Math.round(value * 0.5),
                      hra: Math.round(value * 0.2),
                      specialAllowance: Math.round(value * 0.15),
                      transportAllowance: Math.round(value * 0.05),
                      medicalAllowance: Math.round(value * 0.05),
                      otherAllowances: Math.round(value * 0.05),
                      providentFund: Math.round(value * 0.12),
                      gratuity: Math.round(value * 0.048),
                      otherDeductions: Math.round(value * 0.002)
                    }
                  }
                });
              }}
              placeholder="Enter annual CTC"
              required
            />
          </div>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Salary Structure</label>
          <select
            className="form-select"
            value={newEmployee.salaryInfo.salaryStructure}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              salaryInfo: {...newEmployee.salaryInfo, salaryStructure: e.target.value}
            })}
          >
            <option value="">Select Structure</option>
            <option value="Fixed">Fixed</option>
            <option value="Fixed + Variable">Fixed + Variable</option>
            <option value="Performance Based">Performance Based</option>
            <option value="Commission Based">Commission Based</option>
          </select>
        </div>
    
        {/* === CTC Breakdown === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:chart-bar" />
            </span>
            CTC Breakdown

          </h6>
          <div className="table-responsive">
            <table className="table table-sm table-bordered">
              <thead className="bg-light">
                <tr>
                  <th className="text-muted">Component</th>
                  <th className="text-end text-muted">Amount (Annual)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { 
                    name: 'Basic', 
                    key: 'basic',
                    value: newEmployee.salaryInfo.ctcBreakdown?.basic || 0,
                    onChange: (val) => setNewEmployee({
                      ...newEmployee,
                      salaryInfo: {
                        ...newEmployee.salaryInfo,
                        ctcBreakdown: {
                          ...newEmployee.salaryInfo.ctcBreakdown,
                          basic: val
                        }
                      }
                    })
                  },
                  { 
                    name: 'HRA', 
                    key: 'hra',
                    value: newEmployee.salaryInfo.ctcBreakdown?.hra || 0,
                    onChange: (val) => setNewEmployee({
                      ...newEmployee,
                      salaryInfo: {
                        ...newEmployee.salaryInfo,
                        ctcBreakdown: {
                          ...newEmployee.salaryInfo.ctcBreakdown,
                          hra: val
                        }
                      }
                    })
                  },
                  { 
                    name: 'Special Allowance', 
                    key: 'specialAllowance',
                    value: newEmployee.salaryInfo.ctcBreakdown?.specialAllowance || 0,
                    onChange: (val) => setNewEmployee({
                      ...newEmployee,
                      salaryInfo: {
                        ...newEmployee.salaryInfo,
                        ctcBreakdown: {
                          ...newEmployee.salaryInfo.ctcBreakdown,
                          specialAllowance: val
                        }
                      }
                    })
                  },
                  { 
                    name: 'Transport Allowance', 
                    key: 'transportAllowance',
                    value: newEmployee.salaryInfo.ctcBreakdown?.transportAllowance || 0,
                    onChange: (val) => setNewEmployee({
                      ...newEmployee,
                      salaryInfo: {
                        ...newEmployee.salaryInfo,
                        ctcBreakdown: {
                          ...newEmployee.salaryInfo.ctcBreakdown,
                          transportAllowance: val
                        }
                      }
                    })
                  },
                  { 
                    name: 'Medical Allowance', 
                    key: 'medicalAllowance',
                    value: newEmployee.salaryInfo.ctcBreakdown?.medicalAllowance || 0,
                    onChange: (val) => setNewEmployee({
                      ...newEmployee,
                      salaryInfo: {
                        ...newEmployee.salaryInfo,
                        ctcBreakdown: {
                          ...newEmployee.salaryInfo.ctcBreakdown,
                          medicalAllowance: val
                        }
                      }
                    })
                  },
                  { 
                    name: 'Other Allowances', 
                    key: 'otherAllowances',
                    value: newEmployee.salaryInfo.ctcBreakdown?.otherAllowances || 0,
                    onChange: (val) => setNewEmployee({
                      ...newEmployee,
                      salaryInfo: {
                        ...newEmployee.salaryInfo,
                        ctcBreakdown: {
                          ...newEmployee.salaryInfo.ctcBreakdown,
                          otherAllowances: val
                        }
                      }
                    })
                  },
                ].map((item, index) => (
                  <tr key={index}>
                    <td className="fw-semibold">{item.name}</td>
                    <td>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control text-end"
                          value={item.value}
                          onChange={(e) => item.onChange(parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                
                <tr className="table-secondary fw-bold">
                  <td>Gross Salary</td>
                  <td className="text-end">
                    ₹{(
                      (newEmployee.salaryInfo.ctcBreakdown?.basic || 0) +
                      (newEmployee.salaryInfo.ctcBreakdown?.hra || 0) +
                      (newEmployee.salaryInfo.ctcBreakdown?.specialAllowance || 0) +
                      (newEmployee.salaryInfo.ctcBreakdown?.transportAllowance || 0) +
                      (newEmployee.salaryInfo.ctcBreakdown?.medicalAllowance || 0) +
                      (newEmployee.salaryInfo.ctcBreakdown?.otherAllowances || 0)
                    ).toLocaleString('en-IN')}
                  </td>
                </tr>
                
                {[
                  { 
                    name: 'Provident Fund', 
                    key: 'providentFund',
                    value: newEmployee.salaryInfo.ctcBreakdown?.providentFund || 0,
                    onChange: (val) => setNewEmployee({
                      ...newEmployee,
                      salaryInfo: {
                        ...newEmployee.salaryInfo,
                        ctcBreakdown: {
                          ...newEmployee.salaryInfo.ctcBreakdown,
                          providentFund: val
                        }
                      }
                    })
                  },
                  { 
                    name: 'Gratuity', 
                    key: 'gratuity',
                    value: newEmployee.salaryInfo.ctcBreakdown?.gratuity || 0,
                    onChange: (val) => setNewEmployee({
                      ...newEmployee,
                      salaryInfo: {
                        ...newEmployee.salaryInfo,
                        ctcBreakdown: {
                          ...newEmployee.salaryInfo.ctcBreakdown,
                          gratuity: val
                        }
                      }
                    })
                  },
                  { 
                    name: 'Other Deductions', 
                    key: 'otherDeductions',
                    value: newEmployee.salaryInfo.ctcBreakdown?.otherDeductions || 0,
                    onChange: (val) => setNewEmployee({
                      ...newEmployee,
                      salaryInfo: {
                        ...newEmployee.salaryInfo,
                        ctcBreakdown: {
                          ...newEmployee.salaryInfo.ctcBreakdown,
                          otherDeductions: val
                        }
                      }
                    })
                  },
                ].map((item, index) => (
                  <tr key={index}>
                    <td className="fw-semibold">{item.name}</td>
                    <td>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control text-end"
                          value={item.value}
                          onChange={(e) => item.onChange(parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    
        {/* === Bank Account Details === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:building-library" />
            </span>
            Bank Account Details
          </h6>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Payment Mode</label>
          <select
            className="form-select"
            value={newEmployee.salaryInfo.paymentMode}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              salaryInfo: {...newEmployee.salaryInfo, paymentMode: e.target.value}
            })}
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
    
        {/* Primary Bank Account */}
        <div className="col-12 mt-3">
          <h6 className="fw-bold fs-5 mb-3 text-muted d-flex align-items-center gap-2">
            <span className="text-primary">
            <Icon icon="heroicons:banknotes" />
            </span>
            Primary Bank Account
          </h6>
        </div>
        
    <div className="col-md-6">
      <label className="form-label fw-bold">Account Number</label>
      <input
        type="text"
        className="form-control"
        value={newEmployee.salaryInfo.bankAccounts.primary.accountNumber}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
          if (value.length <= 18) {
            setNewEmployee({
              ...newEmployee,
              salaryInfo: {
                ...newEmployee.salaryInfo,
                bankAccounts: {
                  ...newEmployee.salaryInfo.bankAccounts,
                  primary: {
                    ...newEmployee.salaryInfo.bankAccounts.primary,
                    accountNumber: value
                  }
                }
              }
            });
          }
        }}
        placeholder="1234567890"
        maxLength="18"
      />
      {newEmployee.salaryInfo.bankAccounts.primary.accountNumber && 
       (newEmployee.salaryInfo.bankAccounts.primary.accountNumber.length < 9 || 
        newEmployee.salaryInfo.bankAccounts.primary.accountNumber.length > 18) && (
        <div className="text-danger small mt-1">
          Account number must be 9 to 18 digits
        </div>
      )}
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">IFSC Code</label>
      <input
        type="text"
        className="form-control text-uppercase"
        value={newEmployee.salaryInfo.bankAccounts.primary.ifscCode}
        onChange={(e) => {
          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (value.length <= 11) {
            setNewEmployee({
              ...newEmployee,
              salaryInfo: {
                ...newEmployee.salaryInfo,
                bankAccounts: {
                  ...newEmployee.salaryInfo.bankAccounts,
                  primary: {
                    ...newEmployee.salaryInfo.bankAccounts.primary,
                    ifscCode: value
                  }
                }
              }
            });
          }
        }}
        placeholder="BANK0001234"
        maxLength="11"
      />
      {newEmployee.salaryInfo.bankAccounts.primary.ifscCode && 
       newEmployee.salaryInfo.bankAccounts.primary.ifscCode.length !== 11 && (
        <div className="text-danger small mt-1">
          IFSC code must be exactly 11 characters
        </div>
      )}
    </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Bank Name</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.salaryInfo.bankAccounts.primary.bankName}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              salaryInfo: {
                ...newEmployee.salaryInfo,
                bankAccounts: {
                  ...newEmployee.salaryInfo.bankAccounts,
                  primary: {
                    ...newEmployee.salaryInfo.bankAccounts.primary,
                    bankName: e.target.value
                  }
                }
              }
            })}
            placeholder="State Bank of India"
          />
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Branch</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.salaryInfo.bankAccounts.primary.branch}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              salaryInfo: {
                ...newEmployee.salaryInfo,
                bankAccounts: {
                  ...newEmployee.salaryInfo.bankAccounts,
                  primary: {
                    ...newEmployee.salaryInfo.bankAccounts.primary,
                    branch: e.target.value
                  }
                }
              }
            })}
            placeholder="Main Branch, Mumbai"
          />
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Account Type</label>
          <select
            className="form-select"
            value={newEmployee.salaryInfo.bankAccounts.primary.accountType}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              salaryInfo: {
                ...newEmployee.salaryInfo,
                bankAccounts: {
                  ...newEmployee.salaryInfo.bankAccounts,
                  primary: {
                    ...newEmployee.salaryInfo.bankAccounts.primary,
                    accountType: e.target.value
                  }
                }
              }
            })}
          >
            <option value="">Select Account Type</option>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
            <option value="Salary">Salary</option>
          </select>
        </div>
    
        {/* Secondary Bank Account (Optional) */}
        <div className="col-12 mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold fs-5 text-muted d-flex align-items-center gap-2 mb-0">
              <span className="text-primary">
              <Icon icon="heroicons:plus-circle" />
              </span>
              Secondary Bank Account 
            </h6>
    <button
      type="button"
      className="job-listings-btn"
      onClick={() => {
        if (newEmployee.salaryInfo.bankAccounts.secondary) {
          // Remove secondary account
          setNewEmployee({
            ...newEmployee,
            salaryInfo: {
              ...newEmployee.salaryInfo,
              bankAccounts: {
                ...newEmployee.salaryInfo.bankAccounts,
                secondary: null
              }
            }
          });
        } else {
          // Add secondary account
          setNewEmployee({
            ...newEmployee,
            salaryInfo: {
              ...newEmployee.salaryInfo,
              bankAccounts: {
                ...newEmployee.salaryInfo.bankAccounts,
                secondary: {
                  accountNumber: '',
                  ifscCode: '',
                  bankName: '',
                  branch: '',
                  accountType: ''
                }
              }
            }
          });
        }
      }}
    >
      <Icon
        icon={
          newEmployee.salaryInfo.bankAccounts.secondary
            ? "heroicons:minus"
            : "heroicons:plus"
        }
      />
      {newEmployee.salaryInfo.bankAccounts.secondary
        ? "Remove Account"
        : "Add Account"}
    </button>
    
          </div>
        </div>
        
        {newEmployee.salaryInfo.bankAccounts.secondary && (
          <>
        <div className="col-md-6">
          <label className="form-label fw-bold">Account Number</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.salaryInfo.bankAccounts.secondary.accountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
              if (value.length <= 18) {
                setNewEmployee({
                  ...newEmployee,
                  salaryInfo: {
                    ...newEmployee.salaryInfo,
                    bankAccounts: {
                      ...newEmployee.salaryInfo.bankAccounts,
                      secondary: {
                        ...newEmployee.salaryInfo.bankAccounts.secondary,
                        accountNumber: value
                      }
                    }
                  }
                });
              }
            }}
            placeholder="1234567890"
            maxLength="18"
          />
          {newEmployee.salaryInfo.bankAccounts.secondary.accountNumber && 
           (newEmployee.salaryInfo.bankAccounts.secondary.accountNumber.length < 9 || 
            newEmployee.salaryInfo.bankAccounts.secondary.accountNumber.length > 18) && (
            <div className="text-danger small mt-1">
              Account number must be 9 to 18 digits
            </div>
          )}
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">IFSC Code</label>
          <input
            type="text"
            className="form-control text-uppercase"
            value={newEmployee.salaryInfo.bankAccounts.secondary.ifscCode}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (value.length <= 11) {
                setNewEmployee({
                  ...newEmployee,
                  salaryInfo: {
                    ...newEmployee.salaryInfo,
                    bankAccounts: {
                      ...newEmployee.salaryInfo.bankAccounts,
                      secondary: {
                        ...newEmployee.salaryInfo.bankAccounts.secondary,
                        ifscCode: value
                      }
                    }
                  }
                });
              }
            }}
            placeholder="BANK0001234"
            maxLength="11"
          />
          {newEmployee.salaryInfo.bankAccounts.secondary.ifscCode && 
           newEmployee.salaryInfo.bankAccounts.secondary.ifscCode.length !== 11 && (
            <div className="text-danger small mt-1">
              IFSC code must be exactly 11 characters
            </div>
          )}
        </div>
            
            <div className="col-md-6">
              <label className="form-label fw-bold">Bank Name</label>
              <input
                type="text"
                className="form-control"
                value={newEmployee.salaryInfo.bankAccounts.secondary.bankName}
                onChange={(e) => setNewEmployee({
                  ...newEmployee,
                  salaryInfo: {
                    ...newEmployee.salaryInfo,
                    bankAccounts: {
                      ...newEmployee.salaryInfo.bankAccounts,
                      secondary: {
                        ...newEmployee.salaryInfo.bankAccounts.secondary,
                        bankName: e.target.value
                      }
                    }
                  }
                })}
                placeholder="Bank Name"
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-bold">Branch</label>
              <input
                type="text"
                className="form-control"
                value={newEmployee.salaryInfo.bankAccounts.secondary.branch}
                onChange={(e) => setNewEmployee({
                  ...newEmployee,
                  salaryInfo: {
                    ...newEmployee.salaryInfo,
                    bankAccounts: {
                      ...newEmployee.salaryInfo.bankAccounts,
                      secondary: {
                        ...newEmployee.salaryInfo.bankAccounts.secondary,
                        branch: e.target.value
                      }
                    }
                  }
                })}
                placeholder="Branch Name"
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-bold">Account Type</label>
              <select
                className="form-select"
                value={newEmployee.salaryInfo.bankAccounts.secondary.accountType}
                onChange={(e) => setNewEmployee({
                  ...newEmployee,
                  salaryInfo: {
                    ...newEmployee.salaryInfo,
                    bankAccounts: {
                      ...newEmployee.salaryInfo.bankAccounts,
                      secondary: {
                        ...newEmployee.salaryInfo.bankAccounts.secondary,
                        accountType: e.target.value
                      }
                    }
                  }
                })}
              >
                <option value="">Select Account Type</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
                <option value="Salary">Salary</option>
              </select>
            </div>
          </>
        )}
    
        {/* === Provident Fund & ESI === */}
    <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 text-muted border-bottom pb-2 d-flex align-items-center gap-2">
       <span className="text-primary">
        <Icon icon="heroicons:shield-check" />
        </span>
        Provident Fund & ESI
      </h6>
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">PF Account Number</label>
      <input
        type="text"
        className="form-control"
        value={newEmployee.salaryInfo.pfAccountNumber}
        onChange={(e) => {
          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (value.length <= 22) {
            setNewEmployee({
              ...newEmployee,
              salaryInfo: {...newEmployee.salaryInfo, pfAccountNumber: value}
            });
          }
        }}
        placeholder="PF123456789"
        maxLength="22"
      />
      {newEmployee.salaryInfo.pfAccountNumber && 
       (newEmployee.salaryInfo.pfAccountNumber.length < 10 || 
        newEmployee.salaryInfo.pfAccountNumber.length > 22) && (
        <div className="text-danger small mt-1">
          PF Account number must be 10 to 22 characters
        </div>
      )}
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">UAN (Universal Account Number)</label>
      <input
        type="text"
        className="form-control"
        value={newEmployee.salaryInfo.uan}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
          if (value.length <= 14) {
            setNewEmployee({
              ...newEmployee,
              salaryInfo: {...newEmployee.salaryInfo, uan: value}
            });
          }
        }}
        placeholder="123456789012"
        maxLength="14"
      />
      {newEmployee.salaryInfo.uan && 
       (newEmployee.salaryInfo.uan.length < 12 || 
        newEmployee.salaryInfo.uan.length > 14) && (
        <div className="text-danger small mt-1">
          UAN must be 12 to 14 digits
        </div>
      )}
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">ESI Number</label>
      <input
        type="text"
        className="form-control"
        value={newEmployee.salaryInfo.esiNumber}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
          if (value.length <= 10) {
            setNewEmployee({
              ...newEmployee,
              salaryInfo: {...newEmployee.salaryInfo, esiNumber: value}
            });
          }
        }}
        placeholder="ESI123456789"
        maxLength="10"
      />
      {newEmployee.salaryInfo.esiNumber && 
       newEmployee.salaryInfo.esiNumber.length !== 10 && (
        <div className="text-danger small mt-1">
          ESI number must be exactly 10 digits
        </div>
      )}
    </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">ESI Medical Nominee</label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.salaryInfo.esiMedicalNominee}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              salaryInfo: {...newEmployee.salaryInfo, esiMedicalNominee: e.target.value}
            })}
            placeholder="Nominee Name"
          />
        </div>
    
        {/* === Tax & Benefits === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:document-check" />
            </span>
            Tax & Benefits
          </h6>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Tax Regime</label>
          <select
            className="form-select"
            value={newEmployee.salaryInfo.taxDeclaration?.regime || ''}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              salaryInfo: {
                ...newEmployee.salaryInfo,
                taxDeclaration: {
                  ...newEmployee.salaryInfo.taxDeclaration,
                  regime: e.target.value
                }
              }
            })}
          >
            <option value="">Select Tax Regime</option>
            <option value="Old Regime">Old </option>
            <option value="New Regime">New </option>
          </select>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Tax Declaration</label>
          <select
            className="form-select"
            value={newEmployee.salaryInfo.taxDeclaration?.declared ? 'Yes' : 'No'}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              salaryInfo: {
                ...newEmployee.salaryInfo,
                taxDeclaration: {
                  ...newEmployee.salaryInfo.taxDeclaration,
                  declared: e.target.value === 'Yes'
                }
              }
            })}
          >
            <option value="No">Not Declared</option>
            <option value="Yes">Declared</option>
          </select>
        </div>
        
    <div className="col-md-6">
      <label className="form-label fw-bold">Variable Pay Percentage</label>
      <div className="input-group">
        <input
          type="number"
          className="form-control"
          value={newEmployee.salaryInfo.variablePay?.percentage || ''}
          onChange={(e) => {
            const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
            setNewEmployee({
              ...newEmployee,
              salaryInfo: {
                ...newEmployee.salaryInfo,
                variablePay: {
                  eligible: value > 0,
                  percentage: value
                }
              }
            });
          }}
          placeholder="Enter percentage (0-100)"
          min="0"
          max="100"
          step="0.5"
        />
        <span className="input-group-text">%</span>
      </div>
      <small className="text-muted">
        {newEmployee.salaryInfo.variablePay?.percentage > 0 ? (
          <span className="text-success">
            Eligible ({(newEmployee.salaryInfo.variablePay.percentage || 0)}%)
          </span>
        ) : (
          <span className="text-secondary">Not eligible (0%)</span>
        )}
      </small>
      
      {/* Show calculated amount based on CTC */}
      {newEmployee.salaryInfo.currentCTC > 0 && newEmployee.salaryInfo.variablePay?.percentage > 0 && (
        <div className="mt-2">
          <small className="text-success">
            Estimated Variable Pay: ₹{formatCurrency(
              (newEmployee.salaryInfo.currentCTC * (newEmployee.salaryInfo.variablePay.percentage || 0)) / 100
            )}
          </small>
        </div>
      )}
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">Bonus Amount</label>
      <div className="input-group">
        <span className="input-group-text">₹</span>
        <input
          type="number"
          className="form-control"
          value={newEmployee.salaryInfo.bonusEligibility?.amount || ''}
          onChange={(e) => {
            const value = Math.max(0, parseInt(e.target.value) || 0);
            setNewEmployee({
              ...newEmployee,
              salaryInfo: {
                ...newEmployee.salaryInfo,
                bonusEligibility: {
                  eligible: value > 0,
                  amount: value
                }
              }
            });
          }}
          placeholder="Enter bonus amount"
          min="0"
          step="1000"
        />
      </div>
      <small className="text-muted">
        {newEmployee.salaryInfo.bonusEligibility?.amount > 0 ? (
          <span className="text-success">
            Eligible (₹{formatCurrency(newEmployee.salaryInfo.bonusEligibility.amount || 0)})
          </span>
        ) : (
          <span className="text-secondary">Not eligible (₹0)</span>
        )}
      </small>
      
      {/* Show bonus as percentage of CTC */}
      {newEmployee.salaryInfo.currentCTC > 0 && newEmployee.salaryInfo.bonusEligibility?.amount > 0 && (
        <div className="mt-2">
          <small className="text-success">
            Bonus as % of CTC: {(
              ((newEmployee.salaryInfo.bonusEligibility.amount || 0) / newEmployee.salaryInfo.currentCTC) * 100
            ).toFixed(2)}%
          </small>
        </div>
      )}
    </div>
    
        {/* === Salary Revision History === */}
        <div className="col-12 mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold fs-5 text-muted d-flex align-items-center gap-2 mb-0">
              <span className="text-primary">
              <Icon icon="heroicons:chart-bar" />
              </span>
              Salary Revision History
            </h6>
            <button
              type="button"
              className="create-job-btn"
              onClick={() => {
                // Get current salary from job history
                const jobHistoryEntries = newEmployee.jobHistory || [];
                const salaryHistoryEntries = jobHistoryEntries
                  .filter(entry => entry.salaryChange && parseInt(entry.salaryChange) > 0)
                  .sort((a, b) => new Date(b.date) - new Date(a.date));
                
                const previousSalary = salaryHistoryEntries.length > 0 
                  ? parseInt(salaryHistoryEntries[0].salaryChange) 
                  : (newEmployee.salaryInfo.currentCTC || newEmployee.salary || 0);
                
                // Calculate percentage increase from current CTC
                const currentCTC = newEmployee.salaryInfo.currentCTC || newEmployee.salary || 0;
                const percentageIncrease = previousSalary > 0 
                  ? Math.round(((currentCTC - previousSalary) / previousSalary) * 100)
                  : 0;
                
                const newRevision = {
                  id: Date.now(),
                  effectiveDate: new Date().toISOString().split("T")[0],
                  previousCTC: previousSalary,
                  newCTC: currentCTC,
                  percentageIncrease: percentageIncrease,
                  approvedBy: "",
                  status: "Pending",
                  isEditing: true
                };
                
                setNewEmployee({
                  ...newEmployee,
                  salaryInfo: {
                    ...newEmployee.salaryInfo,
                    salaryRevisionHistory: [
                      ...(newEmployee.salaryInfo.salaryRevisionHistory || []),
                      newRevision
                    ]
                  }
                });
              }}
            >
              <Icon icon="heroicons:plus" className="me-1" />
              Add Salary Revision
            </button>
          </div>
    
          {/* Salary Revision Cards */}
          <div className="col-12">
            {newEmployee.salaryInfo.salaryRevisionHistory && newEmployee.salaryInfo.salaryRevisionHistory.length > 0 ? (
              newEmployee.salaryInfo.salaryRevisionHistory.map((revision, idx) => (
                <div key={revision.id} className="card border mb-3">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted">{formatDate(revision.effectiveDate)}</span>
                      <span className={`badge ${
                        revision.status === 'Approved' ? 'bg-success' :
                        revision.status === 'Rejected' ? 'bg-danger' :
                        'bg-warning'
                      }`}>
                        {revision.status}
                      </span>
                    </div>
                    <div className="d-flex gap-1">
                      {revision.isEditing ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => {
                              const updatedRevisions = [...newEmployee.salaryInfo.salaryRevisionHistory];
                              updatedRevisions[idx] = { ...revision, isEditing: false };
                              setNewEmployee({
                                ...newEmployee,
                                salaryInfo: {
                                  ...newEmployee.salaryInfo,
                                  salaryRevisionHistory: updatedRevisions
                                }
                              });
                            }}
                            title="Save"
                          >
                            <Icon icon="heroicons:check" />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              const updatedRevisions = [...newEmployee.salaryInfo.salaryRevisionHistory];
                              updatedRevisions[idx] = { ...revision, isEditing: false };
                              setNewEmployee({
                                ...newEmployee,
                                salaryInfo: {
                                  ...newEmployee.salaryInfo,
                                  salaryRevisionHistory: updatedRevisions
                                }
                              });
                            }}
                            title="Cancel"
                          >
                            <Icon icon="heroicons:x-mark" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              const updatedRevisions = [...newEmployee.salaryInfo.salaryRevisionHistory];
                              updatedRevisions[idx] = { ...revision, isEditing: true };
                              setNewEmployee({
                                ...newEmployee,
                                salaryInfo: {
                                  ...newEmployee.salaryInfo,
                                  salaryRevisionHistory: updatedRevisions
                                }
                              });
                            }}
                            title="Edit"
                          >
                            <Icon icon="heroicons:pencil" />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this salary revision entry?')) {
                                const updatedRevisions = newEmployee.salaryInfo.salaryRevisionHistory.filter((_, i) => i !== idx);
                                setNewEmployee({
                                  ...newEmployee,
                                  salaryInfo: {
                                    ...newEmployee.salaryInfo,
                                    salaryRevisionHistory: updatedRevisions
                                  }
                                });
                              }
                            }}
                            title="Delete"
                          >
                            <Icon icon="heroicons:trash" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="card-body">
                    {revision.isEditing ? (
                      <div className="row g-3">
                        {/* Row 1: Effective Date and Status */}
                        <div className="col-md-6">
                          <label className="form-label fw-bold small">Effective Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={revision.effectiveDate}
                            onChange={(e) => {
                              const updatedRevisions = [...newEmployee.salaryInfo.salaryRevisionHistory];
                              updatedRevisions[idx] = { ...revision, effectiveDate: e.target.value };
                              setNewEmployee({
                                ...newEmployee,
                                salaryInfo: {
                                  ...newEmployee.salaryInfo,
                                  salaryRevisionHistory: updatedRevisions
                                }
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small">Status</label>
                          <select
                            className="form-select"
                            value={revision.status}
                            onChange={(e) => {
                              const updatedRevisions = [...newEmployee.salaryInfo.salaryRevisionHistory];
                              updatedRevisions[idx] = { ...revision, status: e.target.value };
                              setNewEmployee({
                                ...newEmployee,
                                salaryInfo: {
                                  ...newEmployee.salaryInfo,
                                  salaryRevisionHistory: updatedRevisions
                                }
                              });
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
    
                        {/* Row 2: Previous CTC and New CTC */}
                        <div className="col-md-6">
                          <label className="form-label fw-bold small">Previous CTC</label>
                          <div className="input-group">
                            <span className="input-group-text">₹</span>
                            <input
                              type="number"
                              className="form-control"
                              value={revision.previousCTC}
                              onChange={(e) => {
                                const prevCTC = parseInt(e.target.value) || 0;
                                const updatedRevisions = [...newEmployee.salaryInfo.salaryRevisionHistory];
                                const percentageIncrease = revision.newCTC > 0 
                                  ? Math.round(((revision.newCTC - prevCTC) / prevCTC) * 100) 
                                  : 0;
                                updatedRevisions[idx] = { 
                                  ...revision, 
                                  previousCTC: prevCTC,
                                  percentageIncrease
                                };
                                setNewEmployee({
                                  ...newEmployee,
                                  salaryInfo: {
                                    ...newEmployee.salaryInfo,
                                    salaryRevisionHistory: updatedRevisions
                                  }
                                });
                              }}
                              placeholder="Previous salary"
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small">New CTC</label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              value={revision.newCTC}
                              onChange={(e) => {
                                const newCTC = parseInt(e.target.value) || 0;
                                const updatedRevisions = [...newEmployee.salaryInfo.salaryRevisionHistory];
                                const percentageIncrease = revision.previousCTC > 0 
                                  ? Math.round(((newCTC - revision.previousCTC) / revision.previousCTC) * 100) 
                                  : 0;
                                updatedRevisions[idx] = { 
                                  ...revision, 
                                  newCTC: newCTC,
                                  percentageIncrease
                                };
                                setNewEmployee({
                                  ...newEmployee,
                                  salaryInfo: {
                                    ...newEmployee.salaryInfo,
                                    salaryRevisionHistory: updatedRevisions
                                  }
                                });
                              }}
                              placeholder="New salary"
                              min="0"
                            />
                          </div>
                        </div>
    
                        {/* Row 3: Percentage Increase and Approved By */}
                        <div className="col-md-6">
                          <label className="form-label fw-bold small">Percentage Increase</label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              value={revision.percentageIncrease}
                              onChange={(e) => {
                                const percentage = parseInt(e.target.value) || 0;
                                const updatedRevisions = [...newEmployee.salaryInfo.salaryRevisionHistory];
                                const newCTC = revision.previousCTC + (revision.previousCTC * percentage / 100);
                                updatedRevisions[idx] = { 
                                  ...revision, 
                                  percentageIncrease: percentage,
                                  newCTC: Math.round(newCTC)
                                };
                                setNewEmployee({
                                  ...newEmployee,
                                  salaryInfo: {
                                    ...newEmployee.salaryInfo,
                                    salaryRevisionHistory: updatedRevisions
                                  }
                                });
                              }}
                              placeholder="Percentage"
                              min="0"
                            />
                            <span className="input-group-text">%</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small">Approved By</label>
                          <input
                            type="text"
                            className="form-control"
                            value={revision.approvedBy}
                            onChange={(e) => {
                              const updatedRevisions = [...newEmployee.salaryInfo.salaryRevisionHistory];
                              updatedRevisions[idx] = { ...revision, approvedBy: e.target.value };
                              setNewEmployee({
                                ...newEmployee,
                                salaryInfo: {
                                  ...newEmployee.salaryInfo,
                                  salaryRevisionHistory: updatedRevisions
                                }
                              });
                            }}
                            placeholder="Approver name"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        {/* Read-only display */}
                        <div className="col-md-6 mb-2">
                          <div className="d-flex">
                            <strong className="text-muted me-2" style={{ minWidth: '120px' }}>Effective Date:</strong>
                            <span>{formatDate(revision.effectiveDate)}</span>
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div className="d-flex">
                            <strong className="text-muted me-2" style={{ minWidth: '120px' }}>Status:</strong>
                            <span className={`badge ${
                              revision.status === 'Approved' ? 'bg-success' :
                              revision.status === 'Rejected' ? 'bg-danger' :
                              'bg-warning'
                            }`}>
                              {revision.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="col-md-6 mb-2">
                          <div className="d-flex">
                            <strong className="text-muted me-2" style={{ minWidth: '120px' }}>Previous CTC:</strong>
                            <span>₹{formatCurrency(revision.previousCTC)}</span>
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div className="d-flex">
                            <strong className="text-muted me-2" style={{ minWidth: '120px' }}>New CTC:</strong>
                            <span className="fw-bold text-success">₹{formatCurrency(revision.newCTC)}</span>
                          </div>
                        </div>
                        
                        <div className="col-md-6 mb-2">
                          <div className="d-flex">
                            <strong className="text-muted me-2" style={{ minWidth: '120px' }}>Percentage Increase:</strong>
                            <span className={`fw-bold ${revision.percentageIncrease >= 0 ? 'text-success' : 'text-danger'}`}>
                              {revision.percentageIncrease > 0 ? '+' : ''}{revision.percentageIncrease}%
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div className="d-flex">
                            <strong className="text-muted me-2" style={{ minWidth: '120px' }}>Approved By:</strong>
                            <span>{revision.approvedBy || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-light border d-flex align-items-center gap-2">
                <Icon icon="heroicons:information-circle" className="me-2 text-muted" />
                No salary revision history added. Click "Add Salary Revision" to add one.
              </div>
            )}
          </div>
    
          {/* Summary Table View */}
          {newEmployee.salaryInfo.salaryRevisionHistory && newEmployee.salaryInfo.salaryRevisionHistory.length > 0 && (
            <div className="col-12 mt-4">
              <h6 className="fw-bold mb-3 text-muted border-bottom pb-2 d-flex align-items-center gap-2">
                <Icon icon="heroicons:table-cells" className="me-2" />
                Salary Revision Summary Table
              </h6>
              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-muted">Effective Date</th>
                      <th className="text-muted">Previous CTC</th>
                      <th className="text-muted">New CTC</th>
                      <th className="text-muted">Percentage Increase</th>
                      <th className="text-muted">Approved By</th>
                      <th className="text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newEmployee.salaryInfo.salaryRevisionHistory.map((revision) => (
                      <tr key={revision.id}>
                        <td>{formatDate(revision.effectiveDate)}</td>
                        <td>{formatCurrency(revision.previousCTC)}</td>
                        <td>{formatCurrency(revision.newCTC)}</td>
                        <td>
                          <span className={`badge ${revision.percentageIncrease >= 0 ? 'bg-success' : 'bg-danger'}`}>
                            {revision.percentageIncrease > 0 ? '+' : ''}{revision.percentageIncrease}%
                          </span>
                        </td>
                        <td>{revision.approvedBy || '-'}</td>
                        <td>
                          <span className={`badge ${
                            revision.status === 'Approved' ? 'bg-success' :
                            revision.status === 'Rejected' ? 'bg-danger' :
                            'bg-warning'
                          }`}>
                            {revision.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
    
      </div>
    )}
    
                        {/* Statutory & Compliance Tab */}
    
    {/* Statutory & Compliance Tab */}
    {activeAddTab === 'statutory' && (
      <div className="row g-3">
        {/* Note Section */}
        <div className="col-12 mb-3">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
                        <Icon icon="heroicons:shield-check" />
                        </span>
                        Statutory & Compliance Information
                      </h6>
        </div>
    
        {/* === PAN Card Details === */}
        <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:credit-card" />
            </span>
            PAN Card Details
          </h6>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">PAN Number <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control text-uppercase"
            value={newEmployee.personalInfo.identification.pan.number}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (value.length <= 10) {
                setNewEmployee({
                  ...newEmployee,
                  personalInfo: {
                    ...newEmployee.personalInfo,
                    identification: {
                      ...newEmployee.personalInfo.identification,
                      pan: {...newEmployee.personalInfo.identification.pan, number: value}
                    }
                  }
                });
              }
            }}
            placeholder="ABCDE1234F"
            maxLength="10"
            required
          />
        </div>
    
    
        <div className="col-md-6">
          <label className="form-label fw-bold">PAN Verified</label>
          <select
            className="form-select"
            value={newEmployee.statutoryInfo.pan.verified}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                pan: {...newEmployee.statutoryInfo.pan, verified: e.target.value === 'true'}
              }
            })}
          >
            <option value={false}>Not Verified</option>
            <option value={true}>Verified</option>
          </select>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">PAN Verification Date</label>
          <input
            type="date"
            className="form-control"
            value={newEmployee.statutoryInfo.pan.verifiedDate}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                pan: {...newEmployee.statutoryInfo.pan, verifiedDate: e.target.value}
              }
            })}
          />
        </div>
    
        {/* === Aadhaar Card Details === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:identification" />
            </span>
            Aadhaar Card Details
          </h6>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Aadhaar Number <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            value={newEmployee.personalInfo.identification.aadhaar.number}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 12) {
                setNewEmployee({
                  ...newEmployee,
                  personalInfo: {
                    ...newEmployee.personalInfo,
                    identification: {
                      ...newEmployee.personalInfo.identification,
                      aadhaar: {...newEmployee.personalInfo.identification.aadhaar, number: value}
                    }
                  }
                });
              }
            }}
            placeholder="123456789012"
            maxLength="12"
            required
          />
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Aadhaar Verified</label>
          <select
            className="form-select"
            value={newEmployee.statutoryInfo.aadhaar.verified}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                aadhaar: {...newEmployee.statutoryInfo.aadhaar, verified: e.target.value === 'true'}
              }
            })}
          >
            <option value={false}>Not Verified</option>
            <option value={true}>Verified</option>
          </select>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Aadhaar Verification Date</label>
          <input
            type="date"
            className="form-control"
            value={newEmployee.statutoryInfo.aadhaar.verifiedDate}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                aadhaar: {...newEmployee.statutoryInfo.aadhaar, verifiedDate: e.target.value}
              }
            })}
          />
        </div>
    
        {/* === Provident Fund Membership === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:banknotes" />
            </span>
            Provident Fund Membership
          </h6>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">PF Enrolled</label>
          <select
            className="form-select"
            value={newEmployee.statutoryInfo.pfMembership.enrolled}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                pfMembership: {
                  ...newEmployee.statutoryInfo.pfMembership,
                  enrolled: e.target.value === 'true',
                  accountNumber: e.target.value === 'false' ? '' : newEmployee.statutoryInfo.pfMembership.accountNumber,
                  uan: e.target.value === 'false' ? '' : newEmployee.statutoryInfo.pfMembership.uan
                }
              }
            })}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
    
        {newEmployee.statutoryInfo.pfMembership.enrolled && (
          <>
    <div className="col-md-6">
      <label className="form-label fw-bold">PF Account Number</label>
      <input
        type="text"
        className="form-control"
        value={newEmployee.salaryInfo.pfAccountNumber}
        onChange={(e) => {
          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (value.length <= 22) {
            setNewEmployee({
              ...newEmployee,
              salaryInfo: {...newEmployee.salaryInfo, pfAccountNumber: value}
            });
          }
        }}
        placeholder="PF123456789"
        maxLength="22"
      />
      {newEmployee.salaryInfo.pfAccountNumber && 
       (newEmployee.salaryInfo.pfAccountNumber.length < 10 || 
        newEmployee.salaryInfo.pfAccountNumber.length > 22) && (
        <div className="text-danger small mt-1">
          PF Account number must be 10 to 22 characters
        </div>
      )}
    </div>
    
    <div className="col-md-6">
      <label className="form-label fw-bold">UAN (Universal Account Number)</label>
      <input
        type="text"
        className="form-control"
        value={newEmployee.salaryInfo.uan}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
          if (value.length <= 14) {
            setNewEmployee({
              ...newEmployee,
              salaryInfo: {...newEmployee.salaryInfo, uan: value}
            });
          }
        }}
        placeholder="123456789012"
        maxLength="14"
      />
      {newEmployee.salaryInfo.uan && 
       (newEmployee.salaryInfo.uan.length < 12 || 
        newEmployee.salaryInfo.uan.length > 14) && (
        <div className="text-danger small mt-1">
          UAN must be 12 to 14 digits
        </div>
      )}
    </div>
    
            <div className="col-md-6">
              <label className="form-label fw-bold">PF Enrollment Date</label>
              <input
                type="date"
                className="form-control"
                value={newEmployee.statutoryInfo.pfMembership.enrollmentDate}
                onChange={(e) => setNewEmployee({
                  ...newEmployee,
                  statutoryInfo: {
                    ...newEmployee.statutoryInfo,
                    pfMembership: {...newEmployee.statutoryInfo.pfMembership, enrollmentDate: e.target.value}
                  }
                })}
              />
            </div>
    
            <div className="col-md-6">
              <label className="form-label fw-bold">PF Account Type</label>
              <select
                className="form-select"
                value={newEmployee.statutoryInfo.pfMembership.accountType}
                onChange={(e) => setNewEmployee({
                  ...newEmployee,
                  statutoryInfo: {
                    ...newEmployee.statutoryInfo,
                    pfMembership: {...newEmployee.statutoryInfo.pfMembership, accountType: e.target.value}
                  }
                })}
              >
                <option value="Regular">Regular</option>
                <option value="Exempted">Exempted</option>
                <option value="Voluntary">Voluntary</option>
                <option value="International Worker">International Worker</option>
              </select>
            </div>
          </>
        )}
    
        {/* === ESI Registration === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:heart" />
            </span>
            ESI Registration
          </h6>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">ESI Enrolled</label>
          <select
            className="form-select"
            value={newEmployee.statutoryInfo.esiRegistration.enrolled}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                esiRegistration: {
                  ...newEmployee.statutoryInfo.esiRegistration,
                  enrolled: e.target.value === 'true',
                  number: e.target.value === 'false' ? '' : newEmployee.statutoryInfo.esiRegistration.number
                }
              }
            })}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
    
        {newEmployee.statutoryInfo.esiRegistration.enrolled && (
          <>
   <div className="col-md-6">
      <label className="form-label fw-bold">ESI Number</label>
      <input
        type="text"
        className="form-control"
        value={newEmployee.salaryInfo.esiNumber}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
          if (value.length <= 10) {
            setNewEmployee({
              ...newEmployee,
              salaryInfo: {...newEmployee.salaryInfo, esiNumber: value}
            });
          }
        }}
        placeholder="ESI123456789"
        maxLength="10"
      />
      {newEmployee.salaryInfo.esiNumber && 
       newEmployee.salaryInfo.esiNumber.length !== 10 && (
        <div className="text-danger small mt-1">
          ESI number must be exactly 10 digits
        </div>
      )}
    </div>
    
            <div className="col-md-6">
              <label className="form-label fw-bold">ESI Enrollment Date</label>
              <input
                type="date"
                className="form-control"
                value={newEmployee.statutoryInfo.esiRegistration.enrollmentDate}
                onChange={(e) => setNewEmployee({
                  ...newEmployee,
                  statutoryInfo: {
                    ...newEmployee.statutoryInfo,
                    esiRegistration: {...newEmployee.statutoryInfo.esiRegistration, enrollmentDate: e.target.value}
                  }
                })}
              />
            </div>
          </>
        )}
    
        {/* === Professional Tax === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
            <Icon icon="heroicons:document-text" />
            </span>
            Professional Tax
          </h6>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Professional Tax Applicable</label>
          <select
            className="form-select"
            value={newEmployee.statutoryInfo.professionalTax.applicable}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                professionalTax: {
                  ...newEmployee.statutoryInfo.professionalTax,
                  applicable: e.target.value === 'true',
                  state: e.target.value === 'false' ? '' : newEmployee.statutoryInfo.professionalTax.state,
                  ptNumber: e.target.value === 'false' ? '' : newEmployee.statutoryInfo.professionalTax.ptNumber
                }
              }
            })}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
    
        {newEmployee.statutoryInfo.professionalTax.applicable && (
          <>
            <div className="col-md-6">
              <label className="form-label fw-bold">State</label>
              <select
                className="form-select"
                value={newEmployee.statutoryInfo.professionalTax.state}
                onChange={(e) => setNewEmployee({
                  ...newEmployee,
                  statutoryInfo: {
                    ...newEmployee.statutoryInfo,
                    professionalTax: {...newEmployee.statutoryInfo.professionalTax, state: e.target.value}
                  }
                })}
              >
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Delhi">Delhi</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>
    
<div className="col-md-6">
  <label className="form-label fw-bold">PT Number</label>
  <input
    type="text"
    className="form-control"
    value={newEmployee.statutoryInfo.professionalTax.ptNumber}
    onChange={(e) => {
      const value = e.target.value.toUpperCase();
      // Basic validation: alphanumeric, 8-12 characters, no special chars except hyphens
      if (/^[A-Z0-9-]{0,12}$/.test(value)) {
        setNewEmployee({
          ...newEmployee,
          statutoryInfo: {
            ...newEmployee.statutoryInfo,
            professionalTax: {
              ...newEmployee.statutoryInfo.professionalTax,
              ptNumber: value
            }
          }
        });
      }
    }}
    placeholder="PT12345678"
    maxLength="12"
  />  {newEmployee.statutoryInfo.professionalTax.ptNumber &&
    !/^[A-Z0-9-]{8,12}$/.test(newEmployee.statutoryInfo.professionalTax.ptNumber) && (
      <div className="text-danger small mt-1">
        PT Number must be 8 to 12 alphanumeric characters 
      </div>
    )}

      </div>
            
          </>
        )}
    
        {/* === Labour Welfare Fund === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:users" />
              </span>
            Labour Welfare Fund
          </h6>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Labour Welfare Fund Enrolled</label>
          <select
            className="form-select"
            value={newEmployee.statutoryInfo.labourWelfareFund.enrolled}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                labourWelfareFund: {
                  ...newEmployee.statutoryInfo.labourWelfareFund,
                  enrolled: e.target.value === 'true',
                  enrollmentDate: e.target.value === 'false' ? '' : newEmployee.statutoryInfo.labourWelfareFund.enrollmentDate
                }
              }
            })}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
    
        {newEmployee.statutoryInfo.labourWelfareFund.enrolled && (
          <div className="col-md-6">
            <label className="form-label fw-bold">Enrollment Date</label>
            <input
              type="date"
              className="form-control"
              value={newEmployee.statutoryInfo.labourWelfareFund.enrollmentDate}
              onChange={(e) => setNewEmployee({
                ...newEmployee,
                statutoryInfo: {
                  ...newEmployee.statutoryInfo,
                  labourWelfareFund: {...newEmployee.statutoryInfo.labourWelfareFund, enrollmentDate: e.target.value}
                }
              })}
            />
          </div>
        )}
    
        {/* === Gratuity === */}
        <div className="col-12 mt-4">
         <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:gift" />
            </span>
            Gratuity
          </h6>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Gratuity Eligible</label>
          <select
            className="form-select"
            value={newEmployee.statutoryInfo.gratuity.eligible}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                gratuity: {
                  ...newEmployee.statutoryInfo.gratuity,
                  eligible: e.target.value === 'true',
                  eligibilityDate: e.target.value === 'false' ? '' : newEmployee.statutoryInfo.gratuity.eligibilityDate
                }
              }
            })}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
    
        {newEmployee.statutoryInfo.gratuity.eligible && (
          <div className="col-md-6">
            <label className="form-label fw-bold">Eligibility Date</label>
            <input
              type="date"
              className="form-control"
              value={newEmployee.statutoryInfo.gratuity.eligibilityDate}
              onChange={(e) => setNewEmployee({
                ...newEmployee,
                statutoryInfo: {
                  ...newEmployee.statutoryInfo,
                  gratuity: {...newEmployee.statutoryInfo.gratuity, eligibilityDate: e.target.value}
                }
              })}
            />
          </div>
        )}
    
        {/* === Bonus Act === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:currency-rupee" />
            </span>
            Bonus Act
          </h6>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Bonus Act Applicable</label>
          <select
            className="form-select"
            value={newEmployee.statutoryInfo.bonusAct.applicable}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                bonusAct: {...newEmployee.statutoryInfo.bonusAct, applicable: e.target.value === 'true'}
              }
            })}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
    
        {/* === Shops and Establishment Act === */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:building-office" />
            </span>
            Shops and Establishment Act
          </h6>
        </div>
    
        <div className="col-md-6">
          <label className="form-label fw-bold">Registered</label>
          <select
            className="form-select"
            value={newEmployee.statutoryInfo.shopsAndEstablishment.registered}
            onChange={(e) => setNewEmployee({
              ...newEmployee,
              statutoryInfo: {
                ...newEmployee.statutoryInfo,
                shopsAndEstablishment: {
                  ...newEmployee.statutoryInfo.shopsAndEstablishment,
                  registered: e.target.value === 'true',
                  registrationNumber: e.target.value === 'false' ? '' : newEmployee.statutoryInfo.shopsAndEstablishment.registrationNumber,
                  registrationDate: e.target.value === 'false' ? '' : newEmployee.statutoryInfo.shopsAndEstablishment.registrationDate
                }
              }
            })}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
    
        {newEmployee.statutoryInfo.shopsAndEstablishment.registered && (
          <>
<div className="col-md-6">
  <label className="form-label fw-bold">Registration Number</label>

  <input
    type="text"
    className="form-control"
    value={newEmployee.statutoryInfo?.shopsAndEstablishment?.registrationNumber || ''}
    onChange={(e) => {
      const value = e.target.value.toUpperCase();

      if (value.length <= 15 && /^[A-Z0-9-]*$/.test(value)) {
        setNewEmployee({
          ...newEmployee,
          statutoryInfo: {
            ...newEmployee.statutoryInfo,
            shopsAndEstablishment: {
              ...newEmployee.statutoryInfo.shopsAndEstablishment,
              registrationNumber: value
            }
          }
        });
      }
    }}
    placeholder="Registration number"
    maxLength="15"
  />

  {newEmployee.statutoryInfo?.shopsAndEstablishment?.registrationNumber &&
    !/^[A-Z0-9-]{5,15}$/.test(
      newEmployee.statutoryInfo.shopsAndEstablishment.registrationNumber
    ) && (
      <div className="text-danger small mt-1">
        Registration number must be 5 to 15 characters, alphanumeric or hyphens only
      </div>
    )}
</div>

    
            <div className="col-md-6">
              <label className="form-label fw-bold">Registration Date</label>
              <input
                type="date"
                className="form-control"
                value={newEmployee.statutoryInfo.shopsAndEstablishment.registrationDate}
                onChange={(e) => setNewEmployee({
                  ...newEmployee,
                  statutoryInfo: {
                    ...newEmployee.statutoryInfo,
                    shopsAndEstablishment: {...newEmployee.statutoryInfo.shopsAndEstablishment, registrationDate: e.target.value}
                  }
                })}
              />
            </div>
          </>
        )}
      </div>
    )}
    
                      </div>
                    </div>
                    <div className="modal-footer d-flex justify-content-end gap-2" style={{ flexShrink: 0 }}>
                      <button
                        type="button"
                        className=" cancel-btn"
                        onClick={() => {
                          setShowAddModal(false);
                          setActiveAddTab('personal');
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-success d-flex align-items-center"
                        onClick={handleAddEmployee}
                        disabled={!newEmployee.name || !newEmployee.email || !newEmployee.employmentInfo.designation || !newEmployee.salary}
                      >
                        <Icon icon="heroicons:user-plus" className="me-2" />
                        Add Employee
                      </button>
                    </div>
                  </div>
                </div>
            )}  
            
    </div>

  );
};




// ==================== TAB COMPONENTS ====================

// Personal Information Tab Component
const PersonalInfoTab = ({ employee, formatDate }) => {
  const personalInfo = employee.personalInfo || {};
  const identification = personalInfo.identification || {};

  // Helper function to format date safely
  const safeFormatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return formatDate(dateString);
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  return (
    <div>
      <div className="row g-4">
        {/* Basic Information */}
        <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:identification" />
            </span>
            <span>Basic Information</span>
          </h6>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Full Name</label>
          <p className="form-control-plaintext">{employee.name || 'N/A'}</p>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Date of Birth</label>
          <p className="form-control-plaintext">{safeFormatDate(personalInfo.dateOfBirth)}</p>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Gender</label>
          <p className="form-control-plaintext">{personalInfo.gender || 'N/A'}</p>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Blood Group</label>
          <p className="form-control-plaintext">{personalInfo.bloodGroup || 'N/A'}</p>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Marital Status</label>
          <p className="form-control-plaintext">{personalInfo.maritalStatus || 'N/A'}</p>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Nationality</label>
          <p className="form-control-plaintext">{personalInfo.nationality || 'N/A'}</p>
        </div>
        
        <div className="col-md-12">
          <label className="form-label fw-bold small fw-semibold">Languages</label>
          <p className="form-control-plaintext">
            {personalInfo.languages && personalInfo.languages.length > 0
              ? personalInfo.languages.join(', ')
              : 'N/A'}
          </p>
        </div>

        {/* Contact Information */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:phone" />
            </span>
            <span>Contact Information</span>
          </h6>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Personal Email</label>
          <p className="form-control-plaintext">{personalInfo.personalEmail || 'N/A'}</p>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Primary Phone</label>
          <p className="form-control-plaintext">{personalInfo.phonePrimary || 'N/A'}</p>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Secondary Phone</label>
          <p className="form-control-plaintext">{personalInfo.phoneSecondary || 'N/A'}</p>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Emergency Phone</label>
          <p className="form-control-plaintext">{personalInfo.phoneEmergency || 'N/A'}</p>
        </div>

        {/* Address Information */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:map-pin" />
            </span>
            <span>Address Information</span>
          </h6>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Current Address</label>
          <div className="form-control-plaintext">
            {personalInfo.currentAddress ? (
              <div>
                <div>{personalInfo.currentAddress.line1 || ''}</div>
                {personalInfo.currentAddress.line2 && <div>{personalInfo.currentAddress.line2}</div>}
                <div>
                  {[personalInfo.currentAddress.city, personalInfo.currentAddress.state, personalInfo.currentAddress.pincode]
                    .filter(Boolean)
                    .join(', ')}
                </div>
                <div>{personalInfo.currentAddress.country || ''}</div>
              </div>
            ) : 'N/A'}
          </div>
        </div>
        
        <div className="col-md-6">                                                 
          <label className="form-label fw-bold small fw-semibold">Permanent Address</label>
          <div className="form-control-plaintext">
            {personalInfo.permanentAddress ? (
              <div>
                <div>{personalInfo.permanentAddress.line1 || ''}</div>
                {personalInfo.permanentAddress.line2 && <div>{personalInfo.permanentAddress.line2}</div>}
                <div>
                  {[personalInfo.permanentAddress.city, personalInfo.permanentAddress.state, personalInfo.permanentAddress.pincode]
                    .filter(Boolean)
                    .join(', ')}
                </div>
                <div>{personalInfo.permanentAddress.country || ''}</div>
              </div>
            ) : 'N/A'}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:user-group" />
            </span>
            <span>Emergency Contacts</span>
          </h6>

          {personalInfo.emergencyContacts && personalInfo.emergencyContacts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-muted">Name</th>
                    <th className="text-muted">Relation</th>
                    <th className="text-muted">Phone</th>
                    <th className="text-muted">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {personalInfo.emergencyContacts.map((contact, idx) => (
                    <tr key={idx}>
                      <td>{contact.name || 'N/A'}</td>
                      <td>{contact.relation || 'N/A'}</td>
                      <td>{contact.phone || 'N/A'}</td>
                      <td><span className="badge bg-primary">{contact.priority || 'Primary'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No emergency contacts added</p>
          )}
        </div>

        {/* Family Members */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:home" />
            </span>
            <span>Family Members</span>
          </h6>

          {personalInfo.familyMembers && personalInfo.familyMembers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-muted">Name</th>
                    <th className="text-muted">Relation</th>
                    <th className="text-muted">Date of Birth</th>
                  </tr>
                </thead>
                <tbody>
                  {personalInfo.familyMembers.map((member, idx) => {
                    // Handle both 'dob' and 'dateOfBirth' property names
                    const dob = member.dob || member.dateOfBirth || '';
                    return (
                      <tr key={idx}>
                        <td>{member.name || 'N/A'}</td>
                        <td>{member.relation || 'N/A'}</td>
                        <td>{dob ? safeFormatDate(dob) : 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No family members added</p>
          )}
        </div>

        {/* Nominees */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:gift" />
            </span>
            <span>Nominee Information</span>
          </h6>

          {personalInfo.nominees && personalInfo.nominees.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-muted">Name</th>
                    <th className="text-muted">Relation</th>
                    <th className="text-muted">Phone Number</th>
                    <th className="text-muted">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {personalInfo.nominees.map((nominee, idx) => {
                    // Handle different property names
                    const phoneNumber = nominee.phone || nominee.phoneNo || nominee.contactNo || 'N/A';
                    const percentage = nominee.percentage !== undefined ? nominee.percentage : 
                                      nominee.percentageShare !== undefined ? nominee.percentageShare : 'N/A';
                    
                    return (
                      <tr key={idx}>
                        <td>{nominee.name || 'N/A'}</td>
                        <td>{nominee.relation || 'N/A'}</td>
                        <td>{phoneNumber}</td>
                        <td>{percentage !== 'N/A' ? `${percentage}%` : 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No nominees added</p>
          )}
        </div>

        {/* Identification Documents */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:document-text" />
            </span>
            <span>Identification Documents</span>
          </h6>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">PAN Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{identification.pan?.number || 'N/A'}</p>
            {identification.pan?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Aadhaar Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{identification.aadhaar?.number || 'N/A'}</p>
            {identification.aadhaar?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Passport Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{identification.passport?.number || 'N/A'}</p>
            {identification.passport?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
          {identification.passport?.expiryDate && (
            <small className="text-muted">Expiry: {safeFormatDate(identification.passport.expiryDate)}</small>
          )}
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Voter ID Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{identification.voterId?.number || 'N/A'}</p>
            {identification.voterId?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Employment Information Tab Component
const EmploymentInfoTab = ({ employee, formatDate, getStatusBadge, getEmploymentTypeBadge }) => {
  const empInfo = employee.employmentInfo || {};

  return (
    <div>
      <div className="row g-4">
        <div className="col-12">
          <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
            <span className="icon-circle  text-primary">
              <Icon icon="heroicons:briefcase" />
            </span>
            <span>Employment Details</span>
          </h6>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Employee ID</label>
          <p className="form-control-plaintext">{empInfo.employeeId || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Date of Joining</label>
          <p className="form-control-plaintext">{empInfo.dateOfJoining ? formatDate(empInfo.dateOfJoining) : 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Confirmation Date</label>
          <p className="form-control-plaintext">{empInfo.confirmationDate ? formatDate(empInfo.confirmationDate) : 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Probation Period (months)</label>
          <p className="form-control-plaintext">{empInfo.probationPeriod || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Employment Type</label>
          <p className="form-control-plaintext">{getEmploymentTypeBadge(empInfo.employmentType || 'N/A')}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Employment Status</label>
          <p className="d-flex align-items-center">{getStatusBadge(empInfo.employmentStatus || 'N/A')}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Department</label>
          <p className="form-control-plaintext">{empInfo.department || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Sub-Department</label>
          <p className="form-control-plaintext">{empInfo.subDepartment || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Cost Center</label>
          <p className="form-control-plaintext">{empInfo.costCenter || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Designation</label>
          <p className="form-control-plaintext">{empInfo.designation || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Grade</label>
          <p className="form-control-plaintext">{empInfo.grade || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Level</label>
          <p className="form-control-plaintext">{empInfo.level || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Location</label>
          <p className="form-control-plaintext">{empInfo.location || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Workplace Type</label>
          <p className="form-control-plaintext">{empInfo.workplaceType || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Email</label>
          <p className="form-control-plaintext">{empInfo.workEmail || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Extension Number</label>
          <p className="form-control-plaintext">{empInfo.extensionNumber || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Desk Location</label>
          <p className="form-control-plaintext">{empInfo.deskLocation || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Employee Category</label>
          <p className="form-control-plaintext">{empInfo.employeeCategory || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Notice Period (days)</label>
          <p className="form-control-plaintext">{empInfo.noticePeriod || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Direct Reporting Manager</label>
          <p className="form-control-plaintext">{empInfo.reportingManager?.direct || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Functional Reporting Manager</label>
          <p className="form-control-plaintext">{empInfo.reportingManager?.functional || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">HR Business Partner</label>
          <p className="form-control-plaintext">{empInfo.hrBusinessPartner || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

// Job History Tab Component
const JobHistoryTab = ({ employee, formatDate, formatCurrency }) => {
  const jobHistory = employee.jobHistory || [];

  return (
    <div>
      <div className="row g-4">
        <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:clock" />
            </span>
            Complete Job History
          </h6>
        </div>
        <div className="col-12">
          {jobHistory.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="bg-light">
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Type</th>
                    <th>Organisation</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Location</th>
                    <th>Manager</th>
                    <th>Salary</th>
                    <th>Duration</th>
                    <th>Notes</th>
                    <th>Achievements</th>
                  </tr>
                </thead>
                <tbody>
                  {jobHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map((history, idx) => {
                    // Calculate duration if endDate exists
                    const startDate = new Date(history.date);
                    const endDate = history.endDate === 'Present' ? new Date() : new Date(history.endDate || new Date());
                    const durationInMonths = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
                    
                    // Format duration
                    const years = Math.floor(durationInMonths / 12);
                    const months = durationInMonths % 12;
                    const durationText = years > 0 ? 
                      `${years} yr ${months > 0 ? `${months} mo` : ''}` : 
                      `${months} mo`;
                    
                    return (
                      <tr key={idx}>
                        <td>{formatDate(history.date)}</td>
                        <td>
                          {history.endDate === 'Present' ? (
                            <span className="badge bg-success">Present</span>
                          ) : history.endDate ? (
                            formatDate(history.endDate)
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          <span className={`badge ${history.type === 'Promotion' ? 'bg-success' :
                            history.type === 'Transfer' ? 'bg-info' :
                              history.type === 'Joining' ? 'bg-primary' :
                                history.type === 'Previous Experience' ? 'bg-warning' :
                                  history.type === 'Salary Revision' ? 'bg-secondary' :
                                    'bg-secondary'
                            }`}>
                            {history.type}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span>{history.organisation || 'N/A'}</span>
                            {history.organisation === 'TechCorp Inc.' && (
                              <span className="badge bg-primary-subtle text-primary border border-primary">
                                Current
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{history.department || '-'}</td>
                        <td>
                          <strong>{history.designation || '-'}</strong>
                        </td>
                        <td>{history.location || '-'}</td>
                        <td>{history.manager || '-'}</td>
                        <td>
                          {history.salaryChange ? (
                            <div className="d-flex flex-column">
                              <span className="text-primary fw-semibold">
                                {formatCurrency(history.salaryChange)}
                              </span>
                              {history.type === 'Promotion' && (
                                <small className="text-success">
                                  <Icon icon="heroicons:arrow-trending-up" className="me-1" />
                                  Increased
                                </small>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                        <td>
                          <div className="d-flex flex-column align-items-center">
                            <span className="fw-medium">{durationText}</span>
                            {history.endDate === 'Present' && (
                              <small className="text-muted">Ongoing</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">{history.notes || '-'}</small>
                          {history.reasonForLeaving && history.reasonForLeaving !== 'N/A' && (
                            <div className="mt-1">
                              <small className="text-danger">
                                <Icon icon="heroicons:arrow-right-on-rectangle" className="me-1" />
                                Reason: {history.reasonForLeaving}
                              </small>
                            </div>
                          )}
                        </td>
                        <td>
                          {history.achievements ? (
                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={history.achievements}>
                              <small>{history.achievements}</small>
                            </div>
                          ) : (
                            <small className="text-muted">-</small>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info d-flex align-items-center gap-2">
              <Icon icon="heroicons:information-circle" />
              <span>No job history records found</span>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

// Salary & Compensation Tab Component
const SalaryInfoTab = ({ employee, formatCurrency, formatDate }) => {
  const salaryInfo = employee.salaryInfo || {};
  const ctcBreakdown = salaryInfo.ctcBreakdown || {};
  const bankAccounts = salaryInfo.bankAccounts || {};

  return (
    <div>
      <div className="row g-4">
        {/* Current CTC */}
        <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:currency-dollar" />
            </span>
            Current Compensation
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Current CTC (Annual)</label>
          <p className="form-control-plaintext text-primary fw-bold fs-5">
            {formatCurrency(salaryInfo.currentCTC || 0)}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Salary Structure</label>
          <p className="form-control-plaintext">{salaryInfo.salaryStructure || 'N/A'}</p>
        </div>

        {/* CTC Breakdown */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2">CTC Breakdown</h6>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="bg-light">
                <tr>
                  <th>Component</th>
                  <th className="text-end">Amount (Annual)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.basic || 0)}</td>
                </tr>
                <tr>
                  <td>HRA</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.hra || 0)}</td>
                </tr>
                <tr>
                  <td>Special Allowance</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.specialAllowance || 0)}</td>
                </tr>
                <tr>
                  <td>Transport Allowance</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.transportAllowance || 0)}</td>
                </tr>
                <tr>
                  <td>Medical Allowance</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.medicalAllowance || 0)}</td>
                </tr>
                <tr>
                  <td>Other Allowances</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.otherAllowances || 0)}</td>
                </tr>
                <tr className="table-secondary fw-bold">
                  <td>Gross Salary</td>
                  <td className="text-end">
                    {formatCurrency(
                      (ctcBreakdown.basic || 0) +
                      (ctcBreakdown.hra || 0) +
                      (ctcBreakdown.specialAllowance || 0) +
                      (ctcBreakdown.transportAllowance || 0) +
                      (ctcBreakdown.medicalAllowance || 0) +
                      (ctcBreakdown.otherAllowances || 0)
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Provident Fund</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.providentFund || 0)}</td>
                </tr>
                <tr>
                  <td>Gratuity</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.gratuity || 0)}</td>
                </tr>
                <tr>
                  <td>Other Deductions</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.otherDeductions || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2 ">
            <span className="icon-circle text-primary">
              <Icon icon="heroicons:building-library" />
            </span>
            Bank Account Details
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Payment Mode</label>
          <p className="form-control-plaintext">{salaryInfo.paymentMode || 'N/A'}</p>
        </div>

        <div className="col-md-6"></div>

        <div className="col-md-6">
          <h6 className="fw-bold fs-5 mb-3 text-muted d-flex align-items-center gap-2">
        <span className="text-primary">
          <Icon icon="heroicons:banknotes" />
        </span>Primary Bank Account</h6>
          <div className="card border">
            <div className="card-body">
              <div className="mb-2">
                <label className="form-label fw-bold small fw-semibold">Account Number</label>
                <p className="form-control-plaintext">{bankAccounts.primary?.accountNumber || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold small fw-semibold">IFSC Code</label>
                <p className="form-control-plaintext">{bankAccounts.primary?.ifscCode || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold small fw-semibold">Bank Name</label>
                <p className="form-control-plaintext">{bankAccounts.primary?.bankName || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold small fw-semibold">Branch</label>
                <p className="form-control-plaintext">{bankAccounts.primary?.branch || 'N/A'}</p>
              </div>
              <div>
                <label className="form-label fw-bold small fw-semibold">Account Type</label>
                <p className="form-control-plaintext">{bankAccounts.primary?.accountType || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        {bankAccounts.secondary && (
          <div className="col-md-6">
        <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:plus-circle" />
          </span>Secondary Bank Account</h6>
            <div className="card border">
              <div className="card-body">
                <div className="mb-2">
                  <label className="form-label fw-bold small fw-semibold">Account Number</label>
                  <p className="form-control-plaintext">{bankAccounts.secondary.accountNumber || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold small fw-semibold">IFSC Code</label>
                  <p className="form-control-plaintext">{bankAccounts.secondary.ifscCode || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold small fw-semibold">Bank Name</label>
                  <p className="form-control-plaintext">{bankAccounts.secondary.bankName || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold small fw-semibold">Branch</label>
                  <p className="form-control-plaintext">{bankAccounts.secondary.branch || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <label className="form-label fw-bold small fw-semibold">Account Type</label>
                  <p className="form-control-plaintext">{bankAccounts.secondary.accountType || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PF & ESI */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:shield-check" />
            </span>
            Provident Fund & ESI
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">PF Account Number</label>
          <p className="form-control-plaintext">{salaryInfo.pfAccountNumber || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">UAN (Universal Account Number)</label>
          <p className="form-control-plaintext">{salaryInfo.uan || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">ESI Number</label>
          <p className="form-control-plaintext">{salaryInfo.esiNumber || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">ESI Medical Nominee</label>
          <p className="form-control-plaintext">{salaryInfo.esiMedicalNominee || 'N/A'}</p>
        </div>

        {/* Tax & Variable Pay */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:document-check" />
            </span>
            Tax & Benefits
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Tax Regime</label>
          <p className="form-control-plaintext">{salaryInfo.taxDeclaration?.regime || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Tax Declaration</label>
          <p className="form-control-plaintext">
            {salaryInfo.taxDeclaration?.declared ? (
              <span className="badge bg-success">Declared</span>
            ) : (
              <span className="badge bg-warning">Not Declared</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Variable Pay Eligible</label>
          <p className="form-control-plaintext">
            {salaryInfo.variablePay?.eligible ? (
              <span className="badge bg-success">{salaryInfo.variablePay.percentage}%</span>
            ) : (
              <span className="badge bg-secondary">Not Eligible</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Bonus Eligible</label>
          <p className="form-control-plaintext">
            {salaryInfo.bonusEligibility?.eligible ? (
              <span className="badge bg-success">{formatCurrency(salaryInfo.bonusEligibility.amount || 0)}</span>
            ) : (
              <span className="badge bg-secondary">Not Eligible</span>
            )}
          </p>
        </div>

        {/* Salary Revision History */}
        {salaryInfo.salaryRevisionHistory && salaryInfo.salaryRevisionHistory.length > 0 && (
          <div className="col-12 mt-4">
            <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
              <span className="text-primary">
                <Icon icon="heroicons:chart-bar"/>
              </span>
              Salary Revision History
            </h6>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Effective Date</th>
                    <th>Previous CTC</th>
                    <th>New CTC</th>
                    <th>Percentage Increase</th>
                    <th>Approved By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryInfo.salaryRevisionHistory.map((revision, idx) => (
                    <tr key={idx}>
                      <td>{formatDate(revision.effectiveDate)}</td>
                      <td>{formatCurrency(revision.previousCTC)}</td>
                      <td>{formatCurrency(revision.newCTC)}</td>
                      <td>{revision.percentageIncrease}%</td>
                      <td>{revision.approvedBy}</td>
                      <td><span className="badge bg-success">{revision.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Statutory & Compliance Tab Component
const StatutoryInfoTab = ({ employee, formatDate }) => {
  const statutoryInfo = employee.statutoryInfo || {};

  return (
    <div>
      <div className="row g-4">
        <div className="col-12">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
              <Icon icon="heroicons:shield-check" />
            </span>
            Statutory & Compliance Information
          </h6>
        </div>

        {/* PAN Details */}
        <div className="col-12">
         <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:credit-card" />
        </span>PAN Card Details</h6>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">PAN Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{statutoryInfo.pan?.number || 'N/A'}</p>
            {statutoryInfo.pan?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Verification Date</label>
          <p className="form-control-plaintext">{statutoryInfo.pan?.verifiedDate ? formatDate(statutoryInfo.pan.verifiedDate) : 'N/A'}</p>
        </div>

        {/* Aadhaar Details */}
        <div className="col-12 mt-4">
        <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:identification" />
        </span>Aadhaar Card Details</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Aadhaar Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{statutoryInfo.aadhaar?.number || 'N/A'}</p>
            {statutoryInfo.aadhaar?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Verification Date</label>
          <p className="form-control-plaintext">{statutoryInfo.aadhaar?.verifiedDate ? formatDate(statutoryInfo.aadhaar.verifiedDate) : 'N/A'}</p>
        </div>

        {/* PF Membership */}
        <div className="col-12 mt-4">
         <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:banknotes" />
        </span>Provident Fund Membership</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">PF Enrolled</label>
          <p className="form-control-plaintext">
            {statutoryInfo.pfMembership?.enrolled ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">PF Account Number</label>
          <p className="form-control-plaintext">{statutoryInfo.pfMembership?.accountNumber || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">UAN</label>
          <p className="form-control-plaintext">{statutoryInfo.pfMembership?.uan || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Enrollment Date</label>
          <p className="form-control-plaintext">{statutoryInfo.pfMembership?.enrollmentDate ? formatDate(statutoryInfo.pfMembership.enrollmentDate) : 'N/A'}</p>
        </div>

        {/* ESI Registration */}
        <div className="col-12 mt-4">
       <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:heart" />
        </span>ESI Registration</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">ESI Enrolled</label>
          <p className="form-control-plaintext">
            {statutoryInfo.esiRegistration?.enrolled ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">ESI Number</label>
          <p className="form-control-plaintext">{statutoryInfo.esiRegistration?.number || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Enrollment Date</label>
          <p className="form-control-plaintext">{statutoryInfo.esiRegistration?.enrollmentDate ? formatDate(statutoryInfo.esiRegistration.enrollmentDate) : 'N/A'}</p>
        </div>

        {/* Professional Tax */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:document-text" />
        </span>Professional Tax</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Applicable</label>
          <p className="form-control-plaintext">
            {statutoryInfo.professionalTax?.applicable ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">State</label>
          <p className="form-control-plaintext">{statutoryInfo.professionalTax?.state || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">PT Number</label>
          <p className="form-control-plaintext">{statutoryInfo.professionalTax?.ptNumber || 'N/A'}</p>
        </div>

        {/* Labour Welfare Fund */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:users" />
        </span>Labour Welfare Fund</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Enrolled</label>
          <p className="form-control-plaintext">
            {statutoryInfo.labourWelfareFund?.enrolled ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Enrollment Date</label>
          <p className="form-control-plaintext">{statutoryInfo.labourWelfareFund?.enrollmentDate ? formatDate(statutoryInfo.labourWelfareFund.enrollmentDate) : 'N/A'}</p>
        </div>

        {/* Gratuity */}
        <div className="col-12 mt-4">
      <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:gift" />
        </span>Gratuity</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Eligible</label>
          <p className="form-control-plaintext">
            {statutoryInfo.gratuity?.eligible ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Eligibility Date</label>
          <p className="form-control-plaintext">{statutoryInfo.gratuity?.eligibilityDate ? formatDate(statutoryInfo.gratuity.eligibilityDate) : 'N/A'}</p>
        </div>

        {/* Bonus Act */}
        <div className="col-12 mt-4">
       <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:currency-rupee" />
        </span>Bonus Act</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Applicable</label>
          <p className="form-control-plaintext">
            {statutoryInfo.bonusAct?.applicable ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>

        {/* Shops and Establishment */}
        <div className="col-12 mt-4">
        <h6 className="fw-bold fs-5 mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
        <span className="text-primary"> 
          <Icon icon="heroicons:building-office" />
        </span>Shops and Establishment Act</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Registered</label>
          <p className="form-control-plaintext">
            {statutoryInfo.shopsAndEstablishment?.registered ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Registration Number</label>
          <p className="form-control-plaintext">{statutoryInfo.shopsAndEstablishment?.registrationNumber || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small fw-semibold">Registration Date</label>
          <p className="form-control-plaintext">{statutoryInfo.shopsAndEstablishment?.registrationDate ? formatDate(statutoryInfo.shopsAndEstablishment.registrationDate) : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default AllEmployees;
