import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../../shared/components/Modal";

const AddEmployeeModal = ({ isOpen, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState('personal');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    location: 'New York',
    employmentType: 'Full-time',
    salary: '',
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
    salaryInfo: {
      currentCTC: '',
      ctcBreakdown: { 
        basic: '', 
        hra: '', 
        specialAllowance: '', 
        transportAllowance: '', 
        medicalAllowance: '', 
        otherAllowances: '', 
        providentFund: '', 
        gratuity: '', 
        otherDeductions: '' 
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
      paymentMode: 'Bank Transfer',
      pfAccountNumber: '',
      uan: '',
      esiNumber: '',
      taxDeclaration: { regime: 'New', declared: false },
      variablePay: { eligible: false, percentage: 0 }
    },
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

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Engineering',
        designation: '',
        location: 'New York',
        employmentType: 'Full-time',
        salary: '',
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
        salaryInfo: {
          currentCTC: '',
          ctcBreakdown: { 
            basic: '', 
            hra: '', 
            specialAllowance: '', 
            transportAllowance: '', 
            medicalAllowance: '', 
            otherAllowances: '', 
            providentFund: '', 
            gratuity: '', 
            otherDeductions: '' 
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
          paymentMode: 'Bank Transfer',
          pfAccountNumber: '',
          uan: '',
          esiNumber: '',
          taxDeclaration: { regime: 'New', declared: false },
          variablePay: { eligible: false, percentage: 0 }
        },
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
      setActiveTab('personal');
    }
  }, [isOpen]);

  const handleChange = (path, value) => {
    setFormData(prev => {
      const newState = { ...prev };
      let current = newState;
      const parts = path.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.employmentInfo.designation || !formData.salary) {
      alert('Please fill in all required fields (Name, Email, Designation, Salary)');
      return;
    }
    onAdd(formData);
    onClose();
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'heroicons:user-circle' },
    { id: 'employment', label: 'Employment', icon: 'heroicons:briefcase' },
    { id: 'salary', label: 'Salary', icon: 'heroicons:currency-dollar' },
    { id: 'statutory', label: 'Statutory', icon: 'heroicons:document-check' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoForm data={formData} onChange={handleChange} />;
      case 'employment':
        return <EmploymentInfoForm data={formData} onChange={handleChange} />;
      case 'salary':
        return <SalaryInfoForm data={formData} onChange={handleChange} />;
      case 'statutory':
        return <StatutoryInfoForm data={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee" size="2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-1 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`px-4 py-2 text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon icon={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-2">
          {renderTabContent()}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 flex-shrink-0">
          <button
            type="button"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Icon icon="heroicons:user-plus" className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </form>
    </Modal>
  );
};


const PersonalInfoForm = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.personalInfo.dateOfBirth}
            onChange={(e) => onChange('personalInfo.dateOfBirth', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Gender
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.personalInfo.gender}
            onChange={(e) => onChange('personalInfo.gender', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Blood Group
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.personalInfo.bloodGroup}
            onChange={(e) => onChange('personalInfo.bloodGroup', e.target.value)}
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
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Marital Status
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.personalInfo.maritalStatus}
            onChange={(e) => onChange('personalInfo.maritalStatus', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Nationality
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.personalInfo.nationality}
            onChange={(e) => onChange('personalInfo.nationality', e.target.value)}
            placeholder="Enter nationality"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Personal Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.personalInfo.personalEmail}
            onChange={(e) => onChange('personalInfo.personalEmail', e.target.value)}
            placeholder="personal@email.com"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Primary Phone <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.phone || data.personalInfo.phonePrimary}
            onChange={(e) => {
              onChange('phone', e.target.value);
              onChange('personalInfo.phonePrimary', e.target.value);
            }}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Secondary Phone
          </label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.personalInfo.phoneSecondary}
            onChange={(e) => onChange('personalInfo.phoneSecondary', e.target.value)}
            placeholder="+1 (555) 123-4568"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            PAN Number
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.personalInfo.identification.pan.number}
            onChange={(e) => onChange('personalInfo.identification.pan.number', e.target.value)}
            placeholder="ABCDE1234F"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Aadhaar Number
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.personalInfo.identification.aadhaar.number}
            onChange={(e) => onChange('personalInfo.identification.aadhaar.number', e.target.value)}
            placeholder="1234 5678 9012"
          />
        </div>
      </div>

      <div>
        <h6 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Icon icon="heroicons:map-pin" className="w-4 h-4" />
          Current Address
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.currentAddress.line1}
              onChange={(e) => onChange('personalInfo.currentAddress.line1', e.target.value)}
              placeholder="Address Line 1"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.currentAddress.line2}
              onChange={(e) => onChange('personalInfo.currentAddress.line2', e.target.value)}
              placeholder="Address Line 2"
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.currentAddress.city}
              onChange={(e) => onChange('personalInfo.currentAddress.city', e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.currentAddress.state}
              onChange={(e) => onChange('personalInfo.currentAddress.state', e.target.value)}
              placeholder="State"
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.currentAddress.pincode}
              onChange={(e) => onChange('personalInfo.currentAddress.pincode', e.target.value)}
              placeholder="Pincode"
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.currentAddress.country}
              onChange={(e) => onChange('personalInfo.currentAddress.country', e.target.value)}
              placeholder="Country"
            />
          </div>
        </div>
      </div>

      <div>
        <h6 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Icon icon="heroicons:home" className="w-4 h-4" />
          Permanent Address
        </h6>
        <div className="mb-3">
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              checked={JSON.stringify(data.personalInfo.currentAddress) === JSON.stringify(data.personalInfo.permanentAddress) && 
                       data.personalInfo.currentAddress.line1 !== ''}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange('personalInfo.permanentAddress', { ...data.personalInfo.currentAddress });
                }
              }}
            />
            Same as Current Address
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.permanentAddress.line1}
              onChange={(e) => onChange('personalInfo.permanentAddress.line1', e.target.value)}
              placeholder="Address Line 1"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.permanentAddress.line2}
              onChange={(e) => onChange('personalInfo.permanentAddress.line2', e.target.value)}
              placeholder="Address Line 2"
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.permanentAddress.city}
              onChange={(e) => onChange('personalInfo.permanentAddress.city', e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.permanentAddress.state}
              onChange={(e) => onChange('personalInfo.permanentAddress.state', e.target.value)}
              placeholder="State"
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.permanentAddress.pincode}
              onChange={(e) => onChange('personalInfo.permanentAddress.pincode', e.target.value)}
              placeholder="Pincode"
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              value={data.personalInfo.permanentAddress.country}
              onChange={(e) => onChange('personalInfo.permanentAddress.country', e.target.value)}
              placeholder="Country"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const EmploymentInfoForm = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-slate-700 font-semibold mb-1">
          Date of Joining <span className="text-rose-500">*</span>
        </label>
        <input
          type="date"
          required
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.dateOfJoining}
          onChange={(e) => onChange('employmentInfo.dateOfJoining', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">
          Probation Period (months)
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.probationPeriod}
          onChange={(e) => onChange('employmentInfo.probationPeriod', parseInt(e.target.value) || 0)}
        />
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">
          Employment Type <span className="text-rose-500">*</span>
        </label>
        <select
          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.employmentType}
          onChange={(e) => {
            onChange('employmentInfo.employmentType', e.target.value);
            onChange('employmentType', e.target.value === 'Permanent' ? 'Full-time' : e.target.value);
          }}
        >
          <option value="Permanent">Permanent</option>
          <option value="Contract">Contract</option>
          <option value="Intern">Intern</option>
          <option value="Consultant">Consultant</option>
        </select>
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">
          Employment Status
        </label>
        <select
          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.employmentStatus}
          onChange={(e) => onChange('employmentInfo.employmentStatus', e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="On-Hold">On-Hold</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">
          Department <span className="text-rose-500">*</span>
        </label>
        <select
          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.department || data.department}
          onChange={(e) => {
            onChange('department', e.target.value);
            onChange('employmentInfo.department', e.target.value);
          }}
        >
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Sales">Sales</option>
          <option value="Operations">Operations</option>
          <option value="IT">IT</option>
        </select>
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">
          Designation <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.designation || data.designation}
          onChange={(e) => {
            onChange('designation', e.target.value);
            onChange('employmentInfo.designation', e.target.value);
          }}
          placeholder="Enter designation"
        />
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">
          Location <span className="text-rose-500">*</span>
        </label>
        <select
          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.location || data.location}
          onChange={(e) => {
            onChange('location', e.target.value);
            onChange('employmentInfo.location', e.target.value);
          }}
        >
          <option value="New York">New York</option>
          <option value="San Francisco">San Francisco</option>
          <option value="Chicago">Chicago</option>
          <option value="Boston">Boston</option>
          <option value="Austin">Austin</option>
          <option value="Seattle">Seattle</option>
          <option value="Remote">Remote</option>
        </select>
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">
          Workplace Type
        </label>
        <select
          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.workplaceType}
          onChange={(e) => onChange('employmentInfo.workplaceType', e.target.value)}
        >
          <option value="Office">Office</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-slate-700 font-semibold mb-1">
          Work Email <span className="text-rose-500">*</span>
        </label>
        <input
          type="email"
          required
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.workEmail || data.email}
          onChange={(e) => {
            onChange('email', e.target.value);
            onChange('employmentInfo.workEmail', e.target.value);
          }}
          placeholder="employee@company.com"
        />
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">
          Direct Reporting Manager
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.reportingManager.direct}
          onChange={(e) => onChange('employmentInfo.reportingManager.direct', e.target.value)}
          placeholder="Manager name"
        />
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">
          Notice Period (days)
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
          value={data.employmentInfo.noticePeriod}
          onChange={(e) => onChange('employmentInfo.noticePeriod', parseInt(e.target.value) || 0)}
        />
      </div>
    </div>
  );
};

const SalaryInfoForm = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Current CTC (Annual) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.salaryInfo.currentCTC || data.salary}
            onChange={(e) => {
              onChange('salary', e.target.value);
              onChange('salaryInfo.currentCTC', parseInt(e.target.value) || 0);
            }}
            placeholder="75000"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Payment Mode
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.salaryInfo.paymentMode}
            onChange={(e) => onChange('salaryInfo.paymentMode', e.target.value)}
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Primary Bank Account Number
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.salaryInfo.bankAccounts.primary.accountNumber}
            onChange={(e) => onChange('salaryInfo.bankAccounts.primary.accountNumber', e.target.value)}
            placeholder="1234567890"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            IFSC Code
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.salaryInfo.bankAccounts.primary.ifscCode}
            onChange={(e) => onChange('salaryInfo.bankAccounts.primary.ifscCode', e.target.value)}
            placeholder="BANK0001234"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Bank Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.salaryInfo.bankAccounts.primary.bankName}
            onChange={(e) => onChange('salaryInfo.bankAccounts.primary.bankName', e.target.value)}
            placeholder="Bank Name"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            UAN (Universal Account Number)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.salaryInfo.uan}
            onChange={(e) => onChange('salaryInfo.uan', e.target.value)}
            placeholder="UAN123456789"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            PF Account Number
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.salaryInfo.pfAccountNumber}
            onChange={(e) => onChange('salaryInfo.pfAccountNumber', e.target.value)}
            placeholder="PF123456"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            ESI Number
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.salaryInfo.esiNumber}
            onChange={(e) => onChange('salaryInfo.esiNumber', e.target.value)}
            placeholder="ESI123456"
          />
        </div>
      </div>

      <div>
        <h6 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">CTC Breakdown</h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Basic', field: 'basic' },
            { label: 'HRA', field: 'hra' },
            { label: 'Special Allowance', field: 'specialAllowance' },
            { label: 'Transport Allowance', field: 'transportAllowance' },
            { label: 'Medical Allowance', field: 'medicalAllowance' },
            { label: 'Other Allowances', field: 'otherAllowances' },
            { label: 'Provident Fund', field: 'providentFund' },
            { label: 'Gratuity', field: 'gratuity' },
            { label: 'Other Deductions', field: 'otherDeductions' },
          ].map((item) => (
            <div key={item.field}>
              <label className="block text-slate-600 text-xs font-medium mb-1">{item.label}</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
                value={data.salaryInfo.ctcBreakdown[item.field]}
                onChange={(e) => onChange(`salaryInfo.ctcBreakdown.${item.field}`, parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatutoryInfoForm = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Note:</p>
          <p className="text-sm text-blue-600">PAN and Aadhaar numbers are managed in the Personal Info tab. This section is for statutory compliance and verification status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            PF Enrolled
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.statutoryInfo.pfMembership.enrolled}
            onChange={(e) => onChange('statutoryInfo.pfMembership.enrolled', e.target.value === 'true')}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            ESI Enrolled
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.statutoryInfo.esiRegistration.enrolled}
            onChange={(e) => onChange('statutoryInfo.esiRegistration.enrolled', e.target.value === 'true')}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Professional Tax Applicable
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.statutoryInfo.professionalTax.applicable}
            onChange={(e) => onChange('statutoryInfo.professionalTax.applicable', e.target.value === 'true')}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Gratuity Eligible
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={data.statutoryInfo.gratuity.eligible}
            onChange={(e) => onChange('statutoryInfo.gratuity.eligible', e.target.value === 'true')}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;