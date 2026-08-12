'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";
import { usePageContent } from "@/hooks/useContent";

const ContactPage = () => {
  const { data: content } = usePageContent("contact");
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
        setError(supabaseError.message);
      } else {
        console.log("Success:", data);
        setSubmitted(true);
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#001a38] via-[#002a52] to-[#003764] text-slate-900 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-semibold tracking-tighter"
          >
            Get In Touch
          </motion.h1>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            {content?.contact_subtitle || "We’d love to hear from you. Reach out to the IEEE Student Branch SREC."}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Side - Contact Info & Map */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-none flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Sri Ramakrishna Engineering College</h3>
                  <p className="text-slate-600">{content?.address || "Vattamalaipalayam, NGGO Colony, Coimbatore, Tamil Nadu 641022"}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-none flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-slate-600">{content?.phone || "+91 422 246 1588"}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-none flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-slate-600">{content?.email || "ieee@srec.ac.in"}</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-none overflow-hidden border border-slate-200 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.150399549136!2d76.96321177573155!3d11.102166589067098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f7000afa766b%3A0x2b5757b8d520a3af!2sSri%20Ramakrishna%20Engineering%20College!5e0!3m2!1sen!2sin!4v1776058333418!5m2!1sen!2sin"
                width="100%"
                height="380"
                allowFullScreen
                loading="lazy"
                className="w-full"
                title="College Location"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-none shadow-xl p-8 md:p-12 border border-slate-100">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="mx-auto text-green-500" size={80} />
                  <h3 className="text-3xl font-semibold mt-6">Thank You!</h3>
                  <p className="text-slate-600 mt-3">Your message has been received. We will get back to you soon.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 px-8 py-3 bg-blue-700 text-slate-900 rounded-none hover:bg-blue-800 transition"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-none border border-slate-200 focus:border-blue-600 outline-none transition"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-none border border-slate-200 focus:border-blue-600 outline-none transition"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-none border border-slate-200 focus:border-blue-600 outline-none transition"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-none border border-slate-200 focus:border-blue-600 outline-none transition"
                        placeholder="How can we help you?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-5 py-4 rounded-none border border-slate-200 focus:border-blue-600 outline-none resize-none transition"
                      placeholder="Write your message here..."
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-none">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-slate-900 font-semibold rounded-none flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70"
                  >
                    {loading ? "Sending Message..." : (
                      <>
                        Send Message <Send size={20} />
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