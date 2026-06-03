import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OnboardingCompletion() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        toast.success("🎉 Submitted Successfully!");
        setTimeout(() => {
            // Redirect to onboarding forms page
            navigate("/onboarding/pre-joining");
        }, 1500);
    };

    return (
        <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
            <div
                style={{
                    width: "100%",
                    maxWidth: "900px",
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "18px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    margin: "0 auto"
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <img
                        src="/assets/img/icons/logo-1.png"
                        alt="logo"
                        style={{ width: "55px", height: "55px", borderRadius: "50%" }}
                    />

                    <div>
                        <div style={{ fontSize: "20px", fontWeight: "700" }}>
                            Onboarding Form: Test
                        </div>
                        <div style={{ fontSize: "14px", color: "#6b6b6b" }}>
                            Levitica Technologies Private Limited
                        </div>
                    </div>

                    <div style={{ marginLeft: "auto", fontSize: "20px", cursor: "pointer" }}>
                        🌙
                    </div>
                </div>

                <hr style={{ marginTop: "20px" }} />

                {/* Center Message */}
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <h2 style={{ fontWeight: "700", marginBottom: "15px" }}>Well Done!</h2>
                    <p style={{ fontSize: "16px", color: "#6b6b6b" }}>
                        You have completed all the sections. <br />
                        Click <strong>Back</strong> to make changes.
                    </p>

                    <p style={{ fontSize: "16px", marginTop: "10px" }}>
                        Click <strong>Submit</strong> to send your information.
                    </p>
                </div>

                <hr style={{ marginTop: "40px" }} />

                {/* Buttons */}
                <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/uploaddocument")}
                        style={{
                            padding: "10px 25px",
                            background: "#e5e7eb",
                            border: "none",
                            color: "#111",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: 600
                        }}
                    >
                        ← Back
                    </button>

                    {/* Continue Button */}
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: "10px 25px",
                            background: "#0066ff",
                            border: "none",
                            color: "white",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: 600
                        }}
                    >
                        Submit
                    </button>


                </div>

                <ToastContainer position="top-right" autoClose={2000} />
            </div>
        </div>
    );
}
