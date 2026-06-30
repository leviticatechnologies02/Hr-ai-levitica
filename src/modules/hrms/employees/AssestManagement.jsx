import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assetsAPI } from "../../../shared/utils/api";
import StatCard from '../../../shared/components/StatCard';
import AssetModal from '../modal/AssetModal';
import BulkV2Modal from '../modal/BulkV2Modal';
import DeleteModal from '../modal/DeleteModal';
import { generateAssetInventoryPDF, generateEmployeeWisePDF, generateReturnsPDF } from '../../../shared/services/AssetPDFGenerators';

const AssestManagement = () => {
  const [activeSection, setActiveSection] = useState('master');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssets, setSelectedAssets] = useState([]);

  const [modalState, setModalState] = useState({ type: null, isOpen: false, data: null });
  const openModal = (type, data = null) => setModalState({ type, isOpen: true, data });
  const closeModal = () => setModalState({ type: null, isOpen: false, data: null });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [assetMaster, setAssetMaster] = useState([]);
  const [assetAllocations, setAssetAllocations] = useState([]);
  const [assetReturns, setAssetReturns] = useState([]);

  const showNotification = (message, type = 'success') => toast[type](message, { position: 'top-right' });

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    const num = typeof amount === "string" ? parseInt(amount.replace(/[^0-9]/g, "")) : amount;
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(num);
  };

  const transformAsset = useCallback((a, allocations = [], maintenances = []) => {
    const statusMap = { AVAILABLE: "Available", ALLOCATED: "Allocated", UNDER_REPAIR: "Under Repair", RETIRED: "Retired", LOST: "Lost", DISPOSED: "Disposed" };
    const status = statusMap[a.status] || a.status;
    const assetAllocs = allocations.filter((al) => al.asset_id === a.id).sort((x, y) => new Date(y.allocated_at) - new Date(x.allocated_at));
    const activeAlloc = status === "Allocated" ? assetAllocs[0] : null;
    const purchasePrice = typeof a.purchase_price === "number" ? a.purchase_price : parseFloat(String(a.purchase_price).replace(/[^0-9.]/g, "")) || 0;
    const depRate = a.depreciation_rate || 0;
    const yearsUsed = (new Date() - new Date(a.purchase_date)) / (365.25 * 24 * 60 * 60 * 1000);
    const currentVal = Math.max(0, purchasePrice * (1 - (depRate / 100) * yearsUsed));
    return {
      id: a.id,
      assetId: `AST${String(a.id).padStart(3, "0")}`,
      assetTag: `${(a.category || "").substring(0, 3).toUpperCase()}-${String(a.purchase_date || "").substring(0, 4)}-${a.id}`,
      assetName: a.asset_name,
      category: a.category,
      make: a.make,
      model: a.model,
      serialNumber: a.serial_number,
      purchaseDate: a.purchase_date,
      purchasePrice: `₹${new Intl.NumberFormat("en-IN").format(purchasePrice)}`,
      currentValue: `₹${new Intl.NumberFormat("en-IN").format(Math.round(currentVal))}`,
      depreciationRate: `${depRate}%`,
      condition: a.condition,
      location: a.location,
      department: a.department,
      status,
      allocatedTo: activeAlloc ? `${activeAlloc.employee_id} - ${activeAlloc.employee_name}` : null,
      allocationDate: activeAlloc ? activeAlloc.allocated_at?.split("T")[0] : null,
    };
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [assetsRes, allocsRes, returnsRes] = await Promise.allSettled([
        assetsAPI.listAssets(), assetsAPI.listAllocations(), assetsAPI.listReturns()
      ]);
      const assets = assetsRes.status === 'fulfilled' ? assetsRes.value : [];
      const allocations = allocsRes.status === 'fulfilled' ? allocsRes.value : [];
      const returns = returnsRes.status === 'fulfilled' ? returnsRes.value : [];

      setAssetMaster(assets.map(a => transformAsset(a, allocations, [])));
      const returnedSet = new Set(returns.map(r => String(r.allocation_id)));
      setAssetAllocations(allocations.map(al => {
        const asset = assets.find(a => a.id === al.asset_id);
        return {
          id: al.id, allocationId: `ALLOC-${al.id}`, assetId: asset ? `AST${String(al.asset_id).padStart(3, "0")}` : al.asset_id,
          assetName: asset?.asset_name, employeeName: al.employee_name, department: al.department,
          allocationDate: al.allocated_at?.split('T')[0], status: returnedSet.has(String(al.id)) ? "Returned" : "Active"
        };
      }));
      setAssetReturns(returns.map(r => {
        const alloc = allocations.find(a => String(a.id) === String(r.allocation_id));
        const asset = alloc ? assets.find(a => a.id === alloc.asset_id) : null;
        return {
          id: r.id, returnId: `RET-${r.id}`, assetId: asset ? `AST${String(alloc.asset_id).padStart(3, "0")}` : null,
          assetName: asset?.asset_name, employeeName: alloc?.employee_name, returnDate: r.returned_at?.split('T')[0],
          returnReason: r.return_reason, conditionAtReturn: r.condition_at_return, penaltyAmount: r.penalty || '₹0'
        };
      }));
    } catch (err) {
      setError(err?.message || "Failed to load asset data");
    } finally { setLoading(false); }
  }, [transformAsset]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statistics = useMemo(() => ({
    totalAssets: assetMaster.length,
    allocatedAssets: assetMaster.filter(a => a.status === "Allocated").length,
    availableAssets: assetMaster.filter(a => a.status === "Available").length,
    underRepair: assetMaster.filter(a => a.status === "Under Repair").length,
    totalValue: assetMaster.reduce((sum, a) => sum + parseInt(a.currentValue.replace(/[^0-9]/g, "")), 0),
  }), [assetMaster]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available": return <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">Available</span>;
      case "Allocated": return <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">Allocated</span>;
      case "Under Repair": return <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">Under Repair</span>;
      default: return <span className="px-2 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getConditionBadge = (condition) => {
    if (["New", "Good"].includes(condition)) return <span className="text-emerald-600 font-medium">{condition}</span>;
    if (["Poor", "Damaged"].includes(condition)) return <span className="text-rose-600 font-medium">{condition}</span>;
    return <span className="text-amber-600 font-medium">{condition}</span>;
  };

  const filteredAssets = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return assetMaster.filter(a => a.assetName?.toLowerCase().includes(s) || a.assetTag?.toLowerCase().includes(s));
  }, [assetMaster, searchTerm]);

  const handleDeleteAsset = async (assetId) => {
    try {
      await assetsAPI.deleteAsset(assetId);
      showNotification('Asset deleted successfully');
      fetchData();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Icon icon="heroicons:cube" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
            <p className="text-sm text-slate-500">Lifecycle management from allocation to return</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition" onClick={() => openModal('asset')}>
            <Icon icon="heroicons:plus" className="w-4 h-4" /> Add Asset
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition" onClick={() => openModal('allocate')}>
            <Icon icon="heroicons:truck" className="w-4 h-4" /> Allocate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Value" value={formatCurrency(statistics.totalValue)} subtitle={`${statistics.totalAssets} assets tracking`} icon="heroicons:currency-rupee" color="green" />
        <StatCard title="Utilization" value={`${statistics.totalAssets ? Math.round((statistics.allocatedAssets / statistics.totalAssets) * 100) : 0}%`} subtitle={`${statistics.allocatedAssets} allocated`} icon="heroicons:chart-pie" color="blue" />
        <StatCard title="Available" value={statistics.availableAssets} subtitle="Ready to deploy" icon="heroicons:check-badge" color="purple" />
        <StatCard title="Under Repair" value={statistics.underRepair} subtitle="Requires attention" icon="heroicons:wrench-screwdriver" color="orange" />
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'master', label: 'Asset Master', icon: 'heroicons:database' },
          { id: 'allocations', label: 'Allocations', icon: 'heroicons:truck' },
          { id: 'returns', label: 'Returns', icon: 'heroicons:archive-box-arrow-down' },
          { id: 'reports', label: 'Reports', icon: 'heroicons:document-chart-bar' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveSection(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeSection === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <Icon icon={tab.icon} className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-6">
        <div className="relative w-full md:w-96">
          <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search assets, serial numbers..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {loading && <div className="p-8 text-center text-slate-500"><Icon icon="heroicons:arrow-path" className="w-8 h-8 animate-spin mx-auto mb-2" /> Loading data...</div>}

      {!loading && activeSection === 'master' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600">Asset Details</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Category</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Serial No.</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Purchase Details</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Current Value</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{asset.assetName}</div>
                      <div className="text-xs text-slate-500">{asset.assetTag}</div>
                    </td>
                    <td className="px-4 py-3">{asset.category}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{asset.serialNumber}</td>
                    <td className="px-4 py-3 text-xs">
                      <div>Date: {asset.purchaseDate}</div>
                      <div>Price: {asset.purchasePrice}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{asset.currentValue}</td>
                    <td className="px-4 py-3">{getStatusBadge(asset.status)}<div className="mt-1 text-xs">{getConditionBadge(asset.condition)}</div></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg" title="Edit" onClick={() => openModal('asset', asset)}><Icon icon="heroicons:pencil-square" /></button>
                        <button className="p-1.5 bg-rose-50 text-rose-600 rounded-lg" title="Delete" onClick={() => openModal('delete', asset)}><Icon icon="heroicons:trash" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && activeSection === 'allocations' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Allocation ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Asset</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Employee</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assetAllocations.map(al => (
                <tr key={al.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{al.allocationId}</td>
                  <td className="px-4 py-3 font-medium">{al.assetName} <span className="text-xs text-slate-500 block">{al.assetId}</span></td>
                  <td className="px-4 py-3">{al.employeeName} <span className="text-xs text-slate-500 block">{al.department}</span></td>
                  <td className="px-4 py-3">{al.allocationDate}</td>
                  <td className="px-4 py-3">{al.status === 'Active' ? <span className="text-emerald-600 font-medium">Active</span> : <span className="text-slate-500">Returned</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeSection === 'returns' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Return ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Asset</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Employee</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Penalty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assetReturns.map(rt => (
                <tr key={rt.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{rt.returnId}</td>
                  <td className="px-4 py-3 font-medium">{rt.assetName}</td>
                  <td className="px-4 py-3">{rt.employeeName}</td>
                  <td className="px-4 py-3">{rt.returnDate}</td>
                  <td className="px-4 py-3 text-rose-600 font-medium">{rt.penaltyAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeSection === 'reports' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
            <Icon icon="heroicons:document-text" className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <h4 className="font-semibold mb-2">Inventory Report</h4>
            <p className="text-sm text-slate-500 mb-4">Complete asset master PDF.</p>
            <button className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg w-full" onClick={() => generateAssetInventoryPDF(assetMaster)}>Download PDF</button>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
            <Icon icon="heroicons:users" className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
            <h4 className="font-semibold mb-2">Allocation Report</h4>
            <p className="text-sm text-slate-500 mb-4">Employee-wise allocations.</p>
            <button className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg w-full" onClick={() => generateEmployeeWisePDF(assetAllocations)}>Download PDF</button>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
            <Icon icon="heroicons:archive-box" className="w-12 h-12 mx-auto text-amber-500 mb-4" />
            <h4 className="font-semibold mb-2">Returns Report</h4>
            <p className="text-sm text-slate-500 mb-4">Detailed returns & penalties.</p>
            <button className="px-4 py-2 bg-amber-50 text-amber-700 font-semibold rounded-lg w-full" onClick={() => generateReturnsPDF(assetReturns)}>Download PDF</button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AssetModal isOpen={modalState.isOpen && modalState.type === 'asset'} onClose={closeModal} onSubmit={async (data) => {
        try {
          if (data.id) await assetsAPI.updateAsset(data.id, data);
          else await assetsAPI.createAsset(data);
          showNotification('Asset saved successfully!');
          fetchData(); closeModal();
        } catch (e) { alert(e.message); }
      }} asset={modalState.data} />

      <DeleteModal isOpen={modalState.isOpen && modalState.type === 'delete'} onClose={closeModal} onConfirm={() => { handleDeleteAsset(modalState.data.id); closeModal(); }} itemName={`Asset ${modalState.data?.assetTag}`} />

      <ToastContainer />
    </div>
  );
};

export default AssestManagement;