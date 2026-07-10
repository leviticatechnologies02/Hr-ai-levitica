import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

const Billing = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [autoRenew, setAutoRenew] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const userEmail = localStorage.getItem('userEmail');

  const loadSubscription = useCallback(async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BILLING.BY_EMAIL(userEmail)}`);
      if (!res.ok) throw new Error('Failed to load subscription');
      const data = await res.json();
      if (data.length > 0) {
        // Most recent subscription record
        const latest = data[0];
        setSubscription(latest);
        const planKey = latest.plan_name?.toLowerCase();
        if (planKey && plans[planKey]) setSelectedPlan(planKey);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your subscription from the server');
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const plans = {
    free: { name: 'Free', price: 0, users: 1, jobs: 3 },
    starter: { name: 'Starter', price: 999, users: 3, jobs: 10 },
    pro: { name: 'Pro', price: 2499, users: 10, jobs: 50 },
    enterprise: { name: 'Enterprise', price: 9999, users: 'Unlimited', jobs: 'Unlimited' }
  };

  // NOTE: there is no invoicing/billing-history table in the backend —
  // this used to be hardcoded fake data. Rather than fake it, the table
  // below just shows an honest "not available yet" state.
  const invoices = [];

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'text-success bg-success bg-opacity-10';
      case 'failed': return 'text-danger bg-danger bg-opacity-10';
      case 'pending': return 'text-warning bg-warning bg-opacity-10';
      default: return 'text-muted bg-light';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <Icon icon="heroicons:check-circle" className="small me-1" />;
      case 'failed': return <Icon icon="heroicons:exclamation-triangle" className="small me-1" />;
      case 'pending': return <Icon icon="heroicons:clock" className="small me-1" />;
      default: return null;
    }
  };

  const handleDownloadInvoice = (id) => {
    toast.info('Invoice download is not available yet — no invoice records exist in the backend.');
  };

  const handlePlanChange = async (newPlan) => {
    if (!window.confirm(`Are you sure you want to change to ${plans[newPlan].name} Plan?`)) return;
    if (!userEmail) {
      toast.error('No logged-in user found — please log in again.');
      return;
    }

    try {
      const plan = plans[newPlan];
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BILLING.SUBSCRIBE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          plan_name: plan.name,
          billing_cycle: 'monthly',
          subtotal: plan.price,
          tax_rate: 0,
          tax_amount: 0,
          total_amount: plan.price,
          currency: 'INR',
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ? JSON.stringify(err.detail) : 'Failed to change plan');
      }

      setSelectedPlan(newPlan);
      setShowPlanModal(false);
      toast.success(`Plan change to ${plan.name} recorded. NOTE: no payment gateway is wired up yet — this does not actually charge anything.`);
      await loadSubscription();
    } catch (err) {
      toast.error(err.message || 'Failed to change plan');
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="container-fluid">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <div className="text-muted small mb-3">Loading subscription…</div>}
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
            <h6 className="fw-semibold mb-0">Billing</h6>
            <ul className="d-flex align-items-center gap-2">
              <li className="fw-medium">
                <a href="#" className="d-flex align-items-center gap-1 hover-text-primary">
                  <Icon icon="solar:home-smile-angle-outline" className="icon text-lg" />
                  Dashboard
                </a>
              </li>
              <li>-</li>
              <li className="fw-medium">Settings</li>
              <li>-</li>
              <li className="fw-medium">Billing</li>
            </ul>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div 
                className="card shadow-sm border-0 h-100"
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                style={{ 
                  cursor: isDragging ? 'grabbing' : 'grab',
                  opacity: isDragging ? 0.8 : 1
                }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between mb-4">
                    <div>
                      <h5 className="h5 fw-semibold text-dark mb-1">
                        {plans[selectedPlan].name} Plan
                      </h5>
                      <p className="fs-5 fw-bold text-primary mb-0">
                        ₹{plans[selectedPlan].price.toLocaleString()}
                        <span className="fs-6 text-muted fw-normal">/month</span>
                      </p>
                    </div>
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      Active
                    </span>
                  </div>
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="bg-light rounded p-3">
                        <p className="small text-muted mb-1">Users Included</p>
                        <p className="h6 fw-semibold text-dark mb-0">
                          {plans[selectedPlan].users} Recruiters
                        </p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded p-3">
                        <p className="small text-muted mb-1">Job Posts</p>
                        <p className="h6 fw-semibold text-dark mb-0">
                          {plans[selectedPlan].jobs} Active
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-muted">Current Billing Cycle:</span>
                      <span className="fw-medium text-dark">Monthly</span>
                    </div>
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-muted">Next Renewal:</span>
                      <span className="fw-medium text-dark">10 Nov 2025</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center small">
                      <span className="text-muted">Auto-renew:</span>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={autoRenew}
                          onChange={() => setAutoRenew(!autoRenew)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2" style={{marginTop: "100px", marginLeft: "95px"}}>
              <div className="d-grid gap-3">
                <button
                  onClick={() => setShowPlanModal(!showPlanModal)}
                  className="btn btn-primary"
                >
                  View All Plans
                </button>
                <button
                  onClick={() => handlePlanChange('enterprise')}
                  className="btn btn-success"
                >
                  Upgrade to Enterprise
                </button>
                <button
                  onClick={() => handlePlanChange('starter')}
                  className="btn btn-outline-secondary"
                >
                  Downgrade Plan
                </button>
              </div>
            </div>
          </div>

          {showPlanModal && (
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="h5 fw-semibold text-dark">Choose Your Plan</h5>
                  <button
                    onClick={() => setShowPlanModal(false)}
                    className="btn btn-link text-muted p-0"
                  >
                    <Icon icon="heroicons:x-mark" />
                  </button>
                </div>
                <div className="row g-3">
                  {Object.entries(plans).map(([key, plan]) => (
                    <div key={key} className="col-md-3">
                      <div
                        className={`card border h-100 ${selectedPlan === key ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handlePlanChange(key)}
                      >
                        <div className="card-body text-center">
                          <h6 className="fw-semibold text-dark mb-2">{plan.name}</h6>
                          <p className="h5 fw-bold text-dark mb-3">
                            ₹{plan.price.toLocaleString()}
                            <span className="text-muted small">/months</span>
                          </p>
                          <ul className="list-unstyled small text-muted">
                            <li className="mb-1">✓ {plan.users} users</li>
                            <li className="mb-1">✓ {plan.jobs} job posts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="h5 fw-semibold text-dark">Billing History</h5>
                <button className="btn text-primary p-0 small">
                  Export All
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3 fw-bold text-start fs-5">Date</th>
                      <th className="border-0 py-3 fw-bold text-start fs-5">Amount</th>
                      <th className="border-0 py-3 fw-bold text-start fs-5">Status</th>
                      <th className="border-0 py-3 fw-bold text-end fs-5">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-3 text-center text-muted small">
                          No billing history yet — invoicing isn't wired up on the backend.
                        </td>
                      </tr>
                    )}
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="py-3 small text-dark">{invoice.date}</td>
                        <td className="py-3 small fw-medium text-dark">
                          ₹{invoice.amount.toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span className={`badge d-inline-flex align-items-center ${getStatusColor(invoice.status)}`}>
                            {getStatusIcon(invoice.status)}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 text-end">
                          {invoice.status === 'paid' ? (
                            <button
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              className="btn text-primary p-0 small d-inline-flex align-items-center gap-1"
                            >
                              <Icon icon="heroicons:arrow-down-tray" className="small" />
                              Download
                            </button>
                          ) : invoice.status === 'failed' ? (
                            <button className="btn text-danger p-0 small">
                              Retry Payment
                            </button>
                          ) : (
                            <span className="text-muted small">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="h5 fw-semibold text-dark mb-4">Payment Method</h2>
              
              {!showCardForm ? (
                <div className="border rounded p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-gradient rounded p-3">
                        <Icon icon="heroicons:credit-card" className="text-white" style={{ fontSize: '1.5rem' }} />
                      </div>
                      <div>
                        <p className="fw-medium text-dark mb-0">No payment method on file</p>
                        <p className="small text-muted mb-0">No payment gateway is connected yet — cards aren't actually stored or charged.</p>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => setShowCardForm(true)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Add Card
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="form-control"
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label small fw-medium">Expiry Month</label>
                    <input
                      type="text"
                      placeholder="MM"
                      className="form-control"
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label small fw-medium">Expiry Year</label>
                    <input
                      type="text"
                      placeholder="YY"
                      className="form-control"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-medium">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="form-control"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-medium">Billing Address</label>
                    <input
                      type="text"
                      placeholder="123 Main Street"
                      className="form-control mb-3"
                    />
                    <div className="row g-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          placeholder="City"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          placeholder="State"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 pt-3">
                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          toast.info('No payment gateway is connected yet — nothing was actually saved.');
                          setShowCardForm(false);
                        }}
                      >
                        Save Payment Method
                      </button>
                      <button
                        onClick={() => setShowCardForm(false)}
                        className="btn btn-outline-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;