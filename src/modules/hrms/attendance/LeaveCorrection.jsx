import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import DownloadLeaveCorrectionModal from "../modal/DownloadLeaveCorrectionModal";
import UploadLeaveCorrectionModal from "../modal/UploadLeaveCorrectionModal";
import { attendanceAPI } from "../../../shared/utils/api";

function LeaveCorrection() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState(() => {
    const now = new Date();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${months[now.getMonth()]}-${now.getFullYear()}`;
  });
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [leaveType, setLeaveType] = useState("LV458 - Comp Off");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialLoad = useRef(true);

  const ITEMS_PER_PAGE = 10;

  // NOTE: the original hardcoded list here (LV454-Present, LV455-Absent,
  // LV456-Holiday, LV457-Week Off, LV1055-Leave without Pay, LV2638-Sick
  // Leave, LV2640-Half Day) mostly didn't match the backend's actual 7
  // leave type codes at all — only "LV458 - Comp Off" happened to line up.
  // Replaced with the real list fetched from the backend.
  const [leaveTypes, setLeaveTypes] = useState(["LV458 - Comp Off"]);
  const [filterOptionsData, setFilterOptionsData] = useState({
    business_units: [], locations: [], cost_centers: [], departments: [],
  });

  useEffect(() => {
    attendanceAPI.getLeaveCorrectionFilterOptions()
      .then((opts) => {
        setLeaveTypes((opts.leave_types || []).map((lt) => lt.label));
        setFilterOptionsData({
          business_units: opts.business_units || [],
          locations: opts.locations || [],
          cost_centers: opts.cost_centers || [],
          departments: opts.departments || [],
        });
      })
      .catch((err) => console.error('Failed to load leave correction filter options:', err));
  }, []);

  const labelToCode = (label) => label?.split(' - ')[0]?.trim();

  const mapRowFromBackend = (r) => ({
    id: r.employee_id,
    employeeId: r.employee_id,
    code: r.employee_code,
    name: r.employee_name,
    designation: r.designation || '',
    opening: r.opening,
    activity: r.activity,
    correction: r.correction,
    closing: r.closing,
  });

  const fetchAttendanceData = async (period, showToast = true) => {
    setIsLoading(true);
    try {
      const rows = await attendanceAPI.listLeaveCorrections({
        period,
        leave_type_code: labelToCode(leaveType),
        page: 1,
        page_size: 200,
      });
      setEmployees((rows || []).map(mapRowFromBackend));
      if (!isInitialLoad.current && showToast) {
        toast.info(`Loaded leave corrections for ${period}`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load leave corrections data");
      setEmployees([]);
    } finally {
      setIsLoading(false);
      isInitialLoad.current = false;
    }
  };

  const handleMonthChange = (direction) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const [mon, year] = month.split("-");
    let monthIndex = months.indexOf(mon);
    let currentYear = parseInt(year);

    if (direction === "prev") {
      if (monthIndex === 0) {
        monthIndex = 11;
        currentYear--;
      } else {
        monthIndex--;
      }
    } else {
      if (monthIndex === 11) {
        monthIndex = 0;
        currentYear++;
      } else {
        monthIndex++;
      }
    }

    const newMonth = `${months[monthIndex]}-${currentYear}`;
    setMonth(newMonth);
    fetchAttendanceData(newMonth, true);
  };

  const handleLoad = () => {
    setPage(1);
    fetchAttendanceData(month, true);
  };

  const handleCorrectionChange = (id, value) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, correction: Number(value) || 0 } : emp
      )
    );
  };

  const handleSave = async (id) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;
    try {
      const [mon, year] = month.split("-");
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const result = await attendanceAPI.saveLeaveCorrection({
        employee_id: emp.employeeId,
        leave_type_code: labelToCode(leaveType),
        month: months.indexOf(mon) + 1,
        year: Number(year),
        correction: emp.correction,
      });
      setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, closing: result.closing } : e));
      toast.success(`Correction saved for ${emp.name}`);
    } catch (error) {
      toast.error(error.message || "Failed to save correction");
    }
  };

  const downloadAllExcel = () => {
    if (!employees.length) {
      toast.error("No data to export!");
      return;
    }

    const exportData = employees.map((emp) => ({
      Name: emp.name,
      ID: emp.id,
      Designation: emp.designation,
      Opening: emp.opening,
      Activity: emp.activity,
      Correction: emp.correction,
      Closing: emp.closing,
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leave Corrections");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `Leave_Corrections_${month}.xlsx`
    );
    toast.success("Downloaded successfully!");
  };

  const handleDownloadSubmit = async (format) => {
    try {
      if (format === 'csv') {
        window.open(
          attendanceAPI.downloadLeaveCorrectionsUrl({
            period: month,
            leave_type_code: labelToCode(leaveType),
          }),
          "_blank"
        );
      } else {
        downloadAllExcel();
      }
      toast.success(`Leave corrections downloaded successfully in ${format.toUpperCase()} format!`);
    } catch (error) {
      toast.error("Failed to download leave corrections");
    }
  };

  const handleUploadSubmit = async (file) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) throw new Error("File has no data rows");

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const empIdIdx = headers.findIndex((h) => h.includes("employee_id") || h === "id");
      const empCodeIdx = headers.findIndex((h) => h.includes("employee") && h.includes("code"));
      const correctionIdx = headers.findIndex((h) => h.includes("correction"));
      const remarksIdx = headers.findIndex((h) => h.includes("remark"));

      if (correctionIdx === -1 || (empIdIdx === -1 && empCodeIdx === -1)) {
        throw new Error("CSV must have employee_id (or employee_code) and correction columns");
      }

      const rows = lines.slice(1).map((line) => {
        const cells = line.split(",").map((c) => c.trim());
        let employee_id = empIdIdx !== -1 ? Number(cells[empIdIdx]) : null;
        if (!employee_id && empCodeIdx !== -1) {
          const match = employees.find((e) => e.code === cells[empCodeIdx]);
          employee_id = match?.employeeId;
        }
        return {
          employee_id,
          leave_type_code: labelToCode(leaveType),
          month: months.indexOf(month.split("-")[0]) + 1,
          year: Number(month.split("-")[1]),
          correction: Number(cells[correctionIdx]) || 0,
          remarks: remarksIdx !== -1 ? cells[remarksIdx] : null,
        };
      }).filter((r) => r.employee_id);

      if (rows.length === 0) {
        throw new Error("No valid rows found (couldn't resolve any employee_id)");
      }

      const [mon, year] = month.split("-");
      const result = await attendanceAPI.uploadLeaveCorrections(
        months.indexOf(mon) + 1, Number(year), labelToCode(leaveType), rows
      );

      toast.success(`${result.message || `File "${file.name}" uploaded successfully!`}`);
      setShowUploadModal(false);
      fetchAttendanceData(month, true);
    } catch (error) {
      toast.error(error.message || "Failed to upload file");
    }
  };

  useEffect(() => {
    fetchAttendanceData(month, false);
  }, [leaveType]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE) || 1;
  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="w-full mx-auto max-w-7xl space-y-4 sm:space-y-6 px-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Icon icon="heroicons:pencil-square" className="w-6 h-6 text-blue-600" />
            Leave Correction
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Make corrections in leave balances for employees.
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

      <div className="w-full flex flex-wrap items-center gap-4">
        <div className="flex items-center h-10 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          <button
            type="button"
            onClick={() => handleMonthChange("prev")}
            className="w-12 h-full flex items-center justify-center hover:bg-slate-100 border-r border-slate-200"
          >
            <Icon
              icon="heroicons:chevron-left"
              className="w-5 h-5 text-slate-600"
            />
          </button>

          <div className="px-6 h-full flex items-center gap-2 font-semibold text-slate-700 min-w-[170px] justify-center">

            <Icon
              icon="heroicons:calendar-days"
              className="w-5 h-5 text-blue-600"
            />

            {month}
          </div>

          <button
            type="button"
            onClick={() => handleMonthChange("next")}
            className="w-12 h-full flex items-center justify-center hover:bg-slate-100 border-l border-slate-200"
          >
            <Icon
              icon="heroicons:chevron-right"
              className="w-5 h-5 text-slate-600"
            />
          </button>

        </div>

        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="h-10 min-w-[280px] px-4 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {leaveTypes.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="relative flex-1 min-w-[320px]">
          <Icon
            icon="heroicons:magnifying-glass"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          />
          <input
            type="text"
            value={searchInput}
            placeholder="Search by Employee name, code..."
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="w-full h-10 pl-12 pr-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={handleLoad}
          className="h-10 px-8 bg-slate-900 hover:bg-black text-white rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Icon
            icon="heroicons:arrow-path"
            className="w-5 h-5"
          />

          View
        </button>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 mt-2">Loading leave corrections data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[12px]">
                <tr>
                  <th className="p-3 text-left min-w-[160px]">Employee</th>
                  <th className="p-3 text-left min-w-[140px]">Designation</th>
                  <th className="p-3 text-center w-20">Opening</th>
                  <th className="p-3 text-center w-20">
                    Activity <Icon icon="heroicons:information-circle" className="w-3.5 h-3.5 inline text-slate-400" />
                  </th>
                  <th className="p-3 text-center w-28">Correction</th>
                  <th className="p-3 text-center w-20">Closing</th>
                  <th className="p-3 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((emp, index) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-800 text-xs">{emp.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">ID: {emp.id}</div>
                      </td>
                      <td className="p-3 text-slate-600 text-xs">{emp.designation}</td>
                      <td className="p-3 text-center font-semibold text-slate-700">{emp.opening}</td>
                      <td className="p-3 text-center font-semibold text-slate-700">{emp.activity}</td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={emp.correction}
                          onChange={(e) => handleCorrectionChange(emp.id, e.target.value)}
                          className="w-16 mx-auto block px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-center font-bold text-slate-700"
                        />
                      </td>
                      <td className="p-3 text-center font-semibold text-slate-700">{emp.closing}</td>
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
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                      <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-1.5 text-slate-300" />
                      No leave correction records found.
                      <p className="text-[10px] mt-1 text-slate-400">
                        Upload a file or add leave correction data via API to get started.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-2">
        <p className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1.5">
          <Icon icon="heroicons:information-circle" className="w-4 h-4 text-cyan-500" />
          <span className="font-medium">Note:</span> Corrections are added at the beginning of the period.
        </p>

        {totalPages > 1 && (
          <nav className="flex justify-center sm:justify-end">
            <ul className="flex items-center gap-1.5">
              <li>
                <button
                  type="button"
                  className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors ${page === 1 ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={handlePrevious}
                  disabled={page === 1}
                >
                  <Icon icon="heroicons:chevron-left-20-solid" className="w-4 h-4 text-slate-600" />
                </button>
              </li>
              {[...Array(totalPages)].map((_, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all border ${
                      page === idx + 1
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/15"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors ${page === totalPages ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={handleNext}
                  disabled={page === totalPages}
                >
                  <Icon icon="heroicons:chevron-right-20-solid" className="w-4 h-4 text-slate-600" />
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {showDownloadModal && (
        <DownloadLeaveCorrectionModal
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          financialYear={month}
          onDownload={handleDownloadSubmit}
        />
      )}

      {showUploadModal && (
        <UploadLeaveCorrectionModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          financialYear={month}
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
}

export default LeaveCorrection;