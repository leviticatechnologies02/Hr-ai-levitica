import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ReportBuilderModal = ({ isOpen, onClose, onSave, availableColumns, availableFilters }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Payroll',
    dataSource: 'payroll',
    selectedColumns: [],
    selectedFilters: [],
    format: ['pdf', 'excel'],
    schedule: 'none',
    dashboardWidget: false
  });

  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleNext = () => setStep(prev => Math.min(4, prev + 1));
  const handlePrev = () => setStep(prev => Math.max(1, prev - 1));

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Report name is required');
      return;
    }
    onSave({ ...formData, selectedColumns, selectedFilters });
  };

  const toggleColumn = (columnId) => {
    setSelectedColumns(prev =>
      prev.includes(columnId) ? prev.filter(id => id !== columnId) : [...prev, columnId]
    );
  };

  const toggleFilter = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Custom Report Builder" size="xl">
      <div className="space-y-6 p-2">
        <div className="flex gap-4">
          <div className="w-1/4">
            <div className="space-y-2">
              {[
                { step: 1, label: 'Report Details', icon: 'heroicons:document-text' },
                { step: 2, label: 'Select Columns', icon: 'heroicons:table-cells' },
                { step: 3, label: 'Filters & Sorting', icon: 'heroicons:funnel' },
                { step: 4, label: 'Format & Schedule', icon: 'heroicons:cog' }
              ].map((item) => (
                <button
                  key={item.step}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    step === item.step
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                  onClick={() => setStep(item.step)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === item.step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon icon={item.icon} className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold">{item.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 border border-slate-200 rounded-xl p-6">
            {step === 1 && (
              <div className="space-y-4">
                <h6 className="font-bold text-slate-800 flex items-center gap-2">
                  <Icon icon="heroicons:document-text" className="w-5 h-5 text-blue-500" />
                  Report Details
                </h6>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Report Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter report name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this report"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Payroll">Payroll</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Data Source</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                      value={formData.dataSource}
                      onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                    >
                      <option value="payroll">Payroll Data</option>
                      <option value="employee">Employee Master</option>
                      <option value="attendance">Attendance Records</option>
                      <option value="compliance">Compliance Data</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h6 className="font-bold text-slate-800 flex items-center gap-2">
                  <Icon icon="heroicons:table-cells" className="w-5 h-5 text-blue-500" />
                  Select Data Columns
                </h6>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-slate-500">Select columns to include in your report</span>
                  <span className="text-sm font-semibold text-blue-600">{selectedColumns.length} column(s) selected</span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                  {availableColumns.map((col) => (
                    <div
                      key={col.id}
                      className={`p-3 border rounded-xl cursor-pointer transition ${
                        selectedColumns.includes(col.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                      onClick={() => toggleColumn(col.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedColumns.includes(col.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                        }`}>
                          {selectedColumns.includes(col.id) && (
                            <Icon icon="heroicons:check" className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-slate-800">{col.name}</div>
                          <div className="text-xs text-slate-500">{col.category} • {col.type}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h6 className="font-bold text-slate-800 flex items-center gap-2">
                  <Icon icon="heroicons:funnel" className="w-5 h-5 text-blue-500" />
                  Apply Filters
                </h6>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                    <div className="flex flex-wrap gap-2">
                      {['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT'].map(dept => (
                        <button
                          key={dept}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                            selectedFilters.includes(dept)
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          onClick={() => toggleFilter(dept)}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Date Range</label>
                      <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Date Range</label>
                      <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h6 className="font-bold text-slate-800 flex items-center gap-2">
                  <Icon icon="heroicons:cog" className="w-5 h-5 text-blue-500" />
                  Format & Schedule
                </h6>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Export Format</label>
                  <div className="flex gap-3">
                    {['pdf', 'excel', 'csv'].map((fmt) => (
                      <div
                        key={fmt}
                        className={`flex-1 p-3 border rounded-xl cursor-pointer transition text-center ${
                          formData.format.includes(fmt)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                        onClick={() => {
                          const formats = formData.format.includes(fmt)
                            ? formData.format.filter(f => f !== fmt)
                            : [...formData.format, fmt];
                          setFormData({ ...formData, format: formats });
                        }}
                      >
                        <Icon icon={fmt === 'pdf' ? 'heroicons:document-text' : fmt === 'excel' ? 'heroicons:table-cells' : 'heroicons:document'} className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-sm font-medium capitalize">{fmt}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Schedule Frequency</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  >
                    <option value="none">Don't schedule</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.dashboardWidget}
                    onChange={(e) => setFormData({ ...formData, dashboardWidget: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Add as dashboard widget</span>
                </label>
              </div>
            )}

            <div className="flex justify-between mt-6 pt-4 border-t border-slate-200">
              <button
                type="button"
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                onClick={handlePrev}
                disabled={step === 1}
              >
                <Icon icon="heroicons:arrow-left" className="w-4 h-4 inline mr-2" />
                Previous
              </button>
              <div>
                {step < 4 && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                    onClick={handleNext}
                  >
                    Next
                    <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
                  </button>
                )}
                {step === 4 && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
                    onClick={handleSubmit}
                  >
                    <Icon icon="heroicons:check" className="w-4 h-4" />
                    Create Report
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReportBuilderModal;