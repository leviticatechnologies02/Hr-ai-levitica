import React, { useState } from "react";
import Breadcrump from "../../../shared/components/Breadcrump";
import { toast, ToastContainer } from "react-toastify";

const MonthlyAttendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [selectedEmployee, setSelectedEmployee] = useState("Abhilash Gurrampally (LEVC)");

  const employee = {
    name: "Abhilash Gurrampally",
    code: "LEV029",
    joinDate: "Jul 07, 2025",
    exitDate: "-",
    location: "Hyderabad",
    department: "Technical Support",
    designation: "Associate Software Engineer",
    shift: "General",
  };

  // December 2025 calendar data - matching the image
  // Week starts on Sunday (0 = Sunday, 6 = Saturday)
  const getDaysForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: "", status: "", hasPunch: false });
    }

    // December 2025 data matching the image
    // December 1, 2025 is a Monday (firstDay = 1)
    const decemberData = [
      { day: "01", status: "P", hasPunch: true },
      { day: "02", status: "P", hasPunch: true },
      { day: "03", status: "P", hasPunch: true },
      { day: "04", status: "P", hasPunch: true },
      { day: "05", status: "P", hasPunch: true },
      { day: "06", status: "P", hasPunch: true },
      { day: "07", status: "W", hasPunch: false }, // Sunday
      { day: "08", status: "P", hasPunch: true },
      { day: "09", status: "P", hasPunch: true },
      { day: "10", status: "P", hasPunch: true },
      { day: "11", status: "P", hasPunch: true },
      { day: "12", status: "P", hasPunch: true },
      { day: "13", status: "P", hasPunch: true },
      { day: "14", status: "W", hasPunch: false }, // Sunday
      { day: "15", status: "P", hasPunch: true },
      { day: "16", status: "P", hasPunch: true },
      { day: "17", status: "P", hasPunch: true },
      { day: "18", status: "P", hasPunch: true },
      { day: "19", status: "P", hasPunch: true },
      { day: "20", status: "P", hasPunch: true },
      { day: "21", status: "W", hasPunch: false }, // Sunday
      { day: "22", status: "P", hasPunch: true },
      { day: "23", status: "P", hasPunch: true },
      { day: "24", status: "P", hasPunch: true },
      { day: "25", status: "H", hasPunch: false }, // Holiday
      { day: "26", status: "P", hasPunch: true },
      { day: "27", status: "P", hasPunch: true },
      { day: "28", status: "W", hasPunch: false }, // Sunday
      { day: "29", status: "P", hasPunch: true },
      { day: "30", status: "P", hasPunch: true },
      { day: "31", status: "P", hasPunch: true },
    ];

    // Add the actual month data
    days.push(...decemberData);

    // Fill remaining cells to complete the last week (if needed)
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

  const formatMonthYear = (date) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${months[date.getMonth()]}-${date.getFullYear()}`;
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
    toast.success("Attendance exported successfully!");
  };

  const handleView = () => {
    toast.info("Viewing attendance for selected employee");
  };

  return (
    <div className="page-content" >
      <ToastContainer />
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <div>
            <h4 className="fw-bold mb-1">Monthly Attendance</h4>
            <p className="text-muted mb-0">
              View monthly attendance at employee level in a calendar view.
            </p>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-primary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Options <i className="fe fe-chevron-down"></i>
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={handleExport}>
                  <i className="fe fe-download me-2"></i>Download
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">Business Unit</label>
            <select className="form-select">
              <option>All Units</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Location</label>
            <select className="form-select">
              <option>All Locations</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Cost Center</label>
            <select className="form-select">
              <option>All Cost Centers</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Department</label>
            <select className="form-select">
              <option>All Departments</option>
            </select>
          </div>
        </div>

        {/* Date Picker and Employee Search */}
        <div className="row mb-4 align-items-end">

          {/* ===== Month Picker ===== */}
          <div className="col-md-3">
            <label className="form-label">Month</label>
            <div
              className="d-flex align-items-center border rounded overflow-hidden"
              style={{ height: "38px" }}
            >
              <button
                className=" btn btn-primary d-flex align-items-center"
                onClick={() => handleMonthChange("prev")}
                style={{ borderRadius: 0, width: "40px" }}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <div className="flex-fill bg-light fw-semibold d-flex align-items-center justify-content-center">
                {formatMonthYear(currentDate)}
              </div>

              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={() => handleMonthChange("next")}
                style={{ borderRadius: 0, width: "40px" }}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* ===== Employee Search ===== */}
          <div className="col-md-9">
            <label className="form-label">Employee</label>
            <div className="input-group" style={{ height: "38px" }}>
              <input
                type="text"
                className="form-control"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                placeholder="Search employee..."
              />

              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={handleView}
              >
                <i className="fa-solid fa-magnifying-glass me-2"></i>
                View
              </button>
            </div>
          </div>

        </div>


        {/* Main Content - Side by Side Layout */}
        <div className="row">
          {/* Employee Info Card - Left Side */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h6 className="fw-bold mb-3">
                  {employee.name} ({employee.code})
                </h6>

                <div className="mb-2">
                  <strong>Date of Joining:</strong> {employee.joinDate}
                </div>
                <div className="mb-2">
                  <strong>Date of Exit:</strong> {employee.exitDate}
                </div>
                <div className="mb-2">
                  <strong>Location:</strong> {employee.location}
                </div>
                <div className="mb-2">
                  <strong>Department:</strong> {employee.department}
                </div>
                <div className="mb-2">
                  <strong>Designation:</strong> {employee.designation}
                </div>
                <div className="mb-3">
                  <strong>Default Shift:</strong> {employee.shift}
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-warning btn-sm">
                    <i className="fe fe-zap me-1"></i> Replace
                  </button>
                  <button className="btn btn-success btn-sm">
                    <i className="fe fe-refresh-cw me-1"></i> Recalculate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar View - Right Side */}
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table text-center align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ padding: "12px", fontWeight: 600 }}>SUN</th>
                        <th style={{ padding: "12px", fontWeight: 600 }}>MON</th>
                        <th style={{ padding: "12px", fontWeight: 600 }}>TUE</th>
                        <th style={{ padding: "12px", fontWeight: 600 }}>WED</th>
                        <th style={{ padding: "12px", fontWeight: 600 }}>THU</th>
                        <th style={{ padding: "12px", fontWeight: 600 }}>FRI</th>
                        <th style={{ padding: "12px", fontWeight: 600 }}>SAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
                        <tr key={weekIndex}>
                          {days
                            .slice(weekIndex * 7, weekIndex * 7 + 7)
                            .map((d, i) => {
                              const isSunday = (weekIndex * 7 + i) % 7 === 0;
                              const bgColor =
                                d.status === "P"
                                  ? "#d1f5ee" // Light blue for Present
                                  : d.status === "A"
                                    ? "#fcdada" // Light red for Absent
                                    : d.status === "W"
                                      ? "#e0e0e0" // Grey for Week Off
                                      : d.status === "H"
                                        ? "#d4edda" // Light green for Holiday
                                        : "#ffffff"; // White for empty

                              const textColor =
                                d.status === "P"
                                  ? "#007b83"
                                  : d.status === "A"
                                    ? "#c82333"
                                    : d.status === "W"
                                      ? "#555"
                                      : d.status === "H"
                                        ? "#155724"
                                        : "#000";

                              return (
                                <td
                                  key={i}
                                  className="border text-center"
                                  style={{
                                    minWidth: 80,
                                    height: 80,
                                    background: bgColor,
                                    position: "relative",
                                    borderRadius: 6,
                                    padding: "8px",
                                  }}
                                >
                                  {d.day && (
                                    <>
                                      <div className="fw-semibold" style={{ fontSize: "14px" }}>
                                        {d.day}
                                      </div>
                                      {d.status && (
                                        <div
                                          className="fw-bold mt-1"
                                          style={{
                                            color: textColor,
                                            fontSize: "13px",
                                          }}
                                        >
                                          {d.status}
                                        </div>
                                      )}
                                      {d.hasPunch && d.status === "P" && (
                                        <div
                                          className="position-absolute top-0 end-0 small me-1 mt-1"
                                          title="Time punches exist"
                                        >
                                          <i className="fe fe-clock" style={{ fontSize: "10px", color: "#6c757d" }}></i>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </td>
                              );
                            })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="mt-4 border-top pt-3">
                  <h6 className="fw-bold mb-2">Icons & Legend:</h6>
                  <div className="small" style={{ lineHeight: "1.8" }}>
                    <i className="fe fe-clock me-1" style={{ fontSize: "12px" }}></i>: Time punches exist &nbsp;|&nbsp;
                    <span className="text-info fw-semibold">P:</span> LV454 - Present &nbsp;|&nbsp;
                    <span className="text-danger fw-semibold">A:</span> LV455 - Absent &nbsp;|&nbsp;
                    <span className="text-success fw-semibold">H:</span> LV456 - Holiday &nbsp;|&nbsp;
                    <span className="text-dark fw-semibold">W:</span> LV457 - Week Off &nbsp;|&nbsp;
                    <span className="text-warning fw-semibold">CO:</span> LV458 - Comp Off &nbsp;|&nbsp;
                    <span className="text-primary fw-semibold">CL:</span> LV459 - Casual Leave &nbsp;|&nbsp;
                    <span className="text-secondary fw-semibold">LW:</span> LV1055 - Leave without Pay &nbsp;|&nbsp;
                    <span className="text-info fw-semibold">SL:</span> LV2638 - Sick leave &nbsp;|&nbsp;
                    <span className="text-warning fw-semibold">HD:</span> LV2640 - HALF DAY
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAttendance;
