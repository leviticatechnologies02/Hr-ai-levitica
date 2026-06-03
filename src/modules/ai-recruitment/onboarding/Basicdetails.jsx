import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Basicdetails() {
    const [profilePic, setProfilePic] = useState(null);


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file));
        }
    };
    const navigate = useNavigate();

    const goToContactDetails = () => {
        navigate("/onboardingcontactdetails");
    };


    return (
        <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
            <div style={{ width: "100%", maxWidth: "900px", background: "#fff", padding: "30px", borderRadius: "18px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                    <img
                        src="/logo192.png"
                        alt="logo"
                        style={{ width: "55px", height: "55px", borderRadius: "50%" }}
                    />

                    <div>
                        <div style={{ fontSize: "20px", fontWeight: "700" }}>
                            Onboarding Form: Chandu Thota
                        </div>
                        <div style={{ fontSize: "14px", color: "#6b6b6b" }}>
                            Levitica Technologies Private Limited
                        </div>
                    </div>

                    <div style={{ marginLeft: "auto", fontSize: "20px", cursor: "pointer" }}>🌙</div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #dedede", paddingBottom: "8px" }}>
                    <div style={{ fontSize: "17px", fontWeight: "600", color: "#2563eb" }}>Basic Details</div>
                    <div style={{ color: "#666" }}>Step 1 of 9</div>
                </div>

                {/* Progress */}
                <div style={{ display: "flex", alignItems: "center", margin: "10px 0 20px" }}>
                    <div style={{ width: "120px", height: "4px", background: "#2563eb", borderRadius: "10px" }}></div>
                    <div style={{ marginLeft: "12px", fontSize: "13px", color: "#666" }}>5% completed</div>
                </div>

                {/* Form */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>

                    {/* First Name */}
                    <div>
                        <label style={{ fontWeight: 600 }}>First Name <span style={{ color: "red" }}>*</span></label>
                        <input
                            type="text"
                            placeholder="First Name"
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cdd2d8", background: "#f8f9fa" }}
                        />
                        <small style={{ color: "#8b8b8b" }}>100 chars left</small>
                    </div>

                    {/* Photo Upload */}
                    <div style={{ textAlign: "center" }}>
                        <label style={{ cursor: "pointer" }}>
                            {profilePic ? (
                                <img
                                    src={profilePic}
                                    alt="profile"
                                    style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        background: "#ddd",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "30px"
                                    }}
                                >
                                    👤
                                </div>
                            )}
                        </label>

                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} id="uploadInput" />

                        <label htmlFor="uploadInput" style={{ display: "block", marginTop: "5px", color: "#2563eb", cursor: "pointer" }}>
                            Upload your photo
                        </label>
                    </div>

                    {/* Middle Name */}
                    <div>
                        <label style={{ fontWeight: 600 }}>Middle Name</label>
                        <input
                            type="text"
                            placeholder="Middle Name"
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cdd2d8", background: "#f8f9fa" }}
                        />
                        <small style={{ color: "#8b8b8b" }}>100 chars left</small>
                    </div>

                    {/* Last Name */}
                    <div>
                        <label style={{ fontWeight: 600 }}>Last Name <span style={{ color: "red" }}>*</span></label>
                        <input
                            type="text"
                            placeholder="Last Name"
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cdd2d8", background: "#f8f9fa" }}
                        />
                        <small style={{ color: "#8b8b8b" }}>100 chars left</small>
                    </div>

                    {/* Gender */}
                    <div>
                        <label style={{ fontWeight: 600 }}>Gender <span style={{ color: "red" }}>*</span></label>
                        <select
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cdd2d8",
                                background: "#f8f9fa"
                            }}
                        >
                            <option>Please select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* DOB */}
                    <div>
                        <label style={{ fontWeight: 600 }}>Date of Birth <span style={{ color: "red" }}>*</span></label>
                        <input
                            type="date"
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cdd2d8",
                                background: "#f8f9fa"
                            }}
                        />
                    </div>

                </div>


                {/* Back + Continue Buttons */}
                <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/newhire")}
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
                        onClick={goToContactDetails}
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
                        Continue ➜
                    </button>

                </div>

            </div>
        </div>
    );
}
