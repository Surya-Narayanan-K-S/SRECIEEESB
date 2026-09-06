import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Compass, Sparkles, IdCard, Users, Calendar, Shield, X, Command } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const FloatingUIWidget = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isLaunchOrRemote = location.pathname.startsWith("/launch") || 
                           location.pathname.startsWith("/remote") || 
                           location.pathname.startsWith("/stage");

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLaunchOrRemote) return null;

  const quickLinks = [
    { label: "Student Portal", href: "/student-login", icon: IdCard, color: "text-amber-400" },
    { label: "Technical Societies", href: "/societies", icon: Users, color: "text-cyan-400" },
    { label: "Branch Activities", href: "/activities", icon: Calendar, color: "text-blue-400" },
    { label: "Executive Team", href: "/team", icon: Compass, color: "text-purple-400" },
    { label: "Office Bearers", href: "/office-bearers", icon: Shield, color: "text-emerald-400" },
  ];

  return (
    <aside aria-label="Quick Actions and Page Scroll Progress" className="hidden md:flex fixed bottom-6 right-6 z-40 flex-col items-end gap-3 pointer-events-auto print:hidden">
      {/* Quick Jump Popup Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-64 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,210,255,0.15)] mb-1"
          >
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/10 px-1">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-cyan-400">
                <Sparkles size={13} className="text-cyan-400 animate-pulse" />
                <span>Quick Navigation</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Quick Navigation"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-1">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/10 text-slate-200 hover:text-white transition-all text-xs font-bold group"
                  >
                    <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={14} className={link.color} />
                    </div>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Quick Menu Toggle Pill */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`h-11 px-3.5 rounded-full flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 backdrop-blur-xl border shadow-lg cursor-pointer ${
            menuOpen
              ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.4)]"
              : "bg-slate-950/85 hover:bg-slate-900 text-slate-200 hover:text-white border-white/15 hover:border-cyan-400/50 shadow-md"
          }`}
          title="Quick Navigation"
        >
          <Compass size={16} className={menuOpen ? "animate-spin-slow" : "text-cyan-400"} />
          <span className="hidden sm:inline">Explore</span>
        </button>

        {/* Scroll To Top with Circular Progress Indicator */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={scrollToTop}
              className="relative w-11 h-11 rounded-full bg-slate-950/90 hover:bg-slate-900 text-white flex items-center justify-center border border-white/15 hover:border-cyan-400/60 shadow-xl backdrop-blur-xl cursor-pointer group"
              title="Scroll to Top"
              aria-label="Scroll to Top"
            >
              {/* SVG Circular Progress Track & Fill */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="19"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="19"
                  fill="none"
                  stroke="#00d2ff"
                  strokeWidth="2.5"
                  strokeDasharray="119.38"
                  strokeDashoffset={119.38 - (119.38 * scrollProgress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-150"
                />
              </svg>

              <ChevronUp size={18} className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default FloatingUIWidget;
