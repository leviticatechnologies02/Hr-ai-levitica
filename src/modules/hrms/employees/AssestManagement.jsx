// src/components/HRMS/HROperations/AssestManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { assetsAPI } from "../../../shared/utils/api";
import {
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  Edit,
  Package,
  Truck,
  Wrench,
  FileText,
  BarChart3,
  Database,
  ArchiveRestore,
  ShieldCheck,
  TrendingDown,
  Users,
  Calendar,
  Percent as PercentIcon,
  AlertCircle,
  Check,
  Save,
  Info,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Calculator,
  X,
  Laptop,
  Smartphone,
  Monitor,
  Tablet,
  Server,
  Router,
  Headphones,
  Printer as PrinterIcon,
  Scan,
} from "lucide-react";
import { IndianRupee } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { jsPDF } from "jspdf";

// Custom icon components for missing ones
const Chair = (props) => <div {...props}>🪑</div>;
const Car = (props) => <div {...props}>🚗</div>;

const AssestManagement = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // New state variables for action buttons
  const [showViewModal, setShowViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [showAllocationDetails, setShowAllocationDetails] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [showMaintenanceDetails, setShowMaintenanceDetails] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showPolicyDetailsModal, setShowPolicyDetailsModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showReallocateModal, setShowReallocateModal] = useState(false);

  // API state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Asset Master Data (fetched from API)
  const [assetMaster, setAssetMaster] = useState([]);

  // Asset Categories
  const assetCategories = [
    { value: "Laptop", label: "Laptop", icon: <Laptop size={16} /> },
    { value: "Desktop", label: "Desktop", icon: <Monitor size={16} /> },
    { value: "Mobile", label: "Mobile", icon: <Smartphone size={16} /> },
    { value: "Tablet", label: "Tablet", icon: <Tablet size={16} /> },
    { value: "Monitor", label: "Monitor", icon: <Monitor size={16} /> },
    { value: "Printer", label: "Printer", icon: <PrinterIcon size={16} /> },
    { value: "Scanner", label: "Scanner", icon: <Scan size={16} /> },
    { value: "Server", label: "Server", icon: <Server size={16} /> },
    {
      value: "Network",
      label: "Network Equipment",
      icon: <Router size={16} />,
    },
    {
      value: "Accessories",
      label: "Accessories",
      icon: <Headphones size={16} />,
    },
    { value: "Furniture", label: "Furniture", icon: <Chair size={16} /> },
    { value: "Vehicle", label: "Vehicle", icon: <Car size={16} /> },
    { value: "Other", label: "Other", icon: <Package size={16} /> },
  ];

  // Asset Conditions
  const assetConditions = [
    { value: "Brand New", label: "Brand New", color: "success" },
    { value: "Excellent", label: "Excellent", color: "success" },
    { value: "Good", label: "Good", color: "info" },
    { value: "Fair", label: "Fair", color: "warning" },
    { value: "Poor", label: "Poor", color: "warning" },
    { value: "Damaged", label: "Damaged", color: "danger" },
    { value: "Beyond Repair", label: "Beyond Repair", color: "dark" },
  ];

  // Asset Statuses


  // Asset Allocations (fetched from API)
  const [assetAllocations, setAssetAllocations] = useState([]);

  // Asset Returns (fetched from API)
  const [assetReturns, setAssetReturns] = useState([]);

  // Maintenance History (fetched from API)
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);

  // Insurance Policies (from API – same keys as backend: asset_id, insurance_provider, premium_amount, etc.)
  const [insurancePolicies, setInsurancePolicies] = useState([]);

  // Add Insurance Policy form state (snake_case to match backend AssetInsuranceCreate)
  const [insuranceForm, setInsuranceForm] = useState({
    asset_id: "",
    insurance_provider: "",
    policy_number: "",
    coverage_amount: "",
    premium_amount: "",
    coverage_type: "",
    start_date: "",
    end_date: "",
    coverage_details: "",
    deductible: "",
    status: "Active",
  });
  const [insuranceSubmitting, setInsuranceSubmitting] = useState(false);

  // Depreciation Schedule
  const [depreciationSchedule, setDepreciationSchedule] = useState([
    {
      id: 1,
      assetId: "AST001",
      assetName: "Dell Latitude 5440",
      purchasePrice: "₹85,000",
      depreciationRate: "15%",
      depreciationMethod: "Straight Line",
      usefulLife: "3 years",
      currentValue: "₹72,250",
      yearlyDepreciation: "₹12,750",
      accumulatedDepreciation: "₹12,750",
      netBookValue: "₹72,250",
      nextDepreciationDate: "2025-01-15",
      salvageValue: "₹8,500",
    },
    {
      id: 2,
      assetId: "AST002",
      assetName: "HP EliteDesk 800 G5",
      purchasePrice: "₹65,000",
      depreciationRate: "20%",
      depreciationMethod: "Straight Line",
      usefulLife: "3 years",
      currentValue: "₹48,750",
      yearlyDepreciation: "₹13,000",
      accumulatedDepreciation: "₹16,250",
      netBookValue: "₹48,750",
      nextDepreciationDate: "2024-06-10",
      salvageValue: "₹6,500",
    },
  ]);

  // Statistics
  const statistics = {
    totalAssets: assetMaster.length,
    allocatedAssets: assetMaster.filter((a) => a.status === "Allocated").length,
    availableAssets: assetMaster.filter((a) => a.status === "Available").length,
    underRepair: assetMaster.filter((a) => a.status === "Under Repair").length,
    totalValue: assetMaster.reduce(
      (sum, asset) => sum + parseInt(asset.currentValue.replace(/[^0-9]/g, "")),
      0,
    ),
    pendingReturns: 2,
    upcomingMaintenance: 3,
    expiringInsurance: insurancePolicies.filter((p) => {
      const end = p.end_date ? new Date(p.end_date) : null;
      if (!end) return false;
      const in30 = new Date();
      in30.setDate(in30.getDate() + 30);
      return end <= in30 && end >= new Date();
    }).length,
  };

  // Departments
  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "IT",
    "Design",
    "Product",
    "Support",
  ];

  // Locations
  const locations = [
    "Head Office - Floor 1",
    "Head Office - Floor 2",
    "Head Office - Floor 3",
    "Branch Office - Mumbai",
    "Branch Office - Bangalore",
    "Branch Office - Delhi",
    "IT Store Room",
    "Repair Center",
    "Warehouse",
  ];

  // Transform backend asset to frontend format
  const transformAsset = useCallback((a, allocations = [], maintenances = []) => {
    const statusMap = { AVAILABLE: "Available", ALLOCATED: "Allocated", UNDER_REPAIR: "Under Repair", RETIRED: "Retired", LOST: "Lost", DISPOSED: "Disposed" };
    const status = statusMap[a.status] || a.status;
    const assetAllocs = allocations.filter((al) => al.asset_id === a.id).sort((x, y) => new Date(y.allocated_at) - new Date(x.allocated_at));
    const activeAlloc = status === "Allocated" ? assetAllocs[0] : null;
    const assetMaints = maintenances.filter((m) => m.asset_id === a.id).sort((x, y) => new Date(y.maintenance_date) - new Date(x.maintenance_date));
    const lastMaint = assetMaints[0];
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
      warrantyUntil: a.warranty_until,
      insurancePolicy: null,
      insuranceProvider: null,
      lastMaintenance: lastMaint ? lastMaint.maintenance_date?.split("T")[0] : null,
      nextMaintenance: null,
      maintenanceHistory: assetMaints.map((m) => ({
        date: m.maintenance_date?.split("T")[0],
        type: m.maintenance_type,
        cost: `₹${new Intl.NumberFormat("en-IN").format(m.cost)}`,
        technician: m.performed_by,
      })),
    };
  }, []);

  // Fetch all data from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [assetsRes, allocationsRes, returnsRes, maintenancesRes, insurancesRes] = await Promise.allSettled([
        assetsAPI.listAssets(),
        assetsAPI.listAllocations(),
        assetsAPI.listReturns(),
        assetsAPI.listMaintenances(),
        assetsAPI.listInsurances(),
      ]);
      
      // Handle each response
      const assets = assetsRes.status === 'fulfilled' && Array.isArray(assetsRes.value) ? assetsRes.value : [];
      const allocations = allocationsRes.status === 'fulfilled' && Array.isArray(allocationsRes.value) ? allocationsRes.value : [];
      const returns = returnsRes.status === 'fulfilled' && Array.isArray(returnsRes.value) ? returnsRes.value : [];
      const maintenances = maintenancesRes.status === 'fulfilled' && Array.isArray(maintenancesRes.value) ? maintenancesRes.value : [];
      const policies = insurancesRes.status === 'fulfilled' && Array.isArray(insurancesRes.value) ? insurancesRes.value : [];
      
      // Log any failures
      if (assetsRes.status === 'rejected') {
        console.error('Failed to fetch assets:', assetsRes.reason);
      }
      if (allocationsRes.status === 'rejected') {
        console.error('Failed to fetch allocations:', allocationsRes.reason);
      }
      if (returnsRes.status === 'rejected') {
        console.error('Failed to fetch returns:', returnsRes.reason);
      }
      if (maintenancesRes.status === 'rejected') {
        console.error('Failed to fetch maintenances:', maintenancesRes.reason);
      }
      if (insurancesRes.status === 'rejected') {
        console.error('Failed to fetch insurance policies:', insurancesRes.reason);
      }
      
      // If all failed, show error
      if (assetsRes.status === 'rejected' && allocationsRes.status === 'rejected' && 
          returnsRes.status === 'rejected' && maintenancesRes.status === 'rejected' && insurancesRes.status === 'rejected') {
        const firstError = assetsRes.reason || allocationsRes.reason || returnsRes.reason || maintenancesRes.reason || insurancesRes.reason;
        const errorMessage = firstError?.message || firstError?.toString() || 'Failed to fetch';
        
        // Provide more helpful error messages
        if (errorMessage.includes('Failed to connect') || 
            errorMessage.includes('fetch') || 
            errorMessage.includes('NetworkError') ||
            errorMessage.includes('Failed to fetch')) {
          throw new Error('Failed to connect to backend server. Please ensure the backend is running on http://127.0.0.1:8000');
        }
        throw firstError;
      }
      setAssetMaster(assets.map((a) => transformAsset(a, allocations, maintenances)));
      const returnedAllocationIds = new Set(returns.map((r) => String(r.allocation_id)));
      setAssetAllocations(
        allocations.map((al) => {
          const asset = assets.find((a) => a.id === al.asset_id);
          const isReturned = returnedAllocationIds.has(String(al.id));
          return {
            id: al.id,
            allocation_id: al.id,
            asset_id: al.asset_id,
            allocationId: `ALLOC-${al.allocated_at?.substring(0, 4)}-${String(al.id).substring(0, 8)}`,
            assetId: asset ? `AST${String(al.asset_id).padStart(3, "0")}` : al.asset_id,
            assetName: asset?.asset_name || `Asset #${al.asset_id}`,
            employeeId: al.employee_id,
            employeeName: al.employee_name,
            department: al.department,
            allocationDate: al.allocated_at?.split("T")[0],
            allocationType: al.allocation_type,
            allocationReason: al.allocation_reason,
            status: isReturned ? "Returned" : "Active",
          };
        }),
      );
      setAssetReturns(
        returns.map((r) => {
          const alloc = allocations.find((a) => String(a.id) === String(r.allocation_id));
          const asset = alloc ? assets.find((a) => a.id === alloc.asset_id) : null;
          return {
            id: r.id,
            returnId: `RET-${r.returned_at?.substring(0, 4)}-${String(r.id).substring(0, 8)}`,
            assetId: asset ? `AST${String(alloc.asset_id).padStart(3, "0")}` : null,
            assetName: asset?.asset_name,
            employeeId: alloc?.employee_id,
            employeeName: alloc?.employee_name,
            department: alloc?.department,
            returnDate: r.returned_at?.split("T")[0],
            returnReason: r.return_reason,
            conditionAtReturn: r.condition_at_return,
            missingItems: r.missing_items,
            damageDetails: r.damage_details,
            status: "Completed",
          };
        }),
      );
      setMaintenanceHistory(
        maintenances.map((m) => {
          const asset = assets.find((a) => a.id === m.asset_id);
          return {
            id: m.id,
            maintenanceId: `MNT-${m.created_at?.substring(0, 4)}-${String(m.id).substring(0, 8)}`,
            assetId: m.asset_id,
            assetName: asset?.asset_name || `Asset #${m.asset_id}`,
            maintenanceType: m.maintenance_type,
            maintenanceDate: m.maintenance_date?.split("T")[0],
            cost: `₹${new Intl.NumberFormat("en-IN").format(m.cost)}`,
            performedBy: m.performed_by,
            description: m.description,
            status: "Completed",
          };
        }),
      );
      setInsurancePolicies(policies);
    } catch (err) {
      let errorMessage = err?.message || err?.toString() || "Failed to load asset data";
      
      // Provide more helpful error messages for common issues
      if (errorMessage.includes('Failed to connect') || 
          errorMessage.includes('fetch') || 
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Failed to connect to backend server. Please ensure the backend is running on http://127.0.0.1:8000';
      }
      
      console.error('Error fetching asset data:', err);
      setError(errorMessage);
      // Keep existing data if available, only clear if it's a critical error
      if (errorMessage.includes('Failed to connect') || 
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('backend is running')) {
        setAssetMaster([]);
        setAssetAllocations([]);
        setAssetReturns([]);
        setMaintenanceHistory([]);
        setInsurancePolicies([]);
      }
    } finally {
      setLoading(false);
    }
  }, [transformAsset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Utility Functions
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    const numericAmount =
      typeof amount === "string"
        ? parseInt(amount.replace(/[^0-9]/g, ""))
        : amount;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(numericAmount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return <span className="badge bg-success">Available</span>;
      case "Allocated":
        return <span className="badge bg-primary">Allocated</span>;
      case "Under Repair":
        return <span className="badge bg-warning">Under Repair</span>;
      case "Lost":
        return <span className="badge bg-danger">Lost</span>;
      case "Retired":
        return <span className="badge bg-secondary">Retired</span>;
      case "Disposed":
        return <span className="badge bg-dark">Disposed</span>;
      default:
        return <span className="badge bg-info">{status}</span>;
    }
  };

  const getConditionBadge = (condition) => {
    const cond = assetConditions.find((c) => c.value === condition);
    if (cond) {
      return <span className={`badge bg-${cond.color}`}>{condition}</span>;
    }
    return <span className="badge bg-secondary">{condition}</span>;
  };

  const getCategoryIcon = (category) => {
    const cat = assetCategories.find((c) => c.value === category);
    return cat ? cat.icon : <Package size={16} />;
  };

  // Action Button Handlers - FIXED VERSION
  const handleViewAsset = (asset) => {
    setSelectedAsset(asset);
    setShowViewModal(true);
  };

  const handleEditAsset = (asset) => {
    setEditAsset(asset);
    setEditMode(true);
    setShowAssetModal(true);
  };

  const handleAllocateAssetClick = (asset) => {
    if (asset.status === "Available") {
      setSelectedAsset(asset);
      setShowAllocationModal(true);
    } else {
      alert(
        `Cannot allocate ${asset.assetName}. Current status: ${asset.status}`,
      );
    }
  };

  const handleMaintenanceClick = (asset) => {
    setSelectedAsset(asset);
    setShowMaintenanceModal(true);
  };

  const handleViewAllocationDetails = (allocation) => {
    setSelectedAllocation(allocation);
    setShowAllocationDetails(true);
  };

  const handleInitiateReturn = (allocation) => {
    const asset = assetMaster.find((a) => a.assetId === allocation.assetId || a.id === allocation.asset_id);
    if (asset) {
      setSelectedAsset(asset);
      setSelectedAllocation(allocation);
      setShowReturnModal(true);
    }
  };

  const handleViewMaintenanceDetails = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowMaintenanceDetails(true);
  };

  const handleEditMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowMaintenanceModal(true);
  };

  const handleViewPolicyDetails = (policy) => {
    setSelectedPolicy(policy);
    setShowPolicyDetailsModal(true);
  };

  const getPolicyForAsset = (assetId) => {
    return insurancePolicies.find((p) => p.asset_id === assetId) || null;
  };

  const handleFileClaim = (policy) => {
    const asset = assetMaster.find((a) => a.id === policy.asset_id);
    if (asset) {
      setSelectedAsset(asset);
      setSelectedPolicy(policy);
      setShowClaimModal(true);
    }
  };

  const handleDeletePolicy = async (policy) => {
    if (!window.confirm(`Delete insurance policy for asset? This cannot be undone.`)) return;
    try {
      await assetsAPI.deleteInsurance(policy.id);
      fetchData();
    } catch (err) {
      const msg = err?.message;
      alert(typeof msg === "string" ? msg : JSON.stringify(msg) || "Failed to delete policy");
    }
  };

  const getAssetNameForPolicy = (policy) => {
    const asset = assetMaster.find((a) => a.id === policy.asset_id);
    return asset ? asset.assetName : `Asset #${policy.asset_id}`;
  };

  const formatPolicyCurrency = (val) => {
    if (val == null || val === "") return "—";
    const n = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
    return `₹${new Intl.NumberFormat("en-IN").format(n)}`;
  };

  const handleReallocateAsset = (returnItem) => {
    const asset = assetMaster.find((a) => a.assetId === returnItem.assetId);
    if (asset && asset.status === "Available") {
      setSelectedAsset(asset);
      setShowReallocateModal(true);
    } else {
      alert("Asset is not available for reallocation");
    }
  };

  // Additional Action Handlers
  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await assetsAPI.deleteAsset(assetId);
      alert("Asset deleted successfully!");
      fetchData();
    } catch (err) {
      alert(err?.message || "Failed to delete asset");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAssets.length === 0) {
      alert("Please select assets to delete");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedAssets.length} selected assets?`)) return;
    try {
      await Promise.all(selectedAssets.map((id) => assetsAPI.deleteAsset(id)));
      setSelectedAssets([]);
      alert(`${selectedAssets.length} assets deleted successfully!`);
      fetchData();
    } catch (err) {
      alert(err?.message || "Failed to delete assets");
    }
  };

  // Simple Table Drawing Function for PDF
  const drawTable = (doc, headers, data, startX, startY, options = {}) => {
    const {
      fontSize = 8,
      headerBackground = [41, 128, 185],
      rowHeight = 10,
    } = options;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const availableWidth = pageWidth - margin * 2;
    const colCount = headers.length;
    const colWidth = availableWidth / colCount;

    let currentY = startY;
    let currentX = margin;

    // Draw header
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(...headerBackground);
    doc.rect(currentX, currentY, availableWidth, rowHeight, "F");
    doc.setTextColor(255, 255, 255);

    headers.forEach((header, index) => {
      const x = currentX + colWidth * index + 2;
      const y = currentY + rowHeight / 2 + 2;
      const text =
        typeof header === "string"
          ? header.substring(0, 15)
          : String(header).substring(0, 15);
      doc.text(text, x, y);
    });

    currentY += rowHeight;

    // Draw data rows
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    data.forEach((row, rowIndex) => {
      // Alternate row background
      if (rowIndex % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(currentX, currentY, availableWidth, rowHeight, "F");
      }

      // Draw cell borders
      doc.setDrawColor(200, 200, 200);
      for (let i = 0; i <= colCount; i++) {
        doc.line(
          currentX + colWidth * i,
          currentY,
          currentX + colWidth * i,
          currentY + rowHeight,
        );
      }
      doc.line(currentX, currentY, currentX + availableWidth, currentY);
      doc.line(
        currentX,
        currentY + rowHeight,
        currentX + availableWidth,
        currentY + rowHeight,
      );

      // Draw cell content
      headers.forEach((header, colIndex) => {
        const x = currentX + colWidth * colIndex + 2;
        const y = currentY + rowHeight / 2 + 2;
        let cellValue = row[colIndex];
        if (cellValue === undefined || cellValue === null) cellValue = "";
        const text = String(cellValue).substring(0, 20);
        doc.text(text, x, y);
      });

      currentY += rowHeight;

      // Check for page break
      if (currentY > 280) {
        doc.addPage();
        currentY = margin;
        // Redraw header on new page
        doc.setFillColor(...headerBackground);
        doc.rect(currentX, currentY, availableWidth, rowHeight, "F");
        doc.setTextColor(255, 255, 255);
        headers.forEach((header, index) => {
          const x = currentX + colWidth * index + 2;
          const y = currentY + rowHeight / 2 + 2;
          doc.text(header.substring(0, 15), x, y);
        });
        currentY += rowHeight;
        doc.setTextColor(0, 0, 0);
      }
    });

    return { finalY: currentY + 5 };
  };

  // PDF Report Generation Functions
  const generateAssetInventoryPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;

    // Report Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ASSET INVENTORY REPORT", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      pageWidth / 2,
      22,
      { align: "center" },
    );
    doc.text(`Company: Asset Management System`, pageWidth / 2, 27, {
      align: "center",
    });

    // Summary Section
    let yPos = 35;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("SUMMARY STATISTICS", 20, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const allocatedCount = assetMaster.filter(
      (a) => a.status === "Allocated",
    ).length;
    const availableCount = assetMaster.filter(
      (a) => a.status === "Available",
    ).length;
    const underRepairCount = assetMaster.filter(
      (a) => a.status === "Under Repair",
    ).length;
    const totalValue = assetMaster.reduce(
      (sum, asset) => sum + parseInt(asset.currentValue.replace(/[^0-9]/g, "")),
      0,
    );

    doc.text(`Total Assets: ${assetMaster.length}`, 20, yPos);
    doc.text(`Total Value: ${formatCurrency(totalValue)}`, 100, yPos);
    yPos += 6;
    doc.text(`Allocated: ${allocatedCount}`, 20, yPos);
    doc.text(`Available: ${availableCount}`, 100, yPos);
    yPos += 6;
    doc.text(`Under Repair: ${underRepairCount}`, 20, yPos);
    doc.text(
      `Utilization: ${Math.round((allocatedCount / assetMaster.length) * 100)}%`,
      100,
      yPos,
    );
    yPos += 15;

    // Asset Details Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ASSET DETAILS", 20, yPos);
    yPos += 8;

    const headers = [
      "Asset Tag",
      "Asset Name",
      "Category",
      "Status",
      "Value",
      "Location",
    ];
    const tableData = assetMaster.map((asset) => [
      asset.assetTag,
      asset.assetName,
      asset.category,
      asset.status,
      asset.currentValue,
      asset.location,
    ]);

    const tableResult = drawTable(doc, headers, tableData, 20, yPos, {
      fontSize: 7,
      headerBackground: [41, 128, 185],
    });

    yPos = tableResult.finalY + 10;

    // Category-wise Summary
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CATEGORY-WISE SUMMARY", 20, yPos);
    yPos += 8;

    const categories = [...new Set(assetMaster.map((a) => a.category))];
    const categoryData = categories.map((category) => {
      const categoryAssets = assetMaster.filter((a) => a.category === category);
      const categoryValue = categoryAssets.reduce(
        (sum, asset) =>
          sum + parseInt(asset.currentValue.replace(/[^0-9]/g, "")),
        0,
      );
      return [category, categoryAssets.length, formatCurrency(categoryValue)];
    });

    drawTable(
      doc,
      ["Category", "Count", "Total Value"],
      categoryData,
      20,
      yPos,
      {
        headerBackground: [39, 174, 96],
      },
    );

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, {
        align: "center",
      });
      doc.text("Confidential - Asset Management System", pageWidth / 2, 290, {
        align: "center",
      });
    }

    // Save PDF
    doc.save(
      `asset-inventory-report-${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateEmployeeWisePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;

    // Report Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("EMPLOYEE ASSET ALLOCATION REPORT", pageWidth / 2, 15, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      pageWidth / 2,
      22,
      { align: "center" },
    );

    // Summary
    let yPos = 30;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ALLOCATION SUMMARY", 20, yPos);
    yPos += 8;

    const activeAllocations = assetAllocations.filter(
      (a) => a.status === "Active",
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Active Allocations: ${activeAllocations.length}`, 20, yPos);
    doc.text(
      `Employees: ${[...new Set(activeAllocations.map((a) => a.employeeName))].length}`,
      100,
      yPos,
    );
    yPos += 10;

    // Allocations Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ASSET ALLOCATIONS", 20, yPos);
    yPos += 8;

    const headers = [
      "Allocation ID",
      "Asset",
      "Employee",
      "Department",
      "Allocation Date",
    ];
    const tableData = activeAllocations.map((allocation) => [
      allocation.allocationId,
      allocation.assetName,
      allocation.employeeName,
      allocation.department,
      allocation.allocationDate,
    ]);

    drawTable(doc, headers, tableData, 20, yPos, {
      fontSize: 7,
      headerBackground: [41, 128, 185],
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, {
        align: "center",
      });
      doc.text("Confidential - Asset Management System", pageWidth / 2, 290, {
        align: "center",
      });
    }

    doc.save(
      `employee-asset-report-${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateDepreciationPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;

    // Report Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ASSET DEPRECIATION REPORT", pageWidth / 2, 15, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      pageWidth / 2,
      22,
      { align: "center" },
    );

    // Summary
    let yPos = 30;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DEPRECIATION SUMMARY", 20, yPos);
    yPos += 8;

    const totalPurchase = depreciationSchedule.reduce(
      (sum, asset) =>
        sum + parseInt(asset.purchasePrice.replace(/[^0-9]/g, "")),
      0,
    );
    const totalCurrent = depreciationSchedule.reduce(
      (sum, asset) => sum + parseInt(asset.currentValue.replace(/[^0-9]/g, "")),
      0,
    );
    const totalDepreciation = totalPurchase - totalCurrent;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Assets: ${depreciationSchedule.length}`, 20, yPos);
    doc.text(
      `Total Purchase Value: ${formatCurrency(totalPurchase)}`,
      100,
      yPos,
    );
    yPos += 6;
    doc.text(`Total Current Value: ${formatCurrency(totalCurrent)}`, 20, yPos);
    doc.text(
      `Total Depreciation: ${formatCurrency(totalDepreciation)}`,
      100,
      yPos,
    );
    yPos += 15;

    // Depreciation Schedule Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DEPRECIATION SCHEDULE", 20, yPos);
    yPos += 8;

    const headers = [
      "Asset",
      "Purchase Price",
      "Current Value",
      "Dep %",
      "Yearly Dep",
      "Acc Dep",
      "NBV",
    ];
    const tableData = depreciationSchedule.map((schedule) => [
      schedule.assetName,
      schedule.purchasePrice,
      schedule.currentValue,
      schedule.depreciationRate,
      schedule.yearlyDepreciation,
      schedule.accumulatedDepreciation,
      schedule.netBookValue,
    ]);

    drawTable(doc, headers, tableData, 20, yPos, {
      fontSize: 7,
      headerBackground: [155, 89, 182],
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, {
        align: "center",
      });
      doc.text("Confidential - Asset Management System", pageWidth / 2, 290, {
        align: "center",
      });
    }

    doc.save(
      `depreciation-report-${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateMaintenancePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;

    // Report Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MAINTENANCE HISTORY REPORT", pageWidth / 2, 15, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      pageWidth / 2,
      22,
      { align: "center" },
    );

    // Summary
    let yPos = 30;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("MAINTENANCE SUMMARY", 20, yPos);
    yPos += 8;

    const totalCost = maintenanceHistory.reduce(
      (sum, record) => sum + parseInt(record.cost.replace(/[^0-9]/g, "")),
      0,
    );
    const warrantyCovered = maintenanceHistory.filter(
      (m) => m.warrantyCovered,
    ).length;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Records: ${maintenanceHistory.length}`, 20, yPos);
    doc.text(`Total Cost: ${formatCurrency(totalCost)}`, 100, yPos);
    yPos += 6;
    doc.text(`Warranty Covered: ${warrantyCovered}`, 20, yPos);
    yPos += 10;

    // Maintenance Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("MAINTENANCE RECORDS", 20, yPos);
    yPos += 8;

    const headers = [
      "Date",
      "Asset",
      "Type",
      "Cost",
      "Performed By",
      "Warranty",
    ];
    const tableData = maintenanceHistory.map((record) => [
      record.maintenanceDate,
      record.assetName,
      record.maintenanceType,
      record.cost,
      record.performedBy,
      record.warrantyCovered ? "Yes" : "No",
    ]);

    drawTable(doc, headers, tableData, 20, yPos, {
      fontSize: 7,
      headerBackground: [230, 126, 34],
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, {
        align: "center",
      });
      doc.text("Confidential - Asset Management System", pageWidth / 2, 290, {
        align: "center",
      });
    }

    doc.save(
      `maintenance-report-${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateInsurancePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;

    // Report Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INSURANCE POLICIES REPORT", pageWidth / 2, 15, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      pageWidth / 2,
      22,
      { align: "center" },
    );

    // Summary
    let yPos = 30;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INSURANCE SUMMARY", 20, yPos);
    yPos += 8;

    const totalCoverage = insurancePolicies.reduce(
      (sum, policy) =>
        sum + (typeof policy.coverage_amount === "number" ? policy.coverage_amount : parseFloat(String(policy.coverage_amount || 0).replace(/[^0-9.]/g, "")) || 0),
      0,
    );
    const totalPremium = insurancePolicies.reduce(
      (sum, policy) => {
        const p = policy.premium_amount ?? policy.premium;
        return sum + (typeof p === "number" ? p : parseFloat(String(p || 0).replace(/[^0-9.]/g, "")) || 0);
      },
      0,
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Policies: ${insurancePolicies.length}`, 20, yPos);
    doc.text(`Total Coverage: ${formatCurrency(totalCoverage)}`, 100, yPos);
    yPos += 6;
    doc.text(`Total Premium: ${formatCurrency(totalPremium)}`, 20, yPos);
    yPos += 10;

    // Insurance Policies Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INSURANCE POLICIES", 20, yPos);
    yPos += 8;

    const headers = [
      "Policy ID",
      "Asset",
      "Provider",
      "Coverage",
      "Premium",
      "Validity",
    ];
    const tableData = insurancePolicies.map((policy) => [
      policy.policy_number || String(policy.id),
      getAssetNameForPolicy(policy),
      policy.insurance_provider ?? policy.provider,
      formatPolicyCurrency(policy.coverage_amount),
      formatPolicyCurrency(policy.premium_amount ?? policy.premium),
      policy.end_date || "—",
    ]);

    drawTable(doc, headers, tableData, 20, yPos, {
      fontSize: 7,
      headerBackground: [41, 128, 185],
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, {
        align: "center",
      });
      doc.text("Confidential - Asset Management System", pageWidth / 2, 290, {
        align: "center",
      });
    }

    doc.save(`insurance-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const generateReturnsPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;

    // Report Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("ASSET RETURNS REPORT", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      pageWidth / 2,
      22,
      { align: "center" },
    );

    // Summary
    let yPos = 30;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RETURNS SUMMARY", 20, yPos);
    yPos += 8;

    const totalPenalty = assetReturns.reduce(
      (sum, returnItem) =>
        sum + parseInt(returnItem.penaltyAmount.replace(/[^0-9]/g, "")),
      0,
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Returns: ${assetReturns.length}`, 20, yPos);
    doc.text(`Total Penalty: ${formatCurrency(totalPenalty)}`, 100, yPos);
    yPos += 10;

    // Returns Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ASSET RETURNS", 20, yPos);
    yPos += 8;

    const headers = [
      "Return ID",
      "Asset",
      "Employee",
      "Return Date",
      "Reason",
      "Condition",
    ];
    const tableData = assetReturns.map((returnItem) => [
      returnItem.returnId,
      returnItem.assetName,
      returnItem.employeeName,
      returnItem.returnDate,
      returnItem.returnReason,
      returnItem.conditionAtReturn,
    ]);

    drawTable(doc, headers, tableData, 20, yPos, {
      fontSize: 7,
      headerBackground: [39, 174, 96],
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, {
        align: "center",
      });
      doc.text("Confidential - Asset Management System", pageWidth / 2, 290, {
        align: "center",
      });
    }

    doc.save(`returns-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Handlers
  const handleAddAsset = async (assetData, isEdit = false, editId = null) => {
    const parseNum = (v) => {
      if (typeof v === "number") return v;
      const s = String(v || "").replace(/[^0-9.]/g, "");
      return parseFloat(s) || 0;
    };
    const payload = {
      asset_name: assetData.assetName,
      category: assetData.category,
      make: assetData.make,
      model: assetData.model,
      serial_number: assetData.serialNumber,
      purchase_date: assetData.purchaseDate,
      purchase_price: parseNum(assetData.purchasePrice),
      depreciation_rate: parseNum(assetData.depreciationRate) || 15,
      condition: assetData.condition,
      location: assetData.location,
      department: assetData.department,
      warranty_until: assetData.warrantyUntil || null,
    };
    try {
      if (isEdit && editId) {
        await assetsAPI.updateAsset(editId, payload);
        alert("Asset updated successfully!");
      } else {
        await assetsAPI.createAsset(payload);
        alert("Asset added successfully!");
      }
      setShowAssetModal(false);
      setEditMode(false);
      setEditAsset(null);
      fetchData();
    } catch (err) {
      alert(err?.message || "Failed to save asset");
    }
  };

  const handleAllocateAsset = async (allocationData) => {
    const payload = {
      asset_id: parseInt(allocationData.assetId, 10),
      employee_id: allocationData.employeeId,
      employee_name: allocationData.employeeName,
      department: allocationData.department,
      allocation_type: allocationData.allocationType,
      allocation_reason: allocationData.allocationReason,
    };
    try {
      await assetsAPI.createAllocation(payload);
      setShowAllocationModal(false);
      alert(`Asset allocated to ${allocationData.employeeName} successfully!`);
      fetchData();
    } catch (err) {
      alert(err?.message || "Failed to allocate asset");
    }
  };

  const handleReturnAsset = async (returnData) => {
    const allocationId = returnData.allocationId || returnData.allocation_id;
    if (!allocationId) {
      alert("Please select an allocation to return");
      return;
    }
    const payload = {
      allocation_id: allocationId,
      return_reason: returnData.returnReason,
      condition_at_return: returnData.conditionAtReturn,
      missing_items: returnData.missingItems || null,
      damage_details: returnData.damageDetails || null,
    };
    try {
      await assetsAPI.createReturn(payload);
      setShowReturnModal(false);
      setSelectedAllocation(null);
      alert("Asset return processed successfully!");
      fetchData();
    } catch (err) {
      alert(err?.message || "Failed to process return");
    }
  };

  const handleAddMaintenance = async (maintenanceData) => {
    const parseNum = (v) => {
      const s = String(v || "").replace(/[^0-9.]/g, "");
      return parseFloat(s) || 0;
    };
    const maintenanceDate = maintenanceData.maintenanceDate;
    const payload = {
      asset_id: parseInt(maintenanceData.assetId, 10),
      maintenance_type: maintenanceData.maintenanceType,
      maintenance_date: maintenanceDate.includes("T") ? maintenanceDate : `${maintenanceDate}T12:00:00`,
      cost: parseNum(maintenanceData.cost),
      performed_by: maintenanceData.performedBy,
      description: maintenanceData.description,
    };
    try {
      await assetsAPI.createMaintenance(payload);
      setShowMaintenanceModal(false);
      setSelectedMaintenance(null);
      alert("Maintenance record added successfully!");
      fetchData();
    } catch (err) {
      alert(err?.message || "Failed to add maintenance record");
    }
  };

  // Filter assets based on search term
  const filteredAssets = assetMaster.filter(
    (asset) =>
      searchTerm === "" ||
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.allocatedTo &&
        asset.allocatedTo.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Filter allocations based on search term
  const filteredAllocations = assetAllocations.filter(
    (allocation) =>
      searchTerm === "" ||
      allocation.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.assetId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.allocationId?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter returns based on search term
  const filteredReturns = assetReturns.filter(
    (returnItem) =>
      searchTerm === "" ||
      returnItem.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.assetId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.returnId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.returnReason?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter maintenance records based on search term
  const filteredMaintenance = maintenanceHistory.filter(
    (maintenance) =>
      searchTerm === "" ||
      maintenance.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.assetId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.maintenanceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.maintenanceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.performedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Reports Section Component
  const ReportsSection = () => (
    <div className="row g-4">
      <div className="col-12 col-md-6">
        <div className="card h-100">
          <div className="card-header bg-primary text-white">
            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <FileText size={18} />
              Asset Inventory Report (PDF)
            </h6>
          </div>
          <div className="card-body">
            <p className="text-muted">
              Complete inventory with all asset details, categories, and current
              values.
            </p>
            <div className="mb-3">
              <h6>Report Includes:</h6>
              <ul className="small">
                <li>Asset master data with all fields</li>
                <li>Category-wise summary</li>
                <li>Department-wise allocation</li>
                <li>Current value calculation</li>
                <li>Status distribution</li>
              </ul>
            </div>
            <button
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={generateAssetInventoryPDF}
              type="button"
            >
              <Download size={16} />
              Download PDF Report
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6">
        <div className="card h-100">
          <div className="card-header bg-success text-white">
            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <Users size={18} />
              Employee-wise Allocation Report (PDF)
            </h6>
          </div>
          <div className="card-body">
            <p className="text-muted">
              Detailed report of assets allocated to each employee.
            </p>
            <div className="mb-3">
              <h6>Report Includes:</h6>
              <ul className="small">
                <li>Employee-wise asset list</li>
                <li>Allocation dates and terms</li>
                <li>Department-wise summary</li>
                <li>Pending returns list</li>
                <li>Insurance coverage details</li>
              </ul>
            </div>
            <button
              className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={generateEmployeeWisePDF}
              type="button"
            >
              <Download size={16} />
              Download PDF Report
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6">
        <div className="card h-100">
          <div className="card-header bg-info text-white">
            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <TrendingDown size={18} />
              Depreciation Report (PDF)
            </h6>
          </div>
          <div className="card-body">
            <p className="text-muted">
              Detailed depreciation schedule and calculations for all assets.
            </p>
            <div className="mb-3">
              <h6>Report Includes:</h6>
              <ul className="small">
                <li>Depreciation schedule for each asset</li>
                <li>Purchase price vs current value</li>
                <li>Accumulated depreciation</li>
                <li>Net book values</li>
                <li>Next depreciation dates</li>
              </ul>
            </div>
            <button
              className="btn btn-info w-100 d-inline-flex align-items-center justify-content-center gap-2"
              onClick={generateDepreciationPDF}
              type="button"
            >
              <Download size={16} />
              Download PDF Report
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6">
        <div className="card h-100">
          <div className="card-header bg-warning text-dark">
            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <AlertCircle size={18} />
              Maintenance Report (PDF)
            </h6>
          </div>
          <div className="card-body">
            <p className="text-muted">
              Complete maintenance history and cost analysis.
            </p>
            <div className="mb-3">
              <h6>Report Includes:</h6>
              <ul className="small">
                <li>Maintenance history for all assets</li>
                <li>Cost analysis and trends</li>
                <li>Warranty vs non-warranty repairs</li>
                <li>Upcoming maintenance schedule</li>
                <li>Service provider details</li>
              </ul>
            </div>
            <button
              className="btn btn-warning w-100 d-inline-flex align-items-center justify-content-center gap-2"
              onClick={generateMaintenancePDF}
              type="button"
            >
              <Download size={16} />
              Download PDF Report
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6">
        <div className="card h-100">
          <div
            className="card-header bg-purple text-white"
            style={{ backgroundColor: "#6f42c1" }}
          >
            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <ShieldCheck size={18} />
              Insurance Report (PDF)
            </h6>
          </div>
          <div className="card-body">
            <p className="text-muted">Insurance policies and claim history.</p>
            <div className="mb-3">
              <h6>Report Includes:</h6>
              <ul className="small">
                <li>Insurance policy details</li>
                <li>Coverage amounts and premiums</li>
                <li>Claim history</li>
                <li>Policy expiry dates</li>
                <li>Provider-wise summary</li>
              </ul>
            </div>
            <button
              className="btn w-100 d-inline-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: "#6f42c1", color: "white" }}
              onClick={generateInsurancePDF}
              type="button"
            >
              <Download size={16} />
              Download Insurance Report
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6">
        <div className="card h-100">
          <div
            className="card-header bg-teal text-white"
            style={{ backgroundColor: "#20c997" }}
          >
            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <ArchiveRestore size={18} />
              Asset Return Report (PDF)
            </h6>
          </div>
          <div className="card-body">
            <p className="text-muted">
              Asset return history and condition analysis.
            </p>
            <div className="mb-3">
              <h6>Report Includes:</h6>
              <ul className="small">
                <li>Return history for all assets</li>
                <li>Condition analysis</li>
                <li>Penalty calculations</li>
                <li>Missing items report</li>
                <li>Employee-wise return summary</li>
              </ul>
            </div>
            <button
              className="btn w-100 d-inline-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: "#20c997", color: "white" }}
              onClick={generateReturnsPDF}
              type="button"
            >
              <Download size={16} />
              Download Returns Report
            </button>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header bg-dark text-white">
            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <Printer size={18} />
              Bulk Report Generator
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <p className="text-muted">
                  Generate multiple reports at once with custom date ranges.
                </p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">From Date</label>
                    <input
                      type="date"
                      className="form-control"
                      defaultValue={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 1),
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">To Date</label>
                    <input
                      type="date"
                      className="form-control"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button
                  className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => {
                    generateAssetInventoryPDF();
                    setTimeout(() => generateEmployeeWisePDF(), 1000);
                    setTimeout(() => generateDepreciationPDF(), 2000);
                    setTimeout(() => generateMaintenancePDF(), 3000);
                    setTimeout(() => generateInsurancePDF(), 4000);
                    setTimeout(() => generateReturnsPDF(), 5000);
                  }}
                  type="button"
                >
                  <Download size={16} />
                  Generate All Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const utilization =
    statistics.totalAssets > 0
      ? Math.round((statistics.allocatedAssets / statistics.totalAssets) * 100)
      : 0;

  // Main Component
  return (
    <div className="container-fluid px-3 px-md-4 py-3">
      {loading && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading asset data...</span>
        </div>
      )}
      {error && !loading && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchData} type="button">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      )}
      {!loading && (
      <>
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Package size={24} className="text-primary" />
              <h5 className="fw-bold mb-0">Asset Management System</h5>
            </div>
            <p className="text-muted mb-0 ms-4">
              Complete asset lifecycle management from allocation to return
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => setShowAssetModal(true)}
              type="button"
            >
              <Package size={16} />
              <span>Add Asset</span>
            </button>
            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={() => setShowAllocationModal(true)}
              type="button"
            >
              <Truck size={16} />
              <span>Allocate Asset</span>
            </button>
            <button
              className="btn btn-warning d-flex align-items-center gap-2"
              onClick={() => setShowReturnModal(true)}
              type="button"
            >
              <ArchiveRestore size={16} />
              <span>Process Return</span>
            </button>
            <button
              className="btn btn-info d-flex align-items-center gap-2 text-white"
              onClick={() => setShowMaintenanceModal(true)}
              type="button"
            >
              <Wrench size={16} />
              <span>Maintenance</span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="p-3 bg-primary bg-opacity-10 rounded mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="spinner-grow spinner-grow-sm text-success"
                    role="status">
                  </div>
                  <span className="fw-medium">Asset Management Active</span>
                </div>
                <div className="vr"></div>
                <span className="text-muted small">
                  Tracking {statistics.totalAssets} assets
                </span>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="d-flex align-items-center gap-3 justify-content-end">
                <span className="badge bg-success bg-opacity-10 text-success">
                  <CheckCircle size={12} className="me-1" />
                  {statistics.allocatedAssets} Allocated
                </span>
                <span className="badge bg-info bg-opacity-10 text-info">
                  <Package size={12} className="me-1" />
                  {statistics.availableAssets} Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-3 border-top">
          <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Quick Statistics
          </h6>
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">
                    Total Asset Value
                  </span>
                  {/* <DollarSign size={20} className="text-success" /> */}
                  <IndianRupee size={20} className="text-success" />
                </div>
                <div className="h4 fw-bold">
                  {formatCurrency(statistics.totalValue)}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="text-muted small">Asset Utilization</div>
                  <PercentIcon size={20} className="text-primary" />
                </div>
                <div className="h4 fw-bold">
                  {statistics.totalAssets > 0
                    ? Math.round(
                        (statistics.allocatedAssets / statistics.totalAssets) *
                          100,
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="text-muted small">
                    Upcoming Maintenance
                  </div>
                  <Calendar size={20} className="text-warning" />
                </div>
                <div className="h4 fw-bold">
                  {statistics.upcomingMaintenance}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="text-muted small">
                    Expiring Insurance
                  </div>
                  <AlertCircle size={20} className="text-danger" />
                </div>
                <div className="h4 fw-bold">
                  {statistics.expiringInsurance}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Total Assets</div>
                <div className="h3 mb-0 fw-bold text-primary">
                  {statistics.totalAssets}
                </div>
              </div>
              <Package size={24} className="text-primary opacity-75" />
            </div>
            <div className="small text-success mt-2">
              <TrendingUp size={12} className="me-1" />
              {formatCurrency(statistics.totalValue)} total value
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Allocated Assets</div>
                <div className="h3 mb-0 fw-bold text-success">
                  {statistics.allocatedAssets}
                </div>
              </div>
              <Truck size={24} className="text-success opacity-75" />
            </div>
            <div className="small text-muted mt-2">
              {statistics.totalAssets > 0
                ? Math.round(
                    (statistics.allocatedAssets / statistics.totalAssets) * 100,
                  )
                : 0}
              % utilization
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Under Repair</div>
                <div className="h3 mb-0 fw-bold text-warning">
                  {statistics.underRepair}
                </div>
              </div>
              <Wrench size={24} className="text-warning opacity-75" />
            </div>
            <div className="small text-warning mt-2">Requires attention</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Pending Returns</div>
                <div className="h3 mb-0 fw-bold text-info">
                  {statistics.pendingReturns}
                </div>
              </div>
              <ArchiveRestore size={24} className="text-info opacity-75" />
            </div>
            <div className="small text-muted mt-2">Follow-up required</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {[
            {
              key: "dashboard",
              label: "Dashboard",
              icon: <BarChart3 size={16} />,
            },
            {
              key: "master",
              label: "Asset Master",
              icon: <Database size={16} />,
            },
            {
              key: "allocations",
              label: "Allocations",
              icon: <Truck size={16} />,
            },
            {
              key: "returns",
              label: "Returns",
              icon: <ArchiveRestore size={16} />,
            },
            {
              key: "maintenance",
              label: "Maintenance",
              icon: <Wrench size={16} />,
            },
            {
              key: "insurance",
              label: "Insurance",
              icon: <ShieldCheck size={16} />,
            },
            {
              key: "depreciation",
              label: "Depreciation",
              icon: <TrendingDown size={16} />,
            },
            { key: "reports", label: "Reports", icon: <FileText size={16} /> },
          ].map((section) => (
            <button
              key={section.key}
              className={`btn ${activeSection === section.key ? "btn-primary" : "btn-outline-primary"} d-flex align-items-center gap-2`}
              onClick={() => setActiveSection(section.key)}
              type="button"
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter - Same Height Format */}
      <div className="mb-4">
        <div className="row g-3 align-items-center">
          {/* Search Input and Filter Button - Seamlessly Connected, Same Height */}
          <div className="col-12 col-md-8">
            <div className="d-flex align-items-stretch" style={{ height: "38px" }}>
              {/* Search Input - Rounded left, straight right edge */}
              <div className="flex-grow-1 position-relative">
                <Search 
                  size={18} 
                  className="text-muted position-absolute"
                  style={{ 
                    left: "12px", 
                    top: "50%", 
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    zIndex: 10
                  }} 
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-link position-absolute p-0"
                    onClick={() => setSearchTerm("")}
                    style={{
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                      height: "20px",
                      width: "20px",
                      padding: 0,
                    }}
                    title="Clear search"
                  >
                    <X size={14} className="text-muted" />
                  </button>
                )}
                <input
                  type="text"
                  className="form-control h-100 border-end-0"
                  placeholder="Search assets, serial numbers, employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    paddingLeft: "40px",
                    paddingRight: searchTerm ? "35px" : "12px",
                    borderRadius: "0.375rem 0 0 0.375rem",
                  }}
                  aria-label="Search assets"
                />
              </div>
              {/* Filter Button - Straight left edge (connected), rounded right, blue background */}
              <button
                type="button"
                className="btn btn-primary d-flex flex-column align-items-center justify-content-center px-3 border-start-0"
                onClick={() => setActiveSection("master")}
                style={{
                  borderRadius: "0 0.375rem 0.375rem 0",
                  height: "38px",
                  minWidth: "85px",
                  borderLeft: "none",
                }}
                title="Go to Asset Master to filter"
              >
                <Filter size={16} className="text-white mb-1" style={{ lineHeight: "1" }} />
                <span className="text-white fw-medium" style={{ fontSize: "11px", lineHeight: "1", letterSpacing: "0.3px" }}>
                  Filter
                </span>
              </button>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="col-12 col-md-4">
            <div className="d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center px-3"
                onClick={() => window.location.reload()}
                style={{ height: "38px" }}
                title="Refresh page"
              >
                <RefreshCw size={16} />
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center px-3"
                onClick={() => setActiveSection("reports")}
                style={{ height: "38px" }}
                title="Open Reports"
              >
                <Download size={16} />
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center px-3"
                onClick={() => window.print()}
                style={{ height: "38px" }}
                title="Print page"
              >
                <Printer size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Content based on Active Section */}
      {activeSection === "dashboard" && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <BarChart3 size={18} />
                  Asset Management Dashboard
                </h6>
              </div>
              <div className="card border">
                <div className="card-header bg-light">
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <Package size={18} className="text-primary" />
                    Quick Actions
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-6 col-md-3">
                      <button
                        className="btn btn-primary w-100 d-flex flex-column align-items-center gap-2 p-3"
                        onClick={() => setShowAssetModal(true)}
                        type="button"
                      >
                        <Package size={24} />
                        <span>Add Asset</span>
                      </button>
                    </div>
                    <div className="col-6 col-md-3">
                      <button
                        className="btn btn-success w-100 d-flex flex-column align-items-center gap-2 p-3"
                        onClick={() => setShowAllocationModal(true)}
                        type="button"
                      >
                        <Truck size={24} />
                        <span>Allocate</span>
                      </button>
                    </div>
                    <div className="col-6 col-md-3">
                      <button
                        className="btn btn-warning w-100 d-flex flex-column align-items-center gap-2 p-3"
                        onClick={() => setShowReturnModal(true)}
                        type="button"
                      >
                        <ArchiveRestore size={24} />
                        <span>Process Return</span>
                      </button>
                    </div>
                    <div className="col-6 col-md-3">
                      <button
                        className="btn btn-info w-100 d-flex flex-column align-items-center gap-2 p-3 text-white"
                        onClick={() => setShowMaintenanceModal(true)}
                        type="button"
                      >
                        <Wrench size={24} />
                        <span>Maintenance</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="row g-4 mb-4">
                  <div className="col-12 col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                          <TrendingUp size={18} className="text-success" />
                          Utilization Rate
                        </h6>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">
                              Current Utilization
                            </span>
                            <span className="fw-bold text-success">
                              {utilization}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: "9px" }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: `${utilization}%` }}
                              aria-valuenow={utilization}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                        </div>

                        <div className="row g-2">
                          <div className="col-6">
                            <div className="p-2 border rounded text-center">
                              <div className="text-muted small">Allocated</div>
                              <div className="h5 fw-bold">
                                {statistics.allocatedAssets}
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 border rounded text-center">
                              <div className="text-muted small">Available</div>
                              <div className="h5 fw-bold text-success">
                                {statistics.availableAssets}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                          <AlertCircle size={18} className="text-warning" />
                          Asset Status Overview
                        </h6>
                        <div className="mb-2">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className="badge bg-success"
                                style={{ width: "20px", height: "20px" }}
                              ></span>
                              <span>Available</span>
                            </div>
                            <span className="fw-bold">
                              {statistics.availableAssets}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className="badge bg-primary"
                                style={{ width: "20px", height: "20px" }}
                              ></span>
                              <span>Allocated</span>
                            </div>
                            <span className="fw-bold">
                              {statistics.allocatedAssets}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className="badge bg-warning"
                                style={{ width: "20px", height: "20px" }}
                              ></span>
                              <span>Under Repair</span>
                            </div>
                            <span className="fw-bold">
                              {statistics.underRepair}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-muted small">
                            Asset Distribution
                          </div>
                          <div
                            className="progress mt-1"
                            style={{ height: "8px" }}
                          >
                            <div
                              className="progress-bar bg-success"
                              style={{
                                width: `${((statistics.availableAssets || 0) / (statistics.totalAssets || 1)) * 100}%`,
                              }}
                            ></div>
                            <div
                              className="progress-bar bg-primary"
                              style={{
                                width: `${((statistics.allocatedAssets || 0) / (statistics.totalAssets || 1)) * 100}%`,
                              }}
                            ></div>
                            <div
                              className="progress-bar bg-warning"
                              style={{
                                width: `${((statistics.underRepair || 0) / (statistics.totalAssets || 1)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "master" && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Database size={18} className="text-primary" />
                  Asset Master
                </h6>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary">
                    {statistics.totalAssets}{" "}
                    {statistics.totalAssets === 1 ? "Asset" : "Assets"}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                    onClick={() => setShowAssetModal(true)}
                    type="button"
                  >
                    <Package size={16} />
                    <span>Add New</span>
                  </button>
                  {selectedAssets.length > 0 && (
                    <button
                      className="btn btn-sm btn-danger d-flex align-items-center gap-2"
                      onClick={handleBulkDelete}
                      type="button"
                    >
                      <X size={14} />
                      Delete Selected ({selectedAssets.length})
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAssets(
                                  filteredAssets.map((a) => a.id),
                                );
                              } else {
                                setSelectedAssets([]);
                              }
                            }}
                          />
                        </th>
                        {/* <th>Select All</th> */}
                        <th>Asset Details</th>
                        <th>Category</th>
                        <th>Serial No.</th>
                        <th>Purchase Details</th>
                        <th>Current Value</th>
                        <th>Condition</th>
                        <th>Status</th>
                        <th>Allocated To</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((asset) => (
                        <tr key={asset.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedAssets.includes(asset.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAssets((prev) => [
                                    ...prev,
                                    asset.id,
                                  ]);
                                } else {
                                  setSelectedAssets((prev) =>
                                    prev.filter((id) => id !== asset.id),
                                  );
                                }
                              }}
                            />
                          </td>
                          <td>
                            <div className="fw-medium">{asset.assetName}</div>
                            <small className="text-muted">
                              {asset.assetTag}
                            </small>
                            <div className="small">
                              <span className="me-2">{asset.make}</span>
                              <span>{asset.model}</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {getCategoryIcon(asset.category)}
                              <span>{asset.category}</span>
                            </div>
                          </td>
                          <td>
                            <code>{asset.serialNumber}</code>
                          </td>
                          <td>
                            <div className="small">
                              <div>Date: {asset.purchaseDate}</div>
                              <div>Price: {asset.purchasePrice}</div>
                            </div>
                          </td>
                          <td className="fw-bold text-success">
                            {asset.currentValue}
                          </td>
                          <td>{getConditionBadge(asset.condition)}</td>
                          <td>{getStatusBadge(asset.status)}</td>
                          <td>
                            {asset.allocatedTo ? (
                              <div className="small">
                                <div className="fw-medium">
                                  {asset.allocatedTo}
                                </div>
                                <div className="text-muted">
                                  Since: {asset.allocationDate}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted">Not allocated</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleViewAsset(asset)}
                                type="button"
                                title="View Details"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                className="btn btn-outline-success"
                                onClick={() => handleAllocateAssetClick(asset)}
                                disabled={asset.status !== "Available"}
                                title={
                                  asset.status !== "Available"
                                    ? "Asset not available for allocation"
                                    : "Allocate asset"
                                }
                                type="button"
                              >
                                <Truck size={12} />
                              </button>
                              <button
                                className="btn btn-outline-info"
                                onClick={() => handleMaintenanceClick(asset)}
                                type="button"
                                title="Maintenance"
                              >
                                <Wrench size={12} />
                              </button>
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleEditAsset(asset)}
                                type="button"
                                title="Edit Asset"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteAsset(asset.id)}
                                type="button"
                                title="Delete Asset"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "allocations" && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Truck size={30} className="text-success" />
                  Asset Allocations
                </h6>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-success fs-6 px-3 py-2">
                    {
                      assetAllocations.filter((a) => a.status === "Active")
                        .length
                    }{" "}
                    active
                  </span>
                  <button
                    className="btn btn-success btn-sm d-inline-flex align-items-center gap-1"
                    onClick={() => setShowAllocationModal(true)}
                    type="button"
                  >
                    <Truck size={14} />
                    New Allocation
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Allocation ID</th>
                        <th>Asset Details</th>
                        <th>Employee Details</th>
                        <th>Allocation Date</th>
                        <th>Type</th>
                        <th>Approved By</th>
                        <th>Insurance</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAllocations.map((allocation) => (
                        <tr key={allocation.id}>
                          <td>
                            <code>{allocation.allocationId}</code>
                          </td>
                          <td>
                            <div className="fw-medium">
                              {allocation.assetName}
                            </div>
                            <small className="text-muted">
                              Asset ID: {allocation.assetId}
                            </small>
                          </td>
                          <td>
                            <div className="fw-medium">
                              {allocation.employeeName}
                            </div>
                            <small className="text-muted">
                              {allocation.employeeId} • {allocation.department}
                            </small>
                          </td>
                          <td>{allocation.allocationDate}</td>
                          <td>
                            <span className="badge bg-info bg-opacity-10 text-info">
                              {allocation.allocationType}
                            </span>
                          </td>
                          <td>{allocation.approvedBy}</td>
                          <td>
                            <span className="badge bg-success bg-opacity-10 text-success">
                              {allocation.insuranceCoverage}
                            </span>
                          </td>
                          <td>
                            {allocation.status === "Active" ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-secondary">
                                Returned
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-info"
                                onClick={() =>
                                  handleViewAllocationDetails(allocation)
                                }
                                type="button"
                                title="View Details"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleInitiateReturn(allocation)}
                                disabled={allocation.status !== "Active"}
                                title={
                                  allocation.status !== "Active"
                                    ? "Already returned"
                                    : "Initiate return"
                                }
                                type="button"
                              >
                                <ArchiveRestore size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "returns" && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <ArchiveRestore size={38} />
                  Asset Returns
                </h6>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-warning fs-6 px-3 py-2">
                    {assetReturns.length} Returns
                  </span>
                  <button
                    className="btn btn-warning btn-sm d-inline-flex align-items-center gap-1"
                    onClick={() => setShowReturnModal(true)}
                    type="button"
                  >
                    <ArchiveRestore size={14} />
                    Process Return
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Return ID</th>
                        <th>Asset Details</th>
                        <th>Employee Details</th>
                        <th>Return Date</th>
                        <th>Reason</th>
                        <th>Condition</th>
                        <th>Penalty</th>
                        <th>Certificate</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReturns.map((returnItem) => {
                        // Find the asset in master list
                        const asset = assetMaster.find(
                          (a) => a.assetId === returnItem.assetId,
                        );

                        return (
                          <tr key={returnItem.id}>
                            <td>
                              <code>{returnItem.returnId}</code>
                            </td>
                            <td>
                              <div className="fw-medium">
                                {returnItem.assetName}
                              </div>
                              <small className="text-muted">
                                Asset ID: {returnItem.assetId}
                                {!asset && (
                                  <span className="text-danger ms-2">
                                    (Not in inventory)
                                  </span>
                                )}
                              </small>
                            </td>
                            <td>
                              <div className="fw-medium">
                                {returnItem.employeeName}
                              </div>
                              <small className="text-muted">
                                {returnItem.employeeId} •{" "}
                                {returnItem.department}
                              </small>
                            </td>
                            <td>{returnItem.returnDate}</td>
                            <td>
                              <span className="badge bg-info bg-opacity-10 text-info">
                                {returnItem.returnReason}
                              </span>
                            </td>
                            <td>
                              {getConditionBadge(returnItem.conditionAtReturn)}
                            </td>
                            <td>
                              {returnItem.penaltyAmount !== "₹0" ? (
                                <span className="fw-bold text-danger">
                                  {returnItem.penaltyAmount}
                                </span>
                              ) : (
                                <span className="text-success">No penalty</span>
                              )}
                            </td>
                            <td>
                              <code>{returnItem.clearanceCertificate}</code>
                            </td>
                            <td>
                              <span className="badge bg-success">
                                Completed
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-info"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    if (asset) {
                                      // Found asset in master - view it normally
                                      handleViewAsset(asset);
                                    } else {
                                      // Asset not in master - create a temporary asset object with return data
                                      const tempAsset = {
                                        id: returnItem.id,
                                        assetId: returnItem.assetId,
                                        assetName: returnItem.assetName,
                                        assetTag: `RETURNED-${returnItem.returnId}`,
                                        category: "Returned Asset",
                                        condition: returnItem.conditionAtReturn,
                                        status: "Returned",
                                        serialNumber: "Unknown",
                                        purchaseDate: "Unknown",
                                        purchasePrice: "Unknown",
                                        currentValue: "Unknown",
                                        depreciationRate: "0%",
                                        location: "Storage",
                                        department: returnItem.department,
                                        allocatedTo: `${returnItem.employeeId} - ${returnItem.employeeName}`,
                                        allocationDate:
                                          returnItem.allocationDate,
                                        warrantyUntil: null,
                                        insurancePolicy: null,
                                        lastMaintenance: null,
                                        nextMaintenance: null,
                                        maintenanceHistory: [],
                                        // Add return-specific info
                                        returnInfo: {
                                          returnId: returnItem.returnId,
                                          returnDate: returnItem.returnDate,
                                          returnReason: returnItem.returnReason,
                                          penaltyAmount:
                                            returnItem.penaltyAmount,
                                          clearanceCertificate:
                                            returnItem.clearanceCertificate,
                                          missingItems: returnItem.missingItems,
                                          damageDetails:
                                            returnItem.damageDetails,
                                        },
                                      };

                                      // Show this temporary asset in view modal
                                      setSelectedAsset(tempAsset);
                                      setShowViewModal(true);
                                    }
                                  }}
                                  type="button"
                                  title="View Details"
                                >
                                  <Eye size={12} />
                                </button>
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => {
                                    if (asset && asset.status === "Available") {
                                      handleReallocateAsset(returnItem);
                                    } else {
                                      alert(
                                        asset
                                          ? `Cannot re-allocate: Asset status is "${asset.status}"`
                                          : "Asset not found in current inventory",
                                      );
                                    }
                                  }}
                                  title="Re-allocate this asset"
                                  type="button"
                                >
                                  <Truck size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "maintenance" && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Wrench size={22} />
                  Maintenance History
                </h6>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-info">
                    {maintenanceHistory.length} records
                  </span>
                  <button
                    className="btn btn-info btn-sm text-white d-inline-flex align-items-center gap-1"
                    onClick={() => setShowMaintenanceModal(true)}
                    type="button"
                  >
                    <Wrench size={14} />
                    Add Maintenance
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Maintenance ID</th>
                        <th>Asset Details</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Cost</th>
                        <th>Performed By</th>
                        <th>Description</th>
                        <th>Warranty</th>
                        <th>Next Due</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaintenance.map((maintenance) => (
                        <tr key={maintenance.id}>
                          <td>
                            <code>{maintenance.maintenanceId}</code>
                          </td>
                          <td>
                            <div className="fw-medium">
                              {maintenance.assetName}
                            </div>
                            <small className="text-muted">
                              Asset ID: {maintenance.assetId}
                            </small>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                maintenance.maintenanceType === "Emergency"
                                  ? "bg-danger"
                                  : maintenance.maintenanceType === "Corrective"
                                    ? "bg-warning"
                                    : maintenance.maintenanceType ===
                                        "Preventive"
                                      ? "bg-success"
                                      : "bg-info"
                              }`}
                            >
                              {maintenance.maintenanceType}
                            </span>
                          </td>
                          <td>{maintenance.maintenanceDate}</td>
                          <td className="fw-bold">{maintenance.cost}</td>
                          <td>{maintenance.performedBy}</td>
                          <td>
                            <div
                              className="small text-truncate"
                              style={{ maxWidth: "200px" }}
                            >
                              {maintenance.description}
                            </div>
                          </td>
                          <td>
                            {maintenance.warrantyCovered ? (
                              <span className="badge bg-success">Yes</span>
                            ) : (
                              <span className="badge bg-secondary">No</span>
                            )}
                          </td>
                          <td>{maintenance.nextMaintenanceDate}</td>
                          <td>
                            <span className="badge bg-success">Completed</span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-info"
                                onClick={() =>
                                  handleViewMaintenanceDetails(maintenance)
                                }
                                type="button"
                                title="View Details"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() =>
                                  handleEditMaintenance(maintenance)
                                }
                                type="button"
                                title="Edit Maintenance"
                              >
                                <Edit size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "insurance" && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <ShieldCheck size={28} />
                  Insurance Policies
                </h6>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-success">
                    {insurancePolicies.length} policies
                  </span>
                  <button
                    className="btn btn-success btn-sm d-inline-flex align-items-center gap-1"
                    onClick={() => setShowInsuranceModal(true)}
                    type="button"
                  >
                    <ShieldCheck size={14} className="me-1" />
                    Add Policy
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Policy ID</th>
                        <th>Asset Details</th>
                        <th>Provider</th>
                        <th>Policy Number</th>
                        <th>Coverage Amount</th>
                        <th>Premium</th>
                        <th>Coverage Type</th>
                        <th>Validity</th>
                        <th>Claims</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {insurancePolicies.map((policy) => (
                        <tr key={policy.id}>
                          <td>
                            <code>{policy.policy_number || policy.id}</code>
                          </td>
                          <td>
                            <div className="fw-medium">{getAssetNameForPolicy(policy)}</div>
                            <small className="text-muted">
                              Asset ID: {policy.asset_id}
                            </small>
                          </td>
                          <td>{policy.insurance_provider ?? policy.provider}</td>
                          <td>
                            <code>{policy.policy_number}</code>
                          </td>
                          <td className="fw-bold text-success">
                            {formatPolicyCurrency(policy.coverage_amount)}
                          </td>
                          <td>{formatPolicyCurrency(policy.premium_amount ?? policy.premium)}</td>
                          <td>
                            <span className="badge bg-info bg-opacity-10 text-info">
                              {policy.coverage_type || "—"}
                            </span>
                          </td>
                          <td>
                            <div className="small">
                              <div>From: {policy.start_date || "—"}</div>
                              <div>To: {policy.end_date || "—"}</div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-secondary">—</span>
                          </td>
                          <td>
                            <span className={`badge bg-${(policy.status || "").toLowerCase() === "active" ? "success" : "secondary"}`}>
                              {policy.status || "Active"}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-info"
                                onClick={() => handleViewPolicyDetails(policy)}
                                type="button"
                                title="View Policy Details"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleFileClaim(policy)}
                                type="button"
                                title="File Claim"
                              >
                                <AlertCircle size={12} />
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeletePolicy(policy)}
                                type="button"
                                title="Delete Policy"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "depreciation" && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <TrendingDown size={18} className="text-primary" />
                  Asset Depreciation Schedule
                </h6>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-primary">
                    {depreciationSchedule.length} assets
                  </span>
                  <button
                    className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
                    onClick={() => {
                      alert("Depreciation calculation feature coming soon!");
                    }}
                    type="button"
                  >
                    <Calculator size={14} />
                    Calculate
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Asset Details</th>
                        <th>Purchase Price</th>
                        <th>Depreciation Rate</th>
                        <th>Method</th>
                        <th>Useful Life</th>
                        <th>Current Value</th>
                        <th>Yearly Depreciation</th>
                        <th>Accumulated</th>
                        <th>Net Book Value</th>
                        <th>Next Calculation</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {depreciationSchedule.map((schedule) => (
                        <tr key={schedule.id}>
                          <td>
                            <div className="fw-medium">
                              {schedule.assetName}
                            </div>
                            <small className="text-muted">
                              Asset ID: {schedule.assetId}
                            </small>
                          </td>
                          <td className="fw-bold">{schedule.purchasePrice}</td>
                          <td>
                            <span className="badge bg-warning">
                              {schedule.depreciationRate}
                            </span>
                          </td>
                          <td>{schedule.depreciationMethod}</td>
                          <td>{schedule.usefulLife}</td>
                          <td className="fw-bold text-success">
                            {schedule.currentValue}
                          </td>
                          <td>{schedule.yearlyDepreciation}</td>
                          <td>{schedule.accumulatedDepreciation}</td>
                          <td className="fw-bold">{schedule.netBookValue}</td>
                          <td>{schedule.nextDepreciationDate}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-info"
                                onClick={() => {
                                  const asset = assetMaster.find(
                                    (a) => a.assetId === schedule.assetId,
                                  );
                                  if (asset) handleViewAsset(asset);
                                }}
                                type="button"
                                title="View Asset"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => {
                                  alert(
                                    "Edit depreciation schedule feature coming soon!",
                                  );
                                }}
                                type="button"
                                title="Edit Schedule"
                              >
                                <Edit size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Section */}
      {activeSection === "reports" && <ReportsSection />}

      {/* Asset View Modal - Fixed with scroll inside modal */}
      {showViewModal && selectedAsset && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary bg-opacity-10 border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2 text-primary mb-0">
                  <Eye size={30} />
                  Asset Details – {selectedAsset.assetName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowViewModal(false)}
                />
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Basic Information</h6>
                    <div className="mb-2">
                      <small className="text-muted">Asset ID</small>
                      <div className="fw-medium">{selectedAsset.assetId}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Asset Tag</small>
                      <div className="fw-medium">{selectedAsset.assetTag}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Category</small>
                      <div className="d-flex align-items-center gap-2">
                        {getCategoryIcon(selectedAsset.category)}
                        <span>{selectedAsset.category}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Make & Model</small>
                      <div className="fw-medium">
                        {selectedAsset.make} {selectedAsset.model}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Serial Number</small>
                      <div className="fw-medium">
                        {selectedAsset.serialNumber}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Status & Value</h6>
                    <div className="mb-2">
                      <small className="text-muted">Status</small>
                      <div>{getStatusBadge(selectedAsset.status)}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Condition</small>
                      <div>{getConditionBadge(selectedAsset.condition)}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Purchase Details</small>
                      <div className="fw-medium">
                        {selectedAsset.purchaseDate} •{" "}
                        {selectedAsset.purchasePrice}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Current Value</small>
                      <div className="fw-bold text-success h5">
                        {selectedAsset.currentValue}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Depreciation Rate</small>
                      <div className="fw-medium">
                        {selectedAsset.depreciationRate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Location & Allocation</h6>
                    <div className="mb-2">
                      <small className="text-muted">Location</small>
                      <div className="fw-medium">{selectedAsset.location}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Department</small>
                      <div className="fw-medium">
                        {selectedAsset.department}
                      </div>
                    </div>
                    {selectedAsset.allocatedTo && (
                      <div className="mb-2">
                        <small className="text-muted">Allocated To</small>
                        <div className="fw-medium">
                          {selectedAsset.allocatedTo}
                        </div>
                        <small className="text-muted">
                          Since: {selectedAsset.allocationDate}
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Maintenance & Warranty</h6>
                    <div className="mb-2">
                      <small className="text-muted">Last Maintenance</small>
                      <div className="fw-medium">
                        {selectedAsset.lastMaintenance || "None"}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Next Maintenance Due</small>
                      <div className="fw-medium">
                        {selectedAsset.nextMaintenance || "Not scheduled"}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Warranty Until</small>
                      <div className="fw-medium">
                        {selectedAsset.warrantyUntil || "No warranty"}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Insurance Policy</small>
                      <div className="fw-medium">
                        {(() => {
                          const policy = getPolicyForAsset(selectedAsset.id);
                          if (!policy) return "No insurance";
                          return `${policy.insurance_provider ?? policy.provider} – ${policy.policy_number} (${policy.status || "Active"})`;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedAsset.maintenanceHistory &&
                  selectedAsset.maintenanceHistory.length > 0 && (
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">Maintenance History</h6>
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Type</th>
                              <th>Cost</th>
                              <th>Technician</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedAsset.maintenanceHistory.map(
                              (history, index) => (
                                <tr key={index}>
                                  <td>{history.date}</td>
                                  <td>{history.type}</td>
                                  <td>{history.cost}</td>
                                  <td>{history.technician}</td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                  type="button"
                >
                  Close
                </button>
                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditAsset(selectedAsset);
                  }}
                  type="button"
                >
                  <Edit size={16} />
                  Edit Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Details Modal - Fixed with scroll inside modal */}
      {showAllocationDetails && selectedAllocation && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Truck size={38} />
                  Allocation Details - {selectedAllocation.allocationId}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowAllocationDetails(false)}
                  type="button"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Asset Information</h6>
                    <div className="mb-2">
                      <small className="text-muted">Asset Name</small>
                      <div className="fw-medium">
                        {selectedAllocation.assetName}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Asset ID</small>
                      <div className="fw-medium">
                        {selectedAllocation.assetId}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Allocation Type</small>
                      <div className="fw-medium">
                        {selectedAllocation.allocationType}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Reason</small>
                      <div className="fw-medium">
                        {selectedAllocation.allocationReason}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Employee Details</h6>
                    <div className="mb-2">
                      <small className="text-muted">Employee Name</small>
                      <div className="fw-medium">
                        {selectedAllocation.employeeName}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Employee ID</small>
                      <div className="fw-medium">
                        {selectedAllocation.employeeId}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Department</small>
                      <div className="fw-medium">
                        {selectedAllocation.department}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Allocation Date</small>
                      <div className="fw-medium">
                        {selectedAllocation.allocationDate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Approval & Handover</h6>
                    <div className="mb-2">
                      <small className="text-muted">Approved By</small>
                      <div className="fw-medium">
                        {selectedAllocation.approvedBy}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Handover Date</small>
                      <div className="fw-medium">
                        {selectedAllocation.handoverDate}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Handover By</small>
                      <div className="fw-medium">
                        {selectedAllocation.handoverBy}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Acknowledgment</small>
                      <div className="fw-medium">
                        {selectedAllocation.acknowledgment}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Terms & Insurance</h6>
                    <div className="mb-2">
                      <small className="text-muted">Insurance Coverage</small>
                      <div className="fw-medium">
                        {selectedAllocation.insuranceCoverage}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Terms Accepted</small>
                      <div className="fw-medium">
                        {selectedAllocation.termsAccepted ? "Yes" : "No"} on{" "}
                        {selectedAllocation.termsAcceptedDate}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Expected Return Date</small>
                      <div className="fw-medium">
                        {selectedAllocation.expectedReturnDate}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Status</small>
                      <div>
                        {selectedAllocation.status === "Active" ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-secondary">Returned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedAllocation.handoverChecklist &&
                  selectedAllocation.handoverChecklist.length > 0 && (
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">Handover Checklist</h6>
                      <div className="row">
                        {selectedAllocation.handoverChecklist.map(
                          (item, index) => (
                            <div className="col-md-4 mb-2" key={index}>
                              <div
                                className={`d-flex align-items-center gap-2 ${item.checked ? "text-success" : "text-danger"}`}
                              >
                                {item.checked ? (
                                  <Check size={16} />
                                ) : (
                                  <X size={16} />
                                )}
                                <span>{item.item}</span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAllocationDetails(false)}
                  type="button"
                >
                  Close
                </button>
                {selectedAllocation.status === "Active" && (
                  <button
                    className="btn btn-warning d-flex align-items-center gap-2"
                    onClick={() => {
                      setShowAllocationDetails(false);
                      handleInitiateReturn(selectedAllocation);
                    }}
                    type="button"
                  >
                    <ArchiveRestore size={16} />
                    Initiate Return
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Details Modal - Fixed with scroll inside modal */}
      {showMaintenanceDetails && selectedMaintenance && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Wrench size={38} />
                  <span>
                    Maintenance Details – {selectedMaintenance.maintenanceId}
                  </span>
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowMaintenanceDetails(false)}
                  type="button"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Asset Information</h6>
                    <div className="mb-2">
                      <small className="text-muted">Asset Name</small>
                      <div className="fw-medium">
                        {selectedMaintenance.assetName}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Asset ID</small>
                      <div className="fw-medium">
                        {selectedMaintenance.assetId}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Maintenance Type</small>
                      <div className="fw-medium">
                        <span
                          className={`badge ${
                            selectedMaintenance.maintenanceType === "Emergency"
                              ? "bg-danger"
                              : selectedMaintenance.maintenanceType ===
                                  "Corrective"
                                ? "bg-warning"
                                : selectedMaintenance.maintenanceType ===
                                    "Preventive"
                                  ? "bg-success"
                                  : "bg-info"
                          }`}
                        >
                          {selectedMaintenance.maintenanceType}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Maintenance Date</small>
                      <div className="fw-medium">
                        {selectedMaintenance.maintenanceDate}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Cost & Warranty</h6>
                    <div className="mb-2">
                      <small className="text-muted">Cost</small>
                      <div className="fw-bold h5">
                        {selectedMaintenance.cost}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Warranty Covered</small>
                      <div className="fw-medium">
                        {selectedMaintenance.warrantyCovered ? (
                          <span className="badge bg-success">Yes</span>
                        ) : (
                          <span className="badge bg-secondary">No</span>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Performed By</small>
                      <div className="fw-medium">
                        {selectedMaintenance.performedBy}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Next Maintenance Due</small>
                      <div className="fw-medium">
                        {selectedMaintenance.nextMaintenanceDate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-12 mb-3">
                    <h6 className="fw-bold mb-3">Description</h6>
                    <div className="p-3 bg-light rounded">
                      {selectedMaintenance.description}
                    </div>
                  </div>
                </div>

                {selectedMaintenance.attachments &&
                  selectedMaintenance.attachments.length > 0 && (
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">Attachments</h6>
                      <div className="row">
                        {selectedMaintenance.attachments.map(
                          (attachment, index) => (
                            <div className="col-md-4 mb-2" key={index}>
                              <div className="p-2 border rounded d-flex align-items-center gap-2">
                                <FileText size={16} />
                                <span className="small">{attachment}</span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowMaintenanceDetails(false)}
                  type="button"
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowMaintenanceDetails(false);
                    handleEditMaintenance(selectedMaintenance);
                  }}
                  type="button"
                >
                  <Edit className="me-2" size={16} />
                  Edit Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals for Add/Edit/Allocate/Return/Maintenance - Fixed with scroll */}
      {showAssetModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary bg-opacity-10 text-primary">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Package size={26} />
                  {editMode ? "Edit Asset" : "Add New Asset"}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowAssetModal(false);
                    setEditMode(false);
                    setEditAsset(null);
                  }}
                  type="button"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <form id="assetForm">
                  <div className="alert alert-info d-flex align-items-center gap-2 mb-3">
                    <Info size={16} />
                    {editMode
                      ? "Update asset information"
                      : "Fill all required fields to add a new asset"}
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Asset Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="assetName"
                        name="assetName"
                        className="form-control"
                        placeholder="e.g., Dell Latitude 5440"
                        defaultValue={editAsset?.assetName}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="form-select"
                        defaultValue={editAsset?.category}
                        required
                      >
                        <option value="">Select Category</option>
                        {assetCategories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Make <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="make"
                        name="make"
                        className="form-control"
                        placeholder="e.g., Dell"
                        defaultValue={editAsset?.make}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Model <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="model"
                        name="model"
                        className="form-control"
                        placeholder="e.g., Latitude 5440"
                        defaultValue={editAsset?.model}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Serial Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="serialNumber"
                        name="serialNumber"
                        className="form-control"
                        placeholder="Unique serial number"
                        defaultValue={editAsset?.serialNumber}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Purchase Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="purchaseDate"
                        name="purchaseDate"
                        className="form-control"
                        defaultValue={editAsset?.purchaseDate}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Purchase Price (₹){" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="purchasePrice"
                        name="purchasePrice"
                        className="form-control"
                        placeholder="e.g., 85000"
                        defaultValue={editAsset?.purchasePrice?.replace(
                          "₹",
                          "",
                        )}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Depreciation Rate (%){" "}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        id="depreciationRate"
                        name="depreciationRate"
                        className="form-select"
                        defaultValue={editAsset?.depreciationRate?.replace(
                          "%",
                          "",
                        )}
                        required
                      >
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                        <option value="20">20%</option>
                        <option value="25">25%</option>
                        <option value="30">30%</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Condition <span className="text-danger">*</span>
                      </label>
                      <select
                        id="condition"
                        name="condition"
                        className="form-select"
                        defaultValue={editAsset?.condition}
                        required
                      >
                        {assetConditions.map((cond) => (
                          <option key={cond.value} value={cond.value}>
                            {cond.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Location <span className="text-danger">*</span>
                      </label>
                      <select
                        id="location"
                        name="location"
                        className="form-select"
                        defaultValue={editAsset?.location}
                        required
                      >
                        <option value="">Select Location</option>
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Department <span className="text-danger">*</span>
                      </label>
                      <select
                        id="department"
                        name="department"
                        className="form-select"
                        defaultValue={editAsset?.department}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Warranty Until</label>
                      <input
                        type="date"
                        id="warrantyUntil"
                        name="warrantyUntil"
                        className="form-control"
                        defaultValue={editAsset?.warrantyUntil}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowAssetModal(false);
                    setEditMode(false);
                    setEditAsset(null);
                  }}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={() => {
                    const form = document.getElementById("assetForm");
                    if (!form.checkValidity()) {
                      form.reportValidity();
                      return;
                    }
                    const formData = {
                      assetName: document.getElementById("assetName").value,
                      category: document.getElementById("category").value,
                      make: document.getElementById("make").value,
                      model: document.getElementById("model").value,
                      serialNumber:
                        document.getElementById("serialNumber").value,
                      purchaseDate:
                        document.getElementById("purchaseDate").value,
                      purchasePrice: document.getElementById("purchasePrice").value,
                      depreciationRate: document.getElementById("depreciationRate").value,
                      condition: document.getElementById("condition").value,
                      location: document.getElementById("location").value,
                      department: document.getElementById("department").value,
                      warrantyUntil:
                        document.getElementById("warrantyUntil").value || null,
                    };
                    handleAddAsset(formData, editMode, editAsset?.id);
                  }}
                  type="button"
                >
                  <Save size={16} />
                  {editMode ? "Update Asset" : "Save Asset"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAllocationModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-success bg-opacity-10 border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Truck size={26} />
                  Allocate Asset
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowAllocationModal(false)}
                  type="button"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <form id="allocationForm">
                  <div className="alert alert-info d-flex align-items-center gap-2 mb-3">
                    <Info size={16} />
                    Select an available asset and provide employee details
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Select Asset <span className="text-danger">*</span>
                    </label>
                    <select
                      id="allocationAssetId"
                      name="assetId"
                      className="form-select"
                      defaultValue={selectedAsset?.id}
                      required
                    >
                      <option value="">Select Available Asset</option>
                      {assetMaster
                        .filter((a) => a.status === "Available")
                        .map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.assetName} ({asset.assetTag}) -{" "}
                            {asset.currentValue}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Employee ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        className="form-control"
                        placeholder="e.g., EMP001"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Employee Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        className="form-control"
                        placeholder="Full name"
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Department <span className="text-danger">*</span>
                      </label>
                      <select
                        id="allocationDepartment"
                        name="department"
                        className="form-select"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Allocation Type <span className="text-danger">*</span>
                      </label>
                      <select
                        id="allocationType"
                        name="allocationType"
                        className="form-select"
                        required
                      >
                        <option value="New Joining">New Joining</option>
                        <option value="Role Change">Role Change</option>
                        <option value="Replacement">Replacement</option>
                        <option value="Project Requirement">
                          Project Requirement
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Allocation Reason <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="allocationReason"
                      name="allocationReason"
                      className="form-control"
                      rows="3"
                      placeholder="Reason for allocation..."
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowAllocationModal(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success d-flex align-items-center gap-2"
                  onClick={() => {
                    const form = document.getElementById("allocationForm");
                    if (!form.checkValidity()) {
                      form.reportValidity();
                      return;
                    }
                    const allocationData = {
                      assetId:
                        document.getElementById("allocationAssetId").value,
                      employeeId: document.getElementById("employeeId").value,
                      employeeName:
                        document.getElementById("employeeName").value,
                      department: document.getElementById(
                        "allocationDepartment",
                      ).value,
                      allocationType:
                        document.getElementById("allocationType").value,
                      allocationReason:
                        document.getElementById("allocationReason").value,
                    };
                    handleAllocateAsset(allocationData);
                    setShowAllocationModal(false);
                  }}
                  type="button"
                >
                  <Check size={16} />
                  Allocate Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReturnModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-warning bg-opacity-10 border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <ArchiveRestore size={18} />
                  Process Asset Return
                </h5>
                <button
                  className="btn-close"
                  onClick={() => { setShowReturnModal(false); setSelectedAllocation(null); }}
                  type="button"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <form id="returnForm">
                  <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
                    <AlertCircle size={16} />
                    Complete physical verification before processing return
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Select Allocation to Return{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      id="returnAllocationId"
                      name="allocationId"
                      className="form-select"
                      defaultValue={selectedAllocation?.id || selectedAsset?.id}
                      required
                    >
                      <option value="">Select Active Allocation</option>
                      {assetAllocations
                        .filter((a) => a.status === "Active")
                        .map((alloc) => (
                          <option key={alloc.id} value={alloc.id}>
                            {alloc.assetName} - {alloc.employeeName} ({alloc.department})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Return Reason <span className="text-danger">*</span>
                      </label>
                      <select
                        id="returnReason"
                        name="returnReason"
                        className="form-select"
                        required
                      >
                        <option value="">Select Reason</option>
                        <option value="Employee Resignation">
                          Employee Resignation
                        </option>
                        <option value="Internal Transfer">
                          Internal Transfer
                        </option>
                        <option value="Asset Upgrade">Asset Upgrade</option>
                        <option value="End of Project">End of Project</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Condition at Return{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        id="conditionAtReturn"
                        name="conditionAtReturn"
                        className="form-select"
                        required
                      >
                        {assetConditions.map((cond) => (
                          <option key={cond.value} value={cond.value}>
                            {cond.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Missing Items</label>
                      <input
                        type="text"
                        id="missingItems"
                        name="missingItems"
                        className="form-control"
                        placeholder="List missing items, if any"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Damage Details</label>
                      <input
                        type="text"
                        id="damageDetails"
                        name="damageDetails"
                        className="form-control"
                        placeholder="Describe any damage"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => { setShowReturnModal(false); setSelectedAllocation(null); }}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-warning d-flex align-items-center gap-2"
                  onClick={() => {
                    const form = document.getElementById("returnForm");
                    if (!form.checkValidity()) {
                      form.reportValidity();
                      return;
                    }
                    const returnData = {
                      allocationId: document.getElementById("returnAllocationId").value,
                      allocation_id: document.getElementById("returnAllocationId").value,
                      returnReason:
                        document.getElementById("returnReason").value,
                      conditionAtReturn:
                        document.getElementById("conditionAtReturn").value,
                      missingItems:
                        document.getElementById("missingItems").value || "",
                      damageDetails:
                        document.getElementById("damageDetails").value || "",
                    };
                    handleReturnAsset(returnData);
                    setShowReturnModal(false);
                  }}
                  type="button"
                >
                  <ArchiveRestore size={16} />
                  <span>Process Return</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insurance Modal - Fixed with scroll */}
      {showMaintenanceModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Wrench size={38} />
                  {selectedMaintenance
                    ? "Edit Maintenance Record"
                    : "Add Maintenance Record"}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowMaintenanceModal(false);
                    setSelectedMaintenance(null);
                  }}
                  type="button"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <form id="maintenanceForm">
                  <div className="alert alert-info d-flex align-items-center gap-2 mb-3">
                    <Info size={16} />
                    {selectedMaintenance
                      ? "Update maintenance details"
                      : "Record maintenance details for an asset"}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Select Asset <span className="text-danger">*</span>
                    </label>
                    <select
                      id="maintenanceAssetId"
                      name="assetId"
                      className="form-select"
                      defaultValue={
                        selectedAsset?.id || selectedMaintenance?.assetId
                      }
                      required
                    >
                      <option value="">Select Asset</option>
                      {assetMaster.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.assetName} ({asset.assetTag})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Maintenance Type <span className="text-danger">*</span>
                      </label>
                      <select
                        id="maintenanceType"
                        name="maintenanceType"
                        className="form-select"
                        defaultValue={selectedMaintenance?.maintenanceType}
                        required
                      >
                        <option value="Preventive">Preventive</option>
                        <option value="Corrective">Corrective</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Routine Check">Routine Check</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Maintenance Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="maintenanceDate"
                        name="maintenanceDate"
                        className="form-control"
                        defaultValue={selectedMaintenance?.maintenanceDate}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Next Maintenance Date
                      </label>
                      <input
                        type="date"
                        id="nextMaintenanceDate"
                        name="nextMaintenanceDate"
                        className="form-control"
                        defaultValue={selectedMaintenance?.nextMaintenanceDate}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Cost (₹) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="maintenanceCost"
                        name="cost"
                        className="form-control"
                        placeholder="0"
                        defaultValue={selectedMaintenance?.cost?.replace(
                          "₹",
                          "",
                        )}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Performed By <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="performedBy"
                        name="performedBy"
                        className="form-control"
                        placeholder="Technician/Service center"
                        defaultValue={selectedMaintenance?.performedBy}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="maintenanceDescription"
                      name="description"
                      className="form-control"
                      rows="3"
                      placeholder="Describe maintenance work done..."
                      defaultValue={selectedMaintenance?.description}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowMaintenanceModal(false);
                    setSelectedMaintenance(null);
                  }}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-info text-white d-flex align-items-center gap-2"
                  onClick={() => {
                    const form = document.getElementById("maintenanceForm");
                    if (!form.checkValidity()) {
                      form.reportValidity();
                      return;
                    }
                    const maintenanceData = {
                      assetId:
                        document.getElementById("maintenanceAssetId").value,
                      maintenanceType:
                        document.getElementById("maintenanceType").value,
                      maintenanceDate:
                        document.getElementById("maintenanceDate").value,
                      nextMaintenanceDate:
                        document.getElementById("nextMaintenanceDate").value ||
                        null,
                      cost: `₹${document.getElementById("maintenanceCost").value}`,
                      performedBy: document.getElementById("performedBy").value,
                      description: document.getElementById(
                        "maintenanceDescription",
                      ).value,
                    };
                    handleAddMaintenance(maintenanceData);
                    setShowMaintenanceModal(false);
                    setSelectedMaintenance(null);
                  }}
                  type="button"
                >
                  <Save size={16} />
                  <span>
                    {selectedMaintenance ? "Update Record" : "Save Record"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insurance Modal - Fixed with scroll */}
      {showInsuranceModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <ShieldCheck size={23} />
                  Add Insurance Policy
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowInsuranceModal(false)}
                  type="button"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <div className="alert alert-info d-flex align-items-center gap-2 mb-3">
                  <Info size={16} />
                  Add insurance policy details for an asset
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Asset *</label>
                  <select
                    className="form-select"
                    value={insuranceForm.asset_id}
                    onChange={(e) => setInsuranceForm((f) => ({ ...f, asset_id: e.target.value }))}
                  >
                    <option value="">Select Asset</option>
                    {assetMaster.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.assetName} ({asset.assetTag})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Insurance Provider *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., ICICI Lombard"
                      value={insuranceForm.insurance_provider}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, insurance_provider: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Policy Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Policy number"
                      value={insuranceForm.policy_number}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, policy_number: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Coverage Amount (₹) *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., 85000"
                      value={insuranceForm.coverage_amount}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, coverage_amount: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Premium (₹) *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., 8500"
                      value={insuranceForm.premium_amount}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, premium_amount: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Coverage Type</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Comprehensive"
                      value={insuranceForm.coverage_type}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, coverage_type: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={insuranceForm.status}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, status: e.target.value }))}
                    >
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={insuranceForm.start_date}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, start_date: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={insuranceForm.end_date}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, end_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Coverage Details</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="e.g., Accidental damage, theft, fire"
                    value={insuranceForm.coverage_details}
                    onChange={(e) => setInsuranceForm((f) => ({ ...f, coverage_details: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deductible (₹)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., 5000"
                    value={insuranceForm.deductible}
                    onChange={(e) => setInsuranceForm((f) => ({ ...f, deductible: e.target.value }))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowInsuranceModal(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success d-inline-flex align-items-center gap-2"
                  disabled={insuranceSubmitting || !insuranceForm.asset_id || !insuranceForm.insurance_provider || !insuranceForm.policy_number}
                  onClick={async () => {
                    setInsuranceSubmitting(true);
                    try {
                      const payload = {
                        asset_id: Number(insuranceForm.asset_id),
                        insurance_provider: insuranceForm.insurance_provider,
                        policy_number: insuranceForm.policy_number,
                        coverage_amount: parseFloat(String(insuranceForm.coverage_amount).replace(/[^0-9.]/g, "")) || 0,
                        premium_amount: parseFloat(String(insuranceForm.premium_amount).replace(/[^0-9.]/g, "")) || 0,
                        coverage_type: insuranceForm.coverage_type || null,
                        start_date: insuranceForm.start_date || null,
                        end_date: insuranceForm.end_date || null,
                        coverage_details: insuranceForm.coverage_details || null,
                        deductible: insuranceForm.deductible ? parseFloat(String(insuranceForm.deductible).replace(/[^0-9.]/g, "")) : null,
                        status: insuranceForm.status || "Active",
                      };
                      await assetsAPI.createInsurance(payload);
                      setInsuranceForm({ asset_id: "", insurance_provider: "", policy_number: "", coverage_amount: "", premium_amount: "", coverage_type: "", start_date: "", end_date: "", coverage_details: "", deductible: "", status: "Active" });
                      setShowInsuranceModal(false);
                      fetchData();
} catch (err) {
      const msg = err?.message;
      alert(typeof msg === "string" ? msg : JSON.stringify(msg) || "Failed to add insurance policy");
                    } finally {
                      setInsuranceSubmitting(false);
                    }
                  }}
                  type="button"
                >
                  <Save size={16} />
                  {insuranceSubmitting ? "Saving…" : "Save Policy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Policy Details Modal – same API keys as backend */}
      {showPolicyDetailsModal && selectedPolicy && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <ShieldCheck size={23} />
                  Insurance Policy Details
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => { setShowPolicyDetailsModal(false); setSelectedPolicy(null); }}
                  type="button"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Policy</h6>
                    <div className="mb-2">
                      <small className="text-muted">id</small>
                      <div className="fw-medium">{selectedPolicy.id}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">policy_number</small>
                      <div className="fw-medium">{selectedPolicy.policy_number}</div>
                    </div>
                    <div className="mb-2">
                    <small className="text-muted">insurance_provider</small>
                    <div className="fw-medium">{selectedPolicy.insurance_provider ?? selectedPolicy.provider}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">coverage_type</small>
                      <div className="fw-medium">{selectedPolicy.coverage_type || "—"}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">status</small>
                      <div>
                        <span className={`badge bg-${(selectedPolicy.status || "").toLowerCase() === "active" ? "success" : "secondary"}`}>
                          {selectedPolicy.status || "Active"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-bold mb-3">Asset & Validity</h6>
                    <div className="mb-2">
                      <small className="text-muted">asset_id</small>
                      <div className="fw-medium">{selectedPolicy.asset_id} – {getAssetNameForPolicy(selectedPolicy)}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">start_date</small>
                      <div className="fw-medium">{selectedPolicy.start_date || "—"}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">end_date</small>
                      <div className="fw-medium">{selectedPolicy.end_date || "—"}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">coverage_amount</small>
                      <div className="fw-bold text-success">{formatPolicyCurrency(selectedPolicy.coverage_amount)}</div>
                    </div>
                    <div className="mb-2">
                    <small className="text-muted">premium_amount</small>
                    <div className="fw-medium">{formatPolicyCurrency(selectedPolicy.premium_amount ?? selectedPolicy.premium)}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">deductible</small>
                      <div className="fw-medium">{formatPolicyCurrency(selectedPolicy.deductible)}</div>
                    </div>
                  </div>
                </div>
                {selectedPolicy.coverage_details && (
                  <div className="mb-3">
                    <small className="text-muted">coverage_details</small>
                    <div className="fw-medium">{selectedPolicy.coverage_details}</div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => { setShowPolicyDetailsModal(false); setSelectedPolicy(null); }}
                  type="button"
                >
                  Close
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    handleDeletePolicy(selectedPolicy);
                    setShowPolicyDetailsModal(false);
                    setSelectedPolicy(null);
                  }}
                  type="button"
                >
                  <X size={16} /> Delete Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal - Fixed with scroll */}
      {showClaimModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <AlertCircle size={18} />
                  File Insurance Claim
                </h5>
                <button
                  className="btn-close"
                  onClick={() => { setShowClaimModal(false); setSelectedPolicy(null); }}
                  type="button"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
                  <AlertCircle size={16} />
                  File insurance claim for {selectedAsset?.assetName}
                  {selectedPolicy && (
                    <span className="ms-2 small">
                      (Policy: {selectedPolicy.policy_number} – {selectedPolicy.insurance_provider ?? selectedPolicy.provider})
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Claim Date *</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Claim Amount (₹) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Claim amount"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Claim Reason *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Describe the reason for claim..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => { setShowClaimModal(false); setSelectedPolicy(null); }}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-warning d-inline-flex align-items-center gap-2"
                  onClick={() => {
                    alert("Insurance claim filed successfully!");
                    setShowClaimModal(false);
                    setSelectedPolicy(null);
                  }}
                  type="button"
                >
                  <AlertCircle size={16} />
                  File Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reallocate Modal - Fixed with scroll */}
      {showReallocateModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflow: "hidden" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Truck size={18} />
                  Re-allocate Asset
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowReallocateModal(false)}
                  type="button"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <div className="alert alert-info d-flex align-items-center gap-2 mb-3">
                  <Info size={16} />
                  Re-allocate {selectedAsset?.assetName} to a new employee
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Employee ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., EMP001"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Employee Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full name"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department *</label>
                    <select className="form-select">
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Allocation Type *</label>
                    <select className="form-select">
                      <option value="New Joining">New Joining</option>
                      <option value="Role Change">Role Change</option>
                      <option value="Replacement">Replacement</option>
                      <option value="Project Requirement">
                        Project Requirement
                      </option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Allocation Reason *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Reason for allocation..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowReallocateModal(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    alert("Asset re-allocated successfully!");
                    setShowReallocateModal(false);
                  }}
                  type="button"
                >
                  <Check className="me-2" size={16} />
                  Re-allocate Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default AssestManagement;