import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import { attendanceAPI, employeeAPI } from "../../../shared/utils/api";

const MonthlyAttendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [employee, setEmployee] = useState({
    name: "",
    code: "",
    joinDate: "",
    exitDate: "-",
    location: "",
    department: "",
    designation: "",
    shift: "",
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [employeeDirectory, setEmployeeDirectory] = useState([]);
  const [resolvedEmployeeId, setResolvedEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterOptionsData, setFilterOptionsData] = useState({
    business_units: ["All Units"], locations: ["All Locations"], cost_centers: ["All Cost Centers"], departments: ["All Departments"],
  });

  useEffect(() => {
    employeeAPI.list()
      .then((list) => setEmployeeDirectory(list || []))
      .catch((err) => console.error("Failed to load employee directory:", err.message));
    attendanceAPI.getMonthlyFilterOptions()
      .then((opts) => setFilterOptionsData({
        business_units: ["All Units", ...(opts.business_units || [])],
        locations: ["All Locations", ...(opts.locations || [])],
        cost_centers: ["All Cost Centers", ...(opts.cost_centers || [])],
        departments: ["All Departments", ...(opts.departments || [])],
      }))
      .catch((err) => console.error("Failed to load monthly filter options:", err.message));
  }, []);

  const getDaysForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: "", status: "", hasPunch: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dayOfWeek = dateObj.getDay();

      const attendance = attendanceData.find(
        (a) => new Date(a.date).getDate() === day &&
          new Date(a.date).getMonth() === month &&
          new Date(a.date).getFullYear() === year
      );

      let status = "";
      let hasPunch = false;

      if (attendance) {
        status = attendance.status || "";
        hasPunch = attendance.hasPunch || false;
      } else {
        status = "";
        hasPunch = false;
      }

      days.push({
        day: String(day).padStart(2, "0"),
        status: status,
        hasPunch: hasPunch,
      });
    }

    const totalCells = days.length;
    const remainingCells = totalCells % 7;
    if (remainingCells !== 0) {
      for (let i = 0; i < 7 - remainingCells; i++) {
        days.push({ day: "", status: "", hasPunch: false });
      }
    }

    return days;
  };

  const days = getDaysForMonth();

  const formatMonthYear = (dateObj) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${months[dateObj.getMonth()]}-${dateObj.getFullYear()}`;
  };

  const handleMonthChange = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleExport = () => {
    if (!resolvedEmployeeId) {
      toast.error("Please view an employee's calendar first!");
      return;
    }
    window.open(
      attendanceAPI.downloadMonthlyCsvUrl({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        employee_id: resolvedEmployeeId,
      }),
      "_blank"
    );
    toast.success("Attendance export started!");
  };

  const loadCalendar = async (employeeId) => {
    setLoading(true);
    try {
      const calendar = await attendanceAPI.getMonthlyCalendar(
        employeeId,
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      );
      setEmployee({
        name: calendar.employee.employee_name,
        code: calendar.employee.employee_code,
        joinDate: calendar.employee.date_of_joining || "",
        exitDate: calendar.employee.date_of_exit || "-",
        location: calendar.employee.location || "",
        department: calendar.employee.department || "",
        designation: calendar.employee.designation || "",
        shift: calendar.employee.default_shift || "",
      });
      setAttendanceData(
        calendar.days.map((d) => ({
          date: d.date,
          status: d.day_code,
          hasPunch: d.has_punch,
        }))
      );
    } catch (err) {
      toast.error(`Failed to load calendar: ${err.message}`);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async () => {
    if (!selectedEmployee) {
      toast.warning("Please select an employee");
      return;
    }

    // Employee field is free text — resolve it against the real directory
    // by name or employee code (case-insensitive substring match), since
    // the backend's calendar endpoint needs a real numeric employee_id.
    const search = selectedEmployee.toLowerCase();
    const matches = employeeDirectory.filter(
      (e) => e.name?.toLowerCase().includes(search) || e.employeeId?.toLowerCase().includes(search)
    );

    if (matches.length === 0) {
      toast.error(`No employee found matching "${selectedEmployee}"`);
      return;
    }
    if (matches.length > 1) {
      toast.warning(`${matches.length} employees match "${selectedEmployee}" — please narrow your search (e.g. use their employee code)`);
      return;
    }

    setResolvedEmployeeId(matches[0].id);
    await loadCalendar(matches[0].id);
    toast.info(`Viewing attendance for ${matches[0].name}`);
  };

  // Re-fetch the currently viewed employee's calendar when navigating months
  useEffect(() => {
    if (resolvedEmployeeId) {
      loadCalendar(resolvedEmployeeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const getCalendarStyle = (status) => {
    switch (status) {
      case "P":
        return "bg-emerald-50 border-emerald-100 text-emerald-700";
      case "A":
        return "bg-rose-50 border-rose-100 text-rose-700";
      case "W":
        return "bg-slate-100 border-slate-200 text-slate-500";
      case "H":
        return "bg-blue-50 border-blue-100 text-blue-700";
      case "CO":
        return "bg-amber-50 border-amber-100 text-amber-700";
      case "CL":
        return "bg-sky-50 border-sky-100 text-sky-700";
      case "LW":
        return "bg-slate-100 border-slate-200 text-slate-500";
      case "SL":
        return "bg-indigo-50 border-indigo-100 text-indigo-700";
      case "HD":
        return "bg-amber-50 border-amber-100 text-amber-700";
      default:
        return "bg-slate-50/50 border-transparent text-slate-300";
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", link: "/hrms/dashboard" },
    { label: "Attendance", link: "/hrms/attendance" },
    { label: "Monthly Attendance", active: true }
  ];

  return (
    <div className="w-full mx-auto max-w-7xl space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 sm:py-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Icon icon="heroicons:calendar" className="w-6 h-6 text-blue-600" />
            Monthly Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View monthly attendance at employee level in a calendar view.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleExport}
          disabled={!attendanceData.length}
        >
          <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
          Download CSV
        </button>
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
              {filterOptionsData.business_units.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Location</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700">
              {filterOptionsData.locations.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Cost Center</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700">
              {filterOptionsData.cost_centers.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Department</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700">
              {filterOptionsData.departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500">Month</label>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-200 flex-shrink-0"
              onClick={() => handleMonthChange("prev")}
            >
              <Icon icon="heroicons:chevron-left-20-solid" className="w-4 h-4" />
            </button>
            <div className="flex-grow text-center py-2 font-bold text-slate-700 text-xs sm:text-sm whitespace-nowrap">
              {formatMonthYear(currentDate)}
            </div>
            <button
              type="button"
              className="p-2.5 hover:bg-slate-50 text-slate-600 transition-colors border-l border-slate-200 flex-shrink-0"
              onClick={() => handleMonthChange("next")}
            >
              <Icon icon="heroicons:chevron-right-20-solid" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="md:col-span-3 space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500">Employee</label>
          <div className="flex gap-2 w-full">
            <div className="relative flex-grow">
              <Icon icon="heroicons:magnifying-glass" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employee by name, code or department..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700 shadow-sm"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="border border-slate-200 bg-white shadow-sm rounded-2xl p-5 space-y-4">
            {employee.name ? (
              <>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">{employee.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Code: {employee.code}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Date of Joining</span>
                    <span className="text-slate-700 font-bold">{employee.joinDate || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Date of Exit</span>
                    <span className="text-slate-700 font-bold">{employee.exitDate || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Location</span>
                    <span className="text-slate-700 font-bold">{employee.location || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Department</span>
                    <span className="text-slate-700 font-bold">{employee.department || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Designation</span>
                    <span className="text-slate-700 font-bold">{employee.designation || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-400 font-medium">Default Shift</span>
                    <span className="text-slate-700 font-bold">{employee.shift || "-"}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
                    Replace
                  </button>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <Icon icon="heroicons:arrow-path-solid" className="w-4 h-4" />
                    Recalculate
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Icon icon="heroicons:user" className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No employee selected</p>
                <p className="text-[10px] mt-1">Search and select an employee to view attendance</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="border border-slate-200 bg-white shadow-sm rounded-2xl p-4 sm:p-5">
            {attendanceData.length > 0 || employee.name ? (
              <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                  <div className="grid grid-cols-7 text-center border-b border-slate-100 pb-2">
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((dayName, idx) => (
                      <div key={idx} className="text-[11px] font-bold text-slate-400 tracking-wider py-1.5">
                        {dayName}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 mt-2">
                    {days.map((d, i) => {
                      const isCellActive = d.day !== "";
                      return (
                        <div
                          key={i}
                          className={`h-20 p-2 border border-slate-100 rounded-xl relative flex flex-col justify-between ${isCellActive ? getCalendarStyle(d.status) : "bg-transparent border-transparent"
                            }`}
                        >
                          {isCellActive && (
                            <>
                              <div className="text-xs font-bold">{d.day}</div>
                              {d.status && (
                                <div className="text-sm font-extrabold self-center mb-1">
                                  {d.status}
                                </div>
                              )}
                              {d.hasPunch && d.status === "P" && (
                                <div
                                  className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-600"
                                  title="Time punches exist"
                                >
                                  <Icon icon="heroicons:clock" className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Icon icon="heroicons:calendar" className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No attendance data available</p>
                <p className="text-[10px] mt-1">Select an employee and click View to load attendance data</p>
              </div>
            )}

            <div className="mt-6 border-t border-slate-100 pt-4 space-y-2">
              <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Icon icon="heroicons:information-circle" className="w-4 h-4 text-slate-400" />
                Icons & Legend
              </h5>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-500 font-medium leading-relaxed">
                <span className="flex items-center gap-1">
                  <Icon icon="heroicons:clock" className="w-3.5 h-3.5 text-slate-400" />
                  Time punches exist
                </span>
                <span>|</span>
                <span><strong className="text-emerald-600">P:</strong> LV454 - Present</span>
                <span>|</span>
                <span><strong className="text-rose-600">A:</strong> LV455 - Absent</span>
                <span>|</span>
                <span><strong className="text-blue-600">H:</strong> LV456 - Holiday</span>
                <span>|</span>
                <span><strong className="text-slate-600">W:</strong> LV457 - Week Off</span>
                <span>|</span>
                <span><strong className="text-amber-600">CO:</strong> LV458 - Comp Off</span>
                <span>|</span>
                <span><strong className="text-sky-600">CL:</strong> LV459 - Casual Leave</span>
                <span>|</span>
                <span><strong className="text-slate-400">LW:</strong> LV1055 - Leave without Pay</span>
                <span>|</span>
                <span><strong className="text-indigo-600">SL:</strong> LV2638 - Sick leave</span>
                <span>|</span>
                <span><strong className="text-amber-500">HD:</strong> LV2640 - HALF DAY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default MonthlyAttendance;