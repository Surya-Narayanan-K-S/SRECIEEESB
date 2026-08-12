import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Bell,
  ArrowRight,
  ShieldCheck,
  Zap,
  Trophy,
  Users,
  Radio,
  Star,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import ieeeLogo from "@/assets/ieee-logo.png";
import srecLogo from "@/assets/srec-logo.png";

// Set target launch date (e.g. October 15, 2026)
const TARGET_DATE = new Date("2026-10-15T09:00:00+05:30").getTime();

const GodDayPage = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-600 selection:text-white flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Futuristic Background Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 relative z-10 max-w-6xl mx-auto w-full text-center">
        
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 font-extrabold text-xs tracking-widest uppercase mb-8 backdrop-blur-md shadow-lg shadow-blue-900/20"
        >
          <Sparkles size={14} className="text-amber-400 animate-spin" />
          <span>IEEE SREC Flagship Mega Event 2026</span>
        </motion.div>

        {/* Logos Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-6 mb-8"
        >
          <img src={ieeeLogo} alt="IEEE Logo" className="h-12 sm:h-16 w-auto object-contain filter drop-shadow-md" />
          <div className="w-px h-10 bg-slate-800" />
          <img src={srecLogo} alt="SREC Logo" className="h-12 sm:h-16 w-auto object-contain filter drop-shadow-md" />
        </motion.div>

        {/* Main Title & Teaser */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400"
        >
          GOD DAY <span className="text-amber-400 font-heading">2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
        >
          The Global Open Day celebration of innovation, engineering excellence, and technological breakthroughs at Sri Ramakrishna Engineering College is coming soon!
        </motion.p>

        {/* Live Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl mx-auto mb-16"
        >
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINUTES", value: timeLeft.minutes },
            { label: "SECONDS", value: timeLeft.seconds }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
              <span className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight group-hover:text-blue-400 transition-colors">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-slate-500 text-xs font-black tracking-widest mt-2 uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Pre-Registration Teaser Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-lg mx-auto bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl mb-16 text-left"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">Get Early Access &amp; Spot Notifications</h3>
              <p className="text-slate-400 text-xs font-medium">Be the first to register for flagship workshops &amp; hackathons.</p>
            </div>
          </div>

          {isSubscribed ? (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-extrabold text-sm">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>You're on the VIP list! We will notify you as soon as passes open.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your college / official email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                <span>Notify Me</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left"
        >
          {[
            {
              icon: Trophy,
              title: "Flagship Competitions",
              desc: "Project Expos, Paper Presentations & 24hr Hackathons with cash prizes."
            },
            {
              icon: Zap,
              title: "Hands-on Workshops",
              desc: "Masterclasses by IEEE international speakers and industry veterans."
            },
            {
              icon: Users,
              title: "Networking & Expo",
              desc: "Connect with engineering leaders, innovators, and top recruiters."
            }
          ].map((feat, i) => (
            <div key={i} className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all">
              <feat.icon className="text-amber-400 w-8 h-8 mb-3" />
              <h4 className="font-heading font-black text-white text-base mb-1">{feat.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default GodDayPage;
