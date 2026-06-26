import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const StructureModal = ({ isOpen, onClose, onSubmit, structure, structures }) => {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    level: '',
    category: 'permanent',
    employeeType: 'regular',
    ctc: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    description: '',
    status: 'draft',
    department: [],
    location: [],
    minCTC: '',
    maxCTC: '',
    incrementRange: '',
    componentGroups: {
      earnings: [],
      deductions: [],
      employerContributions: [],
      reimbursements: []
    },
    standardDeductions: {
      pf: { enabled: true, employee: 12, employer: 12 },
      esi: { enabled: false, employee: 0.75, employer: 3.25 },
      professionalTax: { enabled: true, amount: 200 },
      tds: { enabled: false, slab: 'as_per_income' }
    }
  });

  const isEditing = !!structure;

  useEffect(() => {
    if (isOpen && structure) {
      setFormData({
        name: structure.name || '',
        grade: structure.grade || '',
        level: structure.level || '',
        category: structure.category || 'permanent',
        employeeType: structure.employeeType || 'regular',
        ctc: structure.ctc || '',
        effectiveDate: structure.effectiveDate || new Date().toISOString().split('T')[0],
        expiryDate: structure.expiryDate || '',
        description: structure.description || '',
        status: structure.status || 'draft',
        department: structure.department || [],
        location: structure.location || [],
        minCTC: structure.minCTC || '',
        maxCTC: structure.maxCTC || '',
        incrementRange: structure.incrementRange || '',
        componentGroups: structure.componentGroups || {
          earnings: [],
          deductions: [],
          employerContributions: [],
          reimbursements: []
        },
        standardDeductions: structure.standardDeductions || {
          pf: { enabled: true, employee: 12, employer: 12 },
          esi: { enabled: false, employee: 0.75, employer: 3.25 },
          professionalTax: { enabled: true, amount: 200 },
          tds: { enabled: false, slab: 'as_per_income' }
        }
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        grade: '',
        level: '',
        category: 'permanent',
        employeeType: 'regular',
        ctc: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        description: '',
        status: 'draft',
        department: [],
        location: [],
        minCTC: '',
        maxCTC: '',
        incrementRange: '',
        componentGroups: {
          earnings: [],
          deductions: [],
          employerContributions: [],
          reimbursements: []
        },
        standardDeductions: {
          pf: { enabled: true, employee: 12, employer: 12 },
          esi: { enabled: false, employee: 0.75, employer: 3.25 },
          professionalTax: { enabled: true, amount: 200 },
          tds: { enabled: false, slab: 'as_per_income' }
        }
      });
    }
  }, [isOpen, structure]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.grade || !formData.ctc) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit({ ...formData, id: structure?.id });
  };

  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'HR', 'IT'];
  const locations = ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Chennai', 'Remote', 'International'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Structure' : 'Create New Structure'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Structure Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Grade B - Senior"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Grade <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              required
            >
              <option value="">Select Grade</option>
              <option value="A">Grade A (Executive)</option>
              <option value="B">Grade B (Senior)</option>
              <option value="C">Grade C (Junior)</option>
              <option value="D">Grade D (Entry)</option>
              <option value="CT">Contract - Technical</option>
              <option value="IN">Intern</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Level</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            >
              <option value="">Select Level</option>
              <option value="L6">L6 (Senior Management)</option>
              <option value="L5">L5 (Management)</option>
              <option value="L4">L4 (Senior)</option>
              <option value="L3">L3 (Junior)</option>
              <option value="L2">L2 (Entry)</option>
              <option value="L1">L1 (Intern/Trainee)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Category <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="permanent">Permanent</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Employee Type</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.employeeType}
              onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}
            >
              <option value="regular">Regular</option>
              <option value="contractor">Contractor</option>
              <option value="intern">Intern</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Status</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Annual CTC (₹) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.ctc}
              onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
              placeholder="e.g., 1500000"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Min CTC (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.minCTC}
              onChange={(e) => setFormData({ ...formData, minCTC: e.target.value })}
              placeholder="e.g., 1200000"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Max CTC (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.maxCTC}
              onChange={(e) => setFormData({ ...formData, maxCTC: e.target.value })}
              placeholder="e.g., 1800000"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Increment Range (%)</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.incrementRange}
              onChange={(e) => setFormData({ ...formData, incrementRange: e.target.value })}
              placeholder="e.g., 8-12%"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Effective Date <span className="text-rose-500">*</span></label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.effectiveDate}
              onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Departments</label>
            <div className="space-y-1 max-h-[120px] overflow-y-auto border border-slate-200 rounded-xl p-3">
              {departments.map((dept) => (
                <label key={dept} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.department.includes(dept)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, department: [...formData.department, dept] });
                      } else {
                        setFormData({ ...formData, department: formData.department.filter(d => d !== dept) });
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {dept}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Locations</label>
            <div className="space-y-1 max-h-[120px] overflow-y-auto border border-slate-200 rounded-xl p-3">
              {locations.map((loc) => (
                <label key={loc} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.location.includes(loc)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, location: [...formData.location, loc] });
                      } else {
                        setFormData({ ...formData, location: formData.location.filter(l => l !== loc) });
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {loc}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Standard Deductions</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.standardDeductions.pf.enabled}
                    onChange={(e) => setFormData({
                      ...formData,
                      standardDeductions: {
                        ...formData.standardDeductions,
                        pf: { ...formData.standardDeductions.pf, enabled: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  PF
                </label>
              </div>
              {formData.standardDeductions.pf.enabled && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Employee %</label>
                    <input
                      type="number"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={formData.standardDeductions.pf.employee}
                      onChange={(e) => setFormData({
                        ...formData,
                        standardDeductions: {
                          ...formData.standardDeductions,
                          pf: { ...formData.standardDeductions.pf, employee: parseFloat(e.target.value) || 0 }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Employer %</label>
                    <input
                      type="number"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={formData.standardDeductions.pf.employer}
                      onChange={(e) => setFormData({
                        ...formData,
                        standardDeductions: {
                          ...formData.standardDeductions,
                          pf: { ...formData.standardDeductions.pf, employer: parseFloat(e.target.value) || 0 }
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.standardDeductions.esi.enabled}
                    onChange={(e) => setFormData({
                      ...formData,
                      standardDeductions: {
                        ...formData.standardDeductions,
                        esi: { ...formData.standardDeductions.esi, enabled: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  ESI
                </label>
              </div>
              {formData.standardDeductions.esi.enabled && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Employee %</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={formData.standardDeductions.esi.employee}
                      onChange={(e) => setFormData({
                        ...formData,
                        standardDeductions: {
                          ...formData.standardDeductions,
                          esi: { ...formData.standardDeductions.esi, employee: parseFloat(e.target.value) || 0 }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Employer %</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={formData.standardDeductions.esi.employer}
                      onChange={(e) => setFormData({
                        ...formData,
                        standardDeductions: {
                          ...formData.standardDeductions,
                          esi: { ...formData.standardDeductions.esi, employer: parseFloat(e.target.value) || 0 }
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.standardDeductions.professionalTax.enabled}
                    onChange={(e) => setFormData({
                      ...formData,
                      standardDeductions: {
                        ...formData.standardDeductions,
                        professionalTax: { ...formData.standardDeductions.professionalTax, enabled: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Professional Tax
                </label>
              </div>
              {formData.standardDeductions.professionalTax.enabled && (
                <div>
                  <label className="text-[10px] text-slate-500">Monthly Amount (₹)</label>
                  <input
                    type="number"
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.standardDeductions.professionalTax.amount}
                    onChange={(e) => setFormData({
                      ...formData,
                      standardDeductions: {
                        ...formData.standardDeductions,
                        professionalTax: { ...formData.standardDeductions.professionalTax, amount: parseFloat(e.target.value) || 0 }
                      }
                    })}
                  />
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.standardDeductions.tds.enabled}
                    onChange={(e) => setFormData({
                      ...formData,
                      standardDeductions: {
                        ...formData.standardDeductions,
                        tds: { ...formData.standardDeductions.tds, enabled: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  TDS
                </label>
              </div>
              {formData.standardDeductions.tds.enabled && (
                <div>
                  <label className="text-[10px] text-slate-500">TDS Slab</label>
                  <select
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.standardDeductions.tds.slab}
                    onChange={(e) => setFormData({
                      ...formData,
                      standardDeductions: {
                        ...formData.standardDeductions,
                        tds: { ...formData.standardDeductions.tds, slab: e.target.value }
                      }
                    })}
                  >
                    <option value="as_per_income">As per Income Tax</option>
                    <option value="contractor_10%">Contractor 10%</option>
                    <option value="fixed_amount">Fixed Amount</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Description</label>
          <textarea
            rows="2"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe this salary structure..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Icon icon={isEditing ? 'heroicons:pencil-square' : 'heroicons:plus'} className="w-4 h-4" />
            {isEditing ? 'Update Structure' : 'Create Structure'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StructureModal;