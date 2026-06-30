import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  settings, 
  notificationSettings,
  bankSettings,
  onSaveBankSettings,
  integrationSettings,
  onSaveIntegrationSettings,
  mode = 'salary' 
}) => {
  const [localSettings, setLocalSettings] = useState(settings || {});
  const [localNotifications, setLocalNotifications] = useState(notificationSettings || {});

  const [localBankSettings, setLocalBankSettings] = useState(bankSettings || {});

  const [localIntegrationSettings, setLocalIntegrationSettings] = useState(integrationSettings || {
    apiEndpoint: '',
    apiKey: '',
    webhookUrl: '',
    autoBackup: true,
    auditLogging: true
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'bank' || mode === 'payment') {
        setLocalBankSettings(bankSettings || {});
      } else if (mode === 'integration') {
        setLocalIntegrationSettings(integrationSettings || {
          apiEndpoint: '',
          apiKey: '',
          webhookUrl: '',
          autoBackup: true,
          auditLogging: true
        });
      } else {
        setLocalSettings(settings || {});
        setLocalNotifications(notificationSettings || {});
      }
    }
  }, [isOpen, settings, notificationSettings, bankSettings, integrationSettings, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'bank' || mode === 'payment') {
      if (onSaveBankSettings) {
        onSaveBankSettings(localBankSettings);
      }
    } else if (mode === 'integration') {
      if (onSaveIntegrationSettings) {
        onSaveIntegrationSettings(localIntegrationSettings);
      }
    } else {
      if (onSave) {
        onSave(localSettings, localNotifications);
      }
    }
  };

  const handleBankChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalBankSettings({
      ...localBankSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleIntegrationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalIntegrationSettings({
      ...localIntegrationSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (mode === 'bank' || mode === 'payment') {
      setLocalBankSettings({
        ...localBankSettings,
        [name]: type === 'checkbox' ? checked : value
      });
    } else if (mode === 'integration') {
      setLocalIntegrationSettings({
        ...localIntegrationSettings,
        [name]: type === 'checkbox' ? checked : value
      });
    } else {
      setLocalSettings({
        ...localSettings,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setLocalNotifications({
      ...localNotifications,
      [name]: checked
    });
  };

  const getTitle = () => {
    if (mode === 'bank' || mode === 'payment') {
      return 'Payment Settings';
    }
    if (mode === 'integration') {
      return 'Integration Configuration';
    }
    return 'Advanced Settings';
  };

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">API Endpoint</label>
          <input
            type="text"
            name="apiEndpoint"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={localIntegrationSettings.apiEndpoint || ''}
            onChange={handleIntegrationChange}
            placeholder="https://api.example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">API Key</label>
          <input
            type="password"
            name="apiKey"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={localIntegrationSettings.apiKey || ''}
            onChange={handleIntegrationChange}
            placeholder="Enter API key"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Webhook URL</label>
        <input
          type="text"
          name="webhookUrl"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          value={localIntegrationSettings.webhookUrl || ''}
          onChange={handleIntegrationChange}
          placeholder="https://webhook.example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="autoBackup"
            checked={localIntegrationSettings.autoBackup || false}
            onChange={handleIntegrationChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Enable Automatic Backups</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="auditLogging"
            checked={localIntegrationSettings.auditLogging || false}
            onChange={handleIntegrationChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Enable Audit Logging</span>
        </label>
      </div>
    </div>
  );

  const renderBankSettings = () => (
    <div className="space-y-6">
      <div>
        <h6 className="font-bold text-sm text-slate-800 mb-3">Security Settings</h6>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium text-sm text-slate-700 flex items-center gap-2">
                <Icon icon="heroicons:shield-check" className="w-4 h-4 text-blue-500" />
                Auto File Encryption
              </div>
              <p className="text-xs text-slate-500">Automatically encrypt all payment files</p>
            </div>
            <input
              type="checkbox"
              name="autoEncryption"
              checked={localBankSettings.autoEncryption || false}
              onChange={handleBankChange}
              className="w-8 h-5 bg-slate-200 rounded-full appearance-none cursor-pointer checked:bg-blue-600 transition-colors relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-3"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium text-sm text-slate-700 flex items-center gap-2">
                <Icon icon="heroicons:bell" className="w-4 h-4 text-blue-500" />
                Payment Notifications
              </div>
              <p className="text-xs text-slate-500">Send email notifications for payment status</p>
            </div>
            <input
              type="checkbox"
              name="notificationEnabled"
              checked={localBankSettings.notificationEnabled || false}
              onChange={handleBankChange}
              className="w-8 h-5 bg-slate-200 rounded-full appearance-none cursor-pointer checked:bg-blue-600 transition-colors relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-3"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium text-sm text-slate-700 flex items-center gap-2">
                <Icon icon="heroicons:arrow-path" className="w-4 h-4 text-blue-500" />
                Auto Reconciliation
              </div>
              <p className="text-xs text-slate-500">Automatically reconcile payments daily</p>
            </div>
            <input
              type="checkbox"
              name="autoReconciliation"
              checked={localBankSettings.autoReconciliation || false}
              onChange={handleBankChange}
              className="w-8 h-5 bg-slate-200 rounded-full appearance-none cursor-pointer checked:bg-blue-600 transition-colors relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-3"
            />
          </label>
        </div>
      </div>

      <div>
        <h6 className="font-bold text-sm text-slate-800 mb-3">Backup & Retention</h6>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium text-sm text-slate-700 flex items-center gap-2">
                <Icon icon="heroicons:database" className="w-4 h-4 text-blue-500" />
                Auto Backup
              </div>
              <p className="text-xs text-slate-500">Automatically backup payment files</p>
            </div>
            <input
              type="checkbox"
              name="backupEnabled"
              checked={localBankSettings.backupEnabled || false}
              onChange={handleBankChange}
              className="w-8 h-5 bg-slate-200 rounded-full appearance-none cursor-pointer checked:bg-blue-600 transition-colors relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-3"
            />
          </label>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Data Retention Period (days)</label>
            <select
              name="retentionPeriod"
              value={localBankSettings.retentionPeriod || '90'}
              onChange={handleBankChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            >
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">365 days</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h6 className="font-bold text-sm text-slate-800 mb-3">Default Payment Settings</h6>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Default Payment Type</label>
          <select
            name="defaultPaymentType"
            value={localBankSettings.defaultPaymentType || 'NEFT'}
            onChange={handleBankChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
          >
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="IMPS">IMPS</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSalarySettings = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h6 className="font-bold text-sm text-slate-800 mb-3">Company Logo & Seal</h6>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Logo URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={localSettings.logo || ''}
                onChange={(e) => setLocalSettings({ ...localSettings, logo: e.target.value })}
                placeholder="Logo URL"
              />
              {localSettings.logo && (
                <div className="mt-2">
                  <img src={localSettings.logo} alt="Logo Preview" className="w-16 h-16 object-contain" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Seal URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={localSettings.seal || ''}
                onChange={(e) => setLocalSettings({ ...localSettings, seal: e.target.value })}
                placeholder="Seal URL"
              />
              {localSettings.seal && (
                <div className="mt-2">
                  <img src={localSettings.seal} alt="Seal Preview" className="w-16 h-16 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h6 className="font-bold text-sm text-slate-800 mb-3">Security Settings</h6>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Default Password</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                value={localSettings.defaultPassword || 'employee_id'}
                onChange={(e) => setLocalSettings({ ...localSettings, defaultPassword: e.target.value })}
              >
                <option value="employee_id">Employee ID (Basic)</option>
                <option value="dob">Date of Birth (Medium)</option>
                <option value="custom">Custom (Strong)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Retention Period (months)</label>
              <input
                type="number"
                min="1"
                max="60"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={localSettings.retentionPeriod || 12}
                onChange={(e) => setLocalSettings({ ...localSettings, retentionPeriod: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Revision Days</label>
              <input
                type="number"
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={localSettings.revisionDays || 7}
                onChange={(e) => setLocalSettings({ ...localSettings, revisionDays: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h6 className="font-bold text-sm text-slate-800 mb-3">Notification Settings</h6>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="autoSend"
                checked={localNotifications.autoSend || false}
                onChange={handleNotificationChange}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Auto-send on generation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="ccHR"
                checked={localNotifications.ccHR || false}
                onChange={handleNotificationChange}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">CC HR Department</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="bccAccounts"
                checked={localNotifications.bccAccounts || false}
                onChange={handleNotificationChange}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">BCC Accounts Department</span>
            </label>
            <div className="mt-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Auto-send Time</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={localNotifications.sendTime || '09:00'}
                onChange={(e) => setLocalNotifications({ ...localNotifications, sendTime: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <h6 className="font-bold text-sm text-slate-800 mb-3">Additional Settings</h6>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="allowRevisions"
                checked={localSettings.allowRevisions || false}
                onChange={(e) => setLocalSettings({ ...localSettings, allowRevisions: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Allow salary slip revisions</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="sms"
                checked={localNotifications.sms || false}
                onChange={handleNotificationChange}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">SMS notifications</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="portal"
                checked={localNotifications.portal || false}
                onChange={handleNotificationChange}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Portal access</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        {mode === 'bank' || mode === 'payment' ? renderBankSettings() :
         mode === 'integration' ? renderIntegrationSettings() :
         renderSalarySettings()}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;