// src/components/HRMS/Onboarding&Joining/JoiningDayManagement.jsx
import React, { useState } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";

import {
  Grid, Paper, Typography, Button, Box, Card, CardContent,
  IconButton, TextField, FormControl, InputLabel, Select,
  MenuItem, Checkbox, FormControlLabel, Snackbar, RadioGroup,
  Radio, Alert
} from '@mui/material';
import {
  Close as CloseIcon, Save as SaveIcon, Info as InfoIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';

// Default checklist templates by department (used when saving profile)
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
  // Profile Creation Form State
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

  // Notification State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Generate Employee ID
  const generateEmployeeId = (department, firstName, lastName) => {
    const deptCode = department ? department.substring(0, 3).toUpperCase() : 'EMP';
    const initials = `${firstName ? firstName[0] : 'F'}${lastName ? lastName[0] : 'L'}`.toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EMP${deptCode}${initials}${randomNum}`;
  };

  // Reset form
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

  // Save profile
  const handleSaveProfile = () => {
    // Auto-generate employee ID if needed
    let employeeId = profileForm.employeeId;
    if (profileForm.generateIdAuto && !employeeId && profileForm.firstName && profileForm.lastName && profileForm.department) {
      employeeId = generateEmployeeId(profileForm.department, profileForm.firstName, profileForm.lastName);
    }

    // Calculate confirmation date if not provided (joining date + 1 month)
    let confirmationDate = profileForm.confirmationDate;
    if (!confirmationDate && profileForm.joiningDate) {
      const joiningDate = new Date(profileForm.joiningDate);
      joiningDate.setMonth(joiningDate.getMonth() + 1);
      confirmationDate = joiningDate.toISOString().split('T')[0];
    }

    const formData = {
      ...profileForm,
      employeeId,
      confirmationDate,
      email: profileForm.officialEmail || profileForm.email
    };

    const newProfile = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };

    // Load existing profiles from localStorage
    const savedProfiles = localStorage.getItem('employeeProfiles');
    const existingProfiles = savedProfiles ? JSON.parse(savedProfiles) : [];
    const updatedProfiles = [...existingProfiles, newProfile];

    // Save to localStorage
    localStorage.setItem('employeeProfiles', JSON.stringify(updatedProfiles));

    // Create checklist for new employee
    const savedChecklists = localStorage.getItem('employeeChecklists');
    const existingChecklists = savedChecklists ? JSON.parse(savedChecklists) : {};
    existingChecklists[employeeId] = {
      HR: getDefaultChecklist('HR').map(t => ({
        ...t,
        assignedTo: '',
        dueDate: '',
        status: 'pending',
        completedDate: null
      })),
      IT: getDefaultChecklist('IT').map(t => ({
        ...t,
        assignedTo: '',
        dueDate: '',
        status: 'pending',
        completedDate: null
      })),
      ADMIN: getDefaultChecklist('ADMIN').map(t => ({
        ...t,
        assignedTo: '',
        dueDate: '',
        status: 'pending',
        completedDate: null
      })),
      FINANCE: getDefaultChecklist('FINANCE').map(t => ({
        ...t,
        assignedTo: '',
        dueDate: '',
        status: 'pending',
        completedDate: null
      }))
    };
    localStorage.setItem('employeeChecklists', JSON.stringify(existingChecklists));

    // Add to employees list
    const savedEmployees = localStorage.getItem('employeeList');
    const existingEmployees = savedEmployees ? JSON.parse(savedEmployees) : [];
    const newEmployee = {
      id: employeeId,
      name: `${profileForm.firstName} ${profileForm.middleName ? profileForm.middleName + ' ' : ''}${profileForm.lastName}`.trim(),
      department: profileForm.department,
      designation: profileForm.designation,
      joiningDate: profileForm.joiningDate,
      status: 'pending',
      candidateId: profileForm.candidateId
    };
    const updatedEmployees = [...existingEmployees, newEmployee];
    localStorage.setItem('employeeList', JSON.stringify(updatedEmployees));

    // Also create a form entry for PreJoiningEngagement
    const savedForms = localStorage.getItem('onboardingForms');
    const existingForms = savedForms ? JSON.parse(savedForms) : [];
    const newForm = {
      id: parseInt(Date.now().toString().slice(-6)),
      candidate: `${profileForm.firstName} ${profileForm.middleName ? profileForm.middleName + ' ' : ''}${profileForm.lastName}`.trim(),
      created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      email: profileForm.officialEmail || profileForm.email,
      mobile: profileForm.phone,
      info: 'View Form',
      status: 'Pending',
      employeeId: employeeId
    };
    existingForms.unshift(newForm);
    localStorage.setItem('onboardingForms', JSON.stringify(existingForms));

    // Reset form
    resetForm();
    showSnackbar('Profile created successfully', 'success');
  };

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
              <Icon icon='heroicons:calendar' />
              ADD EMPLOYEE
            </h5>
          </div>
        </div>

        <Paper sx={{ mt: 2, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Add New Employee</Typography>
            <IconButton onClick={resetForm}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            {/* Left Column - Employee Personal and Contact Information */}
            <Grid item xs={12} md={8} sx={{ minWidth: { md: 0 } }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Employee Personal and Contact Information
                  </Typography>

                  {/* Employee Name */}
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Employee Name
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="First Name *"
                        value={profileForm.firstName}
                        onChange={(e) => {
                          const firstName = e.target.value;
                          const updatedForm = { ...profileForm, firstName };
                          if (profileForm.generateIdAuto && firstName && profileForm.lastName && profileForm.department) {
                            updatedForm.employeeId = generateEmployeeId(profileForm.department, firstName, profileForm.lastName);
                          }
                          setProfileForm(updatedForm);
                        }}
                        required
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Middle Name"
                        value={profileForm.middleName}
                        onChange={(e) => setProfileForm({ ...profileForm, middleName: e.target.value })}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={profileForm.lastName}
                        onChange={(e) => {
                          const lastName = e.target.value;
                          const updatedForm = { ...profileForm, lastName };
                          if (profileForm.generateIdAuto && profileForm.firstName && lastName && profileForm.department) {
                            updatedForm.employeeId = generateEmployeeId(profileForm.department, profileForm.firstName, lastName);
                          }
                          setProfileForm(updatedForm);
                        }}
                        size="small"
                      />
                    </Grid>
                  </Grid>

                  {/* Dates */}
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Dates
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Joining Date *"
                        type="date"
                        value={profileForm.joiningDate}
                        onChange={(e) => {
                          const joiningDate = e.target.value;
                          setProfileForm({
                            ...profileForm,
                            joiningDate,
                            confirmationDate: joiningDate ? '' : profileForm.confirmationDate
                          });
                        }}
                        InputLabelProps={{ shrink: true }}
                        required
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirmation Date"
                        type="date"
                        value={profileForm.confirmationDate}
                        onChange={(e) => setProfileForm({ ...profileForm, confirmationDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        helperText="Joining Date + 1 month will be considered, if left blank"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={profileForm.dateOfBirth}
                        onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        placeholder="dd-mm-yyyy"
                        size="small"
                        helperText="Optional but recommended"
                      />
                    </Grid>
                  </Grid>

                  {/* Gender */}
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Gender *
                  </Typography>
                  <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <RadioGroup
                      row
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                    >
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      <FormControlLabel value="Transgender" control={<Radio />} label="Transgender" />
                    </RadioGroup>
                  </FormControl>

                  {/* Codes */}
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Codes
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          fullWidth
                          label="Employee Code *"
                          value={profileForm.employeeId}
                          onChange={(e) => setProfileForm({ ...profileForm, employeeId: e.target.value })}
                          required
                          size="small"
                          helperText="Will be auto-generated"
                          disabled={profileForm.generateIdAuto}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={profileForm.generateIdAuto}
                              onChange={(e) => setProfileForm({ ...profileForm, generateIdAuto: e.target.checked })}
                              sx={{ ml: 1 }}
                            />
                          }
                          label="Auto"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          fullWidth
                          label="Biometric Code"
                          value={profileForm.biometricCode}
                          onChange={(e) => setProfileForm({ ...profileForm, biometricCode: e.target.value })}
                          size="small"
                        />
                        <InfoIcon color="action" />
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Contact Information */}
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Contact Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Mobile Number"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        size="small"
                        helperText="Enter 10-digits only"
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Personal Email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        size="small"
                        helperText="Optional"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Official Email"
                        type="email"
                        value={profileForm.officialEmail}
                        onChange={(e) => setProfileForm({ ...profileForm, officialEmail: e.target.value })}
                        size="small"
                        helperText="Company email address"
                      />
                    </Grid>
                  </Grid>

                  {/* Employee Self-Service Access */}
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Employee Self-Service Access
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={profileForm.sendMobileLogin}
                          onChange={(e) => setProfileForm({ ...profileForm, sendMobileLogin: e.target.checked })}
                        />
                      }
                      label="Send Mobile Login"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={profileForm.sendWebLogin}
                          onChange={(e) => setProfileForm({ ...profileForm, sendWebLogin: e.target.checked })}
                        />
                      }
                      label="Send Web Login"
                    />
                  </Box>

                  {/* Save Button */}
<Button
  variant="contained"
  startIcon={<SaveIcon />}
  onClick={handleSaveProfile}
  fullWidth
  className="save-btn"
>
  Save
</Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Work Profile and Policies */}
            <Grid item xs={12} md={4} sx={{ minWidth: { md: 360 } }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  {/* Work Profile */}
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Work Profile (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Select work profile for this employee. If you do not select these values now, system will assign default values, which you can edit later.
                  </Typography>
                  
                  <Grid container  spacing={2} sx={{ mb: 4 }}>
                    {/* Department */}
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="department-label">Department</InputLabel>
                        <Select
                          labelId="department-label"
                          value={profileForm.department}
                          onChange={(e) => {
                            const dept = e.target.value;
                            const updatedForm = { ...profileForm, department: dept };
                            if (profileForm.generateIdAuto && profileForm.firstName && profileForm.lastName && dept) {
                              updatedForm.employeeId = generateEmployeeId(dept, profileForm.firstName, profileForm.lastName);
                            }
                            setProfileForm(updatedForm);
                          }}
                          label="Department"
                        >
                          <MenuItem value="">- Select -</MenuItem>
                          <MenuItem value="Engineering">Engineering</MenuItem>
                          <MenuItem value="Marketing">Marketing</MenuItem>
                          <MenuItem value="Sales">Sales</MenuItem>
                          <MenuItem value="HR">Human Resources</MenuItem>
                          <MenuItem value="Finance">Finance</MenuItem>
                          <MenuItem value="Operations">Operations</MenuItem>
                          <MenuItem value="IT">Information Technology</MenuItem>
                          <MenuItem value="Admin">Administration</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {/* Designation */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Designation"
                        value={profileForm.designation}
                        onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                        size="small"
                        placeholder="e.g., Software Engineer"
                      />
                    </Grid>
                    
                    {/* Business Unit */}
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="business-unit-label">Business Unit</InputLabel>
                        <Select
                          labelId="business-unit-label"
                          value={profileForm.businessUnit}
                          onChange={(e) => setProfileForm({ ...profileForm, businessUnit: e.target.value })}
                          label="Business Unit"
                        >
                          <MenuItem value="">- Select -</MenuItem>
                          <MenuItem value="IT">Technology</MenuItem>
                          <MenuItem value="HR">Human Resources</MenuItem>
                          <MenuItem value="Finance">Finance</MenuItem>
                          <MenuItem value="Operations">Operations</MenuItem>
                          <MenuItem value="Sales">Sales & Marketing</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {/* Location */}
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="location-label">Location</InputLabel>
                        <Select
                          labelId="location-label"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          label="Location"
                        >
                          <MenuItem value="">- Select -</MenuItem>
                          <MenuItem value="Mumbai">Mumbai</MenuItem>
                          <MenuItem value="Delhi">Delhi</MenuItem>
                          <MenuItem value="Bangalore">Bangalore</MenuItem>
                          <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                          <MenuItem value="Chennai">Chennai</MenuItem>
                          <MenuItem value="Pune">Pune</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {/* Cost Center */}
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="cost-center-label">Cost Center</InputLabel>
                        <Select
                          labelId="cost-center-label"
                          value={profileForm.costCenter}
                          onChange={(e) => setProfileForm({ ...profileForm, costCenter: e.target.value })}
                          label="Cost Center"
                        >
                          <MenuItem value="">- Select -</MenuItem>
                          <MenuItem value="CC001">CC001 - Corporate</MenuItem>
                          <MenuItem value="CC002">CC002 - Operations</MenuItem>
                          <MenuItem value="CC003">CC003 - Sales & Marketing</MenuItem>
                          <MenuItem value="CC004">CC004 - R&D</MenuItem>
                          <MenuItem value="CC005">CC005 - Support</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {/* Grade */}
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="grade-label">Grade</InputLabel>
                        <Select
                          labelId="grade-label"
                          value={profileForm.grade}
                          onChange={(e) => setProfileForm({ ...profileForm, grade: e.target.value })}
                          label="Grade"
                        >
                          <MenuItem value="">- Select -</MenuItem>
                          <MenuItem value="A">Grade A (Executive)</MenuItem>
                          <MenuItem value="B">Grade B (Manager)</MenuItem>
                          <MenuItem value="C">Grade C (Senior Manager)</MenuItem>
                          <MenuItem value="D">Grade D (Director)</MenuItem>
                          <MenuItem value="E">Grade E (VP & Above)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {/* Reporting Manager */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Reporting Manager"
                        value={profileForm.reportingManager}
                        onChange={(e) => setProfileForm({ ...profileForm, reportingManager: e.target.value })}
                        size="small"
                        placeholder="Enter manager's name or employee ID"
                      />
                    </Grid>
                  </Grid>

                  {/* Policies */}
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Policies (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Select policies applicable to this employee. If you do not select these values now, system will assign default values, which you can edit later.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {/* Shift Policy */}
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="shift-policy-label">Shift Policy</InputLabel>
                        <Select
                          labelId="shift-policy-label"
                          value={profileForm.shiftPolicy}
                          onChange={(e) => setProfileForm({ ...profileForm, shiftPolicy: e.target.value })}
                          label="Shift Policy"
                        >
                          <MenuItem value="">- Select -</MenuItem>
                          <MenuItem value="General">General (9 AM - 6 PM)</MenuItem>
                          <MenuItem value="Night">Night Shift</MenuItem>
                          <MenuItem value="Flexible">Flexible Hours</MenuItem>
                          <MenuItem value="Rotational">Rotational Shifts</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {/* Week Off Policy - FIXED */}
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="week-off-policy-label">Week Off Policy</InputLabel>
                        <Select
                          labelId="week-off-policy-label"
                          value={profileForm.weekOffPolicy}
                          onChange={(e) => setProfileForm({ ...profileForm, weekOffPolicy: e.target.value })}
                          label="Week Off Policy"
                        >
                          <MenuItem value="">- Select -</MenuItem>
                          <MenuItem value="Sunday">Sunday Fixed</MenuItem>
                          <MenuItem value="Saturday-Sunday">Saturday & Sunday</MenuItem>
                          <MenuItem value="Flexible">Flexible Week Off</MenuItem>
                          <MenuItem value="Rotational">Rotational Week Off</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default JoiningDayManagement;