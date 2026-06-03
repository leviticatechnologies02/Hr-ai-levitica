import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Breadcrump from "../../../shared/components/Breadcrump";


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
  
  // Initialize date to today
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
  const [punchDate, setPunchDate] = useState("");
  const [punchTime, setPunchTime] = useState({ hh: "", mm: "", ss: "" });
  const [punchType, setPunchType] = useState("selfie");
  const [remarks, setRemarks] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeePunches, setEmployeePunches] = useState({});

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showPunchModal || showAddPunchModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPunchModal, showAddPunchModal]);

  // Dummy Data
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 209187,
      name: "Anusha Engilala",
      code: "LEV039",
      date: "08-Oct-2025",
      status: "Present",
      note: "Present marked as at least one time-punch was found",
      location: "Hyderabad",
      businessUnit: "Development",
      costCenter: "Cost-1",
      designation: "Associate Software Engineer",
      department: "Technical Support",
      punchIn: "09:17A",
      punchOut: "06:05P",
      punchType: "Selfie",
      timeline: { start: "03:00A", general: "09:00A - 06:00P", end: "12:00A" },
    },
    {
      id: 209188,
      name: "Ravi Kumar",
      code: "LEV040",
      date: "08-Oct-2025",
      status: "Present",
      note: "Employee completed full shift",
      location: "Bengaluru",
      businessUnit: "Development",
      costCenter: "Cost-1",
      designation: "Frontend Developer",
      department: "Engineering",
      punchIn: "09:05A",
      punchOut: "06:12P",
      punchType: "Manual",
      timeline: { start: "03:00A", general: "09:00A - 06:00P", end: "12:00A" },
    },
    {
      id: 209189,
      name: "Sneha Reddy",
      code: "LEV041",
      date: "08-Oct-2025",
      status: "Late",
      note: "Late punch-in recorded",
      location: "Chennai",
      businessUnit: "Support",
      costCenter: "Cost-2",
      designation: "QA Engineer",
      department: "Quality Assurance",
      punchIn: "09:42A",
      punchOut: "06:00P",
      punchType: "Selfie",
      timeline: { start: "03:00A", general: "09:00A - 06:00P", end: "12:00A" },
    },
    {
      id: 209190,
      name: "Arjun Patel",
      code: "LEV042",
      date: "08-Oct-2025",
      status: "Half Day",
      note: "Employee worked half day",
      location: "Pune",
      businessUnit: "Development",
      costCenter: "Cost-1",
      designation: "Backend Developer",
      department: "Engineering",
      punchIn: "09:10A",
      punchOut: "01:45P",
      punchType: "Manual",
      timeline: { start: "03:00A", general: "09:00A - 06:00P", end: "12:00A" },
    },
    {
      id: 209191,
      name: "Priya Sharma",
      code: "LEV043",
      date: "08-Oct-2025",
      status: "Absent",
      note: "No punch-in or punch-out found",
      location: "Delhi",
      businessUnit: "Support",
      costCenter: "Cost-2",
      designation: "HR Executive",
      department: "Human Resources",
      punchIn: "--",
      punchOut: "--",
      punchType: "-",
      timeline: { start: "03:00A", general: "09:00A - 06:00P", end: "12:00A" },
    },
  ]);

  // Initialize employee punches data
  useEffect(() => {
    setEmployeePunches((prev) => {
      const updated = { ...prev };
      attendanceData.forEach((emp) => {
        if (!updated[emp.id]) {
          updated[emp.id] = [
            { time: emp.punchIn !== "--" ? emp.punchIn : "08:40:16", type: `${emp.punchType} Punch`, direction: "IN" },
            { time: emp.punchOut !== "--" ? emp.punchOut : "18:00:12", type: `${emp.punchType} Punch`, direction: "OUT" },
          ];
        }
      });
      return updated;
    });
  }, [attendanceData.length]);



  const businessUnit = ["All Units", "Development", "Support"];
  const locations = ["All", "Hyderabad", "Chennai", "Bengaluru", "Pune", "Delhi"];
  const costCenters = ["All", "Cost-1", "Cost-2"];
  const departments = ["All", "Technical", "Support", "HR", "Engineering", "Quality Assurance", "Technical Support"];

  // Filter attendance data
  const filteredAttendanceData = attendanceData.filter((emp) => {
    // Business Unit filter
    if (filter.businessUnit !== "All Units" && emp.businessUnit !== filter.businessUnit) {
      return false;
    }

    // Location filter
    if (filter.location !== "All" && emp.location !== filter.location) {
      return false;
    }

    // Cost Center filter
    if (filter.costCenter !== "All" && emp.costCenter !== filter.costCenter) {
      return false;
    }

    // Department filter
    if (filter.department !== "All" && emp.department !== filter.department) {
      return false;
    }

    // Search filter
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

    // Status filter
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

  // Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleDateChange = (type) => {
    // Parse current date (format: DD-MMM-YYYY)
    const dateParts = date.split("-");
    const day = parseInt(dateParts[0]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames.indexOf(dateParts[1]);
    const year = parseInt(dateParts[2]);
    
    const currentDate = new Date(year, month, day);
    const newDate = new Date(currentDate);
    
    if (type === "next") {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    
    setDate(getFormattedDate(newDate));
  };

  const handleView = () => {
    toast.info("Filter applied successfully");
  };

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
    if (!filteredAttendanceData.length) {
      toast.error("No data to export!");
      return;
    }

    const headers = ["id", "name", "code", "date", "status", "location", "designation", "department", "punchIn", "punchOut", "punchType"];
    const csvRows = [headers.join(",")];

    filteredAttendanceData.forEach((row) => {
      const values = headers.map((header) => {
        const val = row[header] ? row[header].toString() : "";
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily_attendance_${date.replace(/-/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported successfully");
  };

  return (
    <div className="page-content">
      <ToastContainer />

      <div className="container-fluid">
        {/* Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3 mt-3">
          <div>
            <h4 className="fw-bold mb-1">Daily Attendance</h4>
            <p className="text-muted mb-0">
              View or edit daily time punches for a single date.
            </p>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-primary btn-sm"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Options <i className="fe fe-chevron-down m-1"></i>
            </button>
            <ul className="dropdown-menu">
              <li>
                <label className="dropdown-item" style={{ cursor: "pointer" }}>
                  <i className="fe fe-upload m-1"></i>Upload
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleExport}>
                  <i className="fe fe-download m-1"></i>Download
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-3">
          {[
            {
              name: "businessUnit",
              label: "Business Unit",
              options: businessUnit,
            },
            { name: "location", label: "Location", options: locations },
            { name: "costCenter", label: "Cost Center", options: costCenters },
            { name: "department", label: "Departments", options: departments },
          ].map((field, idx) => (
            <div className="col-md-3" key={idx}>
              <label>{field.label}</label>
              <select
                className="form-select"
                name={field.name}
                value={filter[field.name]}
                onChange={handleFilterChange}
              >
                {field.options.map((opt, i) => (
                  <option key={i}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Radio Filters */}
        <div className="mt-3 d-flex flex-wrap gap-3">
          {[
            { label: "Show All", value: "all" },
            { label: "Late Coming Only", value: "late" },
            { label: "Absent Only", value: "absent" },
            { label: "No Punches", value: "nopunch" },
          ].map((f) => (
            <div key={f.value}>
              <input
                type="radio"
                id={`filter-${f.value}`}
                name="selectedPunchFilter"
                value={f.value}
                className="d-none"
                checked={selectedPunchFilter === f.value}
                onChange={(e) => setSelectedPunchFilter(e.target.value)}
              />
              <label
                htmlFor={`filter-${f.value}`}
                className={`px-3 py-1 rounded-pill border small cursor-pointer
          ${selectedPunchFilter === f.value
                    ? "bg-primary text-white border-primary"
                    : "bg-light text-dark"
                  }`}
                style={{ cursor: "pointer" }}
              >
                {f.label}
              </label>
            </div>
          ))}
        </div>

        {/* Date Navigation + Search */}
        <div className="d-flex align-items-center  mt-3 gap-3 flex-wrap">
          {/* Date Navigation */}
          <div
            className="d-flex align-items-center border rounded overflow-hidden"
            style={{ height: "40px" }}
          >
            <button
              className="btn btn-primary h-100 px-3"
              onClick={() => handleDateChange("prev")}
            >
              <i className="fa fa-arrow-left"></i>
            </button>

            <div className="px-4 bg-light fw-semibold d-flex align-items-center h-100">
              {date}
            </div>

            <button
              className="btn btn-primary h-100 px-3"
              onClick={() => handleDateChange("next")}
            >
              <i className="fa fa-arrow-right"></i>
            </button>
          </div>

          {/* Search + View */}
          <div className="input-group" style={{ maxWidth: "320px", height: "40px" }}>
            <input
              type="text"
              className="form-control"
              name="search"
              placeholder="All Employees"
              value={filter.search}
              onChange={handleFilterChange}
            />
            <button className="btn btn-primary" onClick={handleView}>
              <i className="fa fa-search me-1"></i> View
            </button>
          </div>
        </div>

        {/* Attendance Cards */}
        <div className="mt-4">
          {filteredAttendanceData.length > 0 ? (
            filteredAttendanceData.map((emp) => (
            <div
              key={emp.id}
              className="card mb-3 shadow-sm"
              style={{ borderRadius: 12 }}
            >
              <div className="card-body">

                {/* ===== Header ===== */}
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                  <div className="fw-semibold text-dark">
                    {emp.name} <span className="text-muted">({emp.code})</span>
                  </div>

                  <div className="d-flex align-items-center flex-wrap gap-3 text-dark">
                    <span>
                      <i className="fa-solid fa-location-dot text-danger me-1"></i>
                      {emp.location}
                    </span>
                    <span>
                      <i className="fa-solid fa-briefcase text-warning me-1"></i>
                      {emp.designation}
                    </span>
                    <span>
                      <i className="fa-solid fa-building text-primary me-1"></i>
                      {emp.department}
                    </span>
                  </div>
                </div>

                {/* ===== Timeline Section ===== */}
                <div className="border-top pt-3">
                  <div className="row align-items-center">

                    {/* Left Info */}
                    <div className="col-md-3 mb-2">
                      <div className="text-primary fw-semibold">{emp.date}</div>
                      <small>
                        <strong>{emp.status}</strong>
                        <br />
                        {emp.note}
                      </small>
                    </div>

                    {/* Timeline */}
                    <div className="col-md-6 mb-2">
                      <div className="text-center mb-1">
                        <small className="text-muted">General</small>
                      </div>

                      <div className="d-flex align-items-center">
                        {/* Start */}
                        <div className="text-start" style={{ width: "15%" }}>
                          <div className="small">{emp.timeline.start}</div>
                          <div className="bg-success rounded" style={{ height: 5 }}></div>
                          <div className="small text-primary mt-1">{emp.punchIn}</div>
                        </div>

                        {/* Middle */}
                        <div style={{ width: "70%" }}>
                          <div className="d-flex justify-content-between small text-muted">
                            <span>09:00A</span>
                            <span>06:00P</span>
                          </div>
                          <div className="bg-primary rounded" style={{ height: 5 }}></div>
                        </div>

                        {/* End */}
                        <div className="text-end" style={{ width: "15%" }}>
                          <div className="small">{emp.timeline.end}</div>
                          <div className="bg-warning rounded" style={{ height: 5 }}></div>
                          <div className="small text-success mt-1">
                            {emp.punchOut} ({emp.punchType})
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="col-md-3 d-flex justify-content-end align-items-center gap-3">
                      <div>
                        In-Time:{" "}
                        <strong className="text-primary">8 h 35 m</strong>
                      </div>

                      <div className="d-flex">
                        <button
                          className="btn btn-outline-success rounded-circle btn-sm me-2"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setPunchDate(new Date().toISOString().split("T")[0]);
                            setPunchTime({ hh: "", mm: "", ss: "" });
                            setRemarks("");
                            setPunchType("selfie");
                            setShowAddPunchModal(true);
                          }}
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>

                        <button
                          className="btn btn-outline-info rounded-circle btn-sm"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setShowPunchModal(true);
                          }}
                        >
                          <i className="fa-solid fa-ellipsis"></i>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
            ))
          ) : (
            <div className="card p-4 text-center">
              <p className="text-muted mb-0">No attendance records found for the selected filters.</p>
            </div>
          )}
        </div>

        {/* Punch Modal */}
        {showPunchModal && selectedEmployee && (
          <div
            className="modal fade show d-block"
            style={{ 
              background: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1055
            }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPunchModal(false);
              }
            }}
          >
            <div 
              className="modal-dialog modal-md modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">

                {/* ===== Header ===== */}
                <div className="modal-header">
                  <h5 className="modal-title fw-semibold">
                    All Punches - {selectedEmployee.name} ({selectedEmployee.code})
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPunchModal(false)}
                  ></button>
                </div>

                {/* ===== Body ===== */}
                <div className="modal-body">
                  <ul className="list-group mb-3">
                    {employeePunches[selectedEmployee.id] && employeePunches[selectedEmployee.id].length > 0 ? (
                      employeePunches[selectedEmployee.id].map((punch, idx) => (
                        <li key={idx} className="list-group-item d-flex align-items-center justify-content-between">
                          <div>
                            <div className="fw-semibold">{punch.time}</div>
                            <small className="text-muted">{punch.type}</small>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <span className={`badge px-3 ${punch.direction === "IN" ? "bg-success" : "bg-warning text-dark"}`}>
                              {punch.direction}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                const updatedPunches = employeePunches[selectedEmployee.id].filter((_, i) => i !== idx);
                                setEmployeePunches((prev) => ({
                                  ...prev,
                                  [selectedEmployee.id]: updatedPunches,
                                }));
                                toast.success("Punch deleted successfully");
                              }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item text-center text-muted">
                        No punches found for this employee
                      </li>
                    )}
                  </ul>

                  <div className="small text-muted d-flex align-items-center">
                    <i className="fa-solid fa-circle-info me-2 text-primary"></i>
                    All punches for selected date are shown.
                  </div>
                </div>

                {/* ===== Footer ===== */}
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowPunchModal(false)}
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>

        )}

        {/* Add Punch Modal */}
        {showAddPunchModal && selectedEmployee && (
          <div
            className="modal fade show d-block"
            style={{ 
              background: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1055
            }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddPunchModal(false);
              }
            }}
          >
            <div 
              className="modal-dialog modal-md modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Time Punch </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowAddPunchModal(false);
                      setPunchDate("");
                      setPunchTime({ hh: "", mm: "", ss: "" });
                      setRemarks("");
                      setPunchType("selfie");
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-lg-4">
                      <label className="from-label fw-semibold">
                        Employee Name:
                      </label>
                    </div>
                    <div className="col-md-6 ">
                      <h5 className="fw-semibold"> {selectedEmployee.name}</h5>
                      <p>{selectedEmployee.id}</p>
                    </div>
                  </div>
                  <div className="row g-3 mb-2">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Punch Date <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-md-7">
                      <input
                        type="date"
                        className="form-control"
                        value={punchDate}
                        onChange={(e) => setPunchDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Punch Time <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-md-7">
                      <div className="d-flex align-items-center gap-2">
                        {["hh", "mm", "ss"].map((field) => (
                          <input
                            key={field}
                            type="number"
                            className="form-control"
                            placeholder={field.toUpperCase()}
                            value={punchTime[field]}
                            onChange={(e) =>
                              setPunchTime((prev) => ({
                                ...prev,
                                [field]: e.target.value,
                              }))
                            }
                            style={{ width: "80px" }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Punch Type <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-md-7">
                      <select
                        className="form-select"
                        value={punchType}
                        onChange={(e) => setPunchType(e.target.value)}
                      >
                        {punchTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Remarks
                      </label>
                    </div>
                    <div className="col-md-7">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter remarks (optional)"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="row gap-5">
                    <div className="col-lg-3 text-start">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowAddPunchModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="col-lg-3 text-end">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          // Validation
                          if (!punchDate) {
                            toast.error("Please select a punch date");
                            return;
                          }
                          if (!punchTime.hh || !punchTime.mm || !punchTime.ss) {
                            toast.error("Please enter complete punch time (HH:MM:SS)");
                            return;
                          }

                          const finalTime = `${String(punchTime.hh).padStart(2, "0")}:${String(punchTime.mm).padStart(2, "0")}:${String(punchTime.ss).padStart(2, "0")}`;
                          const punchTypeLabel = punchTypes.find((pt) => pt.value === punchType)?.label || punchType;
                          
                          // Add punch to employee's punch list
                          const newPunch = {
                            time: finalTime,
                            type: `${punchTypeLabel} Punch`,
                            direction: "IN", // You can add logic to determine IN/OUT
                          };

                          setEmployeePunches((prev) => ({
                            ...prev,
                            [selectedEmployee.id]: [
                              ...(prev[selectedEmployee.id] || []),
                              newPunch,
                            ],
                          }));

                          toast.success(
                            `Punch Added: ${punchDate} ${finalTime} (${punchTypeLabel})`
                          );
                          
                          // Reset form
                          setPunchDate("");
                          setPunchTime({ hh: "", mm: "", ss: "" });
                          setRemarks("");
                          setShowAddPunchModal(false);
                        }}
                      >
                        Insert
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyAttendance;
