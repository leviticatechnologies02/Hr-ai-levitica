import React from 'react';
import Modal from '../../../shared/components/Modal';

const MaterialDistributionModal = ({
  showMaterialDistributionModal,
  setShowMaterialDistributionModal,
  materialForm,
  setMaterialForm,
  inductionPrograms,
  handleDistributeMaterial
}) => {
  return (
    <Modal
      isOpen={showMaterialDistributionModal}
      onClose={() => setShowMaterialDistributionModal(false)}
      title="Distribute Materials"
      size="lg"
    >
      <div className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Select Program <span className="text-rose-500">*</span></label>
          <select 
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
            value={materialForm.programId || ''}
            onChange={(e) => setMaterialForm({
              ...materialForm, 
              programId: parseInt(e.target.value)
            })}
          >
            <option value="">Choose program...</option>
            {inductionPrograms.map(program => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Material Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={materialForm.materialName}
              onChange={(e) => setMaterialForm({...materialForm, materialName: e.target.value})}
              placeholder="e.g., Company Handbook"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Material Type <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={materialForm.materialType}
              onChange={(e) => setMaterialForm({...materialForm, materialType: e.target.value})}
            >
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="presentation">Presentation</option>
              <option value="archive">Archive</option>
              <option value="link">Link</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            rows="3"
            value={materialForm.description}
            onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})}
            placeholder="Material description"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Upload File</label>
          <input
            type="file"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setMaterialForm({...materialForm, file: e.target.files[0]})}
          />
          <span className="text-xs text-slate-400 block mt-1">Supported formats: PDF, DOCX, PPTX, ZIP, MP4</span>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowMaterialDistributionModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-550 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            onClick={handleDistributeMaterial}
            disabled={!materialForm.programId || !materialForm.materialName}
          >
            Distribute Material
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MaterialDistributionModal;
