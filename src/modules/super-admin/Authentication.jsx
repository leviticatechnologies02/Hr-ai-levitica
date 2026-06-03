import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Authentication = () => {
  // State Management
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('activeTab');
    return saved || 'login';
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showRequestOrgModal, setShowRequestOrgModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [mfaMethod, setMfaMethod] = useState('authenticator');
  const [rememberMe, setRememberMe] = useState(() => {
    const saved = localStorage.getItem('rememberMe');
    return saved === 'true' || false;
  });
  const [trustedDevice, setTrustedDevice] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(() => {
    const saved = localStorage.getItem('selectedTenant');
    return saved ? JSON.parse(saved) : null;
  });
  const [searchTenant, setSearchTenant] = useState('');
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('auditLogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('authSettings');
    return saved ? JSON.parse(saved) : {
      sessionTimeout: 30,
      requireMfa: true,
      allowSocialLogin: true,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      enableCaptcha: true,
      captchaThreshold: 3, // Show CAPTCHA after 3 failed attempts
      enableRateLimiting: true,
      rateLimitWindow: 15, // minutes
      rateLimitMaxAttempts: 5,
      enableDeviceManagement: true,
      enableTrustedDevices: true,
      trustedDeviceExpiry: 90, // days
      jwtRefreshTokenEnabled: true,
      jwtTokenExpiry: 15, // minutes
      jwtRefreshTokenExpiry: 7, // days
      passwordEncryption: 'bcrypt', // bcrypt or argon2
      passwordSaltRounds: 10,
      enableAuditLogging: true,
      auditLogRetention: 365 // days
    };
  });

  // ---------------- CAPTCHA STATE ----------------  
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  // ---------------- DEVICE MANAGEMENT STATE ----------------  
  const [trustedDevices, setTrustedDevices] = useState(() => {
    const saved = localStorage.getItem('trustedDevices');
    return saved ? JSON.parse(saved) : [];
  });

  // ---------------- SESSION MANAGEMENT STATE ----------------  
  const [activeSessions, setActiveSessions] = useState(() => {
    const saved = localStorage.getItem('activeSessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Login Form State
  const [loginForm, setLoginForm] = useState(() => {
    const saved = localStorage.getItem('loginForm');
    return saved ? JSON.parse(saved) : {
      email: '',
      password: '',
      tenantId: ''
    };
  });
  
  // Register Form State
  const [registerForm, setRegisterForm] = useState(() => {
    const saved = localStorage.getItem('registerForm');
    return saved ? JSON.parse(saved) : {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      companyName: '',
      companySize: '1-10',
      industry: 'Technology',
      tenantName: '',
      tenantDomain: ''
    };
  });
  
  // Forgot Password State
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  
  // MFA State
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  
  // Request Org Form State
  const [requestOrgForm, setRequestOrgForm] = useState(() => {
    const saved = localStorage.getItem('requestOrgForm');
    return saved ? JSON.parse(saved) : {
      organizationName: '',
      requestEmail: '',
      message: '',
      reason: 'business-need'
    };
  });
  
  // Available Tenants for Selection
  const [tenants, setTenants] = useState(() => {
    const saved = localStorage.getItem('tenants');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'techcorp', 
        name: 'TechCorp Solutions', 
        domain: 'techcorp.hrms.com', 
        logo: 'TC',
        status: 'active',
        employeeCount: 1250,
        primaryColor: '#1890ff',
        subscriptionPlan: 'Enterprise',
        createdAt: '2023-01-15',
        adminEmail: 'admin@techcorp.com'
      },
      { 
        id: 'startup', 
        name: 'Startup Innovations', 
        domain: 'startup.hrms.com', 
        logo: 'SI',
        status: 'active',
        employeeCount: 45,
        primaryColor: '#52c41a',
        subscriptionPlan: 'Professional',
        createdAt: '2023-03-22',
        adminEmail: 'admin@startup.com'
      },
      { 
        id: 'global', 
        name: 'Global Enterprises', 
        domain: 'global.hrms.com', 
        logo: 'GE',
        status: 'suspended',
        employeeCount: 5000,
        primaryColor: '#fa8c16',
        subscriptionPlan: 'Enterprise Plus',
        createdAt: '2022-11-05',
        adminEmail: 'admin@global.com'
      },
      { 
        id: 'retail', 
        name: 'Retail Chain Pvt Ltd', 
        domain: 'retail.hrms.com', 
        logo: 'RC',
        status: 'active',
        employeeCount: 300,
        primaryColor: '#722ed1',
        subscriptionPlan: 'Business',
        createdAt: '2023-05-18',
        adminEmail: 'admin@retail.com'
      },
      { 
        id: 'healthcare', 
        name: 'Healthcare Systems', 
        domain: 'healthcare.hrms.com', 
        logo: 'HS',
        status: 'pending',
        employeeCount: 800,
        primaryColor: '#13c2c2',
        subscriptionPlan: 'Enterprise',
        createdAt: '2023-07-30',
        adminEmail: 'admin@healthcare.com'
      },
      { 
        id: 'education', 
        name: 'Education Hub', 
        domain: 'edu.hrms.com', 
        logo: 'EH',
        status: 'inactive',
        employeeCount: 25,
        primaryColor: '#f5222d',
        subscriptionPlan: 'Starter',
        createdAt: '2023-02-14',
        adminEmail: 'admin@education.com'
      }
    ];
  });

  // Sidebar Menu Items
  const menuItems = [
    {
      title: 'Authentication',
      icon: 'heroicons:lock-closed',
      link: '/auth',
      active: true
    },
    {
      title: 'Tenant Management',
      icon: 'heroicons:building-office',
      link: '/admin/tenants'
    },
    {
      title: 'User Management',
      icon: 'heroicons:users',
      link: '/admin/users'
    },
    {
      title: 'Security Logs',
      icon: 'heroicons:shield-check',
      link: '/admin/security'
    },
    {
      title: 'Settings',
      icon: 'heroicons:cog-6-tooth',
      link: '/admin/settings'
    }
  ];

  // User Info
  const userInfo = {
    name: 'Admin User',
    role: 'Super Administrator',
    email: 'admin@hrms.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  };

  // Save to localStorage whenever states change
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('rememberMe', rememberMe.toString());
  }, [rememberMe]);

  useEffect(() => {
    if (selectedTenant) {
      localStorage.setItem('selectedTenant', JSON.stringify(selectedTenant));
    }
  }, [selectedTenant]);

  useEffect(() => {
    localStorage.setItem('loginForm', JSON.stringify(loginForm));
  }, [loginForm]);

  useEffect(() => {
    localStorage.setItem('registerForm', JSON.stringify(registerForm));
  }, [registerForm]);

  useEffect(() => {
    localStorage.setItem('requestOrgForm', JSON.stringify(requestOrgForm));
  }, [requestOrgForm]);

  useEffect(() => {
    localStorage.setItem('tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('authSettings', JSON.stringify(settings));
  }, [settings]);

  // Generate CAPTCHA
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(result);
    return result;
  };

  // Check if CAPTCHA should be shown
  const shouldShowCaptcha = () => {
    return settings.enableCaptcha && failedAttempts >= settings.captchaThreshold;
  };

  // Get device fingerprint
  const getDeviceFingerprint = () => {
    const ua = navigator.userAgent;
    const screenSize = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    return btoa(`${ua}-${screenSize}-${timezone}-${language}`).substring(0, 32);
  };

  // Get IP address (mock - in production, get from backend)
  const getClientIP = () => {
    return '192.168.1.' + Math.floor(Math.random() * 255);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginForm.tenantId && !selectedTenant) {
      setShowTenantModal(true);
      return;
    }

    // Check rate limiting
    if (settings.enableRateLimiting && failedAttempts >= settings.rateLimitMaxAttempts) {
      alert(`Too many failed login attempts. Please try again after ${settings.rateLimitWindow} minutes.`);
      return;
    }

    // Check CAPTCHA if required
    if (shouldShowCaptcha()) {
      if (!captchaCode || captchaCode.toUpperCase() !== generatedCaptcha.toUpperCase()) {
        setFailedAttempts(prev => prev + 1);
        alert('Invalid CAPTCHA code. Please try again.');
        generateCaptcha();
        return;
      }
    }

    // Get device information
    const deviceInfo = {
      fingerprint: getDeviceFingerprint(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    // Check if device is trusted
    const isTrustedDevice = trustedDevices.some(d => d.fingerprint === deviceInfo.fingerprint);
    const deviceId = isTrustedDevice ? trustedDevices.find(d => d.fingerprint === deviceInfo.fingerprint).id : Date.now();

    // Add to audit logs with full details
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'USER_LOGIN',
      userEmail: loginForm.email,
      tenant: selectedTenant?.name || loginForm.tenantId || 'Unknown',
      status: 'SUCCESS',
      ip: getClientIP(),
      userAgent: navigator.userAgent,
      deviceInfo: deviceInfo,
      deviceId: deviceId,
      isTrustedDevice: isTrustedDevice,
      mfaUsed: settings.requireMfa,
      location: 'Unknown',
      sessionId: 'session_' + Date.now()
    };
    
    const updatedLogs = [newLog, ...auditLogs.slice(0, 99)];
    setAuditLogs(updatedLogs);
    localStorage.setItem('auditLogs', JSON.stringify(updatedLogs));

    // Create session
    const newSession = {
      id: newLog.sessionId,
      userId: loginForm.email,
      tenantId: selectedTenant?.id || loginForm.tenantId,
      deviceInfo: deviceInfo,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ip: getClientIP(),
      expiresAt: new Date(Date.now() + (settings.sessionTimeout * 60 * 1000)).toISOString(),
      jwtToken: 'jwt_token_' + Date.now(),
      refreshToken: 'refresh_token_' + Date.now()
    };

    setActiveSessions([...activeSessions, newSession]);
    localStorage.setItem('activeSessions', JSON.stringify([...activeSessions, newSession]));

    // Add trusted device if checked
    if (trustedDevice && !isTrustedDevice) {
      const newTrustedDevice = {
        id: deviceId,
        ...deviceInfo,
        addedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (settings.trustedDeviceExpiry * 24 * 60 * 60 * 1000)).toISOString()
      };
      setTrustedDevices([...trustedDevices, newTrustedDevice]);
      localStorage.setItem('trustedDevices', JSON.stringify([...trustedDevices, newTrustedDevice]));
    }

    // Reset failed attempts
    setFailedAttempts(0);
    setCaptchaCode('');
    setShowCaptcha(false);

    // Show MFA modal if required
    if (settings.requireMfa) {
      setShowMfaModal(true);
    } else {
      alert(`Login successful! Welcome to ${selectedTenant?.name || loginForm.tenantId || 'your tenant'}`);
      setLoginForm({ email: '', password: '', tenantId: '' });
      setSelectedTenant(null);
    }
    
    console.log('Login attempt:', { ...loginForm, tenantId: selectedTenant?.id || loginForm.tenantId, deviceInfo });
  };

  // Handle Registration
  const handleRegister = (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Create new tenant
    const newTenant = {
      id: registerForm.tenantDomain.toLowerCase().replace(/\s+/g, '-'),
      name: registerForm.companyName,
      domain: `${registerForm.tenantDomain}.hrms.com`,
      logo: registerForm.companyName.substring(0, 2).toUpperCase(),
      status: 'pending',
      employeeCount: parseInt(registerForm.companySize.split('-')[0]),
      primaryColor: '#3b82f6', // Default blue
      subscriptionPlan: 'Starter',
      createdAt: new Date().toISOString().split('T')[0],
      adminEmail: registerForm.email,
      ...registerForm
    };

    const updatedTenants = [...tenants, newTenant];
    setTenants(updatedTenants);
    
    // Add to audit logs
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'TENANT_REGISTRATION',
      userEmail: registerForm.email,
      tenant: registerForm.companyName,
      status: 'PENDING',
      details: `Company size: ${registerForm.companySize}, Industry: ${registerForm.industry}`
    };
    
    const updatedLogs = [newLog, ...auditLogs.slice(0, 49)];
    setAuditLogs(updatedLogs);

    alert(`Registration successful! Your tenant "${registerForm.companyName}" is pending approval.`);
    
    // Reset form
    setRegisterForm({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      companyName: '',
      companySize: '1-10',
      industry: 'Technology',
      tenantName: '',
      tenantDomain: ''
    });
  };

  // Handle Forgot Password
  const handleForgotPassword = (e) => {
    e.preventDefault();
    
    // Add to audit logs
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'PASSWORD_RESET_REQUEST',
      userEmail: forgotPasswordEmail,
      status: 'REQUESTED',
      details: 'Password reset link sent'
    };
    
    const updatedLogs = [newLog, ...auditLogs.slice(0, 49)];
    setAuditLogs(updatedLogs);

    setShowForgotPasswordModal(false);
    alert('Password reset link sent to your email!');
    setForgotPasswordEmail('');
  };

  // Handle MFA Verification
  const handleMfaVerify = (e) => {
    e.preventDefault();
    const code = mfaCode.join('');
    if (code.length === 6) {
      // Add to audit logs
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action: 'MFA_VERIFICATION',
        userEmail: loginForm.email,
        status: 'SUCCESS',
        method: mfaMethod
      };
      
      const updatedLogs = [newLog, ...auditLogs.slice(0, 49)];
      setAuditLogs(updatedLogs);

      console.log('MFA code verified:', code);
      setShowMfaModal(false);
      setMfaCode(['', '', '', '', '', '']);
      
      // In real app, redirect to dashboard
      alert(`Login successful! Welcome to ${selectedTenant?.name || loginForm.tenantId || 'your tenant'}`);
      
      // Reset login form
      setLoginForm({ email: '', password: '', tenantId: '' });
      setSelectedTenant(null);
    } else {
      alert('Please enter complete 6-digit code');
    }
  };

  // Handle MFA Input Change
  const handleMfaInputChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`mfa-input-${index + 1}`)?.focus();
    }
  };

  // Handle Key Down in MFA Input
  const handleMfaKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !mfaCode[index] && index > 0) {
      document.getElementById(`mfa-input-${index - 1}`)?.focus();
    }
  };

  // Handle Request Organization Access
  const handleRequestOrgAccess = (e) => {
    e.preventDefault();
    
    // Add to audit logs
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'ORG_ACCESS_REQUEST',
      userEmail: requestOrgForm.requestEmail,
      tenant: requestOrgForm.organizationName,
      status: 'PENDING',
      reason: requestOrgForm.reason
    };
    
    const updatedLogs = [newLog, ...auditLogs.slice(0, 49)];
    setAuditLogs(updatedLogs);

    alert('Organization access request submitted successfully!');
    setShowRequestOrgModal(false);
    setRequestOrgForm({
      organizationName: '',
      requestEmail: '',
      message: '',
      reason: 'business-need'
    });
  };

  // Handle Social Login
  const handleSocialLogin = (provider) => {
    // Add to audit logs
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'SOCIAL_LOGIN',
      provider: provider,
      status: 'INITIATED',
      userEmail: 'unknown'
    };
    
    const updatedLogs = [newLog, ...auditLogs.slice(0, 49)];
    setAuditLogs(updatedLogs);

    alert(`Redirecting to ${provider} login...`);
    // In real app, this would redirect to OAuth flow
  };

  // Handle Admin Login
  const handleAdminLogin = () => {
    // Add to audit logs
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'ADMIN_LOGIN_ATTEMPT',
      userEmail: 'admin@hrms.com',
      status: 'REDIRECTED',
      details: 'Admin portal access'
    };
    
    const updatedLogs = [newLog, ...auditLogs.slice(0, 49)];
    setAuditLogs(updatedLogs);

    alert('Redirecting to admin login portal...');
    // In real app, redirect to admin login
  };

  // Handle Settings Button
  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  // Handle Audit Logs Button
  const handleAuditLogsClick = () => {
    setShowAuditLogs(true);
  };

  // Handle Settings Save
  const handleSaveSettings = () => {
    // Add to audit logs
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'SETTINGS_UPDATE',
      userEmail: userInfo.email,
      status: 'SUCCESS',
      details: 'Authentication settings updated'
    };
    
    const updatedLogs = [newLog, ...auditLogs.slice(0, 49)];
    setAuditLogs(updatedLogs);

    alert('Settings saved successfully!');
    setShowSettingsModal(false);
  };

  // Handle Tenant Status Change
  const handleTenantStatusChange = (tenantId, newStatus) => {
    const updatedTenants = tenants.map(tenant => 
      tenant.id === tenantId ? { ...tenant, status: newStatus } : tenant
    );
    setTenants(updatedTenants);
    
    // Add to audit logs
    const tenant = tenants.find(t => t.id === tenantId);
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'TENANT_STATUS_CHANGE',
      userEmail: userInfo.email,
      tenant: tenant?.name,
      status: newStatus.toUpperCase(),
      details: `Changed status from ${tenant?.status} to ${newStatus}`
    };
    
    const updatedLogs = [newLog, ...auditLogs.slice(0, 49)];
    setAuditLogs(updatedLogs);
    
    alert(`Tenant status updated to ${newStatus}`);
  };

  // Handle Delete Tenant
  const handleDeleteTenant = (tenantId) => {
    if (window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      const updatedTenants = tenants.filter(tenant => tenant.id !== tenantId);
      setTenants(updatedTenants);
      
      // Add to audit logs
      const tenant = tenants.find(t => t.id === tenantId);
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action: 'TENANT_DELETION',
        userEmail: userInfo.email,
        tenant: tenant?.name,
        status: 'DELETED',
        details: 'Tenant permanently deleted'
      };
      
      const updatedLogs = [newLog, ...auditLogs.slice(0, 49)];
      setAuditLogs(updatedLogs);
      
      alert('Tenant deleted successfully');
    }
  };

  // Clear All Data
  const handleClearData = () => {
    if (window.confirm('Clear all saved data? This will reset forms and remove all saved information.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Export Data
  const handleExportData = () => {
    const data = {
      tenants,
      auditLogs,
      settings,
      loginForm,
      registerForm,
      requestOrgForm,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `auth-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('Data exported successfully!');
  };

  // Password Strength Checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'None', color: 'secondary' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengths = [
      { label: 'Weak', color: 'danger' },
      { label: 'Fair', color: 'warning' },
      { label: 'Good', color: 'info' },
      { label: 'Strong', color: 'success' },
      { label: 'Very Strong', color: 'success' }
    ];
    
    return strengths[strength] || strengths[0];
  };

  // Filter Tenants
  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTenant.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchTenant.toLowerCase())
  );

  const passwordStrength = getPasswordStrength(registerForm.password);

  // Get Status Badge
  const getStatusBadge = (status) => {
    const config = {
      active: { color: 'success', label: 'Active', icon: 'heroicons:check-circle' },
      pending: { color: 'warning', label: 'Pending', icon: 'heroicons:clock' },
      suspended: { color: 'secondary', label: 'Suspended', icon: 'heroicons:pause-circle' },
      inactive: { color: 'danger', label: 'Inactive', icon: 'heroicons:x-circle' }
    };
    const cfg = config[status] || { color: 'secondary', label: status, icon: 'heroicons:question-mark-circle' };
    
    return (
      <span className={`badge bg-${cfg.color}-subtle text-${cfg.color} border border-${cfg.color} d-inline-flex align-items-center gap-1`}>
        <Icon icon={cfg.icon} className="fs-6" />
        {cfg.label}
      </span>
    );
  };

  // Get Status Actions
  const getStatusActions = (tenant) => {
    const actions = [];
    
    if (tenant.status === 'active') {
      actions.push(
        <button 
          key="suspend"
          className="btn btn-sm btn-outline-warning"
          onClick={() => handleTenantStatusChange(tenant.id, 'suspended')}
        >
          Suspend
        </button>,
        <button 
          key="deactivate"
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleTenantStatusChange(tenant.id, 'inactive')}
        >
          Deactivate
        </button>
      );
    } else if (tenant.status === 'suspended' || tenant.status === 'inactive') {
      actions.push(
        <button 
          key="activate"
          className="btn btn-sm btn-outline-success"
          onClick={() => handleTenantStatusChange(tenant.id, 'active')}
        >
          Activate
        </button>
      );
    } else if (tenant.status === 'pending') {
      actions.push(
        <button 
          key="approve"
          className="btn btn-sm btn-outline-success"
          onClick={() => handleTenantStatusChange(tenant.id, 'active')}
        >
          Approve
        </button>,
        <button 
          key="reject"
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleTenantStatusChange(tenant.id, 'inactive')}
        >
          Reject
        </button>
      );
    }
    
    actions.push(
      <button 
        key="delete"
        className="btn btn-sm btn-outline-danger"
        onClick={() => handleDeleteTenant(tenant.id)}
      >
        Delete
      </button>
    );
    
    return actions;
  };

  return (
    
      <div className="container-fluid p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-2 d-flex align-items-center">
              <Icon icon="heroicons:users" className="me-2" width={24} height={24} />
              Authentication
            </h5>
            <p className="text-muted">Manage authentication for all tenants with advanced security features</p>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary" onClick={handleSettingsClick}>
              <Icon icon="heroicons:cog-6-tooth" className="me-2" />
              Settings
            </button>
            <button className="btn btn-outline-secondary" onClick={handleAuditLogsClick}>
              <Icon icon="heroicons:document-text" className="me-2" />
              Audit Logs
            </button>
            <button className="btn btn-outline-info" onClick={handleExportData}>
              <Icon icon="heroicons:arrow-down-tray" className="me-2" />
              Export Data
            </button>
            <button className="btn btn-outline-warning" onClick={handleClearData}>
              <Icon icon="heroicons:trash" className="me-2" />
              Clear Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-2 col-6">
            <div className="card border shadow-sm">
              <div className="card-body text-center">
                <div className="fw-bold text-secondary-light small">Total Tenants</div>
                <div className="fw-bold fs-5 text-primary">{tenants.length}</div>
              </div>
            </div>
          </div>

          <div className="col-md-2 col-6">
            <div className="card border shadow-sm">
              <div className="card-body text-center">
                <div className="fw-bold text-secondary-light small">Active Users</div>
                <div className="fw-bold fs-5 text-success">1,243</div>
              </div>
            </div>
          </div>

          <div className="col-md-2 col-6">
            <div className="card border shadow-sm">
              <div className="card-body text-center">
                <div className="fw-bold text-secondary-light small">MFA Enabled</div>
                <div className="fw-bold fs-5 text-warning">856</div>
              </div>
            </div>
          </div>

          <div className="col-md-2 col-6">
            <div className="card border shadow-sm">
              <div className="card-body text-center">
                <div className="fw-bold text-secondary-light small">Sessions Today</div>
                <div className="fw-bold fs-5 text-info">324</div>
              </div>
            </div>
          </div>

          <div className="col-md-2 col-6">
            <div className="card border shadow-sm">
              <div className="card-body text-center">
                <div className="fw-bold text-secondary-light small">Failed Logins</div>
                <div className="fw-bold fs-5 text-danger">12</div>
              </div>
            </div>
          </div>

          <div className="col-md-2 col-6">
            <div className="card border shadow-sm">
              <div className="card-body text-center">
                <div className="fw-bold text-secondary-light small">SSO Enabled</div>
                <div className="fw-bold fs-5 text-secondary">8</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Left Side - Authentication Forms */}
          <div className="col-lg-8">
            <div className="card border shadow-sm mb-4">
              <div className="card-header bg-light">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                      onClick={() => setActiveTab('login')}
                    >
                      <Icon icon="heroicons:arrow-right-on-rectangle" className="me-2" />
                      User Login
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                      onClick={() => setActiveTab('register')}
                    >
                      <Icon icon="heroicons:user-plus" className="me-2" />
                      Tenant Registration
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                      onClick={() => setActiveTab('admin')}
                    >
                      <Icon icon="heroicons:key" className="me-2" />
                      Admin Access
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body">
                {/* Login Form */}
                {activeTab === 'login' && (
                  <div className="row">
                    <div className="col-md-6">
                      <form onSubmit={handleLogin}>
                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <Icon icon="heroicons:envelope" />
                            </span>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="user@company.com"
                              value={loginForm.email}
                              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Password</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <Icon icon="heroicons:lock-closed" />
                            </span>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="form-control"
                              placeholder="Enter password"
                              value={loginForm.password}
                              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon icon={showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'} />
                            </button>
                          </div>
                        </div>

                        {/* Selected Tenant Display */}
                        {selectedTenant && (
                          <div className="mb-3">
                            <label className="form-label">Selected Organization</label>
                            <div className="border rounded p-3 bg-light">
                              <div className="d-flex align-items-center gap-3">
                                <div 
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: selectedTenant.primaryColor + '20',
                                    border: `2px solid ${selectedTenant.primaryColor}`
                                  }}
                                >
                                  <span className="fw-bold" style={{ color: selectedTenant.primaryColor }}>
                                    {selectedTenant.logo}
                                  </span>
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0">{selectedTenant.name}</h6>
                                  <small className="text-muted">{selectedTenant.domain}</small>
                                  {getStatusBadge(selectedTenant.status)}
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger ms-auto"
                                  onClick={() => setSelectedTenant(null)}
                                >
                                  <Icon icon="heroicons:x-mark" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Options */}
                        <div className="mb-4">
                          <div className="row">
                            <div className="col-6">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="rememberMe"
                                  checked={rememberMe}
                                  onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="rememberMe">
                                  Remember me
                                </label>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="trustedDevice"
                                  checked={trustedDevice}
                                  onChange={(e) => setTrustedDevice(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="trustedDevice">
                                  Trusted device
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CAPTCHA */}
                        {shouldShowCaptcha() && (
                          <div className="mb-3">
                            <label className="form-label">
                              Security Verification <span className="text-danger">*</span>
                            </label>
                            <div className="d-flex align-items-center gap-3">
                              <div className="border rounded p-2 bg-light text-center" style={{ minWidth: '120px', fontFamily: 'monospace', fontSize: '20px', letterSpacing: '5px' }}>
                                {generatedCaptcha || generateCaptcha()}
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => generateCaptcha()}
                                title="Refresh CAPTCHA"
                              >
                                <Icon icon="heroicons:arrow-path" />
                              </button>
                              <input
                                type="text"
                                className="form-control flex-grow-1"
                                placeholder="Enter CAPTCHA"
                                value={captchaCode}
                                onChange={(e) => setCaptchaCode(e.target.value)}
                                maxLength="5"
                                style={{ textTransform: 'uppercase' }}
                                required
                              />
                            </div>
                            <small className="text-muted">Please enter the code shown above</small>
                          </div>
                        )}

                        <div className="d-grid gap-2">
                          <button type="submit" className="btn btn-primary">
                            <Icon icon="heroicons:arrow-right-on-rectangle" className="me-2" />
                            Sign In
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowForgotPasswordModal(true)}
                          >
                            <Icon icon="heroicons:key" className="me-2" />
                            Forgot Password?
                          </button>
                        </div>

                        <div className="text-center mt-3">
                          <button
                            type="button"
                            className="btn btn-link text-decoration-none"
                            onClick={() => setShowTenantModal(true)}
                          >
                            <Icon icon="heroicons:building-office" className="me-1" />
                            Select Different Organization
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="col-md-6">
                      <div className="border-start ps-4">
                        <h6 className="fw-bold mb-3">Quick Access</h6>
                        <div className="mb-4">
                          <button 
                            className="btn btn-outline-danger w-100 mb-2"
                            onClick={() => handleSocialLogin('Google')}
                          >
                            <Icon icon="logos:google-icon" className="me-2" />
                            Sign in with Google
                          </button>
                          <button 
                            className="btn btn-outline-primary w-100 mb-2"
                            onClick={() => handleSocialLogin('Microsoft')}
                          >
                            <Icon icon="logos:microsoft-icon" className="me-2" />
                            Sign in with Microsoft
                          </button>
                          <button 
                            className="btn btn-outline-dark w-100"
                            onClick={() => handleSocialLogin('Enterprise SSO')}
                          >
                            <Icon icon="simple-icons:saml" className="me-2" />
                            Enterprise SSO
                          </button>
                        </div>

                        <div className="card bg-light border">
                          <div className="card-body">
                            <h6 className="fw-bold mb-3">Security Status</h6>
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <Icon icon={settings.requireMfa ? "heroicons:check-circle" : "heroicons:x-circle"} 
                                    className={settings.requireMfa ? "text-success" : "text-danger"} />
                              <small>MFA: {settings.requireMfa ? 'Required' : 'Optional'}</small>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <Icon icon="heroicons:check-circle" className="text-success" />
                              <small>Rate Limiting: Active</small>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <Icon icon="heroicons:check-circle" className="text-success" />
                              <small>Audit Trail: Logging</small>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <Icon icon="heroicons:check-circle" className="text-success" />
                              <small>Session Timeout: {settings.sessionTimeout} min</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registration Form */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegister}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your full name"
                          value={registerForm.fullName}
                          onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value})}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="your@email.com"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="+91 9876543210"
                          value={registerForm.phone}
                          onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Company Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Your Company Name"
                          value={registerForm.companyName}
                          onChange={(e) => setRegisterForm({...registerForm, companyName: e.target.value})}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Company Size</label>
                        <select
                          className="form-select"
                          value={registerForm.companySize}
                          onChange={(e) => setRegisterForm({...registerForm, companySize: e.target.value})}
                        >
                          <option value="1-10">1-10 Employees</option>
                          <option value="11-50">11-50 Employees</option>
                          <option value="51-200">51-200 Employees</option>
                          <option value="201-500">201-500 Employees</option>
                          <option value="501-1000">501-1000 Employees</option>
                          <option value="1000+">1000+ Employees</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Industry</label>
                        <select
                          className="form-select"
                          value={registerForm.industry}
                          onChange={(e) => setRegisterForm({...registerForm, industry: e.target.value})}
                        >
                          <option value="Technology">Technology</option>
                          <option value="Finance">Finance</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Retail">Retail</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Education">Education</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Tenant Domain</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="yourcompany"
                            value={registerForm.tenantDomain}
                            onChange={(e) => setRegisterForm({...registerForm, tenantDomain: e.target.value})}
                            required
                          />
                          <span className="input-group-text">.hrms.com</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            placeholder="Create strong password"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'} />
                          </button>
                        </div>
                        {registerForm.password && (
                          <div className="mt-2">
                            <div className="d-flex justify-content-between">
                              <small>Strength:</small>
                              <small className={`fw-bold text-${passwordStrength.color}`}>
                                {passwordStrength.label}
                              </small>
                            </div>
                            <div className="progress" style={{ height: '4px' }}>
                              <div 
                                className={`progress-bar bg-${passwordStrength.color}`}
                                style={{ width: `${(registerForm.password.length >= 12 ? 100 : registerForm.password.length * 8.33)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-group">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-control"
                            placeholder="Confirm password"
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <Icon icon={showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'} />
                          </button>
                        </div>
                        {registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && (
                          <small className="text-danger">Passwords do not match</small>
                        )}
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="terms"
                            required
                          />
                          <label className="form-check-label" htmlFor="terms">
                            I agree to the Terms of Service and Privacy Policy
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                          <Icon icon="heroicons:building-office" className="me-2" />
                          Register New Tenant
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Admin Access Form */}
                {activeTab === 'admin' && (
                  <div className="text-center py-5">
                    <div className="bg-warning-subtle p-4 rounded-circle d-inline-flex mb-4">
                      <Icon icon="heroicons:shield-exclamation" className="text-warning fs-1" />
                    </div>
                    <h4 className="fw-bold mb-3">Administrator Access</h4>
                    <p className="text-muted mb-4">
                      This section is restricted to system administrators only.
                      <br />
                      Please use your admin credentials or contact your system administrator.
                    </p>
                    <button className="btn btn-warning" onClick={handleAdminLogin}>
                      <Icon icon="heroicons:key" className="me-2" />
                      Admin Login Portal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Tenant List */}
          <div className="col-lg-4">
            <div className="card border shadow-sm h-100">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Available Tenants</h6>
                <small className="text-muted">{tenants.length} total</small>
              </div>
              <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Icon icon="heroicons:magnifying-glass" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search tenants..."
                      value={searchTenant}
                      onChange={(e) => setSearchTenant(e.target.value)}
                    />
                  </div>
                </div>

                <div className="list-group">
                  {filteredTenants.map(tenant => (
                    <div
                      key={tenant.id}
                      className={`list-group-item list-group-item-action cursor-pointer ${
                        selectedTenant?.id === tenant.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedTenant(tenant)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: tenant.primaryColor + '20',
                            border: `2px solid ${tenant.primaryColor}`
                          }}
                        >
                          <span className="fw-bold" style={{ color: tenant.primaryColor }}>
                            {tenant.logo}
                          </span>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="fw-bold mb-0">{tenant.name}</h6>
                            {getStatusBadge(tenant.status)}
                          </div>
                          <small className="text-muted d-block">{tenant.domain}</small>
                          <div className="d-flex gap-3 mt-1">
                            <small className="text-muted">
                              <Icon icon="heroicons:users" className="me-1" />
                              {tenant.employeeCount} users
                            </small>
                            <small className="text-muted">
                              <Icon icon="heroicons:credit-card" className="me-1" />
                              {tenant.subscriptionPlan}
                            </small>
                          </div>
                          <div className="mt-2 d-flex gap-1">
                            {getStatusActions(tenant)}
                          </div>
                        </div>
                        {selectedTenant?.id === tenant.id && (
                          <Icon icon="heroicons:check-circle" className="text-success fs-4" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTenants.length === 0 && (
                  <div className="text-center py-4">
                    <Icon icon="heroicons:building-office" className="text-muted fs-1 mb-3" />
                    <p className="text-muted">No tenants found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      

      {/* MFA Modal */}
      {showMfaModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Multi-Factor Authentication</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowMfaModal(false);
                    setMfaCode(['', '', '', '', '', '']);
                  }}
                ></button>
              </div>
              
              <form onSubmit={handleMfaVerify}>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <div className="bg-primary-subtle p-3 rounded-circle d-inline-flex mb-3">
                      <Icon icon="heroicons:shield-check" className="text-primary fs-2" />
                    </div>
                    <h5>Verify Your Identity</h5>
                    <p className="text-muted mb-0">
                      Enter the 6-digit code from your {mfaMethod === 'authenticator' ? 'authenticator app' : 'SMS'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-center d-block">Authentication Code</label>
                    <div className="d-flex justify-content-center gap-2">
                      {mfaCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`mfa-input-${index}`}
                          type="text"
                          maxLength="1"
                          className="form-control text-center"
                          style={{ width: '50px', fontSize: '1.5rem' }}
                          value={digit}
                          onChange={(e) => handleMfaInputChange(index, e.target.value)}
                          onKeyDown={(e) => handleMfaKeyDown(index, e)}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Verification Method</label>
                    <div className="d-flex gap-3">
                      <button
                        type="button"
                        className={`btn ${mfaMethod === 'authenticator' ? 'btn-primary' : 'btn-outline-primary'} flex-fill`}
                        onClick={() => setMfaMethod('authenticator')}
                      >
                        <Icon icon="heroicons:device-phone-mobile" className="me-2" />
                        Authenticator App
                      </button>
                      <button
                        type="button"
                        className={`btn ${mfaMethod === 'sms' ? 'btn-primary' : 'btn-outline-primary'} flex-fill`}
                        onClick={() => setMfaMethod('sms')}
                      >
                        <Icon icon="heroicons:chat-bubble-left-right" className="me-2" />
                        SMS
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer border-0">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowMfaModal(false);
                      setMfaCode(['', '', '', '', '', '']);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Verify & Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Reset Password</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowForgotPasswordModal(false)}
                ></button>
              </div>
              
              <form onSubmit={handleForgotPassword}>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <div className="bg-warning-subtle p-3 rounded-circle d-inline-flex mb-3">
                      <Icon icon="heroicons:key" className="text-warning fs-2" />
                    </div>
                    <p className="text-muted">
                      Enter your email address to receive password reset instructions.
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Icon icon="heroicons:envelope" />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer border-0">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowForgotPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Selection Modal */}
      {showTenantModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Select Organization</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowTenantModal(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Icon icon="heroicons:magnifying-glass" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search organizations..."
                      value={searchTenant}
                      onChange={(e) => setSearchTenant(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row g-3">
                  {filteredTenants.map(tenant => (
                    <div key={tenant.id} className="col-md-6">
                      <div 
                        className={`card border cursor-pointer ${selectedTenant?.id === tenant.id ? 'border-primary' : ''}`}
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setShowTenantModal(false);
                        }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: tenant.primaryColor + '20',
                                border: `3px solid ${tenant.primaryColor}`
                              }}
                            >
                              <span className="fw-bold" style={{ color: tenant.primaryColor }}>
                                {tenant.logo}
                              </span>
                            </div>
                            <div>
                              <h6 className="fw-bold mb-0">{tenant.name}</h6>
                              <small className="text-muted">{tenant.domain}</small>
                              <div className="mt-1">
                                {getStatusBadge(tenant.status)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 d-flex gap-1">
                            {getStatusActions(tenant)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-4">
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => {
                      setShowTenantModal(false);
                      setShowRequestOrgModal(true);
                    }}
                  >
                    <Icon icon="heroicons:plus" className="me-1" />
                    Request New Organization Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Organization Access Modal */}
      {showRequestOrgModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Request New Organization Access</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowRequestOrgModal(false)}
                ></button>
              </div>
              
              <form onSubmit={handleRequestOrgAccess}>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <div className="bg-info-subtle p-3 rounded-circle d-inline-flex mb-3">
                      <Icon icon="heroicons:building-office" className="text-info fs-2" />
                    </div>
                    <p className="text-muted">
                      Request access to a new organization. Your request will be reviewed by administrators.
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Organization Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter organization name"
                      value={requestOrgForm.organizationName}
                      onChange={(e) => setRequestOrgForm({...requestOrgForm, organizationName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Your Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={requestOrgForm.requestEmail}
                      onChange={(e) => setRequestOrgForm({...requestOrgForm, requestEmail: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Reason for Request</label>
                    <select
                      className="form-select"
                      value={requestOrgForm.reason}
                      onChange={(e) => setRequestOrgForm({...requestOrgForm, reason: e.target.value})}
                    >
                      <option value="business-need">Business Need</option>
                      <option value="new-client">New Client</option>
                      <option value="internal-transfer">Internal Transfer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Additional Information</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Provide any additional information..."
                      value={requestOrgForm.message}
                      onChange={(e) => setRequestOrgForm({...requestOrgForm, message: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="alert alert-info">
                    <div className="d-flex align-items-start gap-2">
                      <Icon icon="heroicons:information-circle" className="mt-1" />
                      <div>
                        <small className="fw-bold">Note:</small>
                        <ul className="mb-0 mt-1 ps-3 small">
                          <li>Requests are typically processed within 24-48 hours</li>
                          <li>You'll receive an email notification once approved</li>
                          <li>Contact support@hrms.com for urgent requests</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer border-0">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowRequestOrgModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Authentication Settings</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowSettingsModal(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        max="480"
                        value={settings.sessionTimeout}
                        onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Max Login Attempts</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        max="10"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Minimum Password Length</label>
                      <input
                        type="number"
                        className="form-control"
                        min="6"
                        max="32"
                        value={settings.passwordMinLength}
                        onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="col-12">
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="requireMfa"
                          checked={settings.requireMfa}
                          onChange={(e) => setSettings({...settings, requireMfa: e.target.checked})}
                        />
                        <label className="form-check-label" htmlFor="requireMfa">
                          Require MFA for all users
                        </label>
                      </div>
                      
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="allowSocialLogin"
                          checked={settings.allowSocialLogin}
                          onChange={(e) => setSettings({...settings, allowSocialLogin: e.target.checked})}
                        />
                        <label className="form-check-label" htmlFor="allowSocialLogin">
                          Allow Social Login (Google, Microsoft)
                        </label>
                      </div>
                      
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="enableAuditLogging"
                          checked={true}
                          onChange={() => {}}
                          disabled
                        />
                        <label className="form-check-label" htmlFor="enableAuditLogging">
                          Enable Audit Logging (Always enabled)
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-footer border-0 mt-4">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowSettingsModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Modal */}
      {showAuditLogs && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Audit Logs</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAuditLogs(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>User</th>
                        <th>Tenant</th>
                        <th>Status</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.slice(0, 10).map(log => (
                        <tr key={log.id}>
                          <td>{new Date(log.timestamp).toLocaleString()}</td>
                          <td>
                            <span className={`badge bg-${log.status === 'SUCCESS' ? 'success' : log.status === 'PENDING' ? 'warning' : 'danger'}-subtle text-${log.status === 'SUCCESS' ? 'success' : log.status === 'PENDING' ? 'warning' : 'danger'}`}>
                              {log.action}
                            </span>
                          </td>
                          <td>{log.userEmail}</td>
                          <td>{log.tenant || 'N/A'}</td>
                          <td>
                            <span className={`badge bg-${log.status === 'SUCCESS' ? 'success' : log.status === 'PENDING' ? 'warning' : 'secondary'}`}>
                              {log.status}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">{log.details || 'No details'}</small>
                          </td>
                        </tr>
                      ))}
                      {auditLogs.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <Icon icon="heroicons:document-text" className="text-muted fs-1 mb-3" />
                            <p className="text-muted">No audit logs yet</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">Showing {Math.min(10, auditLogs.length)} of {auditLogs.length} logs</small>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      const dataStr = JSON.stringify(auditLogs, null, 2);
                      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                      const linkElement = document.createElement('a');
                      linkElement.setAttribute('href', dataUri);
                      linkElement.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.json`);
                      linkElement.click();
                    }}
                  >
                    <Icon icon="heroicons:arrow-down-tray" className="me-1" />
                    Export Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authentication;