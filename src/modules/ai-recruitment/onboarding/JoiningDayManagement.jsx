import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { apiCall } from "../../../shared/utils/api";
import { API_ENDPOINTS } from "../../../shared/constants/api.config";

const getDefaultChecklist = (departmentId) => {
  const checklists = {
    HR: [
      { id: 'HR1', task: 'Profile Creation', description: 'Create employee profile in system', priority: 'High', estimatedDays: 1 },
      { id: 'HR2', task: 'Documentation', description: 'Collect and verify all documents', priority: 'High', estimatedDays: 2 },
      { id: 'HR3', task: 'ID Card', description: 'Generate and issue employee ID card', priority: 'Medium', estimatedDays: 1 },
      { id: 'HR4', task: 'Induction', description: 'Schedule and conduct induction program', priority: 'Medium', estimatedDays: 3 }
    ],
    IT: [
      { id: 'IT1', task: 'Laptop Allocation', description: 'Allocate laptop with required specifications', priority: 'High', estimatedDays: 1 },
      { id: 'IT2', task: 'Email Setup', description: 'Create email account and credentials', priority: 'High', estimatedDays: 1 },
      { id: 'IT3', task: 'System Access', description: 'Provision access to required systems', priority: 'High', estimatedDays: 2 },
      { id: 'IT4', task: 'Tools & Software', description: 'Install required tools and software', priority: 'Medium', estimatedDays: 1 }
    ],
    ADMIN: [
      { id: 'ADMIN1', task: 'Desk Allocation', description: 'Assign workspace/desk', priority: 'Medium', estimatedDays: 1 },
      { id: 'ADMIN2', task: 'Access Card', description: 'Issue office access card', priority: 'High', estimatedDays: 1 },
      { id: 'ADMIN3', task: 'Parking', description: 'Allocate parking space if applicable', priority: 'Low', estimatedDays: 1 }
    ],
    FINANCE: [
      { id: 'FIN1', task: 'Bank Account Verification', description: 'Verify bank account details', priority: 'High', estimatedDays: 2 },
      { id: 'FIN2', task: 'Salary Structure', description: 'Set up salary structure and components', priority: 'High', estimatedDays: 3 }
    ]
  };
  return checklists[departmentId] || [];
};

