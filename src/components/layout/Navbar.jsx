import { useState, useEffect, useRef } from "react";
import { X, Menu, Sparkles, Shield, ExternalLink, ChevronRight, Home, ChevronDown, Image, Phone, UserPlus, LayoutGrid, Users, Calendar, Award, DollarSign, Info, Compass, IdCard, Crown, FileText, BookOpen } from "lucide-react";
import ieeeStamp from "@/assets/ieees.png";
import srecLogo from "@/assets/srec-logo.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import ieeeCustomCardLogo from "@/assets/ieee-custom-card-logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DownloadAppModal from "@/components/modals/DownloadAppModal";
import { usePageVisibility } from "@/hooks/usePageVisibility";

// Primary Desktop Navigation Links (Always visible in top capsule)
const coreNavLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Societies", href: "/societies" },
  { label: "Activities", href: "/activities" },
  { label: "Office Bearers", href: "/office-bearers" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Handbook", href: "/document", icon: BookOpen, desc: "Official Branch PDF" },
  { label: "Register", href: "/membership-registration", icon: UserPlus, desc: "Become a member today" },
];

// Clean "More" Dropdown Links (NO DUPLICATIONS with top bar)
const moreLinks = [
  { label: "Annual Plans", href: "/annual-plans", icon: LayoutGrid, desc: "Activity roadmap & schedules" },
  { label: "Awards & Honors", href: "/awards", icon: Award, desc: "Accolades & recognitions" },
  { label: "Funding & Grants", href: "/funding", icon: DollarSign, desc: "Funding requests & grants" },
  { label: "Society Leaders", href: "/societies/office-bearers", icon: Crown, desc: "CS, WIE, PELS & chapter leadership" },
  { label: "Past Bearers", href: "/past-bearers", icon: Shield, desc: "Alumni leadership records" },
  { label: "Executive Team", href: "/team", icon: Compass, desc: "Full executive committee roster" },
  { label: "Official SB PDF", href: "/document", icon: FileText, desc: "View Handbook inside website" },
  { label: "Student Portal", href: "/student-login", icon: IdCard, desc: "Member login & digital ID card" },
  { label: "Contact Us", href: "/contact", icon: Phone, desc: "Get in touch with branch" },
];

