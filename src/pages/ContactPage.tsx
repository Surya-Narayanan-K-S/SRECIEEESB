'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";

const ContactPage = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: supabaseError } = await supabase
        .from("contact_messages")
        .insert([formData])
        .select();

      if (supabaseError) {
        console.error("Supabase Error:", supabaseError);
        setError(supabaseError.message || "Something went wrong. Please try again.");
      } else {
        console.log("Message sent successfully:", data);
        setSubmitted(true);
        // Reset form
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (err: unknown) {
      console.error("Unexpected error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden font-sans">
      
      {/* High-tech ambient background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-indigo-100/10 rounded-full blur-3xl pointer-events-none translate-x-1/3" />

      <Navbar />


      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 relative z-10">
        
        {/* Intro */}
        <div className="text-left mb-12 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs tracking-wider uppercase mb-4 shadow-sm">
             Connect With Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight mb-4">
             Get In Touch
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed">
             Have questions or want to collaborate? Reach out to the IEEE Student Branch SREC.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch">

          {/* LEFT COLUMN: Modern Bento Contact Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* Box 1: Address Card */}
            <div className="col-span-2 group bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-650 flex items-center justify-center mb-4 border border-blue-100/50">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Campus Coordinates</h3>
              <p className="text-slate-550 text-xs leading-relaxed">
                Sri Ramakrishna Engineering College,<br />
                Vattamalaipalayam, NGGO Colony,<br />
                Coimbatore, Tamil Nadu 641022
              </p>
            </div>

            {/* Box 2: Direct Phone Card */}
            <div className="col-span-1 group bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center mb-4 border border-emerald-100/50">
                <Phone size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-[11px] mb-1 uppercase tracking-wider">Phone Lines</h3>
              <p className="text-slate-550 text-[11px] font-semibold leading-relaxed">
                +91 9080296675
              </p>
            </div>

            {/* Box 3: Direct Email Card */}
            <div className="col-span-1 group bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center mb-4 border border-indigo-100/50">
                <Mail size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-[11px] mb-1 uppercase tracking-wider">Direct Inbox</h3>
              <p className="text-slate-550 text-[11px] font-semibold leading-relaxed truncate">
                ieee@srec.ac.in
              </p>
            </div>

            {/* Box 4: Map Frame */}
            <div className="col-span-2 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all h-[240px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.150399549136!2d76.96321177573155!3d11.102166589067098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f7000afa766b%3A0x2b5757b8d520a3af!2sSri%20Ramakrishna%20Engineering%20College!5e0!3m2!1sen!2sin!4v1776058333418!5m2!1sen!2sin"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full border-0"
                title="SREC Campus Map Location"
              />
            </div>
            
          </div>

          {/* RIGHT COLUMN: Dark Glass Form Card */}
          <div className="lg:col-span-7 flex flex-col justify-stretch">
            <div className="bg-gradient-to-br from-[#001730] to-[#002852] text-white rounded-3xl shadow-xl p-8 md:p-10 border border-[#003875]/35 flex flex-col justify-center min-h-[500px]">
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="mx-auto text-green-450 mb-6" size={64} />
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">Message Dispatched!</h3>
                  <p className="text-blue-200 text-sm max-w-xs mx-auto mb-8">
                     We have received your communications and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider rounded-xl transition"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-450 focus:ring-2 focus:ring-blue-500/10 rounded-xl outline-none transition text-sm text-white placeholder-white/30 font-semibold"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-450 focus:ring-2 focus:ring-blue-500/10 rounded-xl outline-none transition text-sm text-white placeholder-white/30 font-semibold"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-450 focus:ring-2 focus:ring-blue-500/10 rounded-xl outline-none transition text-sm text-white placeholder-white/30 font-semibold"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-450 focus:ring-2 focus:ring-blue-500/10 rounded-xl outline-none transition text-sm text-white placeholder-white/30 font-semibold"
                        placeholder="Inquiry subject"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-450 focus:ring-2 focus:ring-blue-500/10 rounded-2xl outline-none resize-none transition text-sm text-white placeholder-white/30 font-semibold"
                      placeholder="Write your message here..."
                    />
                  </div>

                  {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-550 text-white font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-75"
                  >
                    {loading ? (
                      "Sending Message..."
                    ) : (
                      <>
                        Send Message <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;