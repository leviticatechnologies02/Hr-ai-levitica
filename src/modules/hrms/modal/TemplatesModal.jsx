import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const TemplatesModal = ({ isOpen, onClose, templates, onDownload, getFileIcon }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Document Templates Library" size="lg">
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold text-slate-600">Template Name</th>
                <th className="p-3 font-semibold text-slate-600">Category</th>
                <th className="p-3 font-semibold text-slate-600">File Type</th>
                <th className="p-3 font-semibold text-slate-600">Size</th>
                <th className="p-3 font-semibold text-slate-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.map((template) => (
                <tr key={template.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Icon icon={getFileIcon(template.fileType)} className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-slate-800">{template.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {template.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{template.fileType.toUpperCase()}</td>
                  <td className="p-3 text-slate-600">{template.size}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onDownload(template)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition flex items-center gap-1 mx-auto"
                    >
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

export default TemplatesModal;