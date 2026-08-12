import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { X, Lock, ShieldAlert, Sparkles, UserPlus, CheckCircle2, Phone, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const getRegistrationStatus = (): boolean => {
  const localVal = localStorage.getItem("ieee_registration_open");
  if (localVal !== null) {
    return localVal === "true";
  }
  return true; // Default registration OPEN
};

export const setRegistrationStatusGlobal = (status: boolean) => {
  localStorage.setItem("ieee_registration_open", String(status));
  window.dispatchEvent(new Event("registration_status_changed"));
};

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const navigate = useNavigate();
  const [isOpenRegistration, setIsOpenRegistration] = useState<boolean>(getRegistrationStatus());
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    year_of_study: "2nd Year",
    target_society: "IEEE Computer Society (CS)",
    statement_of_purpose: "Interested in IEEE events and workshops.",
  });

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOpenRegistration(getRegistrationStatus());
    };
    window.addEventListener("registration_status_changed", handleStatusChange);
    window.addEventListener("storage", handleStatusChange);

    // Also check Supabase for remote registration_open setting
    const fetchRemoteStatus = async () => {
      try {
        const { data } = await supabase
          .from("page_contents")
          .select("content_text")
          .eq("page_key", "system")
          .eq("content_key", "registration_open")
          .single();

        if (data && data.content_text) {
          const remoteOpen = data.content_text === "true";
          localStorage.setItem("ieee_registration_open", String(remoteOpen));
          setIsOpenRegistration(remoteOpen);
        }
      } catch {
        // Fallback to local status
      }
    };

    fetchRemoteStatus();

    return () => {
      window.removeEventListener("registration_status_changed", handleStatusChange);
      window.removeEventListener("storage", handleStatusChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const names = form.full_name.split(" ");
      const first_name = names[0] || form.full_name;
      const last_name = names.slice(1).join(" ") || "Student";

      const payload = {
        first_name,
        last_name,
        email: form.email,
        department: form.department || "EEE",
        year_of_study: form.year_of_study,
        target_society: form.target_society,
        statement_of_purpose: form.statement_of_purpose,
      };

      const { error } = await supabase.from("student_applications").insert([payload]);
      if (error) throw error;

      setSubmittedSuccess(true);
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden p-6 md:p-8 relative font-sans"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>

          {/* IF REGISTRATION IS OFF (CLOSED) -> SHOW POP-UP ALERT */}
          {!isOpenRegistration ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert size={32} />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 font-extrabold text-[10px] uppercase tracking-wider mb-2">
                  <Lock size={12} />
                  <span>Registrations Disabled</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                  Registrations Currently Closed
                </h3>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-sm mx-auto">
                  IEEE SREC Membership registrations for the current academic cycle are currently <strong>CLOSED</strong> by the branch administration.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold leading-relaxed text-left flex items-start gap-3">
                <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Need assistance?</span> Please check back during the next registration window or contact the IEEE Student Branch Counsellor for direct onboarding inquiries.
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-md"
                >
                  Close Pop-Up
                </button>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-blue-200 transition"
                >
                  <Phone size={14} />
                  <span>Contact Admin</span>
                </Link>
              </div>
            </div>
          ) : (
            /* IF REGISTRATION IS ON (OPEN) -> SHOW INTERACTIVE REGISTRATION POP-UP */
            <div>
              {submittedSuccess ? (
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 text-green-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">Registration Submitted!</h3>
                    <p className="text-slate-500 text-sm mt-2">
                      Thank you for registering. Our IEEE SREC committee will review your application shortly.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        navigate("/membership-registration");
                      }}
                      className="flex-1 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-1"
                    >
                      <span>Full Portal</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <UserPlus size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-slate-900">IEEE SREC Registration Pop-Up</h3>
                      <p className="text-xs text-slate-500">Quick membership application popup.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Surya Narayanan"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Email *</label>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-blue-600 outline-none"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Phone *</label>
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-blue-600 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Department</label>
                        <input
                          type="text"
                          placeholder="e.g. EEE, CSE"
                          value={form.department}
                          onChange={(e) => setForm({ ...form, department: e.target.value })}
                          className="w-full border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-blue-600 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Year</label>
                        <select
                          value={form.year_of_study}
                          onChange={(e) => setForm({ ...form, year_of_study: e.target.value })}
                          className="w-full border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-blue-600 outline-none bg-white"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Target Society Interest</label>
                      <select
                        value={form.target_society}
                        onChange={(e) => setForm({ ...form, target_society: e.target.value })}
                        className="w-full border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-blue-600 outline-none bg-white"
                      >
                        <option value="IEEE Computer Society (CS)">IEEE Computer Society (CS)</option>
                        <option value="IEEE Computational Intelligence Society (CIS)">IEEE Computational Intelligence Society (CIS)</option>
                        <option value="IEEE Communications Society (ComSoc)">IEEE Communications Society (ComSoc)</option>
                        <option value="IEEE Engineering in Medicine and Biology (EMBS)">IEEE EMBS</option>
                        <option value="IEEE Instrumentation and Measurement (IMS)">IEEE IMS</option>
                        <option value="IEEE Power Electronics Society (PELS)">IEEE PELS</option>
                        <option value="IEEE Women in Engineering (WIE)">IEEE WIE</option>
                        <option value="IEEE SREC Student Branch Main">IEEE SREC SB Main</option>
                      </select>
                    </div>

                    <div className="pt-3 flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2"
                      >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : "Submit Registration"}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RegistrationModal;
