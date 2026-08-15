import { useState, useEffect, useRef } from "react";
import {
  X, Menu, Sparkles, Shield, ExternalLink, ChevronRight, Home, ChevronDown,
  Image, Phone, UserPlus, LayoutGrid, Users, Calendar, Award, DollarSign, Info, Compass, IdCard, Smartphone, Download
} from "lucide-react";
import ieeeLogo from "@/assets/ieee-logo.png";
import ieeeStamp from "@/assets/ieees.png";
import srecLogo from "@/assets/srec-logo.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DownloadAppModal from "@/components/DownloadAppModal";

// Main nav links (always visible on desktop)
const primaryNavLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Societies", href: "/societies" },
  { label: "Activities", href: "/activities" },
  { label: "Team", href: "/team" },
  { label: "Office Bearers", href: "/office-bearers" },
  { label: "Awards", href: "/awards" },
  { label: "Funding", href: "/funding" },
  { label: "Register", href: "/membership-registration", icon: UserPlus, desc: "Become a member today" },
  { label: "Gallery", href: "/gallery", icon: Image, desc: "Photos & event memories" }
];

// "More" dropdown links for desktop
const moreLinks = [
  { label: "Student Portal", href: "/student-login", icon: IdCard, desc: "Member login & digital ID card" },
  { label: "Plans", href: "/annual-plans", icon: LayoutGrid, desc: "Annual activity plans" },
  { label: "Contact Us", href: "/contact", icon: Phone, desc: "Get in touch with us" },
];

// Grid links for futuristic mobile overlay menu
const mobileGridLinks = [
  { label: "Home", href: "/", icon: Home, desc: "Main landing page" },
  { label: "About", href: "/about", icon: Info, desc: "Our history & vision" },
  { label: "Societies", href: "/societies", icon: Users, desc: "Technical chapters" },
  { label: "Activities", href: "/activities", icon: Calendar, desc: "Events & workshops" },
  { label: "Team", href: "/team", icon: Compass, desc: "Executive committee" },
  { label: "Office Bearers", href: "/office-bearers", icon: Shield, desc: "Branch leadership" },
  { label: "Awards", href: "/awards", icon: Award, desc: "Accolades & honors" },
  { label: "Funding", href: "/funding", icon: DollarSign, desc: "Grants & support" },
  { label: "Gallery", href: "/gallery", icon: Image, desc: "Event photo archives" },
  { label: "Annual Plans", href: "/annual-plans", icon: LayoutGrid, desc: "Roadmap & schedule" },
  { label: "Contact Us", href: "/contact", icon: Phone, desc: "Get in touch with us" },
];

