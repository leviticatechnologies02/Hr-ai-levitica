
import React, { useState } from "react";
import Breadcrump from "../../../shared/components/Breadcrump";


const ManualAttendance = () => {
  const [attendance, setAttendance] = useState([
    { id: 1, name: "Abhilash Gurrampally", code: "LEV029", P: 0, A: 0, H: 0, W: 0, CO: 0, CL: 0, LW: 0 },
    { id: 2, name: "Anusha Enigalla", code: "LEV039", P: 0, A: 0, H: 0, W: 0, CO: 0, CL: 0, LW: 0 },
    { id: 3, name: "Ashok Kota", code: "LEV047", P: 0, A: 0, H: 0, W: 0, CO: 0, CL: 0, LW: 0 },
    { id: 4, name: "Bogala Chandramouli", code: "LEV027", P: 0, A: 0, H: 0, W: 0, CO: 0, CL: 0, LW: 0 },
    { id: 5, name: "Burri Gowtham", code: "LEV023", P: 0, A: 0, H: 0, W: 0, CO: 0, CL: 0, LW: 0 },
  ]);

  const [financialYear, setFinancialYear] = useState("SEP-2025");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleYearChange = (direction) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const [currentMonth, currentYearStr] = financialYear.split("-");
    let year = parseInt(currentYearStr);
    let monthIndex = months.indexOf(currentMonth);

    if (direction === "prev") {
      if (monthIndex === 0) { monthIndex = 11; year--; } else { monthIndex--; }
    } else if (direction === "next") {
      if (monthIndex === 11) { monthIndex = 0; year++; } else { monthIndex++; }
    }

    setFinancialYear(`${months[monthIndex]}-${year}`);
  };

  const handleChange = (id, field, value) => {
    setAttendance((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: Number(value) } : row
      )
    );
  };

  const handleSave = (id) => {
    const emp = attendance.find((e) => e.id === id);
    alert(`✅ Attendance saved for ${emp.name}`);
  };

  return (
    <div className="mt-4">

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-1">Manual Attendance</h4>
          <p className="text-muted mb-0">
            Capture number of days present, absent, etc. directly without tracking time punches.
          </p>
        </div>
        <div className="dropdown">
          <button
            className="btn btn-primary btn-sm dropdown-toggle d-inline-flex align-items-center"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Options <i className="fe fe-chevron-down ms-1"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" onClick={() => setShowDownloadModal(true)}>
                <i className="fe fe-download me-2"></i>Download Attendance
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setShowUploadModal(true)}>
                <i className="fe fe-upload me-2"></i>Upload Attendance
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Filters */}
      <div
        className="mb-3 p-3 rounded"
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}
      >
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label small fw-semibold">
              Business Unit
            </label>
            <select className="form-select">
              <option>All Units</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-semibold">
              Location
            </label>
            <select className="form-select">
              <option>All Locations</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-semibold">
              Cost Center
            </label>
            <select className="form-select">
              <option>All Cost Centers</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-semibold">
              Department
            </label>
            <select className="form-select">
              <option>All Departments</option>
            </select>
          </div>
        </div>
      </div>


      {/* Month Selector */}
      <div className="d-flex align-items-center mb-3 gap-3">
        <div className="d-flex align-items-center border rounded overflow-hidden" style={{ height: "38px" }}>
          <button
            className="btn btn-secondary border-0 rounded-0"
            onClick={() => handleYearChange("prev")}
            style={{ height: "38px", width: "38px" }}
          >
            <i className="fe fe-arrow-left"></i>
          </button>
          <div className="px-4 py-2 bg-light fw-semibold text-center d-flex align-items-center justify-content-center" style={{ minWidth: "100px" }}>
            {financialYear}
          </div>
          <button
            className="btn btn-secondary border-0 rounded-0"
            onClick={() => handleYearChange("next")}
            style={{ height: "38px", width: "38px" }}
          >
            <i className="fe fe-arrow-right"></i>
          </button>
        </div>

        <div className="input-group" style={{ width: "250px" }}>
          <input
            type="text"
            className="form-control"
            defaultValue="All Employees"
            style={{ height: "38px" }}
          />
          <button className="btn btn-primary" style={{ height: "38px" }}>
            <i className="fe fe-search"></i>
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <table className="table table-bordered align-middle text-center">
        <thead className="table-light">
          <tr>
            <th>Sl.No</th>
            <th>Employee</th>
            <th>P</th><th>A</th><th>H</th><th>W</th><th>CO</th><th>CL</th><th>LW</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((emp, index) => (
            <tr key={emp.id}>
              <td>{index + 1}</td>
              <td className="text-start">
                <strong>{emp.name}</strong><br />
                <span className="text-muted small">{emp.code}</span>
              </td>
              {["P", "A", "H", "W", "CO", "CL", "LW"].map((field) => (
                <td key={field}>
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm text-center"
                    value={emp[field]}
                    onChange={(e) => handleChange(emp.id, field, e.target.value)}
                  />
                </td>
              ))}
              <td>
                <button className="btn btn-success btn-sm" onClick={() => handleSave(emp.id)}>
                  <i className="fe fe-save"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-outline-secondary btn-sm">Previous</button>
        <span className="small">Page 1 of 1</span>
        <button className="btn btn-outline-secondary btn-sm">Next</button>
      </div>

      {/* ✅ Download Attendance Modal */}
      {showDownloadModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Download Attendance</h6>
                <button className="btn-close" onClick={() => setShowDownloadModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3"><strong>Period:</strong> {financialYear}</div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <select className="form-select"><option>All Locations</option></select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Cost Center</label>
                  <select className="form-select"><option>All Cost Centers</option></select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <select className="form-select"><option>All Departments</option></select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setShowDownloadModal(false)}>Close</button>
                <button className="btn btn-primary">
                  <i className="fe fe-download me-1"></i>Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Upload Attendance Modal */}
      {showUploadModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Upload Attendance</h6>
                <button className="btn-close" onClick={() => setShowUploadModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3"><strong>Period:</strong> {financialYear}</div>
                <div className="mb-3">
                  <label className="form-label">Select File</label>
                  <input type="file" className="form-control" />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setShowUploadModal(false)}>Close</button>
                <button className="btn btn-primary">
                  <i className="fe fe-upload me-1"></i>Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualAttendance;

