import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const LeaveCampaignModal = ({
  isOpen,
  onClose,
  campaignForm,
  setCampaignForm,
  handleCreateCampaign,
  departments
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Leave Planning Campaign"
      size="md"
    >
      <div className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Campaign Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={campaignForm.name}
            onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
            placeholder="Enter campaign name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Period <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={campaignForm.period}
              onChange={(e) => setCampaignForm({ ...campaignForm, period: e.target.value })}
            >
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Target Department</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={campaignForm.targetDepartment}
              onChange={(e) => setCampaignForm({ ...campaignForm, targetDepartment: e.target.value })}
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Start Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={campaignForm.startDate}
              onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              End Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={campaignForm.endDate}
              onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-y"
            rows="3"
            value={campaignForm.message}
            onChange={(e) => setCampaignForm({ ...campaignForm, message: e.target.value })}
            placeholder="Campaign message to employees..."
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10"
            onClick={handleCreateCampaign}
          >
            <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveCampaignModal;