import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import Breadcrump from "../../../shared/components/Breadcrump";

// Import modularized modals
import DownloadManualAttendanceModal from "../modal/DownloadManualAttendanceModal";
import UploadManualAttendanceModal from "../modal/UploadManualAttendanceModal";
import { attendanceAPI } from "../../../shared/utils/api";

const ManualAttendance = () => {
  // Attendance data - will be populated from API
  const [attendance, setAttendance] = useState([]);

  const [financialYear, setFinancialYear] = useState(() => {
    const now = new Date();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${months[now.getMonth()]}-${now.getFullYear()}`;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Create a ref to track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleYearChange = (direction) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const [currentMonth, currentYearStr] = financialYear.split("-");
    let year = parseInt(currentYearStr);
    let monthIndex = months.indexOf(currentMonth);

    if (direction === "prev") {
      if (monthIndex === 0) {
        monthIndex = 11;
        year--;
      } else {
        monthIndex--;
      }
    } else if (direction === "next") {
      if (monthIndex === 11) {
        monthIndex = 0;
        year++;
      } else {
        monthIndex++;
      }
    }

    const newPeriod = `${months[monthIndex]}-${year}`;
    setFinancialYear(newPeriod);
    // Fetch attendance data for the new period
    fetchAttendanceData(newPeriod, false);
  };

  const mapRowFromBackend = (r) => ({
    id: r.employee_id,
    employeeId: r.employee_id,
    code: r.employee_code,
    name: r.employee_name,
    P: r.P, A: r.A, H: r.H, W: r.W, CO: r.CO, CL: r.CL, LW: r.LW,
  });

  const fetchAttendanceData = async (period, showToast = true) => {
    setIsLoading(true);
    try {
      const rows = await attendanceAPI.listManualAttendance({ period, page: 1, page_size: 200 });
      setAttendance((rows || []).map(mapRowFromBackend));

      if (!isInitialLoad && showToast) {
        toast.info(`Loaded attendance for ${period}`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load attendance data");
      setAttendance([]);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const handleChange = (id, field, value) => {
    setAttendance((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: Number(value) || 0 } : row
      )
    );
  };

  const handleSave = async (id) => {
    const emp = attendance.find((e) => e.id === id);
    if (!emp) return;

    try {
      const [mon, year] = financialYear.split("-");
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      await attendanceAPI.saveManualAttendance({
        employee_id: emp.employeeId,
        month: months.indexOf(mon) + 1,
        year: Number(year),
        P: emp.P, A: emp.A, H: emp.H, W: emp.W, CO: emp.CO, CL: emp.CL, LW: emp.LW,
      });
      toast.success(`Attendance saved for ${emp.name}`);
    } catch (error) {
      toast.error(error.message || "Failed to save attendance");
    }
  };

  const handleDownloadSubmit = async (format) => {
    try {
      window.open(attendanceAPI.downloadManualAttendanceUrl({ period: financialYear }), "_blank");
      toast.success(`Attendance downloaded successfully in ${format.toUpperCase()} format!`);
    } catch (error) {
      toast.error("Failed to download attendance");
    }
  };

  const handleUploadSubmit = async (file) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) throw new Error("File has no data rows");

      const headers = lines[0].split(",").map((h) => h.trim());
      const codeIdx = headers.findIndex((h) => h.toLowerCase().includes("employee code"));
      const colIdx = {};
      ["P", "A", "H", "W", "CO", "CL", "LW"].forEach((col) => {
        colIdx[col] = headers.findIndex((h) => h.trim().toUpperCase() === col);
      });

      if (codeIdx === -1) {
        throw new Error('CSV must have an "Employee Code" column');
      }

      const rows = lines.slice(1).map((line) => {
        const cells = line.split(",").map((c) => c.trim());
        const row = { employee_code: cells[codeIdx] };
        ["P", "A", "H", "W", "CO", "CL", "LW"].forEach((col) => {
          row[col] = colIdx[col] !== -1 ? Number(cells[colIdx[col]]) || 0 : 0;
        });
        return row;
      }).filter((r) => r.employee_code);

      const [mon, year] = financialYear.split("-");
      const result = await attendanceAPI.uploadManualAttendance({
        month: months.indexOf(mon) + 1,
        year: Number(year),
        rows,
      });

      toast.success(result.message || `File "${file.name}" uploaded successfully!`);
      fetchAttendanceData(financialYear, true);
    } catch (error) {
      toast.error(error.message || "Failed to upload file");
    }
  };

  // Filter Logic
  const filteredAttendance = attendance.filter((emp) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        emp.name?.toLowerCase().includes(searchLower) ||
        emp.code?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);

  useEffect(() => {
    // Fetch initial attendance data when component mounts - only once
    fetchAttendanceData(financialYear, false);
  }, []); // Empty dependency array - runs only once on mount

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, financialYear]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAttendance.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", link: "/hrms/dashboard" },
    { label: "Attendance", link: "/hrms/attendance" },
    { label: "Manual Attendance", active: true }
  ];

  // Define attendance fields
  const attendanceFields = ["P", "A", "H", "W", "CO", "CL", "LW"];

  return (
    <div className="w-full mx-auto max-w-7xl space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 sm:py-6">
      {/* <Breadcrump items={breadcrumbItems} /> */}

      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Icon icon="heroicons:pencil-square" className="w-6 h-6 text-blue-600" />
            Manual Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Capture number of days present, absent, etc. directly without tracking time punches.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            onClick={() => setShowDownloadModal(true)}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Download
          </button>
          <button
            type="button"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
            onClick={() => setShowUploadModal(true)}
          >
            <Icon icon="heroicons:arrow-up-tray" className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* ===== Filters ===== */}
      <div className="border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <Icon icon="heroicons:funnel" className="w-4 h-4 text-slate-500" />
          Filter Criteria
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Business Unit</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700">
              <option>All Units</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Location</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700">
              <option>All Locations</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Cost Center</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700">
              <option>All Cost Centers</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Department</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700">
              <option>All Departments</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===== Period selector + search ===== */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm max-w-xs">
          <button
            type="button"
            className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-200"
            onClick={() => handleYearChange("prev")}
          >
            <Icon icon="heroicons:chevron-left-20-solid" className="w-4 h-4" />
          </button>
          <div className="px-4 py-2 font-bold text-slate-700 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5">
            <Icon icon="heroicons:calendar" className="w-4 h-4 text-blue-500" />
            {financialYear}
          </div>
          <button
            type="button"
            className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors border-l border-slate-200"
            onClick={() => handleYearChange("next")}
          >
            <Icon icon="heroicons:chevron-right-20-solid" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 max-w-md w-full">
          <div className="relative flex-grow">
            <Icon icon="heroicons:magnifying-glass" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Employee name, code..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ===== Attendance Table ===== */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 mt-2">Loading attendance data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 text-center w-12">Sl.No</th>
                  <th className="p-3">Employee</th>
                  {attendanceFields.map((hdr) => (
                    <th key={hdr} className="p-3 text-center w-16">{hdr}</th>
                  ))}
                  <th className="p-3 text-center w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {currentData.length > 0 ? (
                  currentData.map((emp, index) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 text-center font-semibold text-slate-400">
                        {startIndex + index + 1}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{emp.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Code: {emp.code}</div>
                      </td>
                      {attendanceFields.map((field) => (
                        <td key={field} className="p-2">
                          <input
                            type="number"
                            min="0"
                            className="w-14 mx-auto block px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-center font-bold text-slate-700"
                            value={emp[field] || 0}
                            onChange={(e) => handleChange(emp.id, field, e.target.value)}
                          />
                        </td>
                      ))}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          className="w-8 h-8 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center transition-all mx-auto shadow-inner"
                          onClick={() => handleSave(emp.id)}
                          title="Save Changes"
                        >
                          <Icon icon="heroicons:check" className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                      <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-1.5 text-slate-300" />
                      No attendance records found for {financialYear}.
                      <p className="text-[10px] mt-1 text-slate-400">
                        Upload a CSV file or add attendance data via API to get started.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <nav className="flex justify-center mt-4">
          <ul className="flex items-center gap-1.5">
            <li>
              <button
                type="button"
                className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                  }`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Icon icon="heroicons:chevron-left-20-solid" className="w-4 h-4 text-slate-600" />
              </button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all border ${currentPage === idx + 1
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/15"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  onClick={() => goToPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
                  }`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Icon icon="heroicons:chevron-right-20-solid" className="w-4 h-4 text-slate-600" />
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* ===== Modals ===== */}
      {showDownloadModal && (
        <DownloadManualAttendanceModal
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          financialYear={financialYear}
          onDownload={handleDownloadSubmit}
        />
      )}

      {showUploadModal && (
        <UploadManualAttendanceModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          financialYear={financialYear}
          onUpload={handleUploadSubmit}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        className="text-xs"
      />
    </div>
  );
};

export default ManualAttendance;