const JoiningDayManagement = () => {
  const [profileForm, setProfileForm] = useState({
    candidateId: '',
    employeeId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    officialEmail: '',
    phone: '',
    dateOfBirth: '',
    joiningDate: '',
    confirmationDate: '',
    gender: 'Male',
    biometricCode: '',
    department: '',
    designation: '',
    businessUnit: '',
    location: '',
    costCenter: '',
    grade: '',
    shiftPolicy: '',
    weekOffPolicy: '',
    reportingManager: '',
    generateIdAuto: true,
    sendMobileLogin: true,
    sendWebLogin: true
  });

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const [reportingManagers, setReportingManagers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiCall(API_ENDPOINTS.EMPLOYEES.MANAGERS)
      .then((data) => setReportingManagers(data || []))
      .catch((err) => console.error("Failed to load reporting managers:", err.message));
  }, []);

  const generateEmployeeId = (department, firstName, lastName) => {
    const deptCode = department ? department.substring(0, 3).toUpperCase() : 'EMP';
    const initials = `${firstName ? firstName[0] : 'F'}${lastName ? lastName[0] : 'L'}`.toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EMP${deptCode}${initials}${randomNum}`;
  };

  const resetForm = () => {
    setProfileForm({
      candidateId: '',
      employeeId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      officialEmail: '',
      phone: '',
      dateOfBirth: '',
      joiningDate: '',
      confirmationDate: '',
      gender: 'Male',
      biometricCode: '',
      department: '',
      designation: '',
      businessUnit: '',
      location: '',
      costCenter: '',
      grade: '',
      shiftPolicy: '',
      weekOffPolicy: '',
      reportingManager: '',
      generateIdAuto: true,
      sendMobileLogin: true,
      sendWebLogin: true
    });
  };

  const handleSaveProfile = async () => {
    if (!profileForm.firstName || !profileForm.joiningDate || !profileForm.gender) {
      showToast('Please fill all mandatory fields (*)', 'error');
      return;
    }

    // Employee code and confirmation date are auto-generated server-side
    // when left blank (see EmployeeCreate.default_confirmation_date and
    // create_employee service) — no need to duplicate that logic here.
    const payload = {
      first_name: profileForm.firstName,
      middle_name: profileForm.middleName || null,
      last_name: profileForm.lastName || null,
      joining_date: profileForm.joiningDate,
      confirmation_date: profileForm.confirmationDate || null,
      date_of_birth: profileForm.dateOfBirth || null,
      gender: profileForm.gender.toLowerCase(),
      employee_code: profileForm.generateIdAuto ? null : (profileForm.employeeId || null),
      biometric_code: profileForm.biometricCode || null,
      mobile_number: profileForm.phone,
      personal_email: profileForm.email || null,
      official_email: profileForm.officialEmail || null,
      designation: profileForm.designation || null,
      department: profileForm.department || null,
      business_unit: profileForm.businessUnit || null,
      location: profileForm.location || null,
      grade: profileForm.grade || null,
      cost_center: profileForm.costCenter || null,
      reporting_manager_id: profileForm.reportingManager ? Number(profileForm.reportingManager) : null,
      shift_policy: profileForm.shiftPolicy || null,
      week_off_policy: profileForm.weekOffPolicy || null,
      send_mobile_login: profileForm.sendMobileLogin,
      send_web_login: profileForm.sendWebLogin,
    };

    setSaving(true);
    try {
      await apiCall(API_ENDPOINTS.EMPLOYEES.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // NOTE: the onboarding checklist (HR/IT/ADMIN/FINANCE task lists)
      // generated below has no backend table/endpoint at all — there's no
      // checklist model anywhere in the backend. It's kept as in-memory
      // local state so the checklist UI below this form still works within
      // this session, but it is NOT persisted or shared across users/page
      // reloads until the backend adds real storage for it.
      resetForm();
      showToast('Employee created successfully', 'success');
    } catch (err) {
      showToast(`Failed to create employee: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const InputWrapper = ({ label, required, children, helperText }) => (
    <div className="md:mb-4">
      <label className="block text-sm font-medium text-midnight_text mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {helperText && <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1"><Icon icon="heroicons:information-circle" className="w-3.5 h-3.5" />{helperText}</p>}
    </div>
  );

  return (
    <div className="animate-fade-in p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-midnight_text flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
              <Icon icon="heroicons:user-plus" className="text-primary w-7 h-7" />
            </div>
            Add Employee
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Create a new employee profile and start the onboarding process.</p>
        </div>
        <button
          onClick={resetForm}
          className="px-4 py-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors flex items-center gap-2 border border-transparent hover:border-rose-100 font-medium"
        >
          <Icon icon="heroicons:arrow-path" className="w-5 h-5" />
          Reset Form
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-property border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-cyan"></div>
            <div className="px-4 py-4 border-b border-gray-100 bg-section flex items-center justify-between">
              <h2 className="text-lg font-bold text-midnight_text flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100">
                  <Icon icon="heroicons:identification" className="text-primary w-5 h-5" />
                </div>
                Personal & Contact Information
              </h2>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-bold text-gray-800 tracking-wider mb-4 pb-2 border-b border-gray-100">Name & Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <InputWrapper label="First Name" required>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                    placeholder="Enter first name"
                    value={profileForm.firstName}
                    onChange={(e) => {
                      const firstName = e.target.value;
                      const updatedForm = { ...profileForm, firstName };
                      if (profileForm.generateIdAuto && firstName && profileForm.lastName && profileForm.department) {
                        updatedForm.employeeId = generateEmployeeId(profileForm.department, firstName, profileForm.lastName);
                      }
                      setProfileForm(updatedForm);
                    }}
                  />
                </InputWrapper>
                <InputWrapper label="Middle Name">
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                    placeholder="Enter middle name"
                    value={profileForm.middleName}
                    onChange={(e) => setProfileForm({ ...profileForm, middleName: e.target.value })}
                  />
                </InputWrapper>
                <InputWrapper label="Last Name">
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                    placeholder="Enter last name"
                    value={profileForm.lastName}
                    onChange={(e) => {
                      const lastName = e.target.value;
                      const updatedForm = { ...profileForm, lastName };
                      if (profileForm.generateIdAuto && profileForm.firstName && lastName && profileForm.department) {
                        updatedForm.employeeId = generateEmployeeId(profileForm.department, profileForm.firstName, lastName);
                      }
                      setProfileForm(updatedForm);
                    }}
                  />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 tracking-wider mb-4 pb-2 border-b border-gray-100">Important Dates</h3>
                  <div className="space-y-4">
                    <InputWrapper label="Joining Date" required>
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                        value={profileForm.joiningDate}
                        onChange={(e) => {
                          const joiningDate = e.target.value;
                          setProfileForm({
                            ...profileForm,
                            joiningDate,
                            confirmationDate: joiningDate ? '' : profileForm.confirmationDate
                          });
                        }}
                      />
                    </InputWrapper>
                    <InputWrapper label="Confirmation Date" helperText="Joining Date + 1 month will be considered if left blank">
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                        value={profileForm.confirmationDate}
                        onChange={(e) => setProfileForm({ ...profileForm, confirmationDate: e.target.value })}
                      />
                    </InputWrapper>
                    <InputWrapper label="Date of Birth" helperText="Optional but recommended">
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                        value={profileForm.dateOfBirth}
                        onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                      />
                    </InputWrapper>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800 tracking-wider mb-4 pb-2 border-b border-gray-100">Identity Details</h3>
                  <div className="space-y-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-midnight_text mb-3">Gender <span className="text-rose-500">*</span></label>
                      <div className="flex flex-wrap items-center gap-6">
                        {['Male', 'Female', 'Transgender'].map(g => (
                          <label key={g} className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${profileForm.gender === g ? 'border-primary' : 'border-gray-300 group-hover:border-primary/50'}`}>
                              {profileForm.gender === g && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                            </div>
                            <input type="radio" className="hidden" name="gender" value={g} checked={profileForm.gender === g} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })} />
                            <span className="text-sm font-medium text-gray-700">{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-midnight_text mb-1.5">Employee Code <span className="text-rose-500">*</span></label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          disabled={profileForm.generateIdAuto}
                          className={`flex-1 px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-midnight_text transition-all duration-200 ${profileForm.generateIdAuto ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                          value={profileForm.employeeId}
                          onChange={(e) => setProfileForm({ ...profileForm, employeeId: e.target.value })}
                          placeholder="Auto-generated"
                        />
                        <label className="flex items-center gap-2 cursor-pointer group bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200 hover:border-primary/30 transition-colors">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${profileForm.generateIdAuto ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                            {profileForm.generateIdAuto && <Icon icon="heroicons:check" className="text-white w-3 h-3" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={profileForm.generateIdAuto} onChange={(e) => setProfileForm({ ...profileForm, generateIdAuto: e.target.checked })} />
                          <span className="text-sm font-medium text-gray-700">Auto</span>
                        </label>
                      </div>
                    </div>

                    <InputWrapper label="Biometric Code">
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                        placeholder="Enter biometric code"
                        value={profileForm.biometricCode}
                        onChange={(e) => setProfileForm({ ...profileForm, biometricCode: e.target.value })}
                      />
                    </InputWrapper>
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-800 tracking-wider mb-4 mt-8 pb-2 border-b border-gray-100">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InputWrapper label="Mobile Number" helperText="Enter 10-digits only">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Icon icon="heroicons:phone" className="w-5 h-5" />
                    </span>
                    <input
                      type="tel"
                      maxLength="10"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                      placeholder="e.g. 9876543210"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                </InputWrapper>
                <InputWrapper label="Personal Email" helperText="Optional">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Icon icon="heroicons:envelope" className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                      placeholder="personal@example.com"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                </InputWrapper>
                <InputWrapper label="Official Email" helperText="Company email address">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Icon icon="heroicons:building-office" className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                      placeholder="employee@company.com"
                      value={profileForm.officialEmail}
                      onChange={(e) => setProfileForm({ ...profileForm, officialEmail: e.target.value })}
                    />
                  </div>
                </InputWrapper>
              </div>

              <div className="mt-8 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                <h3 className="text-sm font-bold text-midnight_text mb-4 flex items-center gap-2">
                  <Icon icon="heroicons:device-phone-mobile" className="w-5 h-5 text-primary" />
                  Employee Self-Service Access
                </h3>
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${profileForm.sendMobileLogin ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                      {profileForm.sendMobileLogin && <Icon icon="heroicons:check" className="text-white w-3.5 h-3.5" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={profileForm.sendMobileLogin} onChange={(e) => setProfileForm({ ...profileForm, sendMobileLogin: e.target.checked })} />
                    <span className="font-medium text-gray-700">Send Mobile Login Credentials</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${profileForm.sendWebLogin ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                      {profileForm.sendWebLogin && <Icon icon="heroicons:check" className="text-white w-3.5 h-3.5" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={profileForm.sendWebLogin} onChange={(e) => setProfileForm({ ...profileForm, sendWebLogin: e.target.checked })} />
                    <span className="font-medium text-gray-700">Send Web Login Credentials</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-property border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-gray-400"></div>
            <div className="px-4 py-4 border-b border-gray-100 bg-section flex items-center justify-between">
              <h2 className="text-lg font-bold text-midnight_text flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100">
                  <Icon icon="heroicons:briefcase" className="text-secondary w-5 h-5" />
                </div>
                Work Profile
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3 text-amber-800 text-sm mb-6">
                <Icon icon="heroicons:exclamation-triangle" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>Select work profile for this employee. System will assign default values if left blank, which can be edited later.</p>
              </div>

              <InputWrapper label="Department">
                <div className="relative">
                  <select
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text appearance-none"
                    value={profileForm.department}
                    onChange={(e) => {
                      const dept = e.target.value;
                      const updatedForm = { ...profileForm, department: dept };
                      if (profileForm.generateIdAuto && profileForm.firstName && profileForm.lastName && dept) {
                        updatedForm.employeeId = generateEmployeeId(dept, profileForm.firstName, profileForm.lastName);
                      }
                      setProfileForm(updatedForm);
                    }}
                  >
                    <option value="">- Select Department -</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">Information Technology</option>
                    <option value="Admin">Administration</option>
                  </select>
                  <Icon icon="heroicons:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </InputWrapper>

              <InputWrapper label="Designation">
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                  placeholder="e.g., Software Engineer"
                  value={profileForm.designation}
                  onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                />
              </InputWrapper>

              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="Business Unit">
                  <div className="relative">
                    <select
                      className="w-full pl-4 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text appearance-none text-sm"
                      value={profileForm.businessUnit}
                      onChange={(e) => setProfileForm({ ...profileForm, businessUnit: e.target.value })}
                    >
                      <option value="">- Select -</option>
                      <option value="IT">Technology</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="Sales">Sales</option>
                    </select>
                    <Icon icon="heroicons:chevron-down" className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </InputWrapper>

                <InputWrapper label="Location">
                  <div className="relative">
                    <select
                      className="w-full pl-4 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text appearance-none text-sm"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    >
                      <option value="">- Select -</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                    </select>
                    <Icon icon="heroicons:chevron-down" className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </InputWrapper>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="Cost Center">
                  <div className="relative">
                    <select
                      className="w-full pl-4 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text appearance-none text-sm"
                      value={profileForm.costCenter}
                      onChange={(e) => setProfileForm({ ...profileForm, costCenter: e.target.value })}
                    >
                      <option value="">- Select -</option>
                      <option value="CC001">CC001</option>
                      <option value="CC002">CC002</option>
                      <option value="CC003">CC003</option>
                      <option value="CC004">CC004</option>
                      <option value="CC005">CC005</option>
                    </select>
                    <Icon icon="heroicons:chevron-down" className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </InputWrapper>

                <InputWrapper label="Grade">
                  <div className="relative">
                    <select
                      className="w-full pl-4 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text appearance-none text-sm"
                      value={profileForm.grade}
                      onChange={(e) => setProfileForm({ ...profileForm, grade: e.target.value })}
                    >
                      <option value="">- Select -</option>
                      <option value="A">Grade A</option>
                      <option value="B">Grade B</option>
                      <option value="C">Grade C</option>
                      <option value="D">Grade D</option>
                      <option value="E">Grade E</option>
                    </select>
                    <Icon icon="heroicons:chevron-down" className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </InputWrapper>
              </div>

              <InputWrapper label="Reporting Manager">
                <select
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text"
                  value={profileForm.reportingManager}
                  onChange={(e) => setProfileForm({ ...profileForm, reportingManager: e.target.value })}
                >
                  <option value="">Select reporting manager</option>
                  {reportingManagers.map((mgr) => (
                    <option key={mgr.id} value={mgr.id}>
                      {mgr.name} {mgr.employee_code ? `(${mgr.employee_code})` : ''}
                    </option>
                  ))}
                </select>
              </InputWrapper>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-property border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="px-4 py-4 border-b border-gray-100 bg-section flex items-center justify-between">
              <h2 className="text-lg font-bold text-midnight_text flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100">
                  <Icon icon="heroicons:clipboard-document-list" className="text-purple-600 w-5 h-5" />
                </div>
                Policies
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <InputWrapper label="Shift Policy">
                <div className="relative">
                  <select
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text appearance-none"
                    value={profileForm.shiftPolicy}
                    onChange={(e) => setProfileForm({ ...profileForm, shiftPolicy: e.target.value })}
                  >
                    <option value="">- Select Shift -</option>
                    <option value="General">General (9 AM - 6 PM)</option>
                    <option value="Night">Night Shift</option>
                    <option value="Flexible">Flexible Hours</option>
                    <option value="Rotational">Rotational Shifts</option>
                  </select>
                  <Icon icon="heroicons:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </InputWrapper>

              <InputWrapper label="Week Off Policy">
                <div className="relative">
                  <select
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-midnight_text appearance-none"
                    value={profileForm.weekOffPolicy}
                    onChange={(e) => setProfileForm({ ...profileForm, weekOffPolicy: e.target.value })}
                  >
                    <option value="">- Select Week Off -</option>
                    <option value="Sunday">Sunday Fixed</option>
                    <option value="Saturday-Sunday">Saturday & Sunday</option>
                    <option value="Flexible">Flexible Week Off</option>
                    <option value="Rotational">Rotational Week Off</option>
                  </select>
                  <Icon icon="heroicons:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </InputWrapper>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={resetForm}
          className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
        >
          <Icon icon="heroicons:x-mark" className="w-5 h-5" />
          Cancel
        </button>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-8 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Icon icon="heroicons:document-check" className="w-5 h-5" />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg border flex items-center gap-3 animate-slide-up z-[999] ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
          <Icon icon={toast.type === 'success' ? "heroicons:check-circle" : "heroicons:exclamation-circle"} className={`w-6 h-6 ${toast.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default JoiningDayManagement;