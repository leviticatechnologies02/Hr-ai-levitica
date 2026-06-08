import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ContactPage = () => {
  useEffect(() => {
    AOS.init({ once: false, offset: 80, duration: 900, easing: "ease-out-cubic" });
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    interest: "HR Automation"
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Auto reset for demo purposes
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="font-sans antialiased bg-slate-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-28 lg:pb-14 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px] lg:min-h-[400px] bg-slate-900 flex items-center" data-aos="zoom-in" data-aos-duration="900">
            <div className="absolute inset-0 z-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/images/bannerimg.png')` }}
              >
                <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/30"></div>
              </div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center justify-center px-8 md:px-16 py-12 gap-10 text-center">
              <div className="max-w-3xl" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="200">
                <span
                  className="inline-block py-1.5 px-4 rounded-full text-sm font-semibold mb-6 tracking-wide shadow-lg"
                  style={{ backgroundColor: '#3B82F6', color: '#fff' }}
                >
                  💬 Let's Connect
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-white">
                  We're Here To <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Help You Grow</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed max-w-2xl mx-auto">
                  Whether you have a question about our HR platform, need a custom solution, or just want to see a demo our team is ready to answer all your questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards & Form Section */}
      <section className="py-10 px-6 lg:px-8 relative z-20 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

          {/* Left Side: Contact Info */}
          <div className="w-full lg:w-1/3 space-y-8" data-aos="fade-right">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
                <Mail />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Email Us</h3>
              <p className="text-slate-500 mb-4">Our friendly team is here to help.</p>
              <a href="mailto:hello@levitica.com" className="text-blue-600 font-bold hover:text-blue-700">hello@levitica.com</a>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
                <MapPin />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Visit Us</h3>
              <p className="text-slate-500 mb-4">Come say hello at our office HQ.</p>
              <p className="text-slate-800 font-medium">100 Innovation Drive<br />Tech City, TC 10020</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
                <Phone />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Call Us</h3>
              <p className="text-slate-500 mb-4">Mon-Fri from 8am to 5pm.</p>
              <a href="tel:+1234567890" className="text-pink-600 font-bold hover:text-pink-700">+1 (234) 567-890</a>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="w-full lg:w-2/3" data-aos="fade-left">
            <div className="bg-white p-4 lg:p-14 rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

              <h2 className="text-3xl font-bold text-slate-900 mb-2">Send us a message</h2>
              <p className="text-slate-500 mb-8">We'll get back to you within 24 hours.</p>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-[400px] animate-[fadeIn_0.5s_ease-out]">
                  <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-600">Thank you for reaching out. Our team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50 hover:bg-white"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50 hover:bg-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50 hover:bg-white"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50 hover:bg-white"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">What are you interested in?</label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50 hover:bg-white cursor-pointer"
                    >
                      <option value="HR Automation">HR Automation Platform</option>
                      <option value="CRM">AI CRM Platform</option>
                      <option value="Productivity">Productivity Suite</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50 hover:bg-white resize-none"
                      placeholder="Tell us how we can help..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Global Map / Locations Section */}
      <section className="py-10 px-6 bg-slate-100 text-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Come Visit Us</h2>
          <p className="text-slate-600 text-lg mb-10">We are located in the heart of Hyderabad's tech district.</p>
          <div className="w-full h-80 md:h-[400px] rounded-3xl bg-slate-200 overflow-hidden relative shadow-lg border border-slate-300">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Levitica%20Technologies%20PVT%20LTD,%20Madhapur,%20Hyderabad+(Levitica%20Technologies)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              title="Levitica Technologies Map"
              style={{ filter: "contrast(1.05) opacity(0.95)" }}
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
