import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

const Integrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showSettings, setShowSettings] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const loadIntegrations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.INTEGRATIONS.LIST}`);
      if (!res.ok) throw new Error('Failed to load integrations');
      const data = await res.json();
      setIntegrations(data.map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        status: i.status,
        lastSync: i.connected_at ? new Date(i.connected_at).toLocaleString() : null,
      })));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load integrations from the server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  const handleConnect = async (id, name) => {
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.INTEGRATIONS.CONNECT(id)}`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to connect');
      await loadIntegrations();
      setNotification({
        type: 'success',
        message: `${name} marked as connected. NOTE: this is a toggle only — no real OAuth handshake happens yet, so it won't actually send/receive anything from ${name}.`
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      toast.error(err.message || 'Failed to connect');
    }
  };

  const handleDisconnect = async (id, name) => {
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.INTEGRATIONS.DISCONNECT(id)}`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to disconnect');
      await loadIntegrations();
      setNotification({ type: 'info', message: `${name} disconnected.` });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to disconnect');
    }
  };

  const handleTestConnection = (id, name) => {
    toast.info(`${name} isn't really connected via OAuth yet, so there's nothing to test against — see the note on Connect.`);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'connected':
        return (
          <span className="badge bg-success text-white d-flex align-items-center">
            <Icon icon="heroicons:check-circle" className="me-1" />
            Connected
          </span>
        );
      case 'error':
        return (
          <span className="badge bg-danger text-white d-flex align-items-center">
            <Icon icon="heroicons:x-circle" className="me-1" />
            Error
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary text-white d-flex align-items-center">
            <div className="bg-white rounded-circle me-1" style={{ width: '8px', height: '8px' }}></div>
            Not Connected
          </span>
        );
    }
  };

  const getIntegrationIcon = (id) => {
    switch(id) {
      case 'slack':
        return 'heroicons:chat-bubble-left-right';
      case 'gmail':
        return 'heroicons:envelope';
      case 'google-calendar':
        return 'heroicons:calendar';
      default:
        return 'heroicons:server';
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
      {loading && <div className="text-muted small mb-3">Loading integrations…</div>}
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
            <h6 className="fw-semibold mb-0">Integrations</h6>
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
              <li className="fw-medium">Integrations</li>
            </ul>
          </div>

          {notification && (
            <div className={`alert alert-dismissible fade show mb-4 ${
              notification.type === 'success' ? 'alert-success' : 'alert-info'
            }`} role="alert">
              <span className="fw-medium">{notification.message}</span>
              <button
                type="button"
                className="btn-close"
                onClick={() => setNotification(null)}
              ></button>
            </div>
          )}

          <div className="row g-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="col-md-6">
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
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-gradient rounded-2 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                          <Icon icon={getIntegrationIcon(integration.id)} className="text-white" style={{ fontSize: '1.5rem' }} />
                        </div>
                        <div>
                          <h5 className="fw-semibold text-dark mb-0">{integration.name}</h5>
                          {integration.status === 'connected' && (
                            <button
                              onClick={() => setShowSettings(showSettings === integration.id ? null : integration.id)}
                              className="btn p-0 text-primary small d-flex align-items-center gap-1"
                            >
                              <Icon icon="heroicons:cog-6-tooth" className="small" />
                              Settings
                            </button>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>

                    <p className="text-muted small mb-3">
                      {integration.description}
                    </p>

                    {integration.status === 'connected' && integration.lastSync && (
                      <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                        <Icon icon="heroicons:clock" className="fs-5" />
                        Connected: {integration.lastSync}
                      </div>
                    )}

                    {showSettings === integration.id && integration.status === 'connected' && (
                      <div className="mb-3 p-3 bg-light rounded border">
                        <h5 className="small fw-medium text-dark mb-2">Integration Status</h5>
                        <div className="small text-muted">
                          No real OAuth connection or configurable settings exist for this integration yet — this
                          only tracks whether it's toggled on.
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      {integration.status === 'connected' ? (
                        <>
                          <button
                            onClick={() => handleDisconnect(integration.id, integration.name)}
                            className="btn btn-danger btn-sm d-flex align-items-center justify-content-center gap-1"
                          >
                            <Icon icon="heroicons:link-slash" className="small" />
                            Disconnect
                          </button>
                          <button
                            onClick={() => handleTestConnection(integration.id, integration.name)}
                            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                          >
                            Test
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnect(integration.id, integration.name)}
                          className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-1"
                        >
                          <Icon icon="heroicons:link" className="small" />
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="card bg-primary bg-opacity-10 border border-primary border-opacity-20">
              <div className="card-body">
                <div className="d-flex align-items-start gap-3">
                  <Icon icon="heroicons:exclamation-triangle" className="text-primary mt-1 fs-5" />
                  <div>
                    <h6 className="fw-semibold text-primary mb-1">Not real OAuth yet</h6>
                    <p className="small text-primary mb-0">
                      These toggles are saved on the server, but no actual Slack/Gmail/Google Calendar app
                      registration exists — connecting here won't send or receive anything from those services
                      until a real OAuth integration is built.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;