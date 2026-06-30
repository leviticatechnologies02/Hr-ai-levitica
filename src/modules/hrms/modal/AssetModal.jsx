import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const AssetModal = ({ isOpen, onClose, onSubmit, asset = null }) => {
  const [formData, setFormData] = useState({
    assetName: '',
    category: 'Laptop',
    make: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    depreciationRate: 15,
    condition: 'New',
    location: '',
    department: 'IT',
    warrantyUntil: ''
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        assetName: asset.assetName || '',
        category: asset.category || 'Laptop',
        make: asset.make || '',
        model: asset.model || '',
        serialNumber: asset.serialNumber || '',
        purchaseDate: asset.purchaseDate || '',
        purchasePrice: asset.purchasePrice ? String(asset.purchasePrice).replace(/[^0-9.]/g, '') : '',
        depreciationRate: asset.depreciationRate ? parseFloat(String(asset.depreciationRate).replace(/[^0-9.]/g, '')) : 15,
        condition: asset.condition || 'New',
        location: asset.location || '',
        department: asset.department || 'IT',
        warrantyUntil: asset.warrantyUntil || ''
      });
    } else {
      setFormData({
        assetName: '',
        category: 'Laptop',
        make: '',
        model: '',
        serialNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        purchasePrice: '',
        depreciationRate: 15,
        condition: 'New',
        location: '',
        department: 'IT',
        warrantyUntil: ''
      });
    }
  }, [asset, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string inputs to proper types and map to backend snake_case payload
    const payload = {
      asset_name: formData.assetName,
      category: formData.category,
      make: formData.make,
      model: formData.model,
      serial_number: formData.serialNumber,
      purchase_date: formData.purchaseDate,
      purchase_price: parseFloat(formData.purchasePrice) || 0,
      depreciation_rate: parseFloat(formData.depreciationRate) || 15,
      condition: formData.condition,
      location: formData.location,
      department: formData.department,
      warranty_until: formData.warrantyUntil || null
    };

    // If editing, include the ID for the API update call
    if (asset && asset.id) {
      payload.id = asset.id;
    }

    onSubmit(payload);
  };

  const categories = [
    'Laptop', 'Desktop', 'Mobile', 'Tablet', 'Monitor', 'Printer', 
    'Scanner', 'Server', 'Network', 'Accessories', 'Furniture', 'Vehicle', 'Other'
  ];

  const conditions = ['Brand New', 'Excellent', 'Good', 'Fair', 'Poor', 'Damaged', 'Beyond Repair'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Design', 'Product', 'Support'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={asset ? "Edit Asset" : "Add New Asset"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
          {/* Asset Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Asset Details</h4>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name *</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.assetName}
                onChange={(e) => setFormData({...formData, assetName: e.target.value})}
                placeholder="e.g., MacBook Pro 16"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Condition *</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                >
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Make / Brand</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.make}
                  onChange={(e) => setFormData({...formData, make: e.target.value})}
                  placeholder="e.g., Apple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="e.g., M2 Max"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number *</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                placeholder="SN-XXXXX-YYYYY"
              />
            </div>
          </div>

          {/* Financial & Location */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Financial & Location</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date *</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Warranty Until</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.warrantyUntil}
                  onChange={(e) => setFormData({...formData, warrantyUntil: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price (₹) *</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Depreciation Rate (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.depreciationRate}
                  onChange={(e) => setFormData({...formData, depreciationRate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., HQ - Floor 2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            {asset ? 'Update Asset' : 'Save Asset'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssetModal;
