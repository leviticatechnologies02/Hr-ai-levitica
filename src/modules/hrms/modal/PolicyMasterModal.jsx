import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const PolicyModal = ({ isOpen, onClose, policyDocuments }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Policy Documents & Handbooks" size="lg">
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold text-slate-600">Document Name</th>
                <th className="p-3 font-semibold text-slate-600">Category</th>
                <th className="p-3 font-semibold text-slate-600">Upload Date</th>
                <th className="p-3 font-semibold text-slate-600">Size</th>
                <th className="p-3 font-semibold text-slate-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policyDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-700">{doc.name}</td>
                  <td className="p-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{doc.uploadDate}</td>
                  <td className="p-3 text-slate-500">{doc.size}</td>
                  <td className="p-3 text-center">
                    <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition flex items-center gap-1 mx-auto">
                      <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PolicyModal;