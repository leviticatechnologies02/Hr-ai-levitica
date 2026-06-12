import React from "react";
export default function BasicInfo() {

  const handleDownload = () => {
    alert("Download Statement triggered ✅");
  };

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate this employee?")) {
      alert("Employee has been deactivated ❌");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Changes saved successfully ✅");
  };

  return (
    <div className="bg-light">
      <div className="container-fluid">
        <div className="row min-vh-100">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div>
              <i className="bi bi-chevron-double-left fs-4 text-secondary me-2"></i>
              <i className="bi bi-chevron-double-right fs-4 text-primary"></i>
            </div>
            <div>
              <p className="mb-1 text-muted fw-semibold">
                &gt; All Employees / Basic Info
              </p>
              <h4 className="fw-bold mb-1">Potnuri Naveen Bhargav</h4>
              <p className="text-muted mb-0">
                Find the most relevant information about your business
                here.
              </p>
            </div>
          </div>

          <main className="col-md-12 p-0 ">
            <section className="p-4">
              <div className="bg-white rounded shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold mb-0">Basic Info</h5>
                    <p className="mb-0 text-muted">
                      Manage Core HR Related Employee Information
                    </p>
                  </div>
                  <div>
                    <button onClick={handleDownload} className="btn btn-outline-secondary btn-sm me-2">
                      <i className="bi bi-download me-1"></i> Download
                      Statement
                    </button>
                    <button onClick={handleDeactivate} className="btn btn-outline-danger btn-sm me-2">
                      <i className="bi bi-trash me-1"></i> Deactivate
                    </button>
                  </div>
                </div>

                <div className="row align-items-start">
                  <div className="col-md-2 text-center">
                    <div
                      className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center mx-auto"
                      style={{ width: "80px", height: "80px" }}
                    >
                      PB
                    </div>
                    <small className="d-block mt-2 text-muted">
                      Resolution: 400 × 400 px
                      <br />
                      Max Size: 1MB
                    </small>
                  </div>

                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          defaultValue="Potnuri"
                        />
                        <small className="text-danger">
                          Name as per Aadhaar
                          <br />
                          <strong>Not Verified</strong>
                        </small>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Middle Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          defaultValue="Naveen"
                        />
                        <small className="text-danger">
                          Name as per Bank
                          <br />
                          <strong>Not Verified</strong>
                        </small>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          defaultValue="Bhargav"
                        />
                        <small className="text-danger">
                          Name as per PAN
                          <br />
                          <strong>Not Verified</strong>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="col-md-10">
              <form className="p-4">
                <h6 className="fw-bold mb-3">Official Record</h6>

                {[
                  ["Date of Joining", "date", "2025-05-12"],
                  ["Date of Confirmation", "date", "2025-05-13"],
                  ["Mobile Number", "text", "7036170121"],
                  ["Official EmailId", "email", "naveenb220@gmail.com"],
                  ["Office Phone", "phone", ""],
                  ["Employee code", "text", "LEV076"],
                  ["Biometric code", "text", ""],
                  ["Notice Period", "text", "0"],
                ].map(([label, type, value], idx) => (
                  <div className="row mb-3 align-items-center" key={idx}>
                    <div className="col-md-3">
                      <label className="form-label mb-1">{label}</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        type={type}
                        className="form-control"
                        defaultValue={value}
                      />
                    </div>
                  </div>
                ))}
              </form>
            </div>

            <div className="col-md-10">
              <form onSubmit={handleSave} className="p-4">
                <h6 className="fw-bold mb-3">Personal Record</h6>
                <div className="row mb-3 align-items-center">
                  <div className="col-md-3">
                    <label className="form-label mb-1">
                      Date of Birth
                    </label>
                  </div>
                  <div className="col-md-9">
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="1198-08-02"
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-md-3">
                    <label className="form-label mb-1">Gender</label>
                  </div>
                  <div className="col-md-9">
                    {["Male", "Female", "Transgender"].map((g, i) => (
                      <div
                        className="form-check form-check-inline"
                        key={i}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          value={g}
                          defaultChecked={g === "Male"}
                        />
                        <label className="form-check-label">{g}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-md-3">
                    <label className="form-label mb-1">
                      Marital Status
                    </label>
                  </div>
                  <div className="col-md-9">
                    {["Married", "Unmarried"].map((status, i) => (
                      <div
                        className="form-check form-check-inline"
                        key={i}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="maritalStatus"
                          value={status}
                          defaultChecked={status === "Married"}
                        />
                        <label className="form-check-label">
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {[
                  ["Personal E-Mail", "email", "naveenb220@gmail.com"],
                  ["Personal Phone", "phone", "7396813098"],
                  ["Emergency contact", "phone", "7396813098"],
                ].map(([label, type, value], idx) => (
                  <div className="row mb-3 align-items-center" key={idx}>
                    <div className="col-md-3">
                      <label className="form-label mb-1">{label}</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        type={type}
                        className="form-control"
                        defaultValue={value}
                      />
                    </div>
                  </div>
                ))}

                <button className="btn btn-primary btn-sm">
                  <i className="bi bi-save me-1"></i> Save
                </button>

              </form>
            </div>
          </main>
        </div>
      </div>



      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2">
          <a href="#" className="text-decoration-none text-muted">
            About Us
          </a>
          <span className="text-muted">|</span>
          <a href="#" className="text-decoration-none text-muted">
            Contact Us
          </a>
          <span className="text-muted">|</span>
          <a href="#" className="text-decoration-none text-muted">
            Privacy Policy
          </a>
          <span className="text-muted">|</span>
          <a href="#" className="text-decoration-none text-muted">
            Terms of Service
          </a>
          <span className="text-muted">|</span>
          <a href="#" className="text-decoration-none text-muted">
            Refunds & Cancellations
          </a>
        </div>

        <div className="mt-2">
          <small>
            Licensed to <strong>Levitica Technologies Private Limited</strong>{" "}
            | License valid till: <strong>2025-09-23</strong>
          </small>
          <br />
          <small>© 2025 Runtime Software Private Limited</small>
        </div>
      </div>

    </div>

  );
}
