import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const SettingsModal = ({ isOpen, onClose, onSave, settings, notificationSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [localNotifications, setLocalNotifications] = useState(notificationSettings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
      setLocalNotifications(notificationSettings);
    }
  }, [isOpen, settings, notificationSettings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localSettings, localNotifications);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Advanced Settings" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
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
                  checked={localNotifications.autoSend || false}
                  onChange={(e) => setLocalNotifications({ ...localNotifications, autoSend: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Auto-send on generation</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localNotifications.ccHR || false}
                  onChange={(e) => setLocalNotifications({ ...localNotifications, ccHR: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">CC HR Department</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localNotifications.bccAccounts || false}
                  onChange={(e) => setLocalNotifications({ ...localNotifications, bccAccounts: e.target.checked })}
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
                  checked={localSettings.allowRevisions || false}
                  onChange={(e) => setLocalSettings({ ...localSettings, allowRevisions: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Allow salary slip revisions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localNotifications.sms || false}
                  onChange={(e) => setLocalNotifications({ ...localNotifications, sms: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">SMS notifications</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localNotifications.portal || false}
                  onChange={(e) => setLocalNotifications({ ...localNotifications, portal: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Portal access</span>
              </label>
            </div>
          </div>
        </div>

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