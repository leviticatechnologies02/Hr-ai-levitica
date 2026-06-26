import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const VersionModal = ({ isOpen, onClose, versions, structures, onExport }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Version History" size="lg">
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
              <tr>
                <th className="p-3 text-left min-w-[80px]">Version</th>
                <th className="p-3 text-left min-w-[150px]">Structure</th>
                <th className="p-3 text-left min-w-[200px]">Changes</th>
                <th className="p-3 text-left min-w-[100px]">Date</th>
                <th className="p-3 text-left min-w-[120px]">Changed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {versions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    <Icon icon="heroicons:clock" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">No version history found</p>
                  </td>
                </tr>
              ) : (
                versions.map((version) => {
                  const structure = structures.find(s => s.id === version.structureId);
                  return (
                    <tr key={version.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {version.version}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{structure?.name || 'Unknown'}</td>
                      <td className="p-3 text-slate-600">{version.changes}</td>
                      <td className="p-3 text-slate-500">{version.date}</td>
                      <td className="p-3 text-slate-600">{version.changedBy}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            onClick={onExport}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export History
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VersionModal;