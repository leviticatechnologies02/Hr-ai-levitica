import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import { attendanceAPI } from "../../../shared/utils/api";

import SelfiePunchModal from "../modal/SelfiePunchModal";
import PunchLocationModal from "../modal/PunchLocationModal";
import AddPunchModal from "../modal/AddPunchModal";
import AllPunchesModal from "../modal/AllPunchesModal";

function DailyPunches() {
  const [filterOptionsData, setFilterOptionsData] = useState({
    business_units: ["All Units"], locations: ["All Locations"], cost_centers: ["All Cost Centers"], departments: ["All Departments"],
  });
  const businessUnit = filterOptionsData.business_units;
  const locations = filterOptionsData.locations;
  const costCenters = filterOptionsData.cost_centers;
  const departments = filterOptionsData.departments;

  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAddPunchModal, setShowAddPunchModal] = useState(false);
  const [showAllPunchesModal, setShowAllPunchesModal] = useState(false);
  const [selectedPunchForModal, setSelectedPunchForModal] = useState(null);
  const [punchesData, setPunchesData] = useState([]);

  const [filter, setFilter] = useState({
    businessUnit: "All Units",
    location: "All Locations",
    costCenter: "All Cost Centers",
    department: "All Departments",
    search: "",
  });
  const [selectedPunchFilter, setSelectedPunchFilter] = useState("all");

  const getFormattedDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [selectedDate, setSelectedDate] = useState(getFormattedDate(new Date()));
  const [employeePunches, setEmployeePunches] = useState({});
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const onPunchFilterChange = (value) => setSelectedPunchFilter(value);

  const toIsoDate = (displayDate) => {
    const [day, month, year] = displayDate.split("-");
    return `${year}-${month}-${day}`;
  };

  const mapPunchRowToLocal = (row) => ({
    id: row.id,
    name: row.employee_name || "",
    code: row.employee_code || "",
    designation: row.designation || "",
    department: row.department || "",
    businessUnit: row.business_unit || "",
    location: row.location_name || "",
    start: row.start?.time || "",
    end: row.end?.time || "",
    duration: row.worked_hours ? `${row.worked_hours}h` : "",
    attendance: row.attendance_mark === "Present" ? "P" : row.attendance_mark === "Absent" ? "A" : row.attendance_mark === "Late" ? "L" : row.attendance_mark,
    attendanceColor: "info",
    registeredFace: "/assets/img/users/user-01.jpg",
    punchImage: "/assets/img/users/user-01.jpg",
    locationUrl: "",
    employeeId: row.employee_id,
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadFilterOptions = async () => {
    try {
      const opts = await attendanceAPI.getPunchFilterOptions();
      setFilterOptionsData({
        business_units: ["All Units", ...(opts.business_units || [])],
        locations: ["All Locations", ...(opts.locations || [])],
        cost_centers: ["All Cost Centers", ...(opts.cost_centers || [])],
        departments: ["All Departments", ...(opts.departments || [])],
      });
    } catch (err) {
      console.error("Failed to load punch filter options:", err.message);
    }
  };

  const loadPunches = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = { punch_date: toIsoDate(selectedDate), page: 1, page_size: 200 };
      if (filter.businessUnit !== "All Units") params.business_unit = filter.businessUnit;
      if (filter.location !== "All Locations") params.location = filter.location;
      if (filter.costCenter !== "All Cost Centers") params.cost_center = filter.costCenter;
      if (filter.department !== "All Departments") params.department = filter.department;
      if (selectedPunchFilter === "late") params.late_only = true;
      if (selectedPunchFilter === "absent") params.absent_only = true;
      if (selectedPunchFilter === "nopunch") params.no_punches = true;

      const result = await attendanceAPI.listDailyPunches(params);
      setPunchesData((result.items || []).map(mapPunchRowToLocal));
    } catch (err) {
      setLoadError(err.message);
      setPunchesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadPunches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, filter.businessUnit, filter.location, filter.costCenter, filter.department, selectedPunchFilter]);

  const handleView = () => {
    loadPunches();
    toast.info(`👀 Viewing punches for ${selectedDate}`);
  };

  const filteredPunches = punchesData.filter((p) => {
    if (filter.businessUnit !== "All Units" && p.businessUnit !== filter.businessUnit) {
      return false;
    }
    if (filter.location !== "All Locations" && p.location !== filter.location) {
      return false;
    }
    if (filter.costCenter !== "All Cost Centers" && p.costCenter !== filter.costCenter) {
      return false;
    }
    if (filter.department !== "All Departments" && p.department !== filter.department) {
      return false;
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const name = (p.name || "").toLowerCase();
      const code = (p.code || "").toLowerCase();
      const designation = (p.designation || "").toLowerCase();

      if (!name.includes(searchLower) && !code.includes(searchLower) && !designation.includes(searchLower)) {
        return false;
      }
    }
    if (selectedPunchFilter === "late" && p.attendance !== "L") {
      return false;
    }
    if (selectedPunchFilter === "absent" && p.attendance !== "A") {
      return false;
    }
    if (selectedPunchFilter === "nopunch" && (p.start !== "" && p.end !== "")) {
      return false;
    }
    return true;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(filteredPunches.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, selectedPunchFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredPunches.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // NOTE: same gap as DailyAttendance.jsx — daily-punches has no bulk CSV
  // import endpoint (only daily_attendance.py does, with a different,
  // incompatible contract). Left as a local-only preview; imported rows
  // display in the table but are not sent to or persisted by the backend.
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
        const punch = {};
        headers.forEach((header, i) => {
          punch[header] = values[i] || "";
        });

        return {
          id: punchesData.length + idx + 1,
          name: punch.name,
          code: punch.code,
          designation: punch.designation || "",
          start: punch.start || "",
          end: punch.end || "",
          duration: punch.duration || "",
          attendance: punch.attendance || "P",
          attendanceColor: "info",
          registeredFace: "/assets/img/users/user-01.jpg",
          punchImage: "/assets/img/users/user-01.jpg",
          locationUrl: punch.locationUrl || "",
        };
      });

      setPunchesData((prev) => [...prev, ...importedData]);
      toast.success("CSV imported successfully! (preview only — not saved to backend, no matching bulk-import endpoint exists on this router)");
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    window.open(
      attendanceAPI.exportDailyPunchesUrl({
        punch_date: toIsoDate(selectedDate),
        ...(filter.businessUnit !== "All Units" && { business_unit: filter.businessUnit }),
        ...(filter.location !== "All Locations" && { location: filter.location }),
        ...(filter.costCenter !== "All Cost Centers" && { cost_center: filter.costCenter }),
        ...(filter.department !== "All Departments" && { department: filter.department }),
      }),
      "_blank"
    );
    toast.success("Export started");
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const monthIndex = String(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${monthIndex}/${year}`;
  };

  const month = formatDate(currentMonthDate);

  const handleMonthChange = (direction) => {
    setCurrentMonthDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 1);
      } else if (direction === "next") {
        newDate.setDate(newDate.getDate() + 1);
      }

      const day = String(newDate.getDate()).padStart(2, "0");
      const monthIndex = String(newDate.getMonth() + 1).padStart(2, "0");
      const year = newDate.getFullYear();
      setSelectedDate(`${day}-${monthIndex}-${year}`);

      return newDate;
    });
  };

  useEffect(() => {
    punchesData.forEach((emp) => {
      if (!employeePunches[emp.id] && emp.employeeId) {
        attendanceAPI.getEmployeePunches(emp.employeeId, toIsoDate(selectedDate))
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
  }, [punchesData]);

  const [addingPunch, setAddingPunch] = useState(false);

  const handleAddPunchSubmit = async (formData) => {
    const { date, time, remarks, type } = formData;
    if (!date) {
      toast.error("Please select a punch date");
      return;
    }
    if (!time.hh || !time.mm || !time.ss) {
      toast.error("Please enter complete punch time (HH:MM:SS)");
      return;
    }
    if (!selectedPunchForModal?.employeeId) {
      toast.error("This row has no linked employee record to punch against");
      return;
    }

    const finalTime = `${String(time.hh).padStart(2, "0")}:${String(time.mm).padStart(2, "0")}:${String(time.ss).padStart(2, "0")}`;
    const punchTypeLabel = type.charAt(0).toUpperCase() + type.slice(1);

    setAddingPunch(true);
    try {
      // NOTE: same gap as DailyAttendance.jsx — the backend's manual-punch
      // endpoint takes a single in_time/out_time pair, not a directional
      // punch type; punchTypeLabel folded into the reason text instead.
      await attendanceAPI.addManualPunch({
        employee_id: selectedPunchForModal.employeeId,
        punch_date: toIsoDate(date),
        in_time: finalTime,
        reason: `${punchTypeLabel} punch${remarks ? `: ${remarks}` : ''}`,
      });
      await loadPunches();
      setEmployeePunches((prev) => {
        const next = { ...prev };
        delete next[selectedPunchForModal.id];
        return next;
      });
      toast.success(`Punch added: ${date} ${finalTime} (${punchTypeLabel})`);
      setShowAddPunchModal(false);
      setSelectedPunchForModal(null);
    } catch (err) {
      toast.error(`Failed to add punch: ${err.message}`);
    } finally {
      setAddingPunch(false);
    }
  };

  const handleDeletePunch = async (punchId) => {
    if (!selectedPunchForModal) return;
    try {
      await attendanceAPI.deletePunch(punchId);
      const updatedPunches = employeePunches[selectedPunchForModal.id].filter(
        (p) => p.id !== punchId
      );
      setEmployeePunches((prev) => ({
        ...prev,
        [selectedPunchForModal.id]: updatedPunches,
      }));
      await loadPunches();
      toast.success("Punch deleted successfully");
    } catch (err) {
      toast.error(`Failed to delete punch: ${err.message}`);
    }
  };

  const getAttendanceBadge = (status) => {
    switch (status) {
      case "P":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Present
          </span>
        );
      case "A":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
            Absent
          </span>
        );
      case "L":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            Late
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full mx-auto max-w-7xl space-y-4 sm:space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Icon icon="heroicons:clock" className="w-6 h-6 text-blue-600" />
            Daily Punches
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
          Filter Punches
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
              onClick={() => onPunchFilterChange(f.value)}
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
            onClick={() => handleMonthChange("prev")}
          >
            <Icon icon="heroicons:chevron-left-20-solid" className="w-4 h-4" />
          </button>
          <div className="px-4 py-2 font-bold text-slate-700 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5">
            <Icon icon="heroicons:calendar" className="w-4 h-4 text-blue-500" />
            {selectedDate}
          </div>
          <button
            type="button"
            className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors border-l border-slate-200"
            onClick={() => handleMonthChange("next")}
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

      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Employee Info</th>
                <th className="p-3 text-center">Face Registered</th>
                <th className="p-3 text-center">Punch Selfie</th>
                <th className="p-3 text-center">Punch Location</th>
                <th className="p-3 text-center">In Time</th>
                <th className="p-3 text-center">Out Time</th>
                <th className="p-3 text-center">Duration</th>
                <th className="p-3 text-center">Attendance</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentData.length > 0 ? (
                currentData.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">Code: {p.code}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{p.designation}</div>
                    </td>
                    <td className="p-3 text-center">
                      {p.registeredFace ? (
                        <img
                          src={p.registeredFace}
                          alt="Face"
                          className="w-8 h-8 rounded-full border border-slate-200 mx-auto object-cover"
                        />
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {p.punchImage ? (
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 mx-auto hover:ring-2 hover:ring-blue-500/50 transition-all block"
                          onClick={() => {
                            setSelectedPunchForModal(p);
                            setShowModal(true);
                          }}
                        >
                          <img src={p.punchImage} alt="Selfie" className="w-full h-full object-cover" />
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {p.locationUrl ? (
                        <button
                          type="button"
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors inline-flex items-center justify-center shadow-inner"
                          onClick={() => {
                            setSelectedPunchForModal(p);
                            setShowLocationModal(true);
                          }}
                        >
                          <Icon icon="heroicons:map-pin" className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center font-semibold">{p.start || "--"}</td>
                    <td className="p-3 text-center font-semibold">{p.end || "--"}</td>
                    <td className="p-3 text-center font-medium text-slate-500">{p.duration || "--"}</td>
                    <td className="p-3 text-center">{getAttendanceBadge(p.attendance)}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-all shadow-inner"
                          onClick={() => {
                            setSelectedPunchForModal(p);
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
                            setSelectedPunchForModal(p);
                            setShowAllPunchesModal(true);
                          }}
                          title="All Punches"
                        >
                          <Icon icon="heroicons:ellipsis-horizontal" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-medium">
                    <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-1.5 text-slate-300" />
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Icon icon="heroicons:information-circle" className="w-4 h-4 text-slate-400" />
          Punch Legends
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Biometric Fetch", icon: "heroicons:fingerprint" },
            { label: "Biometric Sync", icon: "heroicons:arrow-path" },
            { label: "Manual", icon: "heroicons:pencil-square" },
            { label: "Excel Import", icon: "heroicons:document-text" },
            { label: "Missed", icon: "heroicons:clock" },
            { label: "Time Relax", icon: "heroicons:adjustments-horizontal" },
            { label: "Travel", icon: "heroicons:truck" },
            { label: "API", icon: "heroicons:command-line" },
          ].map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm"
            >
              <Icon icon={item.icon} className="w-3.5 h-3.5 text-slate-400" />
              {item.label}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 text-[10px] font-bold">
          <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            XX - Processed
          </span>
          <span className="inline-flex px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
            XX - Pending
          </span>
        </div>
      </div>

      {showModal && selectedPunchForModal && (
        <SelfiePunchModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedPunchForModal(null);
          }}
          selectedPunch={selectedPunchForModal}
        />
      )}

      {showLocationModal && selectedPunchForModal && (
        <PunchLocationModal
          isOpen={showLocationModal}
          onClose={() => {
            setShowLocationModal(false);
            setSelectedPunchForModal(null);
          }}
          selectedPunch={selectedPunchForModal}
        />
      )}

      {showAddPunchModal && selectedPunchForModal && (
        <AddPunchModal
          isOpen={showAddPunchModal}
          onClose={() => {
            setShowAddPunchModal(false);
            setSelectedPunchForModal(null);
          }}
          selectedPunch={selectedPunchForModal}
          onSubmit={handleAddPunchSubmit}
        />
      )}

      {showAllPunchesModal && selectedPunchForModal && (
        <AllPunchesModal
          isOpen={showAllPunchesModal}
          onClose={() => {
            setShowAllPunchesModal(false);
            setSelectedPunchForModal(null);
          }}
          selectedPunch={selectedPunchForModal}
          punches={employeePunches[selectedPunchForModal.id]}
          onDeletePunch={handleDeletePunch}
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

export default DailyPunches;