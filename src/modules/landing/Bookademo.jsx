import React, { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

const DemoBooking = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState(null); // stores full Date object
  const [selectedTime, setSelectedTime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    company: "",
    employees: "",
    guests: []
  });

  // Booked slots stored by date string "YYYY-MM-DD"
  const [bookedSlots, setBookedSlots] = useState({
    "2025-12-10": ["12:00 am", "12:15 am"],
    "2025-12-15": ["12:30 am"],
  });

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const allTimes = [
    "12:00 am",
    "12:15 am",
    "12:30 am",
    "12:45 am",
    "1:00 am",
    "1:15 am",
  ];

  const features = [
    {
      icon: "bi-camera",
      title: "Intelligent Screenshots",
      desc: "AI takes screenshots at set intervals, for transparency without the micromanagement.",
    },
    {
      icon: "bi-person-heart",
      title: "Employee Wellness Insights",
      desc: "Help your team avoid burnout with inactivity alerts and work/life balance tracking.",
    },
    {
      icon: "bi-bar-chart-line",
      title: "Robust Reporting Suite",
      desc: "Custom dashboards and reports to track the metrics that matter most to your business.",
    },
    {
      icon: "bi-people",
      title: "Advanced Team Collaboration Tools",
      desc: "Built-in tasks, deadlines, and communication features keep projects on track and streamline workflow.",
    },
  ];

  const blogs = [
    {
      img: "https://cdn.completeaitraining.com/news_images/top-ai-project-management-tools-transforming-team-productivity-in-2025_2025-06-01.jpg",
      title: "The Best AI Project Management Tools in 2025",
      link: "#",
    },
    {
      img: "https://www.wellable.co/blog/wp-content/uploads/2024/01/5616689-edited-scaled.jpg",
      title: "How to Measure the ROI of Employee Wellness Programs?",
      link: "#",
    },
    {
      img: "https://assets.peoplematters.in/images/e8adbda2-3997-49a2-b6fb-5cc7d9df3c91.jpg",
      title: "The Rise of 'Digital Presenteeism': Why Being Online ≠ Being Productive",
      link: "#",
    },
  ];

  // Helper functions
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Format date as YYYY-MM-DD
  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Check if a date is today
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateClick = (day) => {
    const dateKey = formatDateKey(currentYear, currentMonth, day);
    const isCompleted = bookedSlots[dateKey]?.length === allTimes.length;
    if (!isCompleted) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
    }
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddGuest = () => {
    const email = prompt("Enter guest email:");
    if (email) {
      setFormData(prev => ({
        ...prev,
        guests: [...prev.guests, email]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();
      const dateKey = formatDateKey(year, month, day);
      setBookedSlots(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), selectedTime]
      }));
    }
    alert("Demo booked successfully!");
    setShowForm(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ phone: "", company: "", employees: "", guests: [] });
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedTime(null);
  };

  // If booking form is shown
  if (showForm) {
    return (
      <div style={{ background: "#f6f7ff", minHeight: "100vh", padding: "40px 20px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "#fff", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <div style={{ background: "#2b245c", color: "#fff", padding: "20px", textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>Book Your Demo - AI</h2>
            <p style={{ margin: "8px 0 0", fontSize: "14px", opacity: "0.9" }}>
              Selected Time: {selectedDate?.getDate()} {monthNames[selectedDate?.getMonth()]} {selectedDate?.getFullYear()}, {selectedTime}
            </p>
          </div>
          <div style={{ padding: "40px" }}>
            <button onClick={handleBack} style={{ background: "none", border: "none", color: "#6366f1", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "30px", padding: "0" }}>
              <span style={{ fontSize: "18px" }}>←</span> Back
            </button>
            <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>Phone number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} placeholder="Enter your phone number" />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>Company name *</label>
                <input type="text" name="company" value={formData.company} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} placeholder="Enter your company name" />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>Number of employees *</label>
                <select name="employees" value={formData.employees} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}>
                  <option value="">Select number of employees</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="501+">501+</option>
                </select>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>Add guests 🔥</label>
                <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>Invite up to 10 guests to attend the meeting.</p>
                {formData.guests.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    {formData.guests.map((guest, index) => (
                      <div key={index} style={{ background: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", marginBottom: "8px", fontSize: "13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{guest}</span>
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: prev.guests.filter((_, i) => i !== index) }))} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="button" onClick={handleAddGuest} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px dashed #d1d5db", background: "#f9fafb", color: "#374151", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><span>+</span> Add guest via email</button>
                </div>
              </div>
              <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "none", background: "linear-gradient(90deg, #7c3aed, #4f46e5)", color: "#fff", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "20px" }}>Book Demo</button>
            </form>
          </div>
        </div>

        <style jsx="true">{`
          @media (max-width: 768px) {
            div[style*="padding: 40px 20px"] { padding: 20px 16px !important; }
            div[style*="padding: 40px"] { padding: 24px !important; }
            h2[style*="font-size: 20px"] { font-size: 18px !important; }
            input, select, button { font-size: 13px !important; }
            label { font-size: 13px !important; }
          }
          @media (max-width: 480px) {
            div[style*="padding: 40px"] { padding: 20px 16px !important; }
            h2[style*="font-size: 20px"] { font-size: 16px !important; }
            button[style*="font-size: 16px"] { font-size: 14px !important; padding: 12px !important; }
          }
        `}</style>
      </div>
    );
  }

  // Main booking page
  return (
    <div style={{ overflowX: "hidden" }}>
      {/* Demo Booking Section */}
      <div style={{ background: "#f6f7ff", minHeight: "100vh", paddingBottom: "40px" }}>
        <div style={{ background: "#2b245c", color: "#fff", textAlign: "center", padding: "10px", fontSize: "11px", letterSpacing: "1px" }}>
          SEE AI IN ACTION
        </div>

        <div style={{ maxWidth: "1050px", margin: "40px auto", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", padding: "0 16px" }}>
          {/* Calendar Card */}
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <div style={{ width: "48px", height: "48px", background: "#000", color: "#fff", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", marginBottom: "12px", fontWeight: "bold" }}>
                AI
              </div>
              <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Meet with Product Specialist</h4>
              {/* Month navigation */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "10px" }}>
                <button onClick={handlePrevMonth} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#2b245c" }}>‹</button>
                <p style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>{monthNames[currentMonth]} {currentYear}</p>
                <button onClick={handleNextMonth} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#2b245c" }}>›</button>
              </div>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", fontSize: "12px", textAlign: "center", marginBottom: "8px", fontWeight: "600" }}>
              {days.map(d => <div key={d}>{d}</div>)}
            </div>

            {/* Date grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "8px", fontSize: "12px", textAlign: "center", marginBottom: "30px" }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} style={{ padding: "8px 0" }}></div>)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = formatDateKey(currentYear, currentMonth, day);
                const isBookedFully = bookedSlots[dateKey]?.length === allTimes.length;
                const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
                const isTodayDate = isToday(day);

                return (
                  <div
                    key={day}
                    onClick={() => !isBookedFully && handleDateClick(day)}
                    style={{
                      padding: "8px 0",
                      borderRadius: "50%",
                      cursor: isBookedFully ? "not-allowed" : "pointer",
                      background: isSelected ? "#2b245c" : isTodayDate ? "#e0f2fe" : "transparent",
                      color: isSelected ? "#fff" : isBookedFully ? "#9ca3af" : "#111",
                      fontWeight: isSelected || isTodayDate ? 600 : 400,
                      filter: isBookedFully ? "blur(1px)" : "none",
                      transition: "all 0.2s ease",
                      border: isTodayDate && !isSelected ? "1px solid #2b245c" : "none",
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Time selection */}
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#555" }}>Meeting duration: 30 mins</p>
              <p style={{ fontSize: "14px", fontWeight: 600, marginTop: "20px", color: "#333" }}>Select a time</p>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>UTC +05:30 New Delhi, Mumbai, Calcutta</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "10px" }}>
                {allTimes.map((time) => {
                  const dateKey = selectedDate ? formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : null;
                  const isBooked = dateKey ? bookedSlots[dateKey]?.includes(time) : false;
                  const isSelected = time === selectedTime;

                  return (
                    <button
                      key={time}
                      disabled={!selectedDate || isBooked}
                      onClick={() => handleTimeClick(time)}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        background: isSelected ? "#2b245c" : "#fff",
                        color: isSelected ? "#fff" : isBooked ? "#9ca3af" : "#111",
                        fontSize: "12px",
                        cursor: isBooked ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {time} {isBooked ? "✓" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Testimonial Card */}
          <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user" style={{ width: "72px", height: "72px", borderRadius: "50%", marginBottom: "16px", margin: "0 auto", border: "3px solid #f0f0f0" }} />
            <div style={{ color: "#f59e0b", fontSize: "14px", marginBottom: "12px" }}>★★★★★</div>
            <p style={{ fontSize: "13px", color: "#374151", margin: "12px 0", lineHeight: "1.6", fontStyle: "italic" }}>
              "With AI, our productivity skyrocketed. The insights are game-changing for managing our remote team efficiently."
            </p>
            <h4 style={{ fontSize: "14px", marginBottom: "4px", fontWeight: "600" }}>Upanaya Jaiswal</h4>
            <p style={{ fontSize: "12px", color: "#6b7280" }}>HR & Admin</p>
            <div style={{ marginTop: "24px", padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "11px", color: "#4b5563", margin: 0, lineHeight: "1.5" }}>
                <strong style={{ color: "#2b245c" }}>Showing 3,000+ clients</strong> across 18 countries with 47,000+ users
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section - Reduced top padding */}
      <section style={{ background: "#f5f3ff", padding: "0px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 0px", textAlign: "center" }}>
          <h4 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "30px", color: "#1e1b4b" }}>
            Here are some Key Features that Set <span style={{ color: "#7c3aed" }}>AI</span> Apart
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px", marginTop: "20px", marginBottom: "40px" }}>
            {features.map((feature, idx) => (
              <div key={idx} style={{ padding: "30px", background: "#fff", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.06)", textAlign: "left", transition: "transform 0.3s ease" }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ width: "48px", height: "48px", background: "#f3f0ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px" }}>
                    <i className={`${feature.icon}`} style={{ color: "#7c3aed", fontSize: "22px" }}></i>
                  </div>
                  <h5 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>{feature.title}</h5>
                </div>
                <p style={{ fontSize: "15px", color: "#666", margin: 0, lineHeight: "1.6" }}>{feature.desc}</p>
              </div>
            ))}
          </div>

          <button style={{ backgroundColor: "#7c3aed", color: "#fff", border: "none", fontSize: "16px", padding: "14px 32px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6d28d9"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7c3aed"}>
            GET STARTED FOR FREE
          </button>
          <p style={{ fontSize: "13px", color: "#666", marginTop: "16px" }}>Free Trial - Absolutely No Strings Attached.</p>
        </div>
      </section><br></br>

      {/* Blog Section */}
      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "#6b6b6b", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>READ MORE BLOGS</p>
          <h4 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "40px", color: "#1e1b4b" }}>
            Want to study more about{" "}
            <span style={{ background: "linear-gradient(90deg,#a855f7,#3b82f6,#10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Employee Monitoring?
            </span>
          </h4>

         <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
  {blogs.map((blog, idx) => (
    <div
      key={idx}
      style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        overflow: "hidden",
        transition: "transform 0.3s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      
      <img
        src={blog.img}
        alt={blog.title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover"
        }}
      />

      <div
        style={{
          padding: "24px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1
        }}
      >
        <h6
          style={{
            fontSize: "17px",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#1f2937"
          }}
        >
          {blog.title}
        </h6>

        <a
          href={blog.link}
          style={{
            backgroundColor: "#e0d9ff",
            color: "#5c3cae",
            fontSize: "13px",
            borderRadius: "6px",
            textDecoration: "none",
            padding: "8px 16px",
            display: "inline-block",
            fontWeight: "500",
            transition: "all 0.3s ease",
            alignSelf: "flex-start"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#d0c5ff";
            e.currentTarget.style.transform = "translateX(5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#e0d9ff";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          READ MORE &gt;
        </a>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      <style jsx="true">{`
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: 2fr 1fr"] { grid-template-columns: 1fr !important; gap: 20px !important; }
          div[style*="gridTemplateColumns: repeat(2, 1fr)"] { grid-template-columns: 1fr !important; gap: 20px !important; }
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
        }
        @media (max-width: 768px) {
          div[style*="min-height: 100vh"] { padding-bottom: 20px !important; }
          div[style*="gridTemplateColumns: 2fr 1fr"] { margin: 20px auto !important; padding: 0 12px !important; }
          div[style*="background: #fff; padding: 30px"] { padding: 24px !important; }
          h4[style*="font-size: 16px"] { font-size: 15px !important; }
          p[style*="font-size: 13px"] { font-size: 12px !important; }
          div[style*="gridTemplateColumns: repeat(7,1fr)"] { gap: 6px !important; font-size: 11px !important; }
          div[style*="padding: 8px 0"] { padding: 6px 0 !important; }
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          button[style*="padding: 10px"] { font-size: 11px !important; padding: 8px !important; }
          img[style*="width: 72px"] { width: 60px !important; height: 60px !important; }
          p[style*="font-size: 13px; color: #374151"] { font-size: 12px !important; }
          h4[style*="font-size: 14px; margin-bottom: 4px"] { font-size: 13px !important; }
          p[style*="font-size: 12px; color: #6b7280"] { font-size: 11px !important; }
          section[style*="background: #f5f3ff"] { padding: 30px 0 !important; }
          h4[style*="font-size: 24px"] { font-size: 20px !important; padding: 0 15px !important; margin-bottom: 20px !important; }
          div[style*="gridTemplateColumns: repeat(2, 1fr)"] { gap: 16px !important; }
          div[style*="padding: 30px; background: #fff"] { padding: 20px !important; }
          h5[style*="font-size: 18px"] { font-size: 16px !important; }
          p[style*="font-size: 15px; color: #666"] { font-size: 13px !important; }
          button[style*="font-size: 16px"] { font-size: 14px !important; padding: 12px 24px !important; }
          section[style*="background: #fff; padding: 60px 0"] { padding: 40px 0 !important; }
          h4[style*="font-size: 32px"] { font-size: 24px !important; padding: 0 15px !important; }
          p[style*="font-size: 13px; color: #6b6b6b"] { font-size: 12px !important; }
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; gap: 24px !important; }
          img[style*="height: 200px"] { height: 180px !important; }
          div[style*="padding: 24px"] { padding: 20px !important; }
          h5[style*="font-size: 17px"] { font-size: 16px !important; }
          a[style*="font-size: 13px"] { font-size: 12px !important; padding: 6px 12px !important; }
        }
        @media (max-width: 480px) {
          div[style*="gridTemplateColumns: repeat(7,1fr); gap: 8px; font-size: 12px"] { font-size: 10px !important; gap: 4px !important; }
          div[style*="padding: 8px 0"] { padding: 4px 0 !important; }
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          h4[style*="font-size: 24px"] { font-size: 18px !important; }
          h4[style*="font-size: 32px"] { font-size: 20px !important; line-height: 1.3 !important; }
          img[style*="height: 200px"] { height: 160px !important; }
        }
      `}</style>
    </div>
  );
};

export default DemoBooking;