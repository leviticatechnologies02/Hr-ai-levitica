import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import AddPunchModal from "../modal/AddPunchModal";
import AllPunchesModal from "../modal/AllPunchesModal";
import { attendanceAPI } from "../../../shared/utils/api";

const punchTypes = [
  { label: "Selfie", value: "selfie" },
  { label: "Remote", value: "remote" },
  { label: "Manual", value: "manual" },
];

const DailyAttendance = () => {
  const [filter, setFilter] = useState({
    businessUnit: "All Units",
    location: "All",
    costCenter: "All",
    department: "All",
    search: "",
  });
  const [selectedPunchFilter, setSelectedPunchFilter] = useState("all");

  const getFormattedDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [date, setDate] = useState(getFormattedDate(new Date()));
  const [showPunchModal, setShowPunchModal] = useState(false);
  const [showAddPunchModal, setShowAddPunchModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeePunches, setEmployeePunches] = useState({});

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filterOptionsData, setFilterOptionsData] = useState({
    business_units: ["All Units"], locations: ["All"], cost_centers: ["All"], departments: ["All"],
  });

  // UI shows dates as "15-Jun-2026"; the backend's query params expect
  // ISO "2026-06-15".
  const toIsoDate = (displayDate) => {
    const [day, monStr, year] = displayDate.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = String(monthNames.indexOf(monStr) + 1).padStart(2, "0");
    return `${year}-${month}-${day.padStart(2, "0")}`;
  };

  const mapPunchRowToAttendanceRow = (row) => ({
    id: row.id,
    name: row.employee_name || "",
    code: row.employee_code || "",
    date: row.summary_date,
    status: row.attendance_mark,
    note: "",
    location: row.location_name || "All",
    businessUnit: row.business_unit || "All Units",
    costCenter: row.cost_center || "All",
    designation: row.designation || "",
    department: row.department || "All",
    punchIn: row.start?.time || "--",
    punchOut: row.end?.time || "--",
    punchType: "Manual",
    isLate: row.is_late,
    processStatus: row.process_status,
    employeeId: row.employee_id,
  });

  const loadFilterOptions = async () => {
    try {
      const opts = await attendanceAPI.getPunchFilterOptions();
      setFilterOptionsData({
        business_units: ["All Units", ...(opts.business_units || [])],
        locations: ["All", ...(opts.locations || [])],
        cost_centers: ["All", ...(opts.cost_centers || [])],
        departments: ["All", ...(opts.departments || [])],
      });
    } catch (err) {
      console.error("Failed to load attendance filter options:", err.message);
    }
  };

  const loadDailyPunches = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = {
        punch_date: toIsoDate(date),
        page: 1,
        page_size: 200,
      };
      if (filter.businessUnit !== "All Units") params.business_unit = filter.businessUnit;
      if (filter.location !== "All") params.location = filter.location;
      if (filter.costCenter !== "All") params.cost_center = filter.costCenter;
      if (filter.department !== "All") params.department = filter.department;
      if (selectedPunchFilter === "late") params.late_only = true;
      if (selectedPunchFilter === "absent") params.absent_only = true;
      if (selectedPunchFilter === "nopunch") params.no_punches = true;

      const result = await attendanceAPI.listDailyPunches(params);
      setAttendanceData((result.items || []).map(mapPunchRowToAttendanceRow));
    } catch (err) {
      setLoadError(err.message);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDailyPunches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, filter.businessUnit, filter.location, filter.costCenter, filter.department, selectedPunchFilter]);

  useEffect(() => {
    // Load each visible employee's individual punch list (IN/OUT events)
    // lazily from the real per-employee endpoint, only for rows not
    // already cached — avoids re-fetching on every unrelated re-render.
    attendanceData.forEach((emp) => {
      if (!employeePunches[emp.id] && emp.employeeId) {
        attendanceAPI.getEmployeePunches(emp.employeeId, toIsoDate(date))
          .then((punches) => {
            setEmployeePunches((prev) => ({
              ...prev,
              [emp.id]: (punches || []).map((p) => ({
                time: p.punch_time,
                type: `${p.punch_type} Punch`,
                direction: p.punch_type,
                id: p.id,
              })),
            }));
          })
          .catch((err) => console.error(`Failed to load punches for employee ${emp.employeeId}:`, err.message));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceData]);

  const businessUnit = filterOptionsData.business_units;
  const locations = filterOptionsData.locations;
  const costCenters = filterOptionsData.cost_centers;
  const departments = filterOptionsData.departments;

  const filteredAttendanceData = attendanceData.filter((emp) => {
    if (filter.businessUnit !== "All Units" && emp.businessUnit !== filter.businessUnit) {
      return false;
    }
    if (filter.location !== "All" && emp.location !== filter.location) {
      return false;
    }
    if (filter.costCenter !== "All" && emp.costCenter !== filter.costCenter) {
      return false;
    }
    if (filter.department !== "All" && emp.department !== filter.department) {
      return false;
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      if (
        !emp.name.toLowerCase().includes(searchLower) &&
        !emp.code.toLowerCase().includes(searchLower) &&
        !emp.designation.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (selectedPunchFilter === "late" && emp.status !== "Late") {
      return false;
    }
    if (selectedPunchFilter === "absent" && emp.status !== "Absent") {
      return false;
    }
    if (selectedPunchFilter === "nopunch" && (emp.punchIn !== "--" && emp.punchOut !== "--")) {
      return false;
    }
    return true;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(filteredAttendanceData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, selectedPunchFilter, date]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAttendanceData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleDateChange = (direction) => {
    const dateParts = date.split("-");
    const day = parseInt(dateParts[0]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames.indexOf(dateParts[1]);
    const year = parseInt(dateParts[2]);

    const currentDate = new Date(year, month, day);
    const newDate = new Date(currentDate);

    if (direction === "next") {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }

    setDate(getFormattedDate(newDate));
  };

  const handleView = () => {
    toast.info("Filter applied successfully");
  };

  // NOTE: daily-punches (the router this screen is wired to) has no bulk
  // CSV import endpoint. Only daily_attendance.py has one (POST
  // .../attendance/daily/upload), but its contract requires resolving each
  // row to a real employee_code and creating full attendance records, not
  // the free-text preview rows this importer builds. Left as a local-only
  // preview — imported rows appear in the table but are NOT sent to or
  // persisted by the backend. Flagging as a needed follow-up rather than
  // silently faking persistence.
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1);

      const importedData = rows.map((line, idx) => {
        const values = line.split(",").map((v) => v.trim());
        const record = {};
        headers.forEach((header, i) => {
          record[header] = values[i] || "";
        });

        return {
          id: attendanceData.length + idx + 1,
          name: record.name || `Employee ${idx + 1}`,
          code: record.code || `EMP${idx + 1}`,
          date: date,
          status: record.status || "Present",
          note: record.note || "",
          location: record.location || "All",
          businessUnit: record.businessUnit || "All Units",
          costCenter: record.costCenter || "All",
          designation: record.designation || "",
          department: record.department || "All",
          punchIn: record.punchIn || "--",
          punchOut: record.punchOut || "--",
          punchType: record.punchType || "-",
          timeline: { start: "03:00A", general: "09:00A - 06:00P", end: "12:00A" },
        };
      });

      setAttendanceData((prev) => [...prev, ...importedData]);
      toast.success("File uploaded successfully");
    };

    reader.readAsText(file);
  };

  const handleExport = () => {
    const params = { punch_date: toIsoDate(date) };
    if (filter.businessUnit !== "All Units") params.business_unit = filter.businessUnit;
    if (filter.location !== "All") params.location = filter.location;
    if (filter.costCenter !== "All") params.cost_center = filter.costCenter;
    if (filter.department !== "All") params.department = filter.department;
    if (selectedPunchFilter === "late") params.late_only = true;
    if (selectedPunchFilter === "absent") params.absent_only = true;
    if (selectedPunchFilter === "nopunch") params.no_punches = true;

    // Real server-side CSV export (routers .../daily-punches/export) —
    // triggers a browser download directly from the backend rather than
    // re-serializing whatever's currently in local state.
    window.open(attendanceAPI.exportDailyPunchesUrl(params), "_blank");
    toast.success("Export started");
  };

  const [addingPunch, setAddingPunch] = useState(false);

  const handleAddPunchSubmit = async (formData) => {
    const { date: pDate, time, remarks: pRemarks, type } = formData;
    if (!pDate) {
      toast.error("Please select a punch date");
      return;
    }
    if (!time.hh || !time.mm || !time.ss) {
      toast.error("Please enter complete punch time (HH:MM:SS)");
      return;
    }
    if (!selectedEmployee?.employeeId) {
      toast.error("This row has no linked employee record to punch against");
      return;
    }

    const finalTime = `${String(time.hh).padStart(2, "0")}:${String(time.mm).padStart(2, "0")}:${String(time.ss).padStart(2, "0")}`;
    const punchTypeLabel = punchTypes.find((pt) => pt.value === type)?.label || type;

    setAddingPunch(true);
    try {
      // NOTE: the backend's manual-punch endpoint takes in_time/out_time as
      // a pair (not a single directional IN/OUT event), and no "punch type"
      // (selfie/remote/manual) or free-text reason distinction beyond
      // `reason`. Sending the new time as in_time; punchTypeLabel is folded
      // into the reason text since there's no dedicated field for it.
      await attendanceAPI.addManualPunch({
        employee_id: selectedEmployee.employeeId,
        punch_date: toIsoDate(pDate),
        in_time: finalTime,
        reason: `${punchTypeLabel} punch${pRemarks ? `: ${pRemarks}` : ''}`,
      });
      await loadDailyPunches();
      setEmployeePunches((prev) => {
        const next = { ...prev };
        delete next[selectedEmployee.id]; // force refetch of this employee's punch list
        return next;
      });
      toast.success(`Punch Added: ${pDate} ${finalTime} (${punchTypeLabel})`);
      setShowAddPunchModal(false);
      setSelectedEmployee(null);
    } catch (err) {
      toast.error(`Failed to add punch: ${err.message}`);
    } finally {
      setAddingPunch(false);
    }
  };

  const handleDeletePunch = async (punchId) => {
    if (!selectedEmployee) return;
    try {
      await attendanceAPI.deletePunch(punchId);
      const updatedPunches = employeePunches[selectedEmployee.id].filter(
        (p) => p.id !== punchId
      );
      setEmployeePunches((prev) => ({
        ...prev,
        [selectedEmployee.id]: updatedPunches,
      }));
      await loadDailyPunches();
      toast.success("Punch deleted successfully");
    } catch (err) {
      toast.error(`Failed to delete punch: ${err.message}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Present":
        return (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Present
          </span>
        );
      case "Absent":
        return (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
            Absent
          </span>
        );
      case "Late":
        return (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            Late
          </span>
        );
      case "Half Day":
        return (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100">
            Half Day
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full mx-auto max-w-7xl space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Icon icon="heroicons:calendar-days" className="w-6 h-6 text-blue-600" />
            Daily Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View or edit daily time punches for a single date.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">
            <Icon icon="heroicons:arrow-up-tray" className="w-4 h-4" />
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
            onClick={handleExport}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <Icon icon="heroicons:funnel" className="w-4 h-4 text-slate-500" />
          Filter Attendance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Business Unit</label>
            <select
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700"
              name="businessUnit"
              value={filter.businessUnit}
              onChange={handleFilterChange}
            >
              {businessUnit.map((b, i) => (
                <option key={i} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Location</label>
            <select
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700"
              name="location"
              value={filter.location}
              onChange={handleFilterChange}
            >
              {locations.map((loc, i) => (
                <option key={i} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Cost Center</label>
            <select
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700"
              name="costCenter"
              value={filter.costCenter}
              onChange={handleFilterChange}
            >
              {costCenters.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Departments</label>
            <select
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700"
              name="department"
              value={filter.department}
              onChange={handleFilterChange}
            >
              {departments.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "Show All", value: "all", icon: "heroicons:list-bullet" },
          { label: "Late Coming Only", value: "late", icon: "heroicons:clock" },
          { label: "Absent Only", value: "absent", icon: "heroicons:x-circle" },
          { label: "No Punches", value: "nopunch", icon: "heroicons:no-symbol" },
        ].map((f) => {
          const isActive = selectedPunchFilter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setSelectedPunchFilter(f.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${isActive
                ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/15"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <Icon icon={f.icon} className="w-3.5 h-3.5" />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm max-w-xs">
          <button
            type="button"
            className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-200"
            onClick={() => handleDateChange("prev")}
          >
            <Icon icon="heroicons:chevron-left-20-solid" className="w-4 h-4" />
          </button>
          <div className="px-4 py-2 font-bold text-slate-700 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5">
            <Icon icon="heroicons:calendar" className="w-4 h-4 text-blue-500" />
            {date}
          </div>
          <button
            type="button"
            className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors border-l border-slate-200"
            onClick={() => handleDateChange("next")}
          >
            <Icon icon="heroicons:chevron-right-20-solid" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 max-w-md w-full">
          <div className="relative flex-grow">
            <Icon icon="heroicons:magnifying-glass" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="search"
              placeholder="Search by Employee name, code, designation..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700 shadow-sm"
              value={filter.search}
              onChange={handleFilterChange}
            />
          </div>
          <button
            type="button"
            className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
            onClick={handleView}
          >
            <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
            View
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {currentData.length > 0 ? (
          currentData.map((emp) => (
            <div
              key={emp.id}
              className="border border-slate-200 hover:border-blue-100 hover:shadow-md transition-all duration-200 bg-white rounded-2xl p-4 sm:p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200">
                    {emp.name?.charAt(0) || "E"}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm sm:text-base">
                      {emp.name || "Unknown Employee"}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Code: {emp.code || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100/50">
                    <Icon icon="heroicons:map-pin" className="w-3.5 h-3.5" />
                    {emp.location || "N/A"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100/50">
                    <Icon icon="heroicons:briefcase" className="w-3.5 h-3.5" />
                    {emp.designation || "N/A"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100/50">
                    <Icon icon="heroicons:building-office" className="w-3.5 h-3.5" />
                    {emp.department || "N/A"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center pt-3 border-t border-slate-100 text-xs">
                <div className="space-y-1.5">
                  <div className="font-bold text-blue-600">{emp.date || date}</div>
                  <div className="flex flex-col gap-1">
                    <div>{getStatusBadge(emp.status || "Present")}</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed font-medium">{emp.note || ""}</div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    General Shift Timeline
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-2">
                    <div className="bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl border border-slate-100/80 sm:border-0 flex items-center justify-between sm:block sm:w-1/5 sm:text-left">
                      <div className="text-[10px] text-slate-400 font-semibold">{emp.timeline?.start || "03:00A"}</div>
                      <div className="hidden sm:block h-1 bg-emerald-500 rounded-full my-1"></div>
                      <div className="text-xs sm:text-[10px] text-blue-600 font-extrabold">
                        In: {emp.punchIn || "--"}
                      </div>
                    </div>

                    <div className="hidden sm:block sm:w-3/5 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>09:00 AM</span>
                        <span>06:00 PM</span>
                      </div>
                      <div className="h-1 bg-blue-500 rounded-full"></div>
                    </div>

                    <div className="bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl border border-slate-100/80 sm:border-0 flex items-center justify-between sm:block sm:w-1/5 sm:text-right">
                      <div className="text-[10px] text-slate-400 font-semibold">{emp.timeline?.end || "12:00A"}</div>
                      <div className="hidden sm:block h-1 bg-amber-500 rounded-full my-1"></div>
                      <div className="text-xs sm:text-[10px] text-emerald-600 font-extrabold">
                        Out: {emp.punchOut || "--"} {emp.punchType && emp.punchType !== "-" && `(${emp.punchType})`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col lg:flex-row justify-between md:justify-center items-center gap-3">
                  <div className="text-left md:text-center lg:text-left">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Total In-Time</span>
                    <strong className="text-blue-600 font-extrabold text-sm sm:text-base">8 h 35 m</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-all shadow-inner"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowAddPunchModal(true);
                      }}
                      title="Add Punch"
                    >
                      <Icon icon="heroicons:plus" className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full flex items-center justify-center transition-all shadow-inner"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowPunchModal(true);
                      }}
                      title="View All Punches"
                    >
                      <Icon icon="heroicons:ellipsis-horizontal" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="border border-slate-200 bg-white rounded-2xl p-8 text-center text-slate-400 text-xs sm:text-sm">
            <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-1.5 text-slate-300" />
            No attendance records found for the selected filters.
            <p className="mt-2 text-[10px] text-slate-400">
              Upload a CSV file or add attendance data via API to get started.
            </p>
          </div>
        )}
      </div>

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

      {showPunchModal && selectedEmployee && (
        <AllPunchesModal
          isOpen={showPunchModal}
          onClose={() => {
            setShowPunchModal(false);
            setSelectedEmployee(null);
          }}
          selectedPunch={selectedEmployee}
          punches={employeePunches[selectedEmployee.id]}
          onDeletePunch={handleDeletePunch}
        />
      )}

      {showAddPunchModal && selectedEmployee && (
        <AddPunchModal
          isOpen={showAddPunchModal}
          onClose={() => {
            setShowAddPunchModal(false);
            setSelectedEmployee(null);
          }}
          selectedPunch={selectedEmployee}
          onSubmit={handleAddPunchSubmit}
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

export default DailyAttendance;