// Quick actions for bottom navigation dock
const bottomDockItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Societies", href: "/societies", icon: Users },
  { label: "Activities", href: "/activities", icon: Calendar },
  { label: "Team", href: "/team", icon: Compass },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMoreOpen(false);
    setOpen(false);
  }, [location.pathname]);

  // Handle browser back button / swipe back to close open drawer first
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ drawerOpen: true }, "");
    const handlePopState = () => {
      setOpen(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [open]);

  // Touch swipe handling for mobile back navigation / drawer closure
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);

      // Swiped right from left edge (within 60px of left screen edge)
      if (touchStartX < 60 && deltaX > 75 && deltaY < 100) {
        if (open) {
          setOpen(false);
        } else if (!isHomePage) {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate("/");
          }
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [open, isHomePage, navigate]);

  const isMoreActive = moreLinks.some(
    (l) => location.pathname === l.href || location.pathname.startsWith(l.href)
  );

  return (
    <>
      {/* Universal Sticky Header Stack */}
      <header className="fixed top-0 left-0 w-full z-50 flex flex-col items-center pointer-events-none">

        {/* DESKTOP ONLY - ROW 1: Institutional Logos Card */}
        <motion.div
          animate={{ height: scrolled ? 0 : "auto", opacity: scrolled ? 0 : 1, scale: scrolled ? 0.98 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden xl:block w-full pointer-events-auto overflow-hidden z-40 bg-white/80 backdrop-blur-2xl border-b border-white/60 shadow-[0_4px_25px_rgba(0,40,85,0.06)]"
        >
          <div className="w-full max-w-[1700px] mx-auto px-8 md:px-12 py-3 flex items-center justify-center gap-14 md:gap-20">
            <Link to="/" className="flex items-center shrink">
              <img src={srecLogo} alt="SREC Logo" className="h-14 md:h-16 w-auto object-contain hover:scale-105 transition-transform" />
            </Link>
            <div className="w-[1px] h-11 bg-slate-300 shrink-0 opacity-80" />
            <Link to="/" className="flex items-center shrink">
              <img src={ieeeLogo} alt="IEEE Logo" className="h-14 md:h-16 w-auto object-contain hover:scale-105 transition-transform" />
            </Link>
            <div className="w-[1px] h-11 bg-slate-300 shrink-0 opacity-80" />
            <div className="flex items-center shrink">
              <img src={snrLogo} alt="SNR Trust Logo" className="h-14 md:h-16 w-auto object-contain hover:scale-105 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* MOBILE ONLY - Two-Row Header Stack */}
        <div className="xl:hidden w-full pointer-events-auto z-50 flex flex-col items-center">
          
          {/* Row 1: Separate Line Above for ALL THREE Institutional Logos */}
          <div className="w-full bg-white/85 backdrop-blur-2xl border-b border-slate-200/60 py-2 px-3 sm:px-6 flex items-center justify-center gap-3.5 sm:gap-8 shadow-sm">
            <Link to="/" className="flex items-center shrink-0">
              <img src={srecLogo} alt="SREC Logo" className="h-9 sm:h-12 w-auto object-contain hover:scale-105 transition-transform" />
            </Link>
            <div className="w-[1px] h-6 sm:h-8 bg-slate-300 shrink-0 opacity-80" />
            <Link to="/" className="flex items-center shrink-0">
              <img src={ieeeLogo} alt="IEEE Logo" className="h-9 sm:h-12 w-auto object-contain hover:scale-105 transition-transform" />
            </Link>
            <div className="w-[1px] h-6 sm:h-8 bg-slate-300 shrink-0 opacity-80" />
            <div className="flex items-center shrink-0">
              <img src={snrLogo} alt="SNR Trust Logo" className="h-9 sm:h-12 w-auto object-contain hover:scale-105 transition-transform" />
            </div>
          </div>

          {/* Row 2: Dark Action Navigation Bar */}
          <div className="w-full bg-[#000d20]/80 backdrop-blur-2xl border-b border-cyan-500/30 shadow-[0_8px_30px_rgba(0,13,32,0.8)] px-3.5 sm:px-6 py-2">
            <div className="w-full flex items-center justify-between">
              
              {/* Left: IEEE SREC Title */}
              <Link to="/" className="flex items-center gap-2">
                <span className="text-white font-black text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  IEEE SREC
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[8px] sm:text-[9px] font-extrabold text-cyan-300 uppercase">
                  SB 64581
                </span>
              </Link>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <a
                  href="http://aectsd2027.srecieee.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all"
                >
                  <Sparkles size={11} className="animate-pulse" />
                  <span>AECTSD 2027</span>
                </a>

                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/40 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
                  aria-label={open ? "Close Menu" : "Explore Menu"}
                >
                  {open ? <X size={14} className="text-white" /> : <Menu size={14} className="text-white" />}
                  <span>{open ? "Close" : "Menu"}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* DESKTOP ONLY - ROW 2: Navigation Bar (Fully Center Aligned) */}
        <div className="hidden xl:block w-full pointer-events-auto z-50 bg-[#000d20]/95 backdrop-blur-2xl border-b border-cyan-500/35 shadow-[0_12px_40px_rgba(0,13,32,0.9)]">
          <div className="w-full max-w-[1800px] mx-auto flex items-center justify-center px-4 md:px-6 py-2 min-h-[48px]">

            {/* Desktop Navigation (All Items Perfectly Symmetrically Centered) */}
            <nav className="flex items-center justify-center gap-1 2xl:gap-1.5 flex-nowrap">
              {primaryNavLinks.map((l) => {
                const isActive = location.pathname === l.href || (l.href !== "/" && location.pathname.startsWith(l.href));
                return (
                  <Link
                    key={l.label}
                    to={l.href}
                    className={`relative px-2.5 2xl:px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-colors duration-200 whitespace-nowrap ${isActive ? "text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_20px_rgba(0,210,255,0.5)] border border-cyan-300/40 z-0"
                      />
                    )}
                    <span className="relative z-10">{l.label}</span>
                  </Link>
                );
              })}

              {/* ── MORE DROPDOWN ── */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreOpen((p) => !p)}
                  className={`relative flex items-center gap-1 px-2.5 2xl:px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${isMoreActive || moreOpen
                    ? "text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(0,210,255,0.5)]"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  More
                  <motion.span animate={{ rotate: moreOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={12} />
                  </motion.span>
                </button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-64 rounded-2xl overflow-hidden z-50"
                      style={{
                        background: "rgba(0,13,32,0.97)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(0,210,255,0.2)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(0,210,255,0.08)",
                      }}
                    >
                      <div className="px-4 py-3 border-b border-white/8">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400/60">
                          More Pages
                        </p>
                      </div>
                      <div className="p-2">
                        {moreLinks.map((l) => {
                          const ItemIcon = l.icon;
                          const isActive = location.pathname === l.href || location.pathname.startsWith(l.href);

                          return (
                            <Link
                              key={l.label}
                              to={l.href}
                              onClick={() => setMoreOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive
                                ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300"
                                : "text-slate-300 hover:text-white hover:bg-white/8"
                                }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive ? "bg-cyan-500/25" : "bg-white/6 group-hover:bg-cyan-500/15"
                                  }`}
                              >
                                <ItemIcon size={14} className={isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-extrabold uppercase tracking-wide leading-none mb-0.5">
                                  {l.label}
                                </p>
                                <p className="text-[9px] text-white/30 font-medium leading-none truncate">
                                  {l.desc}
                                </p>
                              </div>
                              <ChevronRight
                                size={12}
                                className={`flex-shrink-0 transition-transform ${isActive ? "opacity-70" : "opacity-0 group-hover:opacity-40 group-hover:translate-x-0.5"
                                  }`}
                              />
                            </Link>
                          );
                        })}
                      </div>
                      <div className="h-[1px] mx-3 mb-2" style={{ background: "linear-gradient(90deg, transparent, rgba(0,210,255,0.3), transparent)" }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Subtle Elegant Separator */}
              <div className="w-[1px] h-4 bg-white/20 mx-1 shrink-0" />

              {/* Action Buttons */}
              <a
                href="http://aectsd2027.srecieee.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider hover:from-amber-400 hover:to-orange-500 transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0"
              >
                <Sparkles size={13} className="animate-pulse" />
                <span>AECTSD 2027</span>
              </a>


              <Link
                to="/admin-login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all backdrop-blur-md active:scale-95 whitespace-nowrap shrink-0"
              >
                <Shield size={13} className="text-cyan-400" />
                <span>Admin</span>
              </Link>
            </nav>

          </div>
        </div>

      </header>

      {/* Global Transparent Header Spacer for Subpages */}
      {!isHomePage && (
        <div className="h-[105px] sm:h-[120px] xl:h-[150px] w-full pointer-events-none" aria-hidden="true" />
      )}

      {/* ── DARK GLASSMOBILE CYBER DRAWER OVERLAY ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] w-full h-screen overflow-y-auto bg-[#000814] flex flex-col xl:hidden"
          >
            {/* Ambient Background Glow Orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px]" />
              <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-blue-600/15 blur-[120px]" />
              <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-indigo-600/10 blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-full px-4 sm:px-6 pt-5 pb-12 sm:pb-16">

              {/* Drawer Top Header Capsule */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/20 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="px-2.5 py-1.5 rounded-2xl bg-white backdrop-blur border border-slate-200 shadow-md flex items-center gap-2 shrink-0">
                    <img src={srecLogo} alt="SREC" className="h-6 sm:h-7 w-auto object-contain" />
                    <div className="w-px h-4 bg-slate-300" />
                    <img src={ieeeStamp} alt="IEEE" className="h-5 sm:h-6 w-auto object-contain" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-white font-black text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent truncate">
                        IEEE SREC
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[8px] sm:text-[9px] font-extrabold text-cyan-300 uppercase shrink-0">
                        SB HUB
                      </span>
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-cyan-400/70 tracking-wider uppercase font-semibold truncate mt-0.5">
                      Sri Ramakrishna Engg College
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="p-2.5 rounded-full bg-[#001026] hover:bg-[#001838] border border-cyan-500/30 text-cyan-300 transition-all active:scale-90 shadow-lg shrink-0 ml-2"
                  aria-label="Close drawer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category 1: Navigation Grid */}
              <div className="mb-4">
                <div className="flex items-center justify-between px-1 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400/90">
                    Main Navigation
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    11 Pages
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {mobileGridLinks.map((l, i) => {
                    const ItemIcon = l.icon;
                    const isActive = location.pathname === l.href || (l.href !== "/" && location.pathname.startsWith(l.href));
                    return (
                      <motion.div
                        key={l.label}
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.025, duration: 0.25 }}
                      >
                        <Link
                          to={l.href}
                          onClick={() => setOpen(false)}
                          className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-300 h-full backdrop-blur-xl ${isActive
                            ? "bg-gradient-to-br from-cyan-500/30 to-blue-600/35 border-cyan-400/70 shadow-[0_0_25px_rgba(0,210,255,0.3)] text-white"
                            : "bg-[#000e24]/90 hover:bg-[#001536]/90 border-cyan-500/20 hover:border-cyan-400/50 text-slate-200 shadow-md"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`p-2 rounded-xl flex items-center justify-center ${isActive
                                ? "bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,210,255,0.6)]"
                                : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300"
                                }`}
                            >
                              <ItemIcon size={16} />
                            </div>
                            <ChevronRight
                              size={14}
                              className={isActive ? "text-cyan-300" : "text-slate-500"}
                            />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-wider leading-tight">
                              {l.label}
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium leading-none mt-1 truncate">
                              {l.desc}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: High Impact Banners */}
              <div className="space-y-2.5 mt-2">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400/90 px-1 block mb-1">
                  Portals & Resources
                </span>

                {/* AECTSD 2027 Conference */}
                <motion.a
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  href="http://aectsd2027.srecieee.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/95 via-orange-500/95 to-amber-600/95 text-slate-950 font-black border border-amber-300/50 shadow-[0_0_30px_rgba(251,146,60,0.35)] active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950/20 backdrop-blur text-amber-950">
                      <Sparkles size={18} className="animate-pulse text-slate-950" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-extrabold leading-none">
                        AECTSD 2027 Conference
                      </p>
                      <p className="text-[9px] text-slate-950/80 font-bold tracking-wide mt-1">
                        International Flagship Event
                      </p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-slate-950" />
                </motion.a>

                {/* Dedicated SREC Mobile App Hub */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                >
                  <Link
                    to="/app"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-600/90 via-blue-600/90 to-indigo-600/90 backdrop-blur-2xl border border-cyan-300/50 text-white font-bold active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(0,210,255,0.3)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/20 text-white shadow-sm">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-extrabold text-white leading-none">
                          Dedicated Mobile App
                        </p>
                        <p className="text-[9px] text-cyan-100 font-medium tracking-wide mt-1">
                          Native app, Member table, 3D ID &amp; all pages
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-white" />
                  </Link>
                </motion.div>

                {/* Student Member Login & Digital ID */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Link
                    to="/student-login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#001c3d]/90 to-[#002b5c]/90 backdrop-blur-2xl border border-cyan-400/40 text-white font-bold active:scale-[0.98] transition-all hover:border-cyan-300 shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
                        <IdCard size={18} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-extrabold text-white leading-none">
                          Student Member Portal
                        </p>
                        <p className="text-[9px] text-cyan-300/80 font-medium tracking-wide mt-1">
                          Member login, ID card &amp; full details
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-cyan-400" />
                  </Link>
                </motion.div>

                {/* Membership Registration */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                >
                  <Link
                    to="/membership-registration"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#001026]/90 backdrop-blur-2xl border border-cyan-500/35 text-white font-bold active:scale-[0.98] transition-all hover:border-cyan-400 shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
                        <UserPlus size={18} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-extrabold text-white leading-none">
                          Join IEEE SB Membership
                        </p>
                        <p className="text-[9px] text-cyan-300/80 font-medium tracking-wide mt-1">
                          Unlock global opportunities & events
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-cyan-400" />
                  </Link>
                </motion.div>

                {/* Admin Login */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/admin-login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#000d20]/90 backdrop-blur-2xl border border-white/15 text-white active:scale-[0.98] transition-all hover:border-white/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/10 text-cyan-400">
                        <Shield size={16} />
                      </div>
                      <span className="text-xs uppercase tracking-wider font-bold">
                        Admin Portal Login
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </Link>
                </motion.div>
              </div>

              {/* Drawer Footer */}
              <div className="mt-6 pt-4 border-t border-cyan-500/20 text-center">
                <p className="text-[10px] text-cyan-400/60 tracking-[0.15em] uppercase font-semibold">
                  IEEE Student Branch SREC · Code 64581
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Back Button on Subpages (Navigates to previous page) */}
      {!isHomePage && (
        <button
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate("/");
            }
          }}
          className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[40] bg-cyan-500 text-slate-950 p-3 rounded-full shadow-[0_0_25px_rgba(0,210,255,0.5)] hover:bg-cyan-400 transition-all duration-300 flex items-center justify-center border border-white/40 active:scale-95 group"
          title="Go to previous page"
          aria-label="Go to previous page"
        >
          <ChevronRight size={20} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </>
  );
};

export default Navbar;