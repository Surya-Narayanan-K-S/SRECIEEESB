import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocietyOfficeBearers, { getSocietyKey } from "@/components/societies/SocietyOfficeBearers";
import { ArrowLeft, Crown, Users, Sparkles, ExternalLink, ChevronRight, ChevronLeft, Shield, Layers, Cpu, Zap, Radio, Activity, Gauge, Compass, Heart, RefreshCw, } from "lucide-react";
import srecCampus from "@/assets/srec-campus.png";
const SOCIETIES = [
    {
        key: "cs",
        name: "Computer Society",
        shortCode: "CS",
        fullTitle: "IEEE Computer Society (CS)",
        chapterUrl: "/societies/cs",
        color: "#ff5100",
        accent: "#ea580c",
        badgeBg: "bg-orange-500/20 border-orange-400/40 text-orange-300",
        tagline: "Empowering Computing & Engineering Leaders",
        icon: Cpu,
    },
    {
        key: "wie",
        name: "Women in Engineering",
        shortCode: "WIE",
        fullTitle: "IEEE Women in Engineering (WIE)",
        chapterUrl: "/societies/wie",
        color: "#a855f7",
        accent: "#7e22ce",
        badgeBg: "bg-purple-500/20 border-purple-400/40 text-purple-300",
        tagline: "Inspiring & Empowering Women in STEM",
        icon: Heart,
    },
    {
        key: "pels",
        name: "Power Electronics Society",
        shortCode: "PELS",
        fullTitle: "IEEE Power Electronics Society (PELS)",
        chapterUrl: "/societies/pels",
        color: "#10b981",
        accent: "#008542",
        badgeBg: "bg-emerald-500/20 border-emerald-400/40 text-emerald-300",
        tagline: "Powering Sustainable & Green Technological Future",
        icon: Zap,
    },
    {
        key: "cis",
        name: "Computational Intelligence",
        shortCode: "CIS",
        fullTitle: "IEEE Computational Intelligence Society (CIS)",
        chapterUrl: "/societies/cis",
        color: "#6366f1",
        accent: "#4f46e5",
        badgeBg: "bg-indigo-500/20 border-indigo-400/40 text-indigo-300",
        tagline: "Advancing Artificial Intelligence, Deep Learning & Evolutionary Systems",
        icon: Sparkles,
    },
    {
        key: "comsoc",
        name: "Communications Society",
        shortCode: "ComSoc",
        fullTitle: "IEEE Communications Society (ComSoc)",
        chapterUrl: "/societies/comsoc",
        color: "#0284c7",
        accent: "#0369a1",
        badgeBg: "bg-sky-500/20 border-sky-400/40 text-sky-300",
        tagline: "Connecting the World with Next-Gen Telecommunications & 5G/6G",
        icon: Radio,
    },
    {
        key: "embs",
        name: "Engineering in Medicine & Biology",
        shortCode: "EMBS",
        fullTitle: "IEEE Engineering in Medicine & Biology Society (EMBS)",
        chapterUrl: "/societies/embs",
        color: "#059669",
        accent: "#047857",
        badgeBg: "bg-teal-500/20 border-teal-400/40 text-teal-300",
        tagline: "Innovating Healthcare, Medical Devices & Biomedical Sciences",
        icon: Activity,
    },
    {
        key: "im",
        name: "Instrumentation & Measurement",
        shortCode: "IMS",
        fullTitle: "IEEE Instrumentation and Measurement Society (IMS)",
        chapterUrl: "/societies/im",
        color: "#e11d48",
        accent: "#be123c",
        badgeBg: "bg-rose-500/20 border-rose-400/40 text-rose-300",
        tagline: "Precision Engineering, Smart Sensors & Measurement Systems",
        icon: Gauge,
    },
    {
        key: "cas",
        name: "Circuits & Systems",
        shortCode: "CAS",
        fullTitle: "IEEE Circuits and Systems Society (CAS)",
        chapterUrl: "/societies/cas",
        color: "#2563eb",
        accent: "#1d4ed8",
        badgeBg: "bg-blue-500/20 border-blue-400/40 text-blue-300",
        tagline: "Pioneering Microelectronics, VLSI & Circuit Innovations",
        icon: Layers,
    },
    {
        key: "srec",
        name: "SREC Student Branch",
        shortCode: "IEEE SB",
        fullTitle: "IEEE SREC Student Branch",
        chapterUrl: "/societies/srec",
        color: "#00629b",
        accent: "#002855",
        badgeBg: "bg-blue-600/20 border-blue-500/40 text-blue-300",
        tagline: "Central Student Leadership & Governance",
        icon: Compass,
    },
];
const SocietyOfficeBearersPage = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    // Determine active society key from path or query param
    const rawParam = id || searchParams.get("society") || searchParams.get("chapter") || "cs";
    const activeKey = useMemo(() => {
        const matched = getSocietyKey(rawParam);
        return matched || "cs";
    }, [rawParam]);
    const currentSociety = useMemo(() => {
        return SOCIETIES.find((s) => s.key === activeKey) || SOCIETIES[0];
    }, [activeKey]);
    const handleSelectSociety = (key) => {
        setSearchParams({ society: key });
    };
    // Scroll to top on change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [activeKey]);
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartXRef = useRef(0);
    const scrollStartLeftRef = useRef(0);
    const hasDraggedRef = useRef(false);

    const checkScrollability = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollLeft(scrollLeft > 6);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        checkScrollability();
        el.addEventListener("scroll", checkScrollability, { passive: true });
        window.addEventListener("resize", checkScrollability);

        // Smooth horizontal mouse wheel scrolling translation for desktop mice
        const handleWheel = (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                el.scrollBy({ left: e.deltaY * 1.25, behavior: "smooth" });
            }
        };
        el.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            el.removeEventListener("scroll", checkScrollability);
            window.removeEventListener("resize", checkScrollability);
            el.removeEventListener("wheel", handleWheel);
        };
    }, [checkScrollability]);

    // Auto-scroll active society button into view centered
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const activeBtn = el.querySelector(`[data-society-key="${activeKey}"]`);
        if (activeBtn) {
            const containerRect = el.getBoundingClientRect();
            const btnRect = activeBtn.getBoundingClientRect();
            const currentScroll = el.scrollLeft;
            const targetScroll = currentScroll + (btnRect.left - containerRect.left) - (containerRect.width / 2) + (btnRect.width / 2);
            el.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" });
        }
    }, [activeKey]);

    const handleScroll = (direction) => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const scrollAmount = direction === "left" ? -300 : 300;
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    const handleMouseDown = (e) => {
        const el = scrollContainerRef.current;
        if (!el) return;
        setIsDragging(true);
        hasDraggedRef.current = false;
        dragStartXRef.current = e.pageX - el.offsetLeft;
        scrollStartLeftRef.current = el.scrollLeft;

        const handleMouseMove = (moveEvent) => {
            const x = moveEvent.pageX - el.offsetLeft;
            const walk = x - dragStartXRef.current;
            if (Math.abs(walk) > 4) {
                hasDraggedRef.current = true;
                el.scrollLeft = scrollStartLeftRef.current - walk;
            }
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            setTimeout(() => {
                setIsDragging(false);
                hasDraggedRef.current = false;
            }, 50);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleButtonClick = (key) => {
        if (hasDraggedRef.current) return;
        handleSelectSociety(key);
    };

    const CurrentIcon = currentSociety.icon;
    return (<div className="min-h-screen flex flex-col relative text-white overflow-x-hidden" style={{
            background: "linear-gradient(160deg, #03050c 0%, #070c1b 35%, #050814 65%, #02040a 100%)",
        }}>
      {/* College Campus Background Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <img src={srecCampus} alt="SREC Campus" className="w-full h-full object-cover opacity-[0.12] scale-105 filter brightness-75 contrast-125"/>
        <div className="absolute inset-0" style={{
            background: `radial-gradient(circle at 50% 20%, ${currentSociety.color}15 0%, rgba(3,5,12,0.96) 75%)`,
        }}/>
      </div>

      <Navbar />

      <main className="flex-1 w-full pt-8 md:pt-12 pb-24 relative z-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12">
          {/* Top Breadcrumb & Quick Switch Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link to="/societies" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft size={14}/> Societies
              </Link>
              <ChevronRight size={12} className="text-slate-600"/>
              <Link to={currentSociety.chapterUrl} className="hover:text-white transition-colors">
                {currentSociety.shortCode} Chapter
              </Link>
              <ChevronRight size={12} className="text-slate-600"/>
              <span className="text-white font-bold">Office Bearers</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Link to={currentSociety.chapterUrl} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all hover:scale-102">
                <span>View {currentSociety.shortCode} Hub</span>
                <ExternalLink size={12}/>
              </Link>
              <Link to="/office-bearers" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-bold text-blue-300 transition-all hover:scale-102">
                <Crown size={12} className="text-amber-400"/>
                <span>SB Office Bearers</span>
              </Link>
            </div>
          </div>

          {/* ══════════════════════ HERO SECTION ══════════════════════ */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-2xl">
            {/* Dynamic Ambient Color Orb */}
            <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-700" style={{ background: currentSociety.color }}/>

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className={`px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${currentSociety.badgeBg}`}>
                    <CurrentIcon size={13}/>
                    <span>{currentSociety.shortCode} Chapter Leadership</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-semibold flex items-center gap-1.5">
                    <Shield size={12} className="text-emerald-400"/>
                    <span>Verified 2026 Leadership</span>
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-3">
                  {currentSociety.fullTitle}
                </h1>

                <p className="text-sm sm:text-base font-bold uppercase tracking-wider mb-4" style={{ color: currentSociety.color }}>
                  {currentSociety.tagline}
                </p>

                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                  Explore the dedicated faculty coordinators, student executive leads, and office bearers driving innovation, research, events, and technical excellence for the <strong>{currentSociety.name}</strong> chapter at Sri Ramakrishna Engineering College.
                </p>
              </div>

              {/* Quick Info Box */}
              <div className="w-full lg:w-72 rounded-2xl bg-white/[0.03] border border-white/10 p-5 shrink-0 flex flex-col gap-3 shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-cyan-400"/> Chapter Overview
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Society Code:</span>
                    <span className="font-bold text-white uppercase">{currentSociety.shortCode}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Term:</span>
                    <span className="font-bold text-cyan-300">2026 Academic Year</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Institution:</span>
                    <span className="font-bold text-white">IEEE SREC SB (14201)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ══════════════════ INTERACTIVE SOCIETY SELECTOR BAR ══════════════════ */}
          <div className="mb-10">
            <div className="flex items-center justify-between gap-3 mb-3 px-1">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Users size={14} className="text-cyan-400"/> Select Technical Society / Affinity Group
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500 font-bold hidden sm:inline">
                  {SOCIETIES.length} Chapters Available
                </span>
                {/* Desktop Scroll Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleScroll("left")}
                    disabled={!canScrollLeft}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all ${
                      canScrollLeft
                        ? "bg-white/10 hover:bg-cyan-500 hover:text-slate-950 border-white/20 text-white cursor-pointer active:scale-90 shadow-md"
                        : "bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed opacity-30"
                    }`}
                    title="Scroll Left (or use mouse wheel / drag)"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScroll("right")}
                    disabled={!canScrollRight}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all ${
                      canScrollRight
                        ? "bg-white/10 hover:bg-cyan-500 hover:text-slate-950 border-white/20 text-white cursor-pointer active:scale-90 shadow-md"
                        : "bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed opacity-30"
                    }`}
                    title="Scroll Right (or use mouse wheel / drag)"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Container with Gradient Edge Hints */}
            <div className="relative group">
              {/* Left edge shadow hint */}
              <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#03050c] to-transparent z-10 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />

              <div
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                className="flex gap-2.5 overflow-x-auto py-2.5 px-1 select-none cursor-grab active:cursor-grabbing scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(56,189,248,0.3) rgba(255,255,255,0.03)",
                }}
              >
                {SOCIETIES.map((soc) => {
                  const isSelected = soc.key === activeKey;
                  const Icon = soc.icon;
                  return (
                    <button
                      key={soc.key}
                      data-society-key={soc.key}
                      type="button"
                      onClick={() => handleButtonClick(soc.key)}
                      className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "shadow-xl scale-102 ring-2"
                          : "bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08] hover:text-white"
                      }`}
                      style={{
                        background: isSelected ? soc.color : undefined,
                        color: isSelected ? "#000" : undefined,
                        borderColor: isSelected ? soc.color : undefined,
                        boxShadow: isSelected ? `0 8px 25px -4px ${soc.color}70` : undefined,
                      }}
                    >
                      <Icon size={14} className={isSelected ? "text-slate-950" : "text-slate-400"} />
                      <span>{soc.shortCode}</span>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                          isSelected ? "bg-black/20 text-black" : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {soc.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right edge shadow hint */}
              <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#03050c] to-transparent z-10 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          </div>

          {/* ══════════════════ SOCIETY OFFICE BEARERS ROSTER ══════════════════ */}
          <AnimatePresence mode="wait">
            <motion.div key={currentSociety.key} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <SocietyOfficeBearers societyName={currentSociety.fullTitle} isStandalonePage={true}/>
            </motion.div>
          </AnimatePresence>

          {/* ══════════════════ BOTTOM CHAPTER DISCOVERY BAR ══════════════════ */}
          <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Explore More Societies &amp; Technical Chapters
              </h3>
              <p className="text-xs text-slate-400">
                Discover events, workshop archives, and domain pillars across all technical affinity groups.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/societies" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all">
                <span>All Societies Directory</span>
                <ChevronRight size={14}/>
              </Link>
              <Link to="/office-bearers" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30">
                <Crown size={14} className="text-amber-400"/>
                <span>SB Leadership Showcase</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>);
};
export default SocietyOfficeBearersPage;
