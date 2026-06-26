import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const SimulationModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    baseCTC: 1000000,
    variablePercent: 20,
    pfPercent: 12,
    taxDeduction: 50000,
    structureId: ''
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        baseCTC: 1000000,
        variablePercent: 20,
        pfPercent: 12,
        taxDeduction: 50000,
        structureId: ''
      });
      setResult(null);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.baseCTC) {
      alert('Please enter Base CTC');
      return;
    }

    const base = parseFloat(formData.baseCTC);
    const basic = base * 0.4;
    const hra = basic * 0.5;
    const conveyance = 19200;
    const specialAllowance = base * 0.2 - conveyance;
    const pf = basic * (parseFloat(formData.pfPercent) / 100);
    const gross = basic + hra + conveyance + specialAllowance;
    const employeeDeductions = pf + parseFloat(formData.taxDeduction);
    const takeHome = gross - employeeDeductions;

    setResult({
      basic,
      hra,
      conveyance,
      specialAllowance,
      pf,
      taxDeduction: parseFloat(formData.taxDeduction),
      gross,
      employeeDeductions,
      takeHome,
      annualTakeHome: takeHome * 12,
      ctcVsTakeHome: ((takeHome * 12 / base) * 100).toFixed(1)
    });

    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What-If Salary Simulation" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Base CTC (₹) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.baseCTC}
              onChange={(e) => setFormData({ ...formData, baseCTC: e.target.value })}
              placeholder="1000000"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Variable Pay (%)</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.variablePercent}
              onChange={(e) => setFormData({ ...formData, variablePercent: e.target.value })}
              placeholder="20"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">PF Contribution (%)</label>
            <input
              type="number"
              step="0.1"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.pfPercent}
              onChange={(e) => setFormData({ ...formData, pfPercent: e.target.value })}
              placeholder="12"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Tax Deduction (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.taxDeduction}
              onChange={(e) => setFormData({ ...formData, taxDeduction: e.target.value })}
              placeholder="50000"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
        >
          <Icon icon="heroicons:calculator" className="w-4 h-4" />
          Run Simulation
        </button>

        {result && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Simulation Results</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.basic)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">HRA</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.hra)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Conveyance</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.conveyance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Special Allowance</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.specialAllowance)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">PF Deduction</span>
                  <span className="font-semibold text-rose-600">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.pf)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax Deduction</span>
                  <span className="font-semibold text-rose-600">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.taxDeduction)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-700">Gross Salary</span>
                    <span className="text-blue-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.gross)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-700">Monthly Take-Home</span>
                  <span className="text-emerald-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.takeHome)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-700">Annual Take-Home</span>
                  <span className="text-emerald-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.annualTakeHome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">CTC vs Take-Home</span>
                  <span className="font-semibold text-purple-600">{result.ctcVsTakeHome}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SimulationModal;