// Grid links for mobile overlay menu
const mobileGridLinks = [
  { label: "Home", href: "/", icon: Home, desc: "Main landing page" },
  { label: "About", href: "/about", icon: Info, desc: "Our history & vision" },
  { label: "Societies", href: "/societies", icon: Users, desc: "Technical chapters" },
  { label: "Society Leaders", href: "/societies/office-bearers", icon: Crown, desc: "Chapter leadership directory" },
  { label: "Activities", href: "/activities", icon: Calendar, desc: "Events & workshops" },
  { label: "Gallery", href: "/gallery", icon: Image, desc: "Event photo archives" },
  { label: "Reports", href: "/reports", icon: FileText, desc: "Official Congress & event reports" },
  { label: "Handbook (PDF)", href: "/document", icon: BookOpen, desc: "In-app SB Guidebook" },
  { label: "Office Bearers", href: "/office-bearers", icon: Shield, desc: "Branch leadership" },
  { label: "Past Bearers", href: "/past-bearers", icon: Shield, desc: "Alumni leaders" },
  { label: "Executive Team", href: "/team", icon: Compass, desc: "Executive committee" },
  { label: "Awards", href: "/awards", icon: Award, desc: "Accolades & honors" },
  { label: "Funding", href: "/funding", icon: DollarSign, desc: "Grants & support" },
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
    const moreRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === "/" || location.pathname === "/web" || location.pathname === "/desktop";
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 35);
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
        const handler = (e) => {
            if (moreRef.current && !moreRef.current.contains(e.target)) {
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
        if (!open)
            return;
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
        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        };
        const handleTouchEnd = (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = Math.abs(touchEndY - touchStartY);
            // Swiped right from left edge (within 60px of left screen edge)
            if (touchStartX < 60 && deltaX > 75 && deltaY < 100) {
                if (open) {
                    setOpen(false);
                }
                else if (!isHomePage) {
                    if (window.history.length > 2) {
                        navigate(-1);
                    }
                    else {
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
    const { isPageHidden } = usePageVisibility();
    const visibleCoreLinks = coreNavLinks.filter((l) => !isPageHidden(l.href));
    const visibleMoreLinks = moreLinks.filter((l) => !isPageHidden(l.href));
    const visibleMobileLinks = mobileGridLinks.filter((l) => !isPageHidden(l.href));

    const isMoreActive = visibleMoreLinks.some((l) => location.pathname === l.href || location.pathname.startsWith(l.href));
    return (<>
      {/* Universal Sticky Header Stack */}
      <header className="fixed top-0 left-0 w-full z-50 flex flex-col items-center pointer-events-none">

        {/* DESKTOP ONLY - ROW 1: Floating Navigation Bar (Adaptive Capsule Layout) */}
        <div className="hidden xl:block w-full pointer-events-auto z-50 pt-2.5 px-3 md:px-6 2xl:px-10">
          <div className="w-full max-w-[98vw] 2xl:max-w-[1720px] mx-auto flex items-center justify-between px-3.5 2xl:px-6 py-1.5 min-h-[58px] 2xl:min-h-[66px] rounded-full bg-[#000d20]/95 backdrop-blur-3xl border border-white/15 shadow-[0_15px_50px_rgba(0,0,0,0.85)] transition-all">

            {/* Left Brand Button with Custom Card Logo */}
            <Link to="/" className="flex items-center justify-center p-1.5 2xl:p-2 rounded-2xl bg-white hover:bg-white/95 border border-white/80 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all duration-300 group shrink-0 mr-2 2xl:mr-4 hover:scale-105">
              <img src={ieeeCustomCardLogo} alt="IEEE SREC Emblem" className="h-9 2xl:h-12 w-auto object-contain transition-transform"/>
            </Link>

            {/* Desktop Navigation Links (Responsive Centered Glass Pills) */}
            <nav className="flex items-center justify-center gap-1 2xl:gap-1.5 flex-nowrap mx-auto overflow-visible relative z-50">
              {/* Visible Core Links */}
              {visibleCoreLinks.map((l) => {
                const isActive = location.pathname === l.href || (l.href !== "/" && location.pathname.startsWith(l.href));
                return (
                  <Link
                    key={l.label}
                    to={l.href}
                    className={`relative px-2.5 2xl:px-3.5 py-1.5 2xl:py-2 rounded-full text-[11px] 2xl:text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap border backdrop-blur-xl shrink-0 ${
                      isActive
                        ? "text-cyan-200 bg-gradient-to-r from-cyan-500/25 to-blue-600/30 border-cyan-400/60 shadow-[0_0_20px_rgba(0,210,255,0.35)] scale-[1.02]"
                        : "text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border-white/10 hover:border-white/20 shadow-xs"
                    }`}
                  >
                    <span className="relative z-10">{l.label}</span>
                  </Link>
                );
              })}

              {/* ── MORE DROPDOWN (Zero Duplications) ── */}
              {visibleMoreLinks.length > 0 && (
                <div className="relative shrink-0 z-[100]" ref={moreRef}>
                  <button
                    type="button"
                    onClick={() => setMoreOpen((p) => !p)}
                    className={`relative flex items-center gap-1 px-2.5 2xl:px-3.5 py-1.5 2xl:py-2 rounded-full text-[11px] 2xl:text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap border backdrop-blur-xl cursor-pointer ${
                      isMoreActive || moreOpen
                        ? "text-cyan-200 bg-gradient-to-r from-cyan-500/25 to-blue-600/30 border-cyan-400/60 shadow-[0_0_20px_rgba(0,210,255,0.35)] scale-[1.02]"
                        : "text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border-white/10 hover:border-white/20 shadow-xs"
                    }`}
                  >
                    <span>More</span>
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
                        className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-80 max-h-[75vh] overflow-y-auto rounded-2xl z-[100] bg-[#000814]/98 backdrop-blur-2xl border-2 border-cyan-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(0,210,255,0.25)]"
                      >
                        <div className="px-5 py-3.5 bg-[#001026] border-b border-white/10 flex items-center justify-between sticky top-0 z-10">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">
                            More Navigation
                          </p>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">IEEE SREC</span>
                        </div>
                        <div className="p-2.5 space-y-1.5 bg-[#000814]">
                          {visibleMoreLinks.map((l) => {
                            const ItemIcon = l.icon;
                            const isActive = location.pathname === l.href || location.pathname.startsWith(l.href);
                            return (
                              <Link
                                key={l.label}
                                to={l.href}
                                onClick={() => setMoreOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group ${
                                  isActive
                                    ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/30 border border-cyan-400/50 text-cyan-200 shadow-md"
                                    : "bg-[#001026] hover:bg-[#001838] border border-white/10 hover:border-cyan-400/40 text-white"
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isActive ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/40" : "bg-white/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300"}`}>
                                  <ItemIcon size={15} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-black uppercase tracking-wider text-white group-hover:text-cyan-200 transition-colors leading-none mb-1">
                                    {l.label}
                                  </p>
                                  <p className="text-[10px] text-slate-300 font-medium leading-none truncate group-hover:text-slate-200">
                                    {l.desc}
                                  </p>
                                </div>
                                <ChevronRight size={13} className={`flex-shrink-0 transition-transform text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 ${isActive ? "text-cyan-400" : ""}`} />
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Subtle Elegant Separator */}
              <div className="w-[1px] h-4 bg-white/20 mx-1 shrink-0" />

              {/* Action Buttons */}
              <a
                href="http://aectsd2027.srecieee.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 2xl:px-5 py-1.5 2xl:py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-[11px] 2xl:text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(251,191,36,0.35)] active:scale-95 whitespace-nowrap shrink-0 hover:scale-105"
              >
                <Sparkles size={13} className="text-slate-950 animate-pulse" />
                <span>AECTSD 2027</span>
              </a>

              <Link
                to="/admin-login"
                className="inline-flex items-center gap-1.5 px-3 2xl:px-4 py-1.5 2xl:py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 backdrop-blur-xl text-slate-200 hover:text-white font-bold text-[11px] 2xl:text-xs uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap shrink-0"
              >
                <Shield size={13} className="text-cyan-400" />
                <span>Admin</span>
              </Link>
            </nav>

          </div>
        </div>

        {/* DESKTOP ONLY - ROW 2: Institutional Logos Box */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="hidden xl:flex w-full pointer-events-auto items-center justify-center pt-2 sm:pt-3 z-40"
            >
              <div className="inline-flex items-center justify-center gap-8 md:gap-14 px-8 md:px-12 py-2.5 md:py-3 rounded-2xl bg-white hover:bg-white/95 border border-white/60 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all hover:scale-[1.01]">
                <Link to="/" className="hover:scale-105 transition-transform flex items-center shrink-0">
                  <img src={srecLogo} alt="SREC Logo" className="h-10 md:h-12 w-auto object-contain" />
                </Link>
                <div className="w-[1.5px] h-8 md:h-10 bg-slate-300 shrink-0" />
                <Link to="/" className="hover:scale-105 transition-transform flex items-center shrink-0">
                  <img src={ieeeStamp} alt="IEEE SREC Logo" className="h-10 md:h-12 w-auto object-contain" />
                </Link>
                <div className="w-[1.5px] h-8 md:h-10 bg-slate-300 shrink-0" />
                <div className="hover:scale-105 transition-transform flex items-center shrink-0">
                  <img src={snrLogo} alt="SNR Trust Logo" className="h-10 md:h-12 w-auto object-contain" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE ONLY - Top Bar with Logos and Hamburger */}
        <div className="xl:hidden w-full pointer-events-auto z-50 flex flex-col items-center">
          <div className="w-full bg-[#000814]/95 backdrop-blur-2xl border-b border-white/10 py-3 px-4 sm:px-6 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/" className="px-2.5 py-1.5 rounded-xl bg-white backdrop-blur border border-white/40 flex items-center gap-2 shadow-sm">
                <img src={srecLogo} alt="SREC Logo" className="h-6 sm:h-7 w-auto object-contain" />
                <div className="w-[1px] h-4 bg-slate-300" />
                <img src={ieeeStamp} alt="IEEE SREC Logo" className="h-6 sm:h-7 w-auto object-contain" />
                <div className="w-[1px] h-4 bg-slate-300" />
                <img src={snrLogo} alt="SNR Trust Logo" className="h-6 sm:h-7 w-auto object-contain" />
              </Link>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              aria-label="Open Navigation Menu"
            >
              <Menu size={18} />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>

      </header>

      {/* Global Transparent Header Spacer for Subpages */}
      {!isHomePage && (
        <div className="h-[110px] sm:h-[130px] xl:h-[160px] w-full pointer-events-none" aria-hidden="true" />
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
                    <img src={srecLogo} alt="SREC" className="h-5 sm:h-6 w-auto object-contain" />
                    <div className="w-px h-3.5 bg-slate-300" />
                    <img src={ieeeStamp} alt="IEEE" className="h-5 sm:h-6 w-auto object-contain" />
                    <div className="w-px h-3.5 bg-slate-300" />
                    <img src={snrLogo} alt="SNR" className="h-5 sm:h-6 w-auto object-contain" />
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
                    {visibleMobileLinks.length} Pages
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {visibleMobileLinks.map((l, i) => {
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
                          className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-300 h-full backdrop-blur-xl ${
                            isActive
                              ? "bg-gradient-to-br from-cyan-500/30 to-blue-600/35 border-cyan-400/70 shadow-[0_0_25px_rgba(0,210,255,0.3)] text-white"
                              : "bg-[#000e24]/90 hover:bg-[#001536]/90 border-cyan-500/20 hover:border-cyan-400/50 text-slate-200 shadow-md"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`p-2 rounded-xl flex items-center justify-center ${
                                isActive
                                  ? "bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,210,255,0.6)]"
                                  : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300"
                              }`}
                            >
                              <ItemIcon size={16} />
                            </div>
                            <ChevronRight size={14} className={isActive ? "text-cyan-300" : "text-slate-500"} />
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
                  Portals &amp; Resources
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

                {/* Student Member Login & Digital ID */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
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
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
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
                          Unlock global opportunities &amp; events
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-cyan-400" />
                  </Link>
                </motion.div>

                {/* Admin Login */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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
          </motion.div>)}
      </AnimatePresence>

      {/* ── MOBILE PHONE BOTTOM NAVIGATION BAR (DARK GLASS DOCK) ── */}
      <div className="xl:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md bg-[#000d20]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-full px-2 py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(0,210,255,0.15)] flex items-center justify-around">
        {[
            { label: "Home", href: "/", icon: Home },
            { label: "Societies", href: "/societies", icon: Users },
            { label: "Activities", href: "/activities", icon: Calendar },
            { label: "Bearers", href: "/office-bearers", icon: Crown },
        ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
            return (<Link key={item.label} to={item.href} className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 ${isActive
                    ? "text-cyan-300 bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,210,255,0.3)]"
                    : "text-slate-400 hover:text-slate-200"}`}>
              <Icon size={17} className={isActive ? "text-cyan-300 scale-110" : "text-slate-400"}/>
              <span className="text-[9px] font-black uppercase tracking-wider mt-0.5 leading-none">
                {item.label}
              </span>
            </Link>);
        })}

        {/* Mobile Menu Drawer Toggle */}
        <button onClick={() => setOpen((prev) => !prev)} className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 ${open
            ? "text-cyan-300 bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,210,255,0.3)]"
            : "text-slate-400 hover:text-slate-200"}`} aria-label="Open Navigation Menu">
          {open ? <X size={17} className="text-cyan-300"/> : <Menu size={17} className="text-slate-400"/>}
          <span className="text-[9px] font-black uppercase tracking-wider mt-0.5 leading-none">
            {open ? "Close" : "Menu"}
          </span>
        </button>
      </div>

      {/* Floating Back Button on Subpages */}
      {!isHomePage && (<button onClick={() => {
                if (window.history.length > 2) {
                    navigate(-1);
                }
                else {
                    navigate("/");
                }
            }} className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[39] bg-[#00142e]/90 hover:bg-[#00224a] text-cyan-300 p-2.5 sm:p-3 rounded-full shadow-[0_4px_20px_rgba(0,10,30,0.6)] border border-cyan-400/40 backdrop-blur-xl transition-all duration-300 flex items-center justify-center active:scale-90 group" title="Go to previous page" aria-label="Go to previous page">
          <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-0.5 transition-transform text-cyan-400"/>
        </button>)}

      {/* Download App Modal */}
      <DownloadAppModal isOpen={downloadModalOpen} onClose={() => setDownloadModalOpen(false)}/>
    </>);
};
export default Navbar;
