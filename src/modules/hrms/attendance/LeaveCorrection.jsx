import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Breadcrump from "../../../shared/components/Breadcrump";

function LeaveCorrection() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState("SEP-2025");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [leaveType, setLeaveType] = useState("LV458 - Comp Off");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const leaveTypes = [
    "LV458 - Comp Off",
    "LV454 - Present",
    "LV455 - Absent",
    "LV456 - Holiday",
    "LV457 - Week Off",
    "LV459 - Casual Leave",
    "LV1055 - Leave without Pay",
    "LV2638 - Sick Leave",
    "LV2640 - Half Day",
  ];

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

    setMonth(`${months[monthIndex]}-${currentYear}`);
  };

  const handleLoad = () => {
    console.log("Load clicked with search:", searchInput);
    setPage(1);
  };

  const handleFileUpload = () => {
    alert("File uploaded successfully!");
    setShowUploadModal(false);
  };

  const handleCorrectionChange = (id, value) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, correction: Number(value) } : emp
      )
    );
  };

  const downloadAllExcel = () => {
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
      "Leave_Corrections.xlsx"
    );
  };

  useEffect(() => {
    const data = [
      { name: "Abhilash Gurrampally", id: "LEV029", designation: "Associate Software Engineer", opening: 0, activity: 0, correction: 0, closing: 0 },
      { name: "Anusha Enigalla", id: "LEV039", designation: "Associate Software Engineer", opening: 0, activity: 0, correction: 0, closing: 0 },
      { name: "ARAVELLY THARUN", id: "LEV122", designation: "Associate Software Engineer", opening: 0, activity: 0, correction: 0, closing: 0 },
      { name: "Ashok Kota", id: "LEV047", designation: "Associate Software Engineer", opening: 0, activity: 0, correction: 0, closing: 0 },
      { name: "Baluguri Ashritha Rao", id: "LEV121", designation: "HR Executive", opening: 0, activity: 0, correction: 0, closing: 0 },
      { name: "Abhilash Gurrampally", id: "LEV029", designation: "Associate Software Engineer", opening: 0, activity: 0, correction: 0, closing: 0 },
      { name: "Anusha Enigalla", id: "LEV039", designation: "Associate Software Engineer", opening: 0, activity: 0, correction: 0, closing: 0 },
      { name: "Ashok Kota", id: "LEV047", designation: "Associate Software Engineer", opening: 0, activity: 0, correction: 0, closing: 0 },
      { name: "Bogala Chandramouli", id: "LEV027", designation: "Associate Software Engineer", opening: 0, activity: 0, correction: 0, closing: 0 },
      { name: "Burri Gowtham", id: "LEV023", designation: "Associate Software Engineer", opening: 0, activity: 0, correction: 0, closing: 0 },
    ];
    setEmployees(data);
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="container-fluid">
     
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-3 flex-wrap">
        <div>
          <h4 className="fw-bold mb-1">Leave Correction</h4>
          <p className="text-muted mb-0">Make corrections in leave balances</p>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-primary btn-sm dropdown-toggle"
            type="button"
            id="optionsDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Options <i className="fe fe-chevron-down"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="optionsDropdown">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setShowDownloadModal(true)}
              >
                <i className="fe fe-download me-2"></i> Download
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setShowUploadModal(true)}
              >
                <i className="fe fe-upload me-2"></i> Upload
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Download Corrections</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDownloadModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Download leave correction data for the selected period.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowDownloadModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    downloadAllExcel();
                    setShowDownloadModal(false);
                  }}
                >
                  <i className="fe fe-download me-1"></i> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Data</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUploadModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Select File</label>
                  <input type="file" className="form-control" accept=".xlsx,.xls,.csv" />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowUploadModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleFileUpload}
                >
                  <i className="fe fe-upload me-1"></i> Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Row */}
      <div className="row mb-3">
        <div className="col-md-3 col-lg-2">
          <label className="form-label text-muted small">Business Unit</label>
          <select className="form-select form-select-sm">
            <option>All Units</option>
            <option>Default Business Unit</option>
          </select>
        </div>
        <div className="col-md-3 col-lg-2">
          <label className="form-label text-muted small">Location</label>
          <select className="form-select form-select-sm">
            <option>All Locations</option>
            <option>Hyderabad</option>
          </select>
        </div>
        <div className="col-md-3 col-lg-2">
          <label className="form-label text-muted small">Cost Center</label>
          <select className="form-select form-select-sm">
            <option>All Cost Centers</option>
            <option>Associate Software Engineer</option>
            <option>HR Executive</option>
          </select>
        </div>
        <div className="col-md-3 col-lg-2">
          <label className="form-label text-muted small">Department</label>
          <select className="form-select form-select-sm">
            <option>All Locations</option>
            <option>Product Development Team</option>
            <option>HR Executive</option>
          </select>
        </div>
      </div>

      {/* Month + Leave Type + Search */}
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        {/* Month Selector */}
        <div
          className="d-inline-flex align-items-center border rounded overflow-hidden"
          style={{ height: "38px" }}
        >
          <button
            className="btn btn-secondary d-flex align-items-center justify-content-center border-0 rounded-0"
            onClick={() => handleMonthChange("prev")}
            style={{ width: "38px", height: "38px" }}
          >
            <i className="fe fe-arrow-left"></i>
          </button>

          <div
            className="bg-light fw-semibold text-center d-flex align-items-center justify-content-center"
            style={{
              minWidth: "100px",
              height: "38px",
              padding: "0 12px",
              fontSize: "14px",
            }}
          >
            {month}
          </div>

          <button
            className="btn btn-secondary d-flex align-items-center justify-content-center border-0 rounded-0"
            onClick={() => handleMonthChange("next")}
            style={{ width: "38px", height: "38px" }}
          >
            <i className="fe fe-arrow-right"></i>
          </button>
        </div>

        {/* Leave Type Dropdown */}
        <select
          className="form-select"
          style={{ width: "180px", height: "38px" }}
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        >
          {leaveTypes.map((type, i) => (
            <option key={i} value={type}>{type}</option>
          ))}
        </select>

        {/* Search Input */}
        <div className="input-group" style={{ width: "200px" }}>
          <input
            type="text"
            placeholder="All Employees"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="form-control"
            style={{ height: "38px" }}
          />
        </div>

        {/* View Button */}
        <button className="btn btn-primary" onClick={handleLoad} style={{ height: "38px" }}>
          <i className="fe fe-search me-1"></i> View
        </button>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th className="text-start py-3 px-4" style={{ fontWeight: 600, fontSize: "13px", color: "#6c757d" }}>EMPLOYEE</th>
                  <th className="text-start py-3 px-4" style={{ fontWeight: 600, fontSize: "13px", color: "#6c757d" }}>DESIGNATION</th>
                  <th className="text-center py-3 px-4" style={{ fontWeight: 600, fontSize: "13px", color: "#6c757d" }}>OPENING</th>
                  <th className="text-center py-3 px-4" style={{ fontWeight: 600, fontSize: "13px", color: "#6c757d" }}>
                    ACTIVITY <i className="fe fe-info" style={{ fontSize: "12px" }}></i>
                  </th>
                  <th className="text-center py-3 px-4" style={{ fontWeight: 600, fontSize: "13px", color: "#6c757d" }}>CORRECTION</th>
                  <th className="text-center py-3 px-4" style={{ fontWeight: 600, fontSize: "13px", color: "#6c757d" }}>CLOSING</th>
                  <th className="text-center py-3 px-4" style={{ width: "60px" }}></th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((emp, index) => (
                    <tr key={`${emp.id}-${index}`} style={{ borderBottom: "1px solid #e9ecef" }}>
                      <td className="text-start py-3 px-4">
                        <div>
                          <div className="fw-bold" style={{ fontSize: "14px", color: "#212529" }}>{emp.name}</div>
                          <small className="text-muted">{emp.id}</small>
                        </div>
                      </td>
                      <td className="text-start py-3 px-4" style={{ fontSize: "14px", color: "#6c757d" }}>
                        {emp.designation}
                      </td>
                      <td className="text-center py-3 px-4" style={{ fontSize: "14px", color: "#6c757d" }}>
                        {emp.opening}
                      </td>
                      <td className="text-center py-3 px-4" style={{ fontSize: "14px", color: "#6c757d" }}>
                        {emp.activity}
                      </td>
                      <td className="text-center py-3 px-4">
                        <input
                          type="number"
                          value={emp.correction}
                          onChange={(e) => handleCorrectionChange(emp.id, e.target.value)}
                          className="form-control text-center mx-auto"
                          style={{ width: "80px", height: "32px", fontSize: "14px" }}
                        />
                      </td>
                      <td className="text-center py-3 px-4" style={{ fontSize: "14px", color: "#6c757d" }}>
                        {emp.closing}
                      </td>
                      <td className="text-center py-3 px-4">
                        <button
                          className="btn btn-success btn-sm rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() => alert(`Saved correction for ${emp.name}`)}
                          title="Save"
                        >
                          <i className="fe fe-check" style={{ fontSize: "14px" }}></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Note and Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <p className="mb-0 text-muted small">
          <span style={{ color: "#17a2b8" }}>Note:</span> Corrections are added at the beginning of the period.
        </p>
        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={handlePrevious}
          >
            Previous
          </button>
          <span className="small text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-primary btn-sm"
            disabled={page === totalPages}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaveCorrection;
