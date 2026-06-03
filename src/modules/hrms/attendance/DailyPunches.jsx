import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrump from "../../../shared/components/Breadcrump";

function DailyPunches() {
  const businessUnit = ["All Units", "Default Business Units"];
  const locations = [
    "All Locations",
    "Hyderabad",
    "Chennai",
    "Mumbai",
    "Kerala",
  ];
  const costCenters = [
    "All Cost Centers",
    "Associate Software Engineer",
    "Hr Executive",
  ];
  const departments = [
    "All Departments",
    "OD Team",
    "Product Development Team",
    "Technical Support",
  ];
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAddPunchModal, setShowAddPunchModal] = useState(false);
  const [showAllPunchesModal, setShowAllPunchesModal] = useState(false);
  const [selectedPunchForModal, setSelectedPunchForModal] = useState(null);
  const [punchesData, setPunchesData] = useState([
    {
      id: 1,
      name: "Burri Gowtham",
      code: "LEV092",
      designation: "Associate Software Engineer",
      businessUnit: "Default Business Units",
      location: "Hyderabad",
      costCenter: "Associate Software Engineer",
      department: "OD Team",
      start: "09:01:49AM",
      end: "06:01:49PM",
      duration: "8:58",
      attendance: "P",
      attendanceColor: "primary",
      registeredFace: "/assets/img/users/user-11.jpg",
      punchImage: "/assets/img/users/user-11.jpg",
      locationUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2667144226825!2d78.38363737377158!3d17.446943901089455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910d8d1c4f8b%3A0x6ef1b184af90fa3f!2sCapital%20Park!5e0!3m2!1sen!2sin!4v1756977794236!5m2!1sen!2sin",
    },
    {
      id: 2,
      name: "Chodisetti Sri Rama Sai",
      code: "LEV081",
      designation: "Associate Software Engineer",
      businessUnit: "All Units",
      location: "Chennai",
      costCenter: "Associate Software Engineer",
      department: "Product Development Team",
      start: "09:12:46",
      end: "",
      duration: "0:00",
      attendance: "P",
      attendanceColor: "info",
      registeredFace: "/assets/img/users/user-01.jpg",
      punchImage: "/assets/img/users/user-01.jpg",
      locationUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2667144226825!2d78.38363737377158!3d17.446943901089455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910d8d1c4f8b%3A0x6ef1b184af90fa3f!2sCapital%20Park!5e0!3m2!1sen!2sin!4v1756977794236!5m2!1sen!2sin",
    },
    {
      id: 3,
      name: "Dheeraj Krishna Jakkula",
      code: "LEV079",
      designation: "Associate Software Engineer",
      businessUnit: "Default Business Units",
      location: "Mumbai",
      costCenter: "Associate Software Engineer",
      department: "Technical Support",
      start: "08:55:28",
      end: "",
      duration: "0:00",
      attendance: "P",
      attendanceColor: "info",
      registeredFace: "/assets/img/users/user-37.jpg",
      punchImage: "/assets/img/users/user-37.jpg",
      locationUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2667144226825!2d78.38363737377158!3d17.446943901089455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910d8d1c4f8b%3A0x6ef1b184af90fa3f!2sCapital%20Park!5e0!3m2!1sen!2sin!4v1756977794236!5m2!1sen!2sin",
    },
    {
      id: 4,
      name: "Dubbaka Bharath",
      code: "LEV085",
      designation: "Hr Executive",
      businessUnit: "All Units",
      location: "Kerala",
      costCenter: "Hr Executive",
      department: "OD Team",
      start: "09:02:58",
      end: "",
      duration: "0:00",
      attendance: "P",
      attendanceColor: "info",
      registeredFace: "/assets/img/users/.jpg",
      punchImage: "/assets/img/users/.jpg",
      locationUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2667144226825!2d78.38363737377158!3d17.446943901089455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910d8d1c4f8b%3A0x6ef1b184af90fa3f!2sCapital%20Park!5e0!3m2!1sen!2sin!4v1756977794236!5m2!1sen!2sin",
    },
  ]);
  const [filter, setFilter] = useState({
    businessUnit: "All Units",
    location: "All Locations",
    costCenter: "All Cost Centers",
    department: "All Departments",
    search: "",
  });
  const [selectedPunchFilter, setSelectedPunchFilter] = useState("all");

  // Initialize date to today
  const getFormattedDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [selectedDate, setSelectedDate] = useState(getFormattedDate(new Date()));
  const [selectedPunch, setSelectedPunch] = useState(null);

  // Add punch form state
  const [punchFormData, setPunchFormData] = useState({
    date: "",
    time: { hh: "", mm: "", ss: "" },
    remarks: "",
    type: "selfie",
  });

  // Employee punches tracking
  const [employeePunches, setEmployeePunches] = useState({});

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const onPunchFilterChange = (e) => setSelectedPunchFilter(e.target.value);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const handleView = () => {
    toast.info(`👀 Viewing punches for ${selectedDate}`);
    console.log("View:", selectedDate, selectedPunchFilter);
  };

  // Comprehensive filtering
  const filteredPunches = punchesData.filter((p) => {
    // Business Unit filter
    if (filter.businessUnit !== "All Units" && p.businessUnit !== filter.businessUnit) {
      return false;
    }

    // Location filter
    if (filter.location !== "All Locations" && p.location !== filter.location) {
      return false;
    }

    // Cost Center filter
    if (filter.costCenter !== "All Cost Centers" && p.costCenter !== filter.costCenter) {
      return false;
    }

    // Department filter
    if (filter.department !== "All Departments" && p.department !== filter.department) {
      return false;
    }

    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const name = (p.name || "").toLowerCase();
      const code = (p.code || "").toLowerCase();
      const designation = (p.designation || "").toLowerCase();

      if (!name.includes(searchLower) && !code.includes(searchLower) && !designation.includes(searchLower)) {
        return false;
      }
    }

    // Status filter
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPunches.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, selectedPunchFilter]);

  // Paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredPunches.slice(startIndex, endIndex);
  const [jumpPage, setJumpPage] = useState("");

  // Page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // IMPORT CSV FUNCTION (NO LIBS)
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
      toast.success("CSV imported successfully!");
    };

    reader.readAsText(file);
  };

  // EXPORT CSV FUNCTION (NO LIBS)
  const handleExport = () => {
    if (!filteredPunches.length) {
      toast.error("No data to export!");
      return;
    }

    const headers = ["id", "name", "code", "designation", "start", "end", "duration", "attendance", "location", "department"];
    const csvRows = [headers.join(",")];

    filteredPunches.forEach((row) => {
      const values = headers.map((header) => {
        const val = row[header] ? row[header].toString() : "";
        return `"${val.replace(/"/g, '""')}"`; // Escape quotes
      });
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `daily_punches_${selectedDate.replace(/-/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  // Format to "DD/MM/YYYY" (e.g., "07/1/2026")
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const month = formatDate(currentMonthDate);

  // Modify handleMonthChange to move by one day instead of one month
  const handleMonthChange = (direction) => {
    setCurrentMonthDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 1); // Go to previous day
      } else if (direction === "next") {
        newDate.setDate(newDate.getDate() + 1); // Go to next day
      }

      // Update selectedDate (format as "dd-mm-yyyy")
      const day = String(newDate.getDate()).padStart(2, "0");
      const month = String(newDate.getMonth() + 1).padStart(2, "0");
      const year = newDate.getFullYear();
      setSelectedDate(`${day}-${month}-${year}`);

      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate(); // last day of the month
  };

  // Initialize employee punches data
  useEffect(() => {
    setEmployeePunches((prev) => {
      const updated = { ...prev };
      punchesData.forEach((emp) => {
        if (!updated[emp.id]) {
          updated[emp.id] = [
            { time: emp.start, type: "Remote Punch", direction: "IN", id: `${emp.id}-in` },
            ...(emp.end ? [{ time: emp.end, type: "Remote Punch", direction: "OUT", id: `${emp.id}-out` }] : []),
          ];
        }
      });
      return updated;
    });
  }, [punchesData.length]);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showModal || showLocationModal || showAddPunchModal || showAllPunchesModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal, showLocationModal, showAddPunchModal, showAllPunchesModal]);

  return (
    <div>


      {/* ===== Header ===== */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 mt-3">
        <div>
          <div className="fw-bold h4 h2-md">Daily Punches</div>
          <div className="text-muted" style={{ fontSize: "0.85rem" }}>
            View or edit daily time punches for a single date.
          </div>
        </div>

        <div className="dropdown mt-2 mt-md-0">
          <button
            className="btn btn-primary btn-sm d-flex align-items-center"
            data-bs-toggle="dropdown"
          >
            Options <i className="fa-solid fa-chevron-down ms-2"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <label className="dropdown-item" style={{ cursor: "pointer" }}>
                <i className="fa-solid fa-upload me-2"></i> Upload
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  hidden
                />
              </label>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleExport}>
                <i className="fa-solid fa-download me-2"></i> Download
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ===== Filters ===== */}
      <div className="row mb-3 g-3">
        <div className="col-md-3">
          <label className="form-label">Business Unit</label>
          <select
            className="form-select"
            name="businessUnit"
            value={filter.businessUnit}
            onChange={handleFilterChange}
          >
            {businessUnit.map((b, i) => (
              <option key={i}>{b}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Location</label>
          <select
            className="form-select"
            name="location"
            value={filter.location}
            onChange={handleFilterChange}
          >
            {locations.map((loc, i) => (
              <option key={i}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Cost Center</label>
          <select
            className="form-select"
            name="costCenter"
            value={filter.costCenter}
            onChange={handleFilterChange}
          >
            {costCenters.map((c, i) => (
              <option key={i}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Departments</label>
          <select
            className="form-select"
            name="department"
            value={filter.department}
            onChange={handleFilterChange}
          >
            {departments.map((d, i) => (
              <option key={i}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== Radio Filters (interactive) ===== */}
      <div className="d-flex flex-wrap gap-3 mt-3">
        {[
          { label: "Show All", value: "all" },
          { label: "Late Coming Only", value: "late" },
          { label: "Absent Only", value: "absent" },
          { label: "No Punches", value: "nopunch" },
        ].map((f) => {
          const isActive = selectedPunchFilter === f.value;

          return (
            <label
              key={f.value}
              className={`px-3 py-1 rounded-pill border small fw-semibold cursor-pointer
          ${isActive ? "bg-primary text-white border-primary" : "bg-white text-dark border-secondary"}
        `}
              style={{ cursor: "pointer" }}
            >
              <input
                type="radio"
                name="selectedPunchFilter"
                value={f.value}
                checked={isActive}
                onChange={onPunchFilterChange}
                className="d-none"
              />
              {f.label}
            </label>
          );
        })}
      </div>


      {/* ===== Date + Search ===== */}
      <div className="d-flex flex-wrap align-items-center gap-3 mt-3">
        {/* Date Picker */}
        <div
          className="d-flex align-items-center border rounded overflow-hidden"
          style={{ height: 38 }}
        >
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center"
            onClick={() => handleMonthChange("prev")}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="px-4 bg-light fw-semibold d-flex align-items-center">
            {month}
          </div>

          <button
            className="btn btn-primary d-flex align-items-center justify-content-center"
            onClick={() => handleMonthChange("next")}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        {/* Search */}
        <div className="input-group" style={{ maxWidth: 320 }}>
          <input
            type="text"
            className="form-control"
            name="search"
            placeholder="All Employees"
            value={filter.search}
            onChange={handleFilterChange}
          />
          <button className="btn btn-primary" onClick={handleView}>
            <i className="fa-solid fa-magnifying-glass me-1"></i> View
          </button>
        </div>
      </div>


      {/* ===== Table ===== */}
      <div className="card mt-3 w-100">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                {/* SN */}
                <th className="ps-3" style={{ width: "60px" }}>
                  SN
                </th>
                <th>Employee</th>
                <th>Designation</th>
                <th className="text-center">Start</th>
                <th className="text-center">End</th>
                <th className="text-center">Duration</th>
                <th className="text-center">Attendance</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((p, i) => (
                  <tr key={p.id}>
                    {/* SN */}
                    <td className="ps-3 fw-semibold" style={{ width: "60px", backgroundColor:"red", textAlign:"center" }} >
                      {startIndex + i + 1}
                    </td>

                    {/* Employee */}
                    <td>
                      <div className="fw-semibold text-dark">{p.name}</div>
                      <small className="text-muted">{p.code}</small>
                    </td>

                    {/* Designation */}
                    <td>{p.designation}</td>

                    {/* Start */}
                    <td className="text-center">
                      <div className="d-inline-flex align-items-center gap-2">
                        <i
                          className="fa-solid fa-camera text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedPunchForModal(p);
                            setShowModal(true);
                          }}
                        />
                        <span>{p.start}</span>
                        <i
                          className="fa-solid fa-location-dot text-success"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedPunchForModal(p);
                            setShowLocationModal(true);
                          }}
                        />
                      </div>
                    </td>

                    {/* End */}
                    <td className="text-center">
                      <div className="d-inline-flex align-items-center gap-2">
                        <i
                          className="fa-solid fa-camera text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedPunchForModal(p);
                            setShowModal(true);
                          }}
                        />
                        <span>{p.end || "--"}</span>
                        <i
                          className="fa-solid fa-location-dot text-success"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedPunchForModal(p);
                            setShowLocationModal(true);
                          }}
                        />
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="text-center">{p.duration}</td>

                    {/* Attendance */}
                    <td className="text-center">
                      <span
                        className="d-inline-flex align-items-center justify-content-center fw-semibold"
                        style={{
                          width: 36,
                          height: 24,
                          background: "#7ADCE7",
                          borderRadius: 4,
                        }}
                      >
                        {p.attendance}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-primary rounded-circle d-flex justify-content-center align-items-center"
                          style={{ width: 32, height: 32 }}
                          onClick={() => {
                            setSelectedPunch(p);
                            setSelectedPunchForModal(p);
                            setPunchFormData({
                              date: new Date().toISOString().split("T")[0],
                              time: { hh: "", mm: "", ss: "" },
                              remarks: "",
                              type: "selfie",
                            });
                            setShowAddPunchModal(true);
                          }}
                          title="Add Punch"
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-secondary rounded-circle d-flex justify-content-center align-items-center"
                          style={{ width: 32, height: 32 }}
                          onClick={() => {
                            setSelectedPunch(p);
                            setSelectedPunchForModal(p);
                            setShowAllPunchesModal(true);
                          }}
                          title="View All Punches"
                        >
                          <i className="fa-solid fa-ellipsis"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>




      {/* Toastify */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
      />

      <nav className="mt-3">
        <ul className="pagination justify-content-center align-items-center gap-1 mb-0">

          {/* Previous */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link d-flex align-items-center justify-content-center"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ width: "40px", height: "40px" }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </li>

          {/* Page Numbers */}
          {totalPages > 0 ? (
            [...Array(Math.min(totalPages, 5))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <li
                  key={pageNum}
                  className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                >
                  <button
                    className="page-link d-flex align-items-center justify-content-center"
                    onClick={() => goToPage(pageNum)}
                    style={{ width: "40px", height: "40px" }}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            })
          ) : (
            <li className="page-item active">
              <button className="page-link d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                1
              </button>
            </li>
          )}

          {/* Next */}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link d-flex align-items-center justify-content-center"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ width: "40px", height: "40px" }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </li>

        </ul>
      </nav>

      <div className="mt-3 mb-1 small text-dark">Punch Legend:</div>
      <div
        className="d-flex bg-info-subtle flex-wrap align-items-center px-1 py-1 rounded"
        style={{ fontSize: "12px" }}
      >
        <div className="me-1 mb-1 mt-1 small badge rounded-pill text-dark bg-white">
          <i className="fe fe-send text-info me-1"></i> Remote
        </div>
        <div className="me-1 mb-1 mt-1 small badge rounded-pill text-dark bg-white">
          <i className="fe fe-camera text-danger me-1"></i> Selfie
        </div>
        <div className="me-1 mb-1 mt-1 small badge px-2 rounded-pill text-dark bg-white">
          <i className="fe fe-globe text-success me-1"></i> Web/Chat
        </div>
        <div className="me-1 mb-1 mt-1 small badge px-2 rounded-pill text-dark bg-white">
          <i className="fe fe-grid text-dark me-1"></i> QR Scan
        </div>
        <div className="me-1 mb-1 mt-1 small badge px-2 rounded-pill text-dark bg-white">
          <i className="fe fe-fingerprint text-dark me-1"></i> Biometric Fetch
        </div>
        <div className="me-1 mb-1 mt-1 small badge px-2 rounded-pill text-dark bg-white">
          <i className="fe fe-refresh-cw text-warning me-1"></i> Biometric Sync
        </div>
        <div className="me-1 mb-1 mt-1 small badge px-2 rounded-pill text-dark bg-white">
          <i className="fe fe-edit text-muted me-1"></i> Manual
        </div>
        <div className="me-1 mb-1 mt-1 small badge px-2 rounded-pill text-dark bg-white">
          <i className="fe fe-file-text text-success me-1"></i> Excel Import
        </div>
        <div className="me-1 mb-1 mt-1 small badge px-2 rounded-pill text-dark bg-white">
          <i className="fe fe-clock text-danger me-1"></i> Missed
        </div>
        <div className="me-1 mb-1 mt-1 small badge px-2 rounded-pill text-dark bg-white">
          <i className="fe fe-clock text-warning me-1"></i> Time Relax
        </div>
        <div className="me-1 mb-1 mt-1 small badge px-2 rounded-pill text-dark bg-white">
          <i className="fe fe-truck text-primary me-1"></i> Travel
        </div>
        <div className="me-1 mb-1 mt-1 small badge px-2 rounded-pill text-dark bg-white">
          <i className="fe fe-power text-success me-1"></i> API
        </div>
      </div>
      <div
        className="d-inline-block bg-info-subtle px-2 py-1 rounded mt-2 mb-2"
        style={{ fontSize: "13px" }}
      >
        <span className="mb-1 mt-1 badge bg-white rounded-pill text-success me-2">
          XX - Processed
        </span>
        <span className="mb-1 mt-1 badge bg-white rounded-pill text-danger me-2">
          XX - Pending
        </span>
      </div>

      {/* Selfie Punch Image Modal */}
      {showModal && selectedPunchForModal && (
        <div
          className="modal fade show d-block"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1055
          }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setSelectedPunchForModal(null);
            }
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">Selfie Punch Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPunchForModal(null);
                  }}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body d-flex justify-content-center gap-3">
                {selectedPunchForModal ? (
                  <>
                    <div className="mt-2 text-center">
                      <img
                        src={selectedPunchForModal.registeredFace || "https://placehold.co/150x150.png?text=?"}
                        alt="Registered Face"
                        className="rounded shadow"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://placehold.co/150x150.png?text=?";
                        }}
                      />
                      <p className="mt-1">Registered Face</p>
                    </div>

                    <div className="mt-2 text-center">
                      <img
                        src={selectedPunchForModal.punchImage || "https://placehold.co/150x150.png?text=?"}
                        alt="Punch Image"
                        className="rounded shadow"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://placehold.co/150x150.png?text=?";
                        }}
                      />
                      <p className="mt-1">Punch Image</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-2 text-center">
                      <img
                        src="https://placehold.co/150x150.png?text=?"
                        alt="Dummy 1"
                        className="rounded shadow"
                      />
                      <p className="mt-1">Registered Face</p>
                    </div>

                    <div className="mt-2 text-center">
                      <img
                        src="https://placehold.co/150x150.png?text=?"
                        alt="Dummy 2"
                        className="rounded shadow"
                      />
                      <p className="mt-1">Punch Image</p>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPunchForModal(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && selectedPunchForModal && (
        <div
          className="modal fade show d-block"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1055
          }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLocationModal(false);
              setSelectedPunchForModal(null);
            }
          }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Location - {selectedPunchForModal.name} ({selectedPunchForModal.code})
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowLocationModal(false);
                    setSelectedPunchForModal(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {selectedPunchForModal.locationUrl ? (
                  <iframe
                    src={selectedPunchForModal.locationUrl}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <p className="text-muted">Location data not available</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowLocationModal(false);
                    setSelectedPunchForModal(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Time Punch Modal */}
      {showAddPunchModal && selectedPunchForModal && (
        <div
          className="modal fade show d-block"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1055
          }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddPunchModal(false);
              setSelectedPunchForModal(null);
            }
          }}
        >
          <div
            className="modal-dialog modal-md modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Time Punch</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddPunchModal(false);
                    setSelectedPunchForModal(null);
                    setPunchFormData({
                      date: "",
                      time: { hh: "", mm: "", ss: "" },
                      remarks: "",
                      type: "selfie",
                    });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Employee:</label>
                  <p className="mb-0">
                    {selectedPunchForModal.name} ({selectedPunchForModal.code})
                  </p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Punch Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={punchFormData.date}
                    onChange={(e) => setPunchFormData({ ...punchFormData, date: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Punch Time <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex gap-2">
                    {["hh", "mm", "ss"].map((field) => (
                      <input
                        key={field}
                        type="number"
                        className="form-control"
                        placeholder={field.toUpperCase()}
                        value={punchFormData.time[field]}
                        onChange={(e) =>
                          setPunchFormData({
                            ...punchFormData,
                            time: { ...punchFormData.time, [field]: e.target.value },
                          })
                        }
                        style={{ width: "80px" }}
                        min="0"
                        max={field === "hh" ? "23" : "59"}
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Punch Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={punchFormData.type}
                    onChange={(e) => setPunchFormData({ ...punchFormData, type: e.target.value })}
                  >
                    <option value="selfie">Selfie</option>
                    <option value="remote">Remote</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter remarks (optional)"
                    value={punchFormData.remarks}
                    onChange={(e) => setPunchFormData({ ...punchFormData, remarks: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddPunchModal(false);
                    setSelectedPunchForModal(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    // Validation
                    if (!punchFormData.date) {
                      toast.error("Please select a punch date");
                      return;
                    }
                    if (!punchFormData.time.hh || !punchFormData.time.mm || !punchFormData.time.ss) {
                      toast.error("Please enter complete punch time (HH:MM:SS)");
                      return;
                    }

                    const finalTime = `${String(punchFormData.time.hh).padStart(2, "0")}:${String(punchFormData.time.mm).padStart(2, "0")}:${String(punchFormData.time.ss).padStart(2, "0")}`;
                    const punchTypeLabel = punchFormData.type.charAt(0).toUpperCase() + punchFormData.type.slice(1);

                    // Add punch to employee's punch list
                    const newPunch = {
                      time: finalTime,
                      type: `${punchTypeLabel} Punch`,
                      direction: "IN",
                      id: `${selectedPunchForModal.id}-${Date.now()}`,
                    };

                    setEmployeePunches((prev) => ({
                      ...prev,
                      [selectedPunchForModal.id]: [
                        ...(prev[selectedPunchForModal.id] || []),
                        newPunch,
                      ],
                    }));

                    toast.success(`Punch added: ${punchFormData.date} ${finalTime} (${punchTypeLabel})`);

                    // Reset form
                    setPunchFormData({
                      date: "",
                      time: { hh: "", mm: "", ss: "" },
                      remarks: "",
                      type: "selfie",
                    });
                    setShowAddPunchModal(false);
                    setSelectedPunchForModal(null);
                  }}
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Punches Modal */}
      {showAllPunchesModal && selectedPunchForModal && (
        <div
          className="modal fade show d-block"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1055
          }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAllPunchesModal(false);
              setSelectedPunchForModal(null);
            }
          }}
        >
          <div
            className="modal-dialog modal-md modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-semibold">
                  All Punches - {selectedPunchForModal.name} ({selectedPunchForModal.code})
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAllPunchesModal(false);
                    setSelectedPunchForModal(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="list-group mb-3">
                  {employeePunches[selectedPunchForModal.id] && employeePunches[selectedPunchForModal.id].length > 0 ? (
                    employeePunches[selectedPunchForModal.id].map((punch) => (
                      <li key={punch.id} className="list-group-item d-flex align-items-center justify-content-between">
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
                              const updatedPunches = employeePunches[selectedPunchForModal.id].filter(
                                (p) => p.id !== punch.id
                              );
                              setEmployeePunches((prev) => ({
                                ...prev,
                                [selectedPunchForModal.id]: updatedPunches,
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
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAllPunchesModal(false);
                    setSelectedPunchForModal(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyPunches;
