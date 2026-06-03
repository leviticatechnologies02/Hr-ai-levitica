import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import 'bootstrap/dist/css/bootstrap.min.css';


const HRHelpdesk = () => {
  // States
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
    employeeName: '',
    employeeId: '',
    department: ''
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeView, setActiveView] = useState('list');
  const [internalNotes, setInternalNotes] = useState({});
  const [assignedAgents] = useState(['John HR', 'Priya Kumar', 'IT Support', 'Admin Team', 'Finance Team']);
  const [userRole] = useState('hr_admin');
  const [selectedAgent, setSelectedAgent] = useState('');

  // Mock data
  const mockTickets = [
    {
      id: 1,
      title: 'PF Deduction Issue',
      category: 'Payroll queries',
      priority: 'high',
      status: 'open',
      description: 'PF deduction seems incorrect in last month payslip. Need clarification on the calculation.',
      createdAt: '2024-01-15T10:30:00Z',
      assignedTo: 'John HR',
      employeeName: 'Rahul Sharma',
      employeeId: 'EMP001',
      department: 'Engineering',
      resolutionTime: null,
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Leave Balance Update',
      category: 'Leave and attendance issues',
      priority: 'medium',
      status: 'in-progress',
      description: 'My leave balance is not updated after my vacation last week. Please check and update.',
      createdAt: '2024-01-14T14:20:00Z',
      assignedTo: 'Priya Kumar',
      employeeName: 'Priya Kumar',
      employeeId: 'EMP002',
      department: 'Sales',
      resolutionTime: null,
      lastUpdated: '2024-01-15T09:15:00Z'
    },
    {
      id: 3,
      title: 'Email Access Issue',
      category: 'IT access issues',
      priority: 'low',
      status: 'resolved',
      description: 'Cannot access corporate email from mobile device. Getting authentication error.',
      createdAt: '2024-01-13T09:15:00Z',
      assignedTo: 'IT Support',
      employeeName: 'Amit Patel',
      employeeId: 'EMP003',
      department: 'Marketing',
      resolutionTime: '2024-01-13T16:45:00Z',
      lastUpdated: '2024-01-13T16:45:00Z'
    },
    {
      id: 4,
      title: 'Policy Clarification Needed',
      category: 'Policy clarifications',
      priority: 'medium',
      status: 'open',
      description: 'Need clarification on new work from home policy regarding core working hours.',
      createdAt: '2024-01-16T11:20:00Z',
      assignedTo: null,
      employeeName: 'Sneha Reddy',
      employeeId: 'EMP004',
      department: 'HR',
      resolutionTime: null,
      lastUpdated: '2024-01-16T11:20:00Z'
    },
    {
      id: 5,
      title: 'Reimbursement Pending',
      category: 'Reimbursement queries',
      priority: 'high',
      status: 'in-progress',
      description: 'Travel reimbursement for December business trip is still pending approval.',
      createdAt: '2024-01-12T15:45:00Z',
      assignedTo: 'Finance Team',
      employeeName: 'Rajesh Kumar',
      employeeId: 'EMP005',
      department: 'Operations',
      resolutionTime: null,
      lastUpdated: '2024-01-15T14:30:00Z'
    },
    {
      id: 6,
      title: 'Address Change Request',
      category: 'Personal data updates',
      priority: 'low',
      status: 'closed',
      description: 'Need to update my residential address in company records.',
      createdAt: '2024-01-10T09:00:00Z',
      assignedTo: 'Admin Team',
      employeeName: 'Meera Singh',
      employeeId: 'EMP006',
      department: 'Engineering',
      resolutionTime: '2024-01-11T11:30:00Z',
      lastUpdated: '2024-01-11T11:30:00Z'
    }
  ];

  const categories = [
    'Payroll queries',
    'Leave and attendance issues',
    'Policy clarifications',
    'IT access issues',
    'Document requests',
    'Reimbursement queries',
    'Personal data updates',
    'General HR queries',
    'Grievances and complaints'
  ];

  // Initialize with mock data
  useEffect(() => {
    setTickets(mockTickets);
  }, []);

  // Calculate statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    highPriority: tickets.filter(t => t.priority === 'high').length,
    unassigned: tickets.filter(t => !t.assignedTo).length,
    // New metrics
    today: tickets.filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.createdAt.split('T')[0] === today;
    }).length,
    overdue: tickets.filter(t => {
      if (t.status !== 'open' && t.status !== 'in-progress') return false;
      const created = new Date(t.createdAt);
      const now = new Date();
      const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
      return daysDiff > 3;
    }).length,
    averageResolution: calculateAverageResolutionTime()
  };

  function calculateAverageResolutionTime() {
    const resolvedTickets = tickets.filter(t => t.resolutionTime && t.status === 'resolved');
    if (resolvedTickets.length === 0) return 0;
    
    const totalHours = resolvedTickets.reduce((sum, ticket) => {
      const created = new Date(ticket.createdAt);
      const resolved = new Date(ticket.resolutionTime);
      const hours = (resolved - created) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);
    
    return Math.round(totalHours / resolvedTickets.length);
  }

  // Handle create ticket
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.title.trim() || !newTicket.category || !newTicket.description.trim()) {
      alert('Please fill all required fields');
      return;
    }

    const newTicketObj = {
      id: tickets.length + 1,
      ...newTicket,
      status: 'open',
      createdAt: new Date().toISOString(),
      assignedTo: null,
      resolutionTime: null,
      lastUpdated: new Date().toISOString()
    };

    setTickets([newTicketObj, ...tickets]);
    setNewTicket({
      title: '',
      category: '',
      priority: 'medium',
      description: '',
      employeeName: '',
      employeeId: '',
      department: ''
    });

    alert(`Ticket created successfully! Ticket ID: #${newTicketObj.id}`);
  };

  // Handle view ticket
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  // Update ticket status
  const updateTicketStatus = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedTicket = {
          ...ticket,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
        
        if (newStatus === 'resolved' && !ticket.resolutionTime) {
          updatedTicket.resolutionTime = new Date().toISOString();
        }
        
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updatedTicket);
        }
        
        return updatedTicket;
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
  };

  // Assign ticket to agent
  const assignTicket = (ticketId, agentName) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId ? { 
        ...ticket, 
        assignedTo: agentName,
        lastUpdated: new Date().toISOString()
      } : ticket
    );
    setTickets(updatedTickets);
    
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({...selectedTicket, assignedTo: agentName});
    }
  };

  // Add internal note
  const addInternalNote = (ticketId, note) => {
    if (!note.trim()) return;
    
    const noteObj = {
      id: Date.now(),
      content: note,
      timestamp: new Date().toISOString(),
      author: userRole === 'hr_admin' ? 'You' : 'HR Support',
      ticketId: ticketId
    };
    
    setInternalNotes(prev => ({
      ...prev,
      [ticketId]: [...(prev[ticketId] || []), noteObj]
    }));
  };

  // Filter and sort tickets
  const filteredAndSortedTickets = tickets
    .filter(ticket => {
      if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
      if (selectedAgent && ticket.assignedTo !== selectedAgent) return false;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower) ||
          ticket.employeeName?.toLowerCase().includes(searchLower) ||
          ticket.employeeId?.toLowerCase().includes(searchLower) ||
          ticket.id.toString().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aVal = priorityOrder[a.priority] || 0;
          bVal = priorityOrder[b.priority] || 0;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case 'lastUpdated':
          aVal = new Date(a.lastUpdated);
          bVal = new Date(b.lastUpdated);
          break;
        default:
          aVal = a[sortBy];
          bVal = b[sortBy];
      }
      
      return sortOrder === 'asc' ? 
        (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) :
        (aVal > bVal ? -1 : aVal < bVal ? 1 : 0);
    });

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#1d4ed8';
      case 'in-progress': return '#7c3aed';
      case 'resolved': return '#15803d';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Styles
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '24px'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px'
    },
    ticketForm: {
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      marginBottom: '24px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      fontSize: '14px',
      marginTop: '4px'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical'
    },
    button: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    secondaryButton: {
      background: '#f8f9fa',
      color: '#6c757d',
      border: '1px solid #dee2e6'
    },
    ticketsTable: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    tableHeader: {
      backgroundColor: '#f8f9fa',
      padding: '16px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#495057',
      borderBottom: '2px solid #e9ecef'
    },
    tableCell: {
      padding: '16px',
      borderBottom: '1px solid #e9ecef'
    },
    priorityBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflowY: 'auto'
    }
  };

  const cardStyle = {
    background: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    width: '150px'
  };

  const labelStyle = {
    color: '#6c757d',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '8px'
  };

  const valueStyle = {
    fontSize: '1.5rem',
    fontWeight: '700'
  };

  // Menu items for the layout
  const menuItems = [
    {
      title: 'Dashboard',
      link: '/hr/dashboard',
      active: false
    },
    {
      title: 'Employee Master',
      link: '/hr/employees'
    },
    {
      title: 'HR Operations',
      link: '/hr/operations'
    },
    {
      title: 'HR Helpdesk',
      link: '/hr/helpdesk',
      active: true
    },
    {
      title: 'Attendance',
      link: '/hr/attendance'
    },
    {
      title: 'Leave Management',
      link: '/hr/leave'
    },
    {
      title: 'Payroll',
      link: '/hr/payroll'
    },
    {
      title: 'Performance',
      link: '/hr/performance'
    },
    {
      title: 'Reports',
      link: '/hr/reports'
    },
    {
      title: 'Settings',
      link: '/hr/settings'
    }
  ];

  const userInfo = {
    name: 'HR Manager',
    role: 'Human Resources',
    email: 'hr@company.com'
  };

  // Modal component
  const TicketModal = ({ ticket, onClose }) => {
    const [note, setNote] = useState('');
    const [assignTo, setAssignTo] = useState(ticket.assignedTo || '');
    const ticketNotes = internalNotes[ticket.id] || [];

    const handleAddNote = () => {
      if (note.trim()) {
        addInternalNote(ticket.id, note);
        setNote('');
      }
    };

    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
          <div style={{padding: '24px', borderBottom: '1px solid #e9ecef'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
              <div>
                <h2 style={{margin: 0, color: '#212529'}}>Ticket #{ticket.id}</h2>
                <h3 style={{margin: '8px 0 0', color: '#495057'}}>{ticket.title}</h3>
              </div>
              <button 
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#6c757d',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
              <span style={{
                ...styles.priorityBadge,
                backgroundColor: getPriorityColor(ticket.priority) + '20',
                color: getPriorityColor(ticket.priority)
              }}>
                {ticket.priority}
              </span>
              <span style={{
                ...styles.priorityBadge,
                backgroundColor: getStatusColor(ticket.status) + '20',
                color: getStatusColor(ticket.status)
              }}>
                {ticket.status}
              </span>
              <span style={{
                ...styles.priorityBadge,
                backgroundColor: '#e7f1ff',
                color: '#0d6efd'
              }}>
                {ticket.category}
              </span>
            </div>
          </div>

          <div style={{padding: '24px'}}>
            {/* Ticket Details */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px'}}>
              <div>
                <h4 style={{color: '#495057', marginBottom: '12px'}}>Employee Details</h4>
                <div style={{color: '#6c757d', lineHeight: '1.8'}}>
                  <div><strong>Name:</strong> {ticket.employeeName || 'Not provided'}</div>
                  <div><strong>ID:</strong> {ticket.employeeId || 'N/A'}</div>
                  <div><strong>Department:</strong> {ticket.department || 'N/A'}</div>
                </div>
              </div>
              <div>
                <h4 style={{color: '#495057', marginBottom: '12px'}}>Ticket Details</h4>
                <div style={{color: '#6c757d', lineHeight: '1.8'}}>
                  <div><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</div>
                  <div><strong>Last Updated:</strong> {new Date(ticket.lastUpdated).toLocaleString()}</div>
                  <div><strong>Assigned To:</strong> {ticket.assignedTo || 'Unassigned'}</div>
                  {ticket.resolutionTime && (
                    <div><strong>Resolved:</strong> {new Date(ticket.resolutionTime).toLocaleString()}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{marginBottom: '24px'}}>
              <h4 style={{color: '#495057', marginBottom: '12px'}}>Description</h4>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                color: '#495057',
                lineHeight: '1.6'
              }}>
                {ticket.description}
              </div>
            </div>

            {/* Assignment Section */}
            {userRole === 'hr_admin' && (
              <div style={{marginBottom: '24px'}}>
                <h4 style={{color: '#495057', marginBottom: '12px'}}>Assign Ticket</h4>
                <div style={{display: 'flex', gap: '12px'}}>
                  <select
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Agent</option>
                    {assignedAgents.map(agent => (
                      <option key={agent} value={agent}>{agent}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => assignTicket(ticket.id, assignTo)}
                    disabled={!assignTo}
                    style={{
                      ...styles.button,
                      ...styles.primaryButton,
                      opacity: assignTo ? 1 : 0.5
                    }}
                  >
                    Assign
                  </button>
                </div>
              </div>
            )}

            {/* Internal Notes */}
            <div style={{marginBottom: '24px'}}>
              <h4 style={{color: '#495057', marginBottom: '12px'}}>Internal Notes</h4>
              <div style={{
                maxHeight: '200px',
                overflowY: 'auto',
                marginBottom: '16px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '12px'
              }}>
                {ticketNotes.length === 0 ? (
                  <div style={{color: '#adb5bd', textAlign: 'center', padding: '20px'}}>No internal notes yet</div>
                ) : (
                  ticketNotes.map(note => (
                    <div key={note.id} style={{
                      backgroundColor: '#e7f1ff',
                      padding: '12px',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      borderLeft: '4px solid #0d6efd'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px'}}>
                        <span style={{fontWeight: '600', color: '#0d6efd'}}>{note.author}</span>
                        <span style={{color: '#6c757d'}}>
                          {new Date(note.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div style={{color: '#212529', lineHeight: '1.5'}}>{note.content}</div>
                    </div>
                  ))
                )}
              </div>
              
              <div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add internal note..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '12px'
                  }}
                />
                <button
                  onClick={handleAddNote}
                  style={{
                    ...styles.button,
                    backgroundColor: '#198754',
                    color: 'white'
                  }}
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid #e9ecef'}}>
              <div style={{display: 'flex', gap: '12px'}}>
                {ticket.status === 'open' && (
                  <button
                    onClick={() => updateTicketStatus(ticket.id, 'in-progress')}
                    style={{
                      ...styles.button,
                      backgroundColor: '#0d6efd',
                      color: 'white'
                    }}
                  >
                    Start Progress
                  </button>
                )}
                {ticket.status === 'in-progress' && (
                  <button
                    onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                    style={{
                      ...styles.button,
                      backgroundColor: '#198754',
                      color: 'white'
                    }}
                  >
                    Mark as Resolved
                  </button>
                )}
                {ticket.status !== 'closed' && (
                  <button
                    onClick={() => updateTicketStatus(ticket.id, 'closed')}
                    style={{
                      ...styles.button,
                      backgroundColor: '#6c757d',
                      color: 'white'
                    }}
                  >
                    Close Ticket
                  </button>
                )}
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <button style={{
                  ...styles.button,
                  backgroundColor: 'white',
                  color: '#6c757d',
                  border: '1px solid #dee2e6'
                }}>
                  Escalate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={styles.container}>
        {/* Header */}
     <div>
  <h5 className="mb-2 d-flex align-items-center">
    <Icon
      icon="heroicons-outline:lifebuoy"
      className="me-2"
      width={24}
      height={24}
    />
    HR Helpdesk & Ticketing System
  </h5>

  <p className="text-muted d-none d-md-block">
    Manage all HR queries and support requests in one place
  </p>
</div>


        {/* Statistics Cards Grid */}
        <div style={{ marginBottom: '24px', overflowX: 'auto' }}>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              minWidth: '1200px',
            }}
          >
            {/* Total Tickets */}
            <div style={cardStyle}>
              <div style={labelStyle}>Total Tickets</div>
              <div style={{ ...valueStyle, color: '#0d6efd' }}>{stats.total}</div>
            </div>

            {/* Open */}
            <div style={cardStyle}>
              <div style={labelStyle}>Open</div>
              <div style={{ ...valueStyle, color: '#dc3545' }}>{stats.open}</div>
            </div>

            {/* In Progress */}
            <div style={cardStyle}>
              <div style={labelStyle}>In Progress</div>
              <div style={{ ...valueStyle, color: '#0dcaf0' }}>{stats.inProgress}</div>
            </div>

            {/* Resolved */}
            <div style={cardStyle}>
              <div style={labelStyle}>Resolved</div>
              <div style={{ ...valueStyle, color: '#198754' }}>{stats.resolved}</div>
            </div>

            {/* High Priority */}
            <div style={cardStyle}>
              <div style={labelStyle}>High Priority</div>
              <div style={{ ...valueStyle, color: '#dc3545' }}>{stats.highPriority}</div>
            </div>

            {/* Unassigned */}
            <div style={cardStyle}>
              <div style={labelStyle}>Unassigned</div>
              <div style={{ ...valueStyle, color: '#fd7e14' }}>{stats.unassigned}</div>
            </div>

            {/* Today's Tickets */}
            <div style={cardStyle}>
              <div style={labelStyle}>Today's Tickets</div>
              <div style={{ ...valueStyle, color: '#20c997' }}>{stats.today}</div>
            </div>

            {/* Overdue */}
            <div style={cardStyle}>
              <div style={labelStyle}>Overdue</div>
              <div style={{ ...valueStyle, color: '#ffc107' }}>{stats.overdue}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Left Column */}
          <div>
            {/* Create Ticket Form */}
            <div style={styles.ticketForm}>
              <h5 style={{color: '#212529', marginBottom: '20px', fontSize: '1.5rem'}}>Create New Ticket</h5>
              <form onSubmit={handleCreateTicket}>
                <div style={styles.formGrid}>
                  <div>
                    <label style={{display: 'block', color: '#495057', marginBottom: '8px', fontSize: '14px'}}>
                      <strong>Title *</strong>
                    </label>
                    <input
                      type="text"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                      placeholder="Brief description of issue"
                      required
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', color: '#495057', marginBottom: '8px', fontSize: '14px'}}>
                      <strong>Category *</strong>
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                      required
                      style={styles.input}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{display: 'block', color: '#495057', marginBottom: '8px', fontSize: '14px'}}>
                      <strong>Priority</strong>
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                      style={styles.input}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label style={{display: 'block', color: '#495057', marginBottom: '8px', fontSize: '14px'}}>
                      <strong>Employee Name</strong>
                    </label>
                    <input
                      type="text"
                      value={newTicket.employeeName}
                      onChange={(e) => setNewTicket({...newTicket, employeeName: e.target.value})}
                      placeholder="Optional"
                      style={styles.input}
                    />
                  </div>
                </div>
                
                <div style={{marginTop: '16px'}}>
                  <label style={{display: 'block', color: '#495057', marginBottom: '8px', fontSize: '14px'}}>
                    <strong>Description *</strong>
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    placeholder="Detailed description of the issue..."
                    required
                    style={styles.textarea}
                  />
                </div>
                
                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                    marginTop: '20px',
                    width: '100%',
                    fontSize: '16px',
                    padding: '12px'
                  }}
                >
                  Create Ticket
                </button>
              </form>
            </div>

            {/* Tickets Table */}
            <div style={{background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
              <div style={{padding: '24px', borderBottom: '1px solid #e9ecef'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <h5 style={{color: '#212529', margin: 0, fontSize: '1.25rem'}}>
                    All Tickets <span style={{color: '#6c757d'}}>({filteredAndSortedTickets.length})</span>
                  </h5>
                  <div style={{display: 'flex', gap: '12px'}}>
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        fontSize: '14px',
                        width: '200px'
                      }}
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                
                <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">All Agents</option>
                    {assignedAgents.map(agent => (
                      <option key={agent} value={agent}>{agent}</option>
                    ))}
                  </select>
                </div>
              </div>

              <table style={styles.ticketsTable}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>ID</th>
                    <th style={styles.tableHeader}>Title</th>
                    <th style={styles.tableHeader}>Category</th>
                    <th style={styles.tableHeader}>Priority</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={styles.tableHeader}>Created</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedTickets.map(ticket => (
                    <tr key={ticket.id} style={{borderBottom: '1px solid #e9ecef'}}>
                      <td style={styles.tableCell}>
                        <strong style={{color: '#212529'}}>#{ticket.id}</strong>
                      </td>
                      <td style={styles.tableCell}>
                        <div>
                          <strong style={{color: '#212529'}}>{ticket.title}</strong>
                          <div style={{color: '#6c757d', fontSize: '13px', marginTop: '4px'}}>
                            {ticket.description.substring(0, 60)}...
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          backgroundColor: '#e7f1ff',
                          color: '#0d6efd',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {ticket.category}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          ...styles.priorityBadge,
                          backgroundColor: getPriorityColor(ticket.priority) + '20',
                          color: getPriorityColor(ticket.priority)
                        }}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          ...styles.priorityBadge,
                          backgroundColor: getStatusColor(ticket.status) + '20',
                          color: getStatusColor(ticket.status)
                        }}>
                          {ticket.status}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{color: '#6c757d', fontSize: '13px'}}>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                          <div style={{fontSize: '11px', color: '#adb5bd'}}>
                            {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button
                            onClick={() => handleViewTicket(ticket)}
                            style={{
                              ...styles.button,
                              backgroundColor: '#0d6efd',
                              color: 'white',
                              padding: '6px 12px',
                              fontSize: '13px'
                            }}
                          >
                            View
                          </button>
                          {userRole === 'hr_admin' && ticket.status === 'open' && (
                            <button
                              onClick={() => updateTicketStatus(ticket.id, 'in-progress')}
                              style={{
                                ...styles.button,
                                backgroundColor: '#198754',
                                color: 'white',
                                padding: '6px 12px',
                                fontSize: '13px'
                              }}
                            >
                              Start
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Quick Actions */}
            <div style={{background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
              <h5 style={{color: '#212529', marginBottom: '20px', fontSize: '1.25rem'}}>Quick Actions</h5>
              <div style={{display: 'grid', gap: '12px'}}>
                <button style={{...styles.button, ...styles.secondaryButton, textAlign: 'left'}}>
                  Export Tickets to Excel
                </button>
                <button style={{...styles.button, ...styles.secondaryButton, textAlign: 'left'}}>
                  View Unassigned Tickets
                </button>
                <button style={{...styles.button, ...styles.secondaryButton, textAlign: 'left'}}>
                  Generate Weekly Report
                </button>
                <button style={{...styles.button, ...styles.secondaryButton, textAlign: 'left'}}>
                  View All Agents
                </button>
              </div>
            </div>

            {/* Category Breakdown */}
            <div style={{background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
              <h5 style={{color: '#212529', marginBottom: '20px', fontSize: '1.25rem'}}>Category Breakdown</h5>
              {categories.map(category => {
                const count = tickets.filter(t => t.category === category).length;
                return (
                  <div key={category} style={{marginBottom: '12px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                      <span style={{color: '#495057', fontSize: '14px'}}>{category}</span>
                      <span style={{color: '#212529', fontWeight: '500', fontSize: '14px'}}>{count}</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(count / tickets.length) * 100}%`,
                        height: '100%',
                        backgroundColor: '#0d6efd',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Agent Performance */}
            <div style={{background: 'white', borderRadius: '12px', padding: '24px', marginTop: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
              <h5 style={{color: '#212529', marginBottom: '20px', fontSize: '1.25rem'}}>Agent Performance</h5>
              <div style={{display: 'grid', gap: '16px'}}>
                {assignedAgents.map(agent => {
                  const agentTickets = tickets.filter(t => t.assignedTo === agent);
                  const resolvedTickets = agentTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
                  const avgResolution = agentTickets.length > 0 ? 
                    Math.round(agentTickets.reduce((sum, t) => {
                      if (t.resolutionTime) {
                        const created = new Date(t.createdAt);
                        const resolved = new Date(t.resolutionTime);
                        return sum + ((resolved - created) / (1000 * 60 * 60));
                      }
                      return sum;
                    }, 0) / agentTickets.length) : 0;
                  
                  return (
                    <div key={agent} style={{
                      padding: '12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span style={{fontWeight: '500', color: '#212529'}}>{agent}</span>
                        <span style={{
                          backgroundColor: resolvedTickets > 0 ? '#d1e7dd' : '#f8d7da',
                          color: resolvedTickets > 0 ? '#0f5132' : '#842029',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {resolvedTickets} resolved
                        </span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#6c757d'}}>
                        <span>Total: {agentTickets.length}</span>
                        <span>Avg: {avgResolution}h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedTicket && (
          <TicketModal
            ticket={selectedTicket}
            onClose={() => {
              setShowModal(false);
              setSelectedTicket(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default HRHelpdesk;