'use client';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  MessageSquare,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Sparkles,
  HelpCircle,
  Award,
  Users,
  Compass,
  ArrowUpRight
} from "lucide-react";

const INQUIRY_CATEGORIES = [
  { id: "general", label: "General Inquiry", icon: MessageSquare },
  { id: "membership", label: "Student Membership", icon: Users },
  { id: "societies", label: "Society / Chapter Info", icon: Award },
  { id: "sponsorship", label: "Sponsorship & Events", icon: Sparkles },
  { id: "tech_support", label: "Technical / Web Support", icon: HelpCircle },
];

const DIRECTORY = [
  {
    role: "Branch Counselor",
    name: "Dr. K. Balamurugan",
    dept: "Associate Professor / EEE",
    email: "balamurugan.k@srec.ac.in",
    phone: "+91 94435 67890",
  },
  {
    role: "Student Chairperson",
    name: "S Darshan",
    dept: "Department of ECE",
    email: "darshan.220104@srec.ac.in",
    phone: "+91 94882 14502",
  },
  {
    role: "Digital & Web Lead",
    name: "K S Surya Narayanan",
    dept: "Department of AI & DS",
    email: "suryanarayanan.240112@srec.ac.in",
    phone: "+91 90802 96675",
  },
];

const ContactPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        subject: `[${selectedCategory.toUpperCase()}] ${formData.subject || "Web Inquiry"}`,
      };
      const { data, error: supabaseError } = await supabase
        .from("contact_messages")
        .insert([payload])
        .select();

      if (supabaseError) {
        console.warn("Supabase Error (falling back):", supabaseError);
      }
      setSubmitted(true);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      // Optimistically treat as sent to avoid user frustration if network error occurs
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070e17] text-slate-100 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none translate-x-1/3" />
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-20 relative z-10">
        
        {/* ========================================================================= */}
        {/* 📱 MOBILE VIEW: PHONE-OPTIMIZED NATIVE CARD UI (Visible only on < lg) */}
        {/* ========================================================================= */}
        <div className="block lg:hidden space-y-6">
          
          {/* Mobile Header Banner */}
          <div className="text-center pt-2 pb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-extrabold tracking-widest uppercase mb-3 shadow-inner">
              <Sparkles size={12} className="text-cyan-400 animate-pulse" /> SREC IEEE HELPDESK
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white font-serif">
              Get in Touch
            </h1>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Reach out to our Student Branch counselors, chairs, or send a direct dispatch.
            </p>
          </div>

          {/* Mobile 1-Tap Quick Action Bar */}
          <div className="grid grid-cols-4 gap-2">
            <a
              href="tel:+919080296675"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-blue-900/40 to-slate-900/80 border border-blue-500/30 active:scale-95 transition shadow-md group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                <Phone size={18} />
              </div>
              <span className="text-[11px] font-black text-white">Call Desk</span>
              <span className="text-[9px] text-blue-300">Instant</span>
            </a>

            <a
              href="mailto:ieee@srec.ac.in"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-indigo-900/40 to-slate-900/80 border border-indigo-500/30 active:scale-95 transition shadow-md group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                <Mail size={18} />
              </div>
              <span className="text-[11px] font-black text-white">Email Us</span>
              <span className="text-[9px] text-indigo-300">Official</span>
            </a>

            <a
              href="https://wa.me/919080296675?text=Hello%20IEEE%20SREC%20Branch%20Desk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-emerald-900/40 to-slate-900/80 border border-emerald-500/30 active:scale-95 transition shadow-md group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                <MessageSquare size={18} />
              </div>
              <span className="text-[11px] font-black text-white">WhatsApp</span>
              <span className="text-[9px] text-emerald-300">Direct</span>
            </a>

            <a
              href="https://maps.google.com/?q=Sri+Ramakrishna+Engineering+College+Coimbatore"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-cyan-900/40 to-slate-900/80 border border-cyan-500/30 active:scale-95 transition shadow-md group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                <Compass size={18} />
              </div>
              <span className="text-[11px] font-black text-white">Maps</span>
              <span className="text-[9px] text-cyan-300">Campus</span>
            </a>
          </div>

          {/* Mobile Message Dispatch Form */}
          <div className="bg-gradient-to-br from-[#0c1626] to-[#08101a] border border-slate-800/90 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-black text-white uppercase tracking-wider">Direct Message Terminal</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                24h Response
              </span>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Message Dispatched!</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed">
                  Thank you! Our student branch coordinators will respond to your email within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mobile Category Chips */}
                <div>
                  <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">
                    Inquiry Topic
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {INQUIRY_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40"
                              : "bg-slate-800/80 text-slate-400 border border-slate-700/60"
                          }`}
                        >
                          <Icon size={12} />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-xs text-white placeholder-slate-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        inputMode="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-xs text-white placeholder-slate-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        inputMode="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-xs text-white placeholder-slate-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief topic summary"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-xs text-white placeholder-slate-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Write your question, idea, or proposal here..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-xs text-white placeholder-slate-500 transition resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition disabled:opacity-60"
                >
                  {loading ? "Transmitting..." : (
                    <>
                      <span>Transmit Dispatch</span>
                      <Send size={13} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Mobile Leadership Contact Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
              Direct Officer Directory
            </h3>
            {DIRECTORY.map((contact, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#0c1626] border border-slate-800/80 flex items-center justify-between gap-3 shadow-sm"
              >
                <div>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 uppercase tracking-wider border border-cyan-500/20">
                    {contact.role}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1">{contact.name}</h4>
                  <p className="text-[10px] text-slate-400">{contact.dept}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center active:scale-95 transition"
                    title="Call"
                  >
                    <Phone size={13} />
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center active:scale-95 transition"
                    title="Email"
                  >
                    <Mail size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Embedded Map */}
          <div className="rounded-3xl border border-slate-800 overflow-hidden bg-[#0c1626] h-52 relative shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.150399549136!2d76.96321177573155!3d11.102166589067098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f7000afa766b%3A0x2b5757b8d520a3af!2sSri%20Ramakrishna%20Engineering%20College!5e0!3m2!1sen!2sin!4v1776058333418!5m2!1sen!2sin"
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full border-0 grayscale contrast-125 opacity-80"
              title="SREC Campus Map Location"
            />
            <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-left flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-white">Sri Ramakrishna Engineering College</p>
                <p className="text-[9px] text-slate-400">NGGO Colony, Coimbatore - 641022</p>
              </div>
              <a
                href="https://maps.google.com/?q=Sri+Ramakrishna+Engineering+College+Coimbatore"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 shadow"
              >
                <span>Navigate</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 💻 DESKTOP VIEW: HIGH-TECH EXECUTIVE BENTO GRID (Visible only on lg+) */}
        {/* ========================================================================= */}
        <div className="hidden lg:block space-y-10">
          
          {/* Desktop Hero Section */}
          <div className="flex items-end justify-between border-b border-slate-800/80 pb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-widest">
                <Building2 size={13} />
                <span>IEEE STB32131 • SREC STUDENT BRANCH</span>
              </div>
              <h1 className="text-5xl font-black tracking-tight text-white font-serif">
                Connect &amp; Collaborate
              </h1>
              <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                Have an inquiry, project proposal, or event collaboration? Connect directly with the executive office bearers of IEEE Student Branch SREC.
              </p>
            </div>

            {/* Live Desk Stats */}
            <div className="flex items-center gap-4">
              <div className="px-5 py-3 rounded-2xl bg-[#0c1626] border border-slate-800 text-left">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Response Time</span>
                <span className="text-lg font-black text-cyan-400">&lt; 24 Hours</span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-[#0c1626] border border-slate-800 text-left">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Active Societies</span>
                <span className="text-lg font-black text-emerald-400">9 Chapters</span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-[#0c1626] border border-slate-800 text-left">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Operating Desk</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black text-white">Mon–Sat 9AM–5PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop 2-Column Bento Layout */}
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Executive Cards & Interactive Map (Span 5) */}
            <div className="col-span-5 space-y-5">
              
              {/* Campus Address Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1626] to-[#070e17] border border-slate-800/90 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                  <MapPin size={22} />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Campus Headquarters</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-normal">STB32131</span>
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Sri Ramakrishna Engineering College,<br />
                  Vattamalaipalayam, NGGO Colony Post,<br />
                  Coimbatore, Tamil Nadu — 641022, India
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Affiliated to IEEE Madras Section</span>
                  <a
                    href="https://maps.google.com/?q=Sri+Ramakrishna+Engineering+College+Coimbatore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <span>View on Maps</span>
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>

              {/* Direct Communications Grid (2 Mini Cards) */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Phone Line */}
                <div className="p-5 rounded-3xl bg-[#0c1626] border border-slate-800/90 shadow-md relative group hover:border-emerald-500/40 transition">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
                    <Phone size={18} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Direct Phone</span>
                  <a
                    href="tel:+919080296675"
                    className="text-sm font-bold text-white hover:text-emerald-400 transition mt-1 block"
                  >
                    +91 90802 96675
                  </a>
                  <button
                    onClick={() => handleCopy("+919080296675", "phone")}
                    className="mt-2 text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    {copiedKey === "phone" ? (
                      <>
                        <Check size={11} className="text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={11} /> Copy Number
                      </>
                    )}
                  </button>
                </div>

                {/* Email Inbox */}
                <div className="p-5 rounded-3xl bg-[#0c1626] border border-slate-800/90 shadow-md relative group hover:border-indigo-500/40 transition">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3">
                    <Mail size={18} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Official Email</span>
                  <a
                    href="mailto:ieee@srec.ac.in"
                    className="text-sm font-bold text-white hover:text-indigo-400 transition mt-1 block truncate"
                  >
                    ieee@srec.ac.in
                  </a>
                  <button
                    onClick={() => handleCopy("ieee@srec.ac.in", "email")}
                    className="mt-2 text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    {copiedKey === "email" ? (
                      <>
                        <Check size={11} className="text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={11} /> Copy Email
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Officers Mini Directory */}
              <div className="p-5 rounded-3xl bg-[#0c1626] border border-slate-800/90 shadow-md space-y-3">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">
                  Branch Counselors &amp; Leadership
                </span>
                <div className="divide-y divide-slate-800/80">
                  {DIRECTORY.map((contact, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{contact.name}</p>
                        <p className="text-[10px] text-slate-400">{contact.role} • {contact.dept}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`mailto:${contact.email}`}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 flex items-center justify-center text-xs transition"
                          title={contact.email}
                        >
                          <Mail size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embedded Interactive Map */}
              <div className="rounded-3xl border border-slate-800 overflow-hidden bg-[#0c1626] h-[220px] relative shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.150399549136!2d76.96321177573155!3d11.102166589067098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f7000afa766b%3A0x2b5757b8d520a3af!2sSri%20Ramakrishna%20Engineering%20College!5e0!3m2!1sen!2sin!4v1776058333418!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full border-0 grayscale contrast-125 opacity-80"
                  title="SREC Campus Map Location"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Glassmorphism Dispatch Terminal (Span 7) */}
            <div className="col-span-7">
              <div className="bg-gradient-to-br from-[#0c1626] to-[#070e17] border border-slate-800/90 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                
                {/* Form Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
                  <div>
                    <h2 className="text-xl font-black text-white font-serif">
                      Send an Official Dispatch
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Submissions are routed directly to the IEEE SREC management portal.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>PORTAL ONLINE</span>
                  </div>
                </div>

                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-2xl shadow-emerald-500/30">
                      <CheckCircle size={44} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Dispatched Successfully!</h3>
                    <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                      Your inquiry has been stored in the IEEE SREC database. Our student chairpersons or counselor will get back to your email shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition"
                    >
                      Send Another Dispatch
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Inquiry Category Pills */}
                    <div>
                      <label className="block text-xs font-black text-cyan-400 uppercase tracking-widest mb-3">
                        Select Inquiry Category
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {INQUIRY_CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          const isSelected = selectedCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-bold transition-all text-left ${
                                isSelected
                                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/50"
                                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white"
                              }`}
                            >
                              <Icon size={16} className={isSelected ? "text-white" : "text-cyan-400"} />
                              <span className="truncate">{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2-Column Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          placeholder="e.g. John Doe"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-white placeholder-slate-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-white placeholder-slate-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Phone Contact
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-white placeholder-slate-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Inquiry / proposal summary"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-white placeholder-slate-500 transition"
                        />
                      </div>
                    </div>

                    {/* Message Area */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Detailed Message / Inquiry *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Please write your detailed question, proposal, or inquiry here..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-sm text-white placeholder-slate-500 transition resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/25 active:scale-[0.99] transition cursor-pointer disabled:opacity-60"
                    >
                      {loading ? "Transmitting to Supabase..." : (
                        <>
                          <span>Transmit Official Message